/* system.js — 系统壳、手势、控制中心、通知、多任务 */
(function(){
  const ui = window.L.ui, icons = window.L.icons;
  const sys = { _mode:'boot', _prevMode:null, _activeApp:null };
  let suppressClick = false;

  function el(id){ return ui.q('#'+id); }
  function setMode(m){ sys.mode = m; }
  function coord(e){
    const rect = el('screen').getBoundingClientRect();
    const s = (rect.height/874) || 1;
    return { x:(e.clientX-rect.left)/s, y:(e.clientY-rect.top)/s, s:s };
  }

  /* ---------- 缩放适配 ---------- */
  function layout(){
    const stage = el('stage'), screen = el('screen');
    const r = stage.getBoundingClientRect();
    const s = Math.min(r.width/402, r.height/874);
    screen.style.transform = 'scale('+s+')';
  }

  /* ---------- 触感 ---------- */
  function tapHaptic(){
    const s = window.L.store.get();
    if (s.settings.haptic && navigator.vibrate){ try{ navigator.vibrate(8); }catch(e){} }
  }

  /* ---------- 状态栏 ---------- */
  function buildStatusbar(){
    const sb = el('statusbar');
    sb.innerHTML = '<div class="sb-in"><div class="sb-left"></div><div class="sb-right">'+
      icons.inlineHTML('signal',15,'')+icons.inlineHTML('wifi',15,'')+
      '<img style="height:12px" src="'+icons.dataURL('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 14" width="28" height="14"><rect x="1" y="3" width="21" height="10" rx="3" fill="none" stroke="#fff" stroke-width="1.4"/><rect x="23" y="6" width="3" height="5" rx="1.2" fill="#fff"/><rect x="3" y="5" width="7" height="6" rx="1.4" fill="#fff"/></svg>')+'"></div></div>';
    const l = sb.querySelector('.sb-left');
    l.textContent = ui.hm(Date.now());
    sys._sbTime = l;
  }
  function tickClock(){
    const now = new Date();
    if (sys._sbTime) sys._sbTime.textContent = ui.hm(now.getTime());
    if (sys.mode==='lock'){
      const lt = el('lock');
      if (lt && !lt.classList.contains('hidden')){
        const d1 = ui.q('.lock-date', lt), d2 = ui.q('.lock-time', lt);
        if (d1) d1.textContent = ui.dateCN(now);
        if (d2) d2.textContent = ui.hm(now.getTime());
      }
    }
    if (sys.mode==='home' || sys.mode==='app'){
      const ws = ui.q('#home .widget-time');
      if (ws){
        const d1 = ui.q('.wt-date', ws), d2 = ui.q('.wt-time', ws);
        if (d1) d1.textContent = ui.dateCN(now);
        if (d2) d2.textContent = ui.hm(now.getTime());
      }
    }
  }
  function showStatus(show){
    el('statusbar').classList.toggle('hidden', !show);
    el('homeindicator').classList.toggle('hidden', !show);
  }

  /* ---------- 开机 / 年龄 / 锁屏 ---------- */
  function buildBoot(){
    const b = el('boot');
    b.innerHTML = '<div class="logo">'+icons.inlineHTML('heart',46,'')+'</div><div class="brand">LEANO</div>';
    setTimeout(()=>{ b.classList.add('done'); setTimeout(()=>{ b.classList.add('hidden'); }, 460); afterBoot(); }, 1500);
  }
  function afterBoot(){
    const s = window.L.store.get();
    if (s.adult) showLock();
    else showAge();
  }
  function showAge(){
    setMode('age');
    showStatus(false);
    const g = el('agegate');
    g.innerHTML = '<div class="ag-card"><div class="ag-logo">'+icons.inlineHTML('heartLine',64,'')+'</div>'+
      '<h1>Leano</h1><div class="ag-sub">黑白 · 虚拟小手机</div>'+
      '<div class="ag-note">本应用为 <b>18+ 成人向恋爱角色扮演</b> 互动内容。<br>· 涉及成年角色之间的暧昧与情感互动<br>· 请勿用于任何未成年人相关场景<br>· 互动由 AI 角色驱动，虚拟且自愿</div>'+
      '<button class="ag-btn">我已满 18 周岁，继续</button><div class="ag-legal">继续即代表你已阅读并同意以上说明<br>Leano v1.0 · 数据仅存于本机</div></div>';
    g.classList.remove('hidden');
    g.querySelector('.ag-btn').addEventListener('click', ()=>{
      window.L.store.markAdult();
      g.classList.add('hidden');
      showLock();
    });
  }
  function buildLock(){
    const lk = el('lock');
    lk.innerHTML = '<div class="lock-bg"></div><div class="lock-shade"></div>'+
      '<div class="lock-top"><div class="lock-date"></div><div class="lock-time"></div></div>'+
      '<div class="lock-btm">'+
        '<button class="lock-orb test-orb"></button>'+
        '<div class="lock-mid"><div class="lock-hint"><span>上滑进入小手机</span><span class="up">'+icons.inlineHTML('arrowUp',18,'')+'</span></div></div>'+
        '<button class="lock-orb cam-orb"></button></div>';
    const bg = lk.querySelector('.lock-bg');
    bg.style.backgroundImage = 'url('+ui.lockURL()+')';
    lk.querySelector('.test-orb').innerHTML = icons.inlineHTML('test',24,'');
    lk.querySelector('.cam-orb').innerHTML = icons.inlineHTML('camera',24,'');
    lk.querySelector('.cam-orb').addEventListener('click', ()=> openApp('camera', {}));
    lk.querySelector('.test-orb').addEventListener('click', ()=>{
      ui.sheet('系统自检', '<b>Leano · 虚拟小手机</b><br>界面分辨率：402 × 874（等比缩放）<br>引擎：纯前端 · 断网可用<br>数据：保存在本机浏览器<br>版本：v1.0（预设回复）', {buttons:[{label:'知道了', onClick:()=>{}}]});
    });
    // 解锁：全屏上滑（按钮除外）
    lk.addEventListener('pointerdown', function(e){ if (e.target.closest && e.target.closest('.lock-orb')) return; startUnlockFromBottom(e); });
  }
  function showLock(){
    setMode('lock');
    el('home').classList.add('hidden');
    el('appview').classList.add('hidden');
    el('lock').classList.remove('hidden');
    const lbg = el('lock').querySelector('.lock-bg');
    if (lbg) lbg.style.backgroundImage = 'url('+ui.lockURL()+')';
    showStatus(false);
  }
  function unlock(){
    const lk = el('lock');
    lk.style.transition = 'transform .45s cubic-bezier(.3,.7,.2,1), opacity .45s';
    lk.style.transform = 'translateY(-100%)';
    lk.style.opacity = '0';
    setTimeout(()=>{ lk.classList.add('hidden'); lk.style.transform=''; lk.style.opacity=''; lk.style.transition=''; showHome(); }, 460);
  }
  let lockDrag = null;
  function startUnlockFromBottom(e){
    if (sys.mode!=='lock') return;
    const lk = el('lock');
    lockDrag = { y0:e.clientY, moved:false };
    const mv = (ev)=>{
      if (!lockDrag) return;
      const s = el('screen').getBoundingClientRect().height/874 || 1;
      const dy = (ev.clientY - lockDrag.y0)/s;
      if (dy < -6){ lockDrag.moved = true; lk.style.transition='none'; lk.style.transform = 'translateY('+Math.max(dy,-360)+'px)'; lk.style.opacity = String(Math.min(1, Math.max(0, 1+dy/600))).slice(0,4); }
    };
    const up = ()=>{
      document.removeEventListener('pointermove', mv);
      document.removeEventListener('pointerup', up);
      if (lockDrag && lockDrag.moved){
        const y = parseFloat(lk.style.transform.replace(/[^0-9-.]/g,''))||0;
        if (y < -70){ unlock(); } else { lk.style.transition='transform .3s, opacity .3s'; lk.style.transform=''; lk.style.opacity=''; }
      }
      lockDrag = null;
    };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  /* ---------- 主屏 ---------- */
  function showHome(){
    setMode('home');
    el('lock').classList.add('hidden');
    el('appview').classList.add('hidden');
    el('home').classList.remove('hidden');
    showStatus(true);
    window.L.home.refresh();
  }
  function goHome(){
    const av = el('appview');
    const app = av.firstElementChild;
    const done = ()=>{
      if (app && app._cleanup) { try{ app._cleanup(); }catch(e){} }
      av.innerHTML='';
      sys._activeApp=null;
      if (sys._prevMode==='lock'){ showLock(); sys._prevMode=null; return; }
      sys._prevMode=null;
      showHome();
    };
    if (app){
      app.classList.add('app-view-out');
      setTimeout(done, 190);
    } else done();
  }

  /* ---------- 打开 App ---------- */
  function openApp(id, opts){
    opts = opts||{};
    const av = el('appview');
    if (av.firstElementChild && av.firstElementChild._cleanup){ try{ av.firstElementChild._cleanup(); }catch(e){} }
    av.innerHTML='';
    sys._prevMode = sys.mode;
    const appEl = window.L.apps.build(id, opts);
    av.appendChild(appEl);
    av.classList.remove('hidden');
    el('home').classList.add('hidden');
    window.L.store.bumpRecents(id);
    sys._activeApp = id;
    setMode('app');
    showStatus(true);
    window.L.home.refreshBadges();
    if (opts.charId){ window.L.apps.openChat(opts.charId); }
  }

  /* ---------- 控制中心 ---------- */
  const ccState = {};
  function defaultCC(){ return { plane:false, wifi:true, bt:true, flash:false, dnd:false, rotate:false }; }
  function loadCC(){ const s = window.L.store.get(); s.settings.cc = Object.assign(defaultCC(), s.settings.cc||{}); return s.settings.cc; }
  function buildCC(){
    const cc = el('controlcenter');
    cc.innerHTML = '';
    const grid = ui.h('<div class="cc-grid"></div>');
    const tiles = [
      {k:'plane', icon:'planeMode', label:'飞行模式'},
      {k:'wifi', icon:'wifi', label:'无线局域网'},
      {k:'bt', icon:'bt', label:'蓝牙'},
      {k:'flash', icon:'flash', label:'手电筒', danger:true},
      {k:'dnd', icon:'moon', label:'专注模式'},
      {k:'rotate', icon:'refresh', label:'屏幕旋转'}
    ];
    const st = loadCC();
    tiles.forEach(t=>{
      const d = ui.h('<div class="cc-tile" data-k="'+t.k+'"><div class="ct-ic">'+icons.inlineHTML(t.icon,22,'')+'</div><div class="ct-lb">'+t.label+'</div></div>');
      if (st[t.k]) d.classList.add('on');
      if (t.danger && st[t.k]) d.classList.add('danger');
      d.addEventListener('click', ()=>{
        const s2 = window.L.store.get();
        s2.settings.cc[t.k] = !s2.settings.cc[t.k];
        window.L.store.save();
        d.classList.toggle('on', s2.settings.cc[t.k]);
        d.classList.toggle('danger', t.danger && s2.settings.cc[t.k]);
        if (t.k==='flash') ui.toast(s2.settings.cc.flash?'手电筒 开':'手电筒 关');
        if (t.k==='plane') ui.toast(s2.settings.cc.plane?'飞行模式 开':'飞行模式 关');
      });
      grid.appendChild(d);
    });
    cc.appendChild(grid);
    const s2 = window.L.store.get();
    const bright = ui.h('<div class="cc-row"><span style="width:18px">'+icons.inlineHTML('sun',16,'')+'</span><input type="range" min="0.2" max="1" step="0.01" value="'+s2.settings.brightness+'"><span style="width:18px">'+icons.inlineHTML('sun',16,'')+'</span></div>');
    bright.querySelector('input').addEventListener('input', e=>{
      const v = parseFloat(e.target.value);
      s2.settings.brightness = v;
      window.L.store.save();
      applyBrightness(v);
    });
    cc.appendChild(bright);
    const now = ui.h('<div class="cc-now"><div class="cn-art">'+icons.inlineHTML('vinyl',30,'')+'</div><div><div class="cn-t">Eric · 想你的第 1 秒</div><div class="cn-s">Leano 电台 · 黑白频道</div></div></div>');
    cc.appendChild(now);
    cc.addEventListener('click', e=>{ if (e.target===cc) closeCC(); });
  }
  function openCC(){
    buildCC();
    el('controlcenter').classList.remove('hidden');
    el('controlcenter').classList.add('open');
  }
  function closeCC(){
    el('controlcenter').classList.remove('open');
    setTimeout(()=> el('controlcenter').classList.add('hidden'), 380);
  }

  /* ---------- 通知中心 ---------- */
  function buildNotif(){
    const nf = el('notifcenter');
    nf.innerHTML = '<div class="nf-head"><div class="t">通知</div><button class="le-btn ghost" style="padding:6px 14px;font-size:11px">清空</button></div><div class="nf-list"></div>';
    const list = nf.querySelector('.nf-list');
    const chars = window.L.store.myChars();
    const cards = [];
    chars.forEach(ch=>{
      const un = window.L.store.unreadOf(ch.id);
      if (un>0){
        const lm = window.L.store.lastMsg(ch.id);
        if (lm){
          cards.push({ch:ch, text:lm.text, n:un});
        }
      }
    });
    if (!cards.length){
      list.appendChild(ui.h('<div class="nf-empty"><div class="ce-ic" style="background:rgba(255,255,255,.08);border-radius:50%;width:64px;height:64px;display:flex;align-items:center;justify-content:center">'+icons.inlineHTML('bell',28,'')+'</div>暂无新通知</div>'));
    } else {
      cards.forEach(c=>{
        const card = ui.h('<div class="nf-card"><div class="nf-av"></div><div style="flex:1;min-width:0"><div class="nf-app">Leano · '+c.ch.name+'</div><div class="nf-txt"></div></div></div>');
        card.querySelector('.nf-av').appendChild(ui.avatarImg(c.ch,40));
        card.querySelector('.nf-txt').textContent = c.text;
        card.addEventListener('click', ()=>{
          closeNotif();
          window.L.apps.openChat(c.ch.id);
        });
        list.appendChild(card);
      });
    }
    nf.querySelector('.nf-head button').addEventListener('click', ()=>{
      window.L.store.myChars().forEach(ch=> window.L.store.clearUnread(ch.id));
      window.L.home.refreshBadges();
      buildNotif();
    });
  }
  function openNotif(){
    buildNotif();
    el('notifcenter').classList.remove('hidden');
    el('notifcenter').classList.add('open');
  }
  function closeNotif(){
    el('notifcenter').classList.remove('open');
    setTimeout(()=> el('notifcenter').classList.add('hidden'), 380);
  }

  /* ---------- 多任务切换 ---------- */
  function openSwitcher(){
    const sw = el('switcher');
    const recents = window.L.store.get().recents.slice(0,8);
    sw.innerHTML = '<div class="sw-title">APP 切换器</div><div class="sw-track"></div>'+
      '<div class="sw-close"><button>返回主屏</button></div>';
    const track = sw.querySelector('.sw-track');
    const defs = window.L.apps._defs;
    if (!recents.length){
      track.appendChild(ui.h('<div class="chat-empty" style="min-width:240px"><div class="ce-ic">'+icons.inlineHTML('home',30,'')+'</div><div>还没有打开过的 App</div></div>'));
    }
    recents.forEach(id=>{
      const d = defs[id] || {};
      const card = ui.h('<div class="sw-card"><div class="sw-top"><div class="is"></div></div><div class="sw-body">'+
        '<div class="sw-x">×</div>'+icons.inlineHTML(d.icon||'task',34,'')+'<div class="sc-t"></div><div class="sc-s"></div></div></div>');
      card.querySelector('.sc-t').textContent = d.title || id;
      card.querySelector('.sc-s').textContent = 'Leano · 点击恢复';
      card.querySelector('.sw-body').addEventListener('click', ()=>{ closeSwitcher(); openApp(id, {}); });
      card.querySelector('.sw-x').addEventListener('click', e=>{
        e.stopPropagation();
        const s = window.L.store.get();
        s.recents = s.recents.filter(x=>x!==id);
        window.L.store.save();
        card.remove();
        if (!track.children.length) openSwitcher();
      });
      track.appendChild(card);
    });
    sw.querySelector('.sw-close button').addEventListener('click', ()=>{ closeSwitcher(); goHome(); });
    sw.classList.remove('hidden');
  }
  function closeSwitcher(){ el('switcher').classList.add('hidden'); }

  /* ---------- 亮度 ---------- */
  function applyBrightness(v){
    const c = el('curtain');
    c.style.opacity = String(Math.max(0, (1-v)*0.94));
  }

  /* ---------- 手势 ---------- */
  let g = null;
  function onDown(e){
    if (sys.mode==='boot'||sys.mode==='age') return;
    if (el('controlcenter').classList.contains('open')){ startClosePanel(el('controlcenter'), closeCC); return; }
    if (el('notifcenter').classList.contains('open')){ startClosePanel(el('notifcenter'), closeNotif); return; }
    if (!el('switcher').classList.contains('hidden')) return;
    const c = coord(e);
    if (c.y < 36){ g = {type:'top', x0:c.x, y0:c.y, x:c.x, y:c.y, t0:Date.now()}; }
    else if (c.y > 874-42){ g = {type:'bottom', y0:c.y, t0:Date.now(), held:false}; }
    else if (sys.mode==='home'){ g = {type:'page', x0:c.x, x:c.x, moved:false}; }
    else g = null;
    if (g && g.type==='page'){ const tr = ui.q('#home .home-track'); if (tr){ tr.style.transition='none'; } }
  }
  function onMove(e){
    if (!g) return;
    if (g.type==='top'){
      const c2 = coord(e);
      const dy = c2.y - g.y0;
      if (dy > 26){
        const left = g.x0 < 201;
        g = null;
        if (left) openNotif(); else openCC();
        suppressClick = true;
      }
      return;
    }
    if (g.type==='bottom'){
      const dy = coord(e).y - g.y0;
      if (dy < -24){
        g = null;
        if (sys.mode==='app' || sys._activeApp) goHome();
        suppressClick = true;
      }
      return;
    }
    if (g.type==='page'){
      const cx = coord(e).x;
      const dx = cx - g.x0;
      g.x = cx;
      if (Math.abs(dx)>10) g.moved = true;
      const tr = ui.q('#home .home-track');
      if (tr && sys.mode==='home'){
        const base = -window.L.home.idx*402;
        let nx = base + dx;
        nx = Math.max(-402-60, Math.min(60, nx));
        tr.style.transform = 'translateX('+nx+'px)';
      }
    }
  }
  function onUp(){
    if (!g) return;
    if (g.type==='page'){
      const tr = ui.q('#home .home-track');
      const dx = g.x - g.x0;
      let target = window.L.home.idx;
      if (g.moved){
        if (dx < -50) target = 1;
        else if (dx > 50) target = 0;
        else target = window.L.home.idx;
        if (dx < -150) target = 1;
        if (dx > 150) target = 0;
        suppressClick = true;
      }
      if (tr){ tr.style.transition=''; window.L.home.slideTo(target); }
      if (g.moved && window.L.home.idx!==target) window.L.home.slideTo(target);
    }
    g = null;
  }
  function startClosePanel(panel, closeFn){
    let y0=null;
    const mv = ev=>{
      if (y0===null) y0 = ev.clientY;
      if (ev.clientY - y0 > 60){ document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); closeFn(); }
    };
    const up = ()=>{ document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); };
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  /* 底部指示条手势：点击回主屏；按住 400ms 打开切换器 */
  function bottomBarDown(e){
    if (sys.mode==='boot'||sys.mode==='age') return;
    if (!el('switcher').classList.contains('hidden')){ closeSwitcher(); return; }
    let moved=false, y0=e.clientY;
    const mv = ev=>{
      const dy = ev.clientY - y0;
      if (dy < -20){ moved=true; cleanup(); if (sys.mode==='app'||sys._activeApp){ goHome(); } else if (el('controlcenter').classList.contains('open')) closeCC(); }
    };
    const up = ev=>{
      cleanup();
      const dur = ev.timeStamp - e.timeStamp;
      if (!moved && dur > 380){ if (sys._activeApp || sys.mode==='app' || window.L.store.get().recents.length) openSwitcher(); }
    };
    function cleanup(){ document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); }
    document.addEventListener('pointermove', mv);
    document.addEventListener('pointerup', up);
  }

  /* ---------- 顶部快捷区点击：左=通知 右=控制中心 ---------- */
  function topZoneClick(e){
    if (sys.mode==='boot'||sys.mode==='age') return;
    const c = coord(e);
    if (c.x < 201){ openNotif(); } else { openCC(); }
  }

  /* ---------- 初始化 ---------- */
  function init(){
    const stage = el('stage');
    const screen = el('screen');
    // 顶部互动区
    const topZone = document.createElement('div');
    topZone.style.cssText = 'position:absolute;top:0;left:0;right:0;height:34px;z-index:43;cursor:pointer;touch-action:none;';
    topZone.addEventListener('pointerdown', e=>{ e.stopPropagation(); });
    topZone.addEventListener('click', topZoneClick);
    screen.appendChild(topZone);
    // 底部指示条
    const hi = el('homeindicator');
    hi.innerHTML = '<div class="hi-bar"></div><div class="hi-grab"></div>';
    const hiBar = hi.querySelector('.hi-bar');
    if (hiBar) hiBar.addEventListener('pointerdown', function(e){ e.stopPropagation(); bottomBarDown(e); });
    // 触屏：这些区域禁止浏览器接管滚动（避免上滑无反应）
    screen.addEventListener('touchmove', function(e){
      const t = e.target;
      if (t && t.closest && (t.closest('#lock') || t.closest('.home-pages') || t.closest('.cc.open') || t.closest('.notif.open') || t.closest('#homeindicator'))) e.preventDefault();
    }, { passive:false });
    // 手势监听
    screen.addEventListener('pointerdown', onDown);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    // 点击抑制（拖拽后）
    document.addEventListener('click', e=>{
      if (suppressClick){ e.stopPropagation(); e.preventDefault(); suppressClick=false; }
    }, true);
    // 键盘
    document.addEventListener('keydown', e=>{
      if (e.key==='Escape'){
        if (!ui.q('#sheet').classList.contains('hidden') && ui.q('#sheet').classList.contains('open')){ ui.q('#sheet').classList.remove('open'); return; }
        if (el('controlcenter').classList.contains('open')){ closeCC(); return; }
        if (el('notifcenter').classList.contains('open')){ closeNotif(); return; }
        if (!el('switcher').classList.contains('hidden')){ closeSwitcher(); return; }
        if (sys.mode==='app'){ goHome(); return; }
      }
      if (e.key==='Home'){ if (sys.mode==='app') goHome(); }
    });
    layout();
    window.addEventListener('resize', layout);
    buildStatusbar();
    buildLock();
    applyBrightness(window.L.store.get().settings.brightness||1);
    setInterval(tickClock, 1000);
    tickClock();
  }

  window.L = window.L || {};
  window.L.system = { boot:buildBoot, init:init, mode:sys, setMode:setMode, showHome:showHome, goHome:goHome, openApp:openApp,
    tapHaptic:tapHaptic, showStatus:showStatus, unlock:unlock, openCC:openCC, closeCC:closeCC,
    openNotif:openNotif, closeNotif:closeNotif, openSwitcher:openSwitcher, closeSwitcher:closeSwitcher,
    hideHomeIndicator:function(){ el('homeindicator').classList.add('hidden'); },
    showHomeIndicator:function(){ el('homeindicator').classList.remove('hidden'); } };
  Object.defineProperty(sys,'mode',{get:function(){return sys._mode;}, set:function(v){ sys._mode=v; }});
})();