/* apps-extra.js — 角色中心 / 相册 / 时钟 / 计算器 / 设置 */
(function(){
  const ui = window.L.ui, icons = window.L.icons;

  /* ================= 角色中心 hub ================= */
  const ROLES = {};
  function hubHead(el, title, back){
    const head = ui.h('<div class="app-head"><div class="ah-side"><button class="ah-btn bb">'+icons.inlineHTML('back',18,'')+'</button></div>'+
      '<div class="ah-t" style="position:static;transform:none"></div><div class="ah-spacer"></div></div>');
    head.querySelector('.ah-t').textContent = title;
    head.querySelector('.bb').addEventListener('click', back);
    return head;
  }
  function showHub(el, opts){
    opts = opts||{};
    el.innerHTML='';
    const head = hubHead(el, '角色', ()=> opts.back ? opts.back() : window.L.system.goHome());
    el.appendChild(head);
    const hub = ui.h('<div class="hub"><div class="hub-tabs"></div><div class="hub-body"></div></div>');
    el.appendChild(hub);
    const tabs = [
      {id:'plaza', label:'广场'},
      {id:'key', label:'接key'},
      {id:'create', label:'自建'},
      {id:'mine', label:'我的'}
    ];
    const tabbar = hub.querySelector('.hub-tabs');
    const body = hub.querySelector('.hub-body');
    const views = {};
    tabs.forEach(t=>{
      const b = document.createElement('button');
      b.textContent = t.label;
      b.dataset.tab = t.id;
      b.addEventListener('click', ()=> show(t.id));
      tabbar.appendChild(b);
      views[t.id] = null;
    });
    function show(tab){
      tabbar.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.tab===tab));
      body.innerHTML='';
      if (tab==='plaza') viewPlaza(body);
      else if (tab==='key') viewKey(body);
      else if (tab==='create') viewCreate(body);
      else viewMine(body);
    }
    show(opts.tab || 'plaza');
  }
  function charMini(ch){
    const tags = (ch.tags||[]).map(ui.chip).join('');
    return '<div class="char-card"><div class="av"></div><div class="ch-info"><div class="ch-name"></div>'+
      '<div class="ch-tag"></div><div class="ch-bio"></div></div><div class="ch-act"></div></div>';
  }
  function fillMini(card, ch, actHTML){
    card.querySelector('.av').appendChild(ui.avatarImg(ch,58));
    card.querySelector('.ch-name').textContent = ch.name + ' · ' + (ch.age||'') + '岁';
    const tag = card.querySelector('.ch-tag');
    (ch.tags||[]).forEach(t=> tag.insertAdjacentHTML('beforeend','<span class="chip">'+ui.esc(t)+'</span>'));
    tag.insertAdjacentHTML('beforeend','<span style="color:rgba(255,255,255,.4);font-size:10.5px"> '+ui.esc(ch.tagline||'')+'</span>');
    card.querySelector('.ch-bio').textContent = ch.bio || ch.style || '';
    card.querySelector('.ch-act').innerHTML = actHTML;
  }
  function viewPlaza(body){
    const ids = L.data.PLAZA;
    ids.forEach(id=>{
      const ch = L.data.CHARS[id];
      const owned = window.L.store.isOwned(id);
      const card = ui.h(charMini(ch));
      fillMini(card, ch, owned
        ? '<span class="chip">已拥有</span>'
        : '<button class="le-btn" style="padding:8px 16px;font-size:12px">添加</button>');
      if (!owned){
        card.querySelector('button').addEventListener('click', ()=>{
          window.L.store.addChar(id);
          window.L.store.pushMsg(id,'char', window.L.engine.greeting(ch));
          ui.toast('已添加 '+ch.name+'，去聊天吧');
          viewPlaza(body);
        });
      }
      body.appendChild(card);
    });
    // 专属角色提示
    const tip = ui.h('<div class="key-box"><div class="kb-t">还有专属角色（如顾屿、江野）由对方通过<b>解锁码</b>分发，输入码即可解锁。</div><button class="le-btn ghost" style="font-size:12px;padding:10px 18px">去输入解锁码</button></div>');
    tip.querySelector('button').addEventListener('click', ()=> showKeyTab());
    body.appendChild(tip);
    function showKeyTab(){ const b = body.parentElement.querySelector('.hub-tabs [data-tab=key]'); if (b) b.click(); }
  }
  function viewKey(body){
    const box = ui.h('<div class="key-box"><div class="kb-t">输入对方给你的专属解锁码<br>解锁后角色会出现在「我的」与聊天列表</div>'+
      '<input class="le-input code-input" placeholder="例如 LEANO-GU" maxlength="20" style="margin-bottom:12px">'+
      '<button class="le-btn" style="width:100%">解锁</button><div class="kb-result" style="margin-top:12px;font-size:12.5px;color:rgba(255,255,255,.55)"></div></div>');
    const input = box.querySelector('input'), res = box.querySelector('.kb-result');
    function unlock(){
      const code = input.value.trim();
      if (!code){ res.textContent='请输入解锁码'; return; }
      const r = window.L.store.useCode(code);
      if (!r.ok){
        res.textContent = r.reason==='used' ? '这个解锁码已经用过了哦' : '解锁码无效，请核对后重试';
        return;
      }
      const ch = L.data.CHARS[r.id];
      if (!window.L.store.isOwned(r.id)){
        window.L.store.addChar(r.id);
        window.L.store.pushMsg(r.id,'char', window.L.engine.greeting(ch));
      }
      res.textContent = '解锁成功：'+ch.name+' 已加入你的角色';
      ui.toast('解锁成功 🖤');
    }
    box.querySelector('button').addEventListener('click', unlock);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') unlock(); });
    body.appendChild(box);
    // 绑定自己的 key
    const s = window.L.store.get();
    const kb = ui.h('<div class="field" style="margin-top:6px"><div class="fl"><b>绑定你自己的 key</b>（二期接入真实 AI 时使用，仅保存在本机）</div>'+
      '<input class="le-input" type="password" placeholder="粘贴你的 API Key" style="margin-bottom:10px">'+
      '<button class="le-btn ghost" style="width:100%">保存绑定</button></div>');
    const kinput = kb.querySelector('input');
    kinput.value = s.ownKey || '';
    kb.querySelector('button').addEventListener('click', ()=>{
      window.L.store.setOwnKey(kinput.value);
      ui.toast('已保存（仅存本机）');
    });
    body.appendChild(kb);
    const note = ui.h('<div style="font-size:11.5px;color:rgba(255,255,255,.35);line-height:1.8">演示解锁码：LEANO-GU（顾屿）、LEANO-JIANG（江野）</div>');
    body.appendChild(note);
  }
  function viewCreate(body){
    const form = ui.h('<div></div>');
    const fName = ui.h('<div class="field"><div class="fl">角色名字 <b>*</b></div><input class="le-input" maxlength="12" placeholder="例如：林深"></div>');
    const fMotif = ui.h('<div class="field"><div class="fl">头像风格</div><div class="tagpick motifs"></div></div>');
    const motifKeys = ['heart','swan','kiss','moon','ring'];
    let motif = 'heart';
    const mpick = fMotif.querySelector('.motifs');
    motifKeys.forEach(m=>{
      const b = document.createElement('button');
      b.style.cssText = 'width:46px;height:46px;padding:0;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;';
      const im = document.createElement('img');
      im.src = icons.avatarMotifURL(m); im.style.cssText='width:100%;height:100%;border-radius:50%;';
      b.appendChild(im);
      b.addEventListener('click', ()=>{ motif=m; mpick.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); });
      mpick.appendChild(b);
    });
    const fTag = ui.h('<div class="field"><div class="fl">性格/说话风格 <b>*</b></div><div class="tagpick"></div></div>');
    const tpick = fTag.querySelector('.tagpick');
    const arcKeys = Object.keys(L.data.ARCHETYPES);
    let tag = arcKeys[0];
    arcKeys.forEach(k=>{
      const b = document.createElement('button');
      b.textContent = L.data.ARCHETYPES[k].label;
      b.addEventListener('click', ()=>{ tag=k; tpick.querySelectorAll('button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); });
      tpick.appendChild(b);
    });
    tpick.firstElementChild.classList.add('on');
    const fTagline = ui.h('<div class="field"><div class="fl">一句话人设</div><input class="le-input" maxlength="30" placeholder="例如：只对你温柔"></div>');
    const fBio = ui.h('<div class="field"><div class="fl">角色背景/设定</div><textarea class="le-input" maxlength="300" placeholder="写写他的过去、性格细节、你们是怎么认识的……"></textarea></div>');
    const save = ui.h('<button class="le-btn" style="width:100%">创建角色</button>');
    form.appendChild(fName); form.appendChild(fMotif); form.appendChild(fTag); form.appendChild(fTagline); form.appendChild(fBio); form.appendChild(save);
    save.addEventListener('click', ()=>{
      const name = fName.querySelector('input').value.trim();
      const tagline = fTagline.querySelector('input').value.trim();
      const bio = fBio.querySelector('textarea').value.trim();
      if (!name){ ui.toast('先给角色取个名字吧'); return; }
      const label = L.data.ARCHETYPES[tag].label;
      const ch = { id:'c'+Date.now(), kind:'local', name:name, gender:'male', age:22, role:'恋人',
        avatar:'motif', motif:motif, tagline:tagline||'只属于你的角色', tags:[label],
        bio:bio || ('由你亲手创建的角色，性格偏「'+label+'」。'),
        style:'基于「'+label+'」原型生成回复；二期接入真实 AI 后完全按你的人设走。' };
      window.L.store.addCreatedChar(ch);
      window.L.store.pushMsg(ch.id,'char', window.L.engine.greeting(ch));
      ui.toast('创建成功，去和 TA 聊聊吧');
      const b = body.parentElement.querySelector('.hub-tabs [data-tab=mine]');
      if (b) b.click();
    });
    body.appendChild(form);
  }
  function viewMine(body){
    const chars = window.L.store.myChars();
    if (!chars.length){
      body.appendChild(ui.h('<div class="chat-empty"><div class="ce-ic">'+icons.inlineHTML('heartLine',30,'')+'</div><div>还没有角色<br>去广场添加，或输入解锁码</div></div>'));
      return;
    }
    chars.forEach(ch=>{
      const isLocal = ch.kind==='local';
      const card = ui.h(charMini(ch));
      fillMini(card, ch, '<button class="le-btn" data-a="chat" style="padding:7px 12px;font-size:11.5px;margin-bottom:6px">聊天</button>'+
        '<button class="le-btn ghost danger" data-a="del" style="padding:6px 12px;font-size:11px">'+(isLocal?'删除':'移除')+'</button>');
      card.querySelector('[data-a=chat]').addEventListener('click', ()=> window.L.apps.openChat(ch.id));
      card.querySelector('[data-a=del]').addEventListener('click', ()=>{
        ui.sheet('移除角色', '移除后，与 <b>'+ui.esc(ch.name)+'</b> 的对话将不再显示。（本地数据仍保留，重新添加可恢复）', {
          buttons:[{label:'确认移除', danger:true, onClick:()=>{ window.L.store.removeChar(ch.id); viewMine(body); }}]
        });
      });
      body.appendChild(card);
    });
  }
  ROLES.showHub = showHub;

  /* ================= 相册 ================= */
  function buildPhotos(el){
    el.appendChild(ui.h('<div class="app-head"><div class="ah-t">照片</div><div class="ah-spacer"></div><div class="ah-side"></div></div>'));
    const body = ui.h('<div class="body"></div>');
    el.appendChild(body);
    render(body);
    function render(container){
      container.innerHTML='';
      const grid = ui.h('<div class="photos-grid"></div>');
      const store = window.L.store.get();
      const items = [];
      store.photos.forEach(p=> items.push({cap:p.cap||'此刻', src:p.data}));
      L.data.SAMPLE_PHOTOS.forEach(p=> items.push({cap:p.cap, src: icons.sceneURL(p.scene, 300, 300), sample:true}));
      if (!items.length){
        container.appendChild(ui.h('<div class="chat-empty"><div class="ce-ic">'+icons.inlineHTML('photos',30,'')+'</div><div>暂无照片</div></div>'));
        return;
      }
      items.forEach((it,idx)=>{
        const c = ui.h('<div class="ph-cell"><img alt=""></div>');
        c.querySelector('img').src = it.src;
        c.addEventListener('click', ()=>{
          openViewer(container, items, idx);
        });
        grid.appendChild(c);
      });
      container.appendChild(grid);
    }
    function openViewer(container, items, idx){
      container.innerHTML='';
      const vw = ui.h('<div class="photo-viewer"><div class="pv-img"></div><div class="pv-cap"></div></div>');
      const img = document.createElement('img');
      img.src = items[idx].src;
      vw.querySelector('.pv-img').appendChild(img);
      vw.querySelector('.pv-cap').textContent = items[idx].cap;
      vw.addEventListener('click', e=>{ if (e.target===vw || e.target.classList.contains('photo-viewer')) render(container); });
      // back via header
      const head = el.querySelector('.app-head');
      head.innerHTML = '<div class="ah-side"><button class="ah-btn bb">'+icons.inlineHTML('back',18,'')+'</button></div>'+
        '<div class="ah-t" style="position:static;transform:none">照片</div><div class="ah-spacer"></div>';
      head.querySelector('.bb').onclick = ()=> render(container);
      container.appendChild(vw);
    }
    el._returnHeader = ()=>{};
  }

  /* ================= 时钟 ================= */
  function buildClock(el){
    el.classList.add('clock-app');
    el.appendChild(ui.h('<div class="app-head"><div class="ah-t">时钟</div><div class="ah-spacer"></div><div class="ah-side"></div></div>'));
    const seg = ui.h('<div class="seg clock-seg"><button class="on" data-v="world">世界时钟</button><button data-v="sw">秒表</button><button data-v="timer">计时器</button></div>');
    el.appendChild(seg);
    const body = ui.h('<div class="body"></div>');
    el.appendChild(body);
    const views = {};
    function show(v){
      seg.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.v===v));
      body.innerHTML='';
      if (v==='world'){ views.world = views.world || buildWorld(); body.appendChild(views.world); tickWorld(); }
      else if (v==='sw'){ views.sw = views.sw || buildStopwatch(); body.appendChild(views.sw); }
      else { views.timer = views.timer || buildTimer(); body.appendChild(views.timer); }
    }
    seg.addEventListener('click', e=>{ const b=e.target.closest('button'); if (b) show(b.dataset.v); });
    let wt = null;
    show('world');
    function tickWorld(){
      const list = body.querySelector('.world-list');
      if (!list) return;
      list.querySelectorAll('.wr-row').forEach(row=>{
        const tz = row.dataset.tz;
        const fmt = new Intl.DateTimeFormat('zh-CN', { timeZone:tz, hour:'2-digit', minute:'2-digit', hour12:false });
        row.querySelector('.wr-time').textContent = fmt.format(new Date());
      });
    }
    function buildWorld(){
      const wrap = ui.h('<div class="world-list"></div>');
      L.data.CITIES.forEach(c=>{
        const row = ui.h('<div class="wr-row" data-tz="'+c.tz+'"><div><div class="wr-city"></div><div class="wr-diff"></div></div><div class="wr-time"></div></div>');
        row.querySelector('.wr-city').textContent = c.name;
        row.querySelector('.wr-diff').textContent = c.diff;
        wrap.appendChild(row);
      });
      if (wt) clearInterval(wt);
      wt = setInterval(tickWorld, 1000);
      return wrap;
    }
    function buildStopwatch(){
      const wrap = ui.h('<div class="stopwatch"><div class="sw-time">00:00.00</div><div class="sw-laps"></div>'+
        '<div class="sw-ctl"><button class="lap">计次</button><button class="go">启动</button></div></div>');
      const timeEl = wrap.querySelector('.sw-time'), lapsEl = wrap.querySelector('.sw-laps');
      let running=false, base=0, start=0, timer=null;
      function renderTime(){
        const t = base + (running? Date.now()-start : 0);
        const cs = Math.floor(t/10)%100, s = Math.floor(t/1000);
        timeEl.textContent = String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')+'.'+String(cs).padStart(2,'0');
      }
      wrap.querySelector('.go').addEventListener('click', function(){
        if (!running){ running=true; start=Date.now(); this.textContent='停止'; this.className='stop'; timer=setInterval(renderTime, 33); }
        else { running=false; clearInterval(timer); base += Date.now()-start; this.textContent='启动'; this.className='go'; }
      });
      wrap.querySelector('.lap').addEventListener('click', ()=>{
        const t = base + (running? Date.now()-start:0);
        const cs=Math.floor(t/10)%100, s=Math.floor(t/1000);
        const laps = lapsEl.querySelectorAll('.sw-lap').length+1;
        const row = ui.h('<div class="sw-lap"><span>计次 '+laps+'</span><span>'+(String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')+'.'+String(cs).padStart(2,'0'))+'</span></div>');
        lapsEl.prepend(row);
      });
      return wrap;
    }
    function buildTimer(){
      const wrap = ui.h('<div class="timer-set"><div class="timer-disp">00:00</div><div class="timer-wheel"></div><div class="timer-ctl"><button class="lap" style="background:rgba(255,255,255,.12);color:#fff">取消</button><button class="go" style="background:#2e7d32;color:#fff">开始</button></div></div>');
      const disp = wrap.querySelector('.timer-disp');
      let total = 0, left = 0, running=false, timer=null, endAt=0;
      const wheel = wrap.querySelector('.timer-wheel');
      const add = (n, label)=>{
        const d = ui.h('<div class="tw-n"><div style="font-size:11px;opacity:.55;margin-bottom:2px">'+label+'</div>'+n+'</div>');
        d.addEventListener('click', ()=>{ if(!running){ total=Math.min(3599,total+n* (label==='分'?60:1)); render(); } });
        wheel.appendChild(d);
      };
      [1,5,10].forEach(n=>add(n,'分')); [1,5,10].forEach(n=>add(n,'秒'));
      function render(){ disp.textContent = ui.fmtClock(running? left*1000 : total*1000); }
      function tick(){
        left = Math.max(0, Math.round((endAt-Date.now())/1000));
        render();
        if (left<=0){ clearInterval(timer); running=false; beep(); wrap.querySelector('.go').textContent='开始'; wrap.querySelector('.go').style.background='#2e7d32'; }
      }
      function beep(){
        try{
          const AC = window.AudioContext||window.webkitAudioContext;
          if (AC){ const ac = new AC(); [0,0.35,0.7].forEach((d,i)=>{ const o=ac.createOscillator(); const g=ac.createGain(); o.connect(g); g.connect(ac.destination); o.frequency.value=880; g.gain.setValueAtTime(0.0001, ac.currentTime+d); g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime+d+0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+d+0.25); o.start(ac.currentTime+d); o.stop(ac.currentTime+d+0.3); }); }
        }catch(e){}
        ui.toast('时间到 ⏰');
      }
      wrap.querySelector('.go').addEventListener('click', function(){
        if (!running){
          if (total<=0) return;
          running=true; left=total; endAt = Date.now()+left*1000;
          this.textContent='暂停'; this.style.background='#b71c1c';
          timer=setInterval(tick, 250);
        } else {
          clearInterval(timer); total = left; running=false;
          this.textContent='继续'; this.style.background='#2e7d32';
        }
      });
      wrap.querySelector('.lap').addEventListener('click', ()=>{ clearInterval(timer); running=false; total=0; left=0; render(); wrap.querySelector('.go').textContent='开始'; wrap.querySelector('.go').style.background='#2e7d32'; });
      render();
      return wrap;
    }
  }

  /* ================= 计算器 ================= */
  function buildCalc(el){
    el.classList.add('calc-app');
    el.appendChild(ui.h('<div class="app-head"><div class="ah-t">计算器</div><div class="ah-spacer"></div><div class="ah-side"></div></div>'));
    const body = ui.h('<div class="calc-body"><div class="calc-display"><div class="cd">0</div></div><div class="calc-keys"></div></div>');
    el.appendChild(body);
    const cd = body.querySelector('.cd'), keys = body.querySelector('.calc-keys');
    let cur='0', acc=null, op=null, fresh=true;
    function fmt(n){ return String(Math.round(n*1e10)/1e10); }
    function render(){ cd.textContent = cur.length>12 ? Number(cur).toExponential(5) : cur; }
    function press(key){
      if (/^[0-9]$/.test(key)){
        if (fresh){ cur=key; fresh=false; }
        else cur = cur==='0'? key : cur+key;
        if (cur.length>16) cur=cur.slice(0,16);
      } else if (key==='.'){
        if (fresh){ cur='0.'; fresh=false; }
        else if (cur.indexOf('.')<0) cur+='.';
      } else if (key==='AC'){ cur='0'; acc=null; op=null; fresh=true; }
      else if (key==='±'){ cur = cur.charAt(0)==='-' ? cur.slice(1) : (cur==='0'?cur:'-'+cur); }
      else if (key==='%'){ cur = fmt(parseFloat(cur)/100); }
      else if (['+','-','×','÷'].indexOf(key)>=0){
        if (op && !fresh){ compute(); }
        acc = parseFloat(cur); op=key; fresh=true;
      } else if (key==='='){
        if (op!=null && !fresh){ compute(); op=null; }
      }
      render();
      function compute(){
        const b = parseFloat(cur);
        const a = acc;
        let r = 0;
        if (op==='+') r=a+b; else if (op==='-') r=a-b; else if (op==='×') r=a*b; else if (op==='÷') r = b===0? NaN : a/b;
        cur = isNaN(r) ? '错误' : fmt(r);
        acc=null; fresh=true;
      }
    }
    const rows = [
      ['AC','±','%','÷'],
      ['7','8','9','×'],
      ['4','5','6','-'],
      ['1','2','3','+'],
      ['0','.','=']
    ];
    rows.forEach((row,ri)=>{
      row.forEach(k=>{
        const b = document.createElement('button');
        b.textContent = k;
        b.className = 'calc-key ' + (k==='AC'||k==='±'||k==='%' ? 'ck-fn' : (['÷','×','-','+','='].indexOf(k)>=0 ? 'ck-op' : 'ck-num'));
        if (k==='0') b.classList.add('ck-zero');
        if (k==='=') b.style.background='#f0a33c';
        b.addEventListener('click', ()=> press(k));
        keys.appendChild(b);
      });
    });
  }

  /* ================= 设置 ================= */
  function buildSettings(el){
    el.appendChild(ui.h('<div class="app-head"><div class="ah-t">设置</div><div class="ah-spacer"></div><div class="ah-side"></div></div>'));
    const body = ui.h('<div class="body"><div class="set-list"></div></div>');
    el.appendChild(body);
    const list = body.querySelector('.set-list');
    const s = window.L.store.get();
    function row(icon, label, right, click){
      const r = ui.h('<div class="set-row"><div class="sr-ic">'+icons.inlineHTML(icon,15,'')+'</div><div class="sr-l">'+label+'</div>'+(right?right:'')+'</div>');
      if (click) r.addEventListener('click', click);
      return r;
    }
    function sw(key, init){
      const d = ui.h('<div class="switch '+(init?'on':'')+'"></div>');
      d.addEventListener('click', e=>{
        e.stopPropagation();
        const on = window.L.store.toggleSetting(key);
        d.classList.toggle('on', on);
        if (key==='haptic') ui.toast(on?'触感反馈 开':'触感反馈 关');
        if (key==='sound') ui.toast(on?'提示音 开':'提示音 关');
      });
      return d;
    }
    const g1 = ui.h('<div class="set-group"></div>');
    g1.appendChild(row('gear','主题', '<div class="sr-v">黑白 · ins</div>', ()=> ui.devSheet('主题商店','gear')));
    g1.appendChild(row('sun','外观','<div class="sr-v">深色</div>', ()=> ui.toast('黑白 ins 主题已默认')));
    g1.appendChild(row('mic','触感反馈', sw('haptic', s.settings.haptic)));
    g1.appendChild(row('music','提示音', sw('sound', s.settings.sound)));
    const g2 = ui.h('<div class="set-group"></div>');
    g2.appendChild(row('key','我的 key', '<div class="sr-v">'+(s.ownKey?'已绑定':'未绑定')+'</div>', ()=> editKey()));
    g2.appendChild(row('roleplay','角色管理','<div class="sr-v">'+window.L.store.myChars().length+' 个</div>', ()=> window.L.system.openApp('roles', {})));
    const g3 = ui.h('<div class="set-group"></div>');
    g3.appendChild(row('user','关于 Leano','', ()=> about()));
    g3.appendChild(row('trash','清空数据','', ()=> clearAll()));
    // 自定义图片
    const gImgs = ui.h('<div class="set-group"></div>');
    gImgs.appendChild(row('photos','自定义图片','<div class="sr-v" id="imgcount"></div>', ()=> customImgSheet()));
    const IMG_SLOTS = [
      {key:'wallpaper', label:'主屏壁纸', max:1200},
      {key:'lock', label:'锁屏壁纸', max:1200},
      {key:'widget', label:'顶部组件图', max:640},
      {key:'collage0', label:'拼贴图 1（第2页）', max:640},
      {key:'collage1', label:'拼贴图 2（第2页）', max:640},
      {key:'collage2', label:'拼贴图 3（第2页）', max:640},
      {key:'avatar:user', label:'我的头像', max:512},
      {key:'avatar:eric', label:'恋人头像（Eric）', max:512}
    ];
    const ICON_KEYS = ['wechat','x','vinyl','douyin','film','camera','photos','calc','worldbook','phone','music','spyphone','browser','task','couple','ai','waimai','shop','plane','candle','door','roleplay','rose','clock','calendar','game','mail','gear'];
    const ICON_NAMES = {wechat:'微信', x:'X', vinyl:'Vinyl', douyin:'抖音', film:'放映室', camera:'相机', photos:'照片', calc:'计算器', worldbook:'世界书', phone:'电话', music:'音乐', spyphone:'查他手机', browser:'浏览器', task:'任务设备', couple:'情侣空间', ai:'AI账户', waimai:'外卖', shop:'购物', plane:'云程', candle:'规则怪谈', door:'惊悚抉择', roleplay:'角色扮演', rose:'线下约会', clock:'时钟', calendar:'日历', game:'游戏', mail:'邮件', gear:'设置'};
    function imgCount(){ const c = window.L.store.get().custom||{}; return Object.keys(c).length; }
    function refreshImgCount(){ const e = ui.q('#imgcount'); if (e) e.textContent = imgCount()+' 张'; }
    function defSlot(key){
      if (key==='wallpaper'||key==='lock') return icons.wallpaperURL();
      if (key==='widget') return icons.sceneURL('kiss',200,200);
      if (key==='collage0') return icons.sceneURL('wings',200,200);
      if (key==='collage1') return icons.sceneURL('swan',200,200);
      if (key==='collage2') return icons.sceneURL('lily',200,200);
      if (key==='avatar:user') return icons.avatarMotifURL('kiss');
      if (key==='avatar:eric') return icons.avatarMotifURL('swan');
      return icons.appIcon('gear');
    }
    function refreshAppearance(){ window.L.home.build(); refreshImgCount(); }
    function customImgSheet(){
      let html = '<div style="padding:2px 0">';
      IMG_SLOTS.forEach(sl=>{
        const cur = window.L.store.getCustom(sl.key);
        const src = cur || defSlot(sl.key);
        html += '<div class="ci-row" data-slot="'+sl.key+'"><img class="ci-prev" src="'+src+'"><div class="ci-mid"><div class="ci-lb">'+sl.label+'</div><div class="ci-st">'+(cur?'已自定义':'默认')+'</div></div>'+
          '<button class="ci-btn set">更换</button><button class="ci-btn rst">重置</button></div>';
      });
      html += '<div style="font-size:12px;color:rgba(255,255,255,.5);margin:12px 2px 6px">App 图标（点一下即可换成你的图片）</div>';
      html += '<div class="ci-grid">';
      ICON_KEYS.forEach(k=>{
        const cur = window.L.store.getCustom('icon:'+k);
        html += '<div class="ci-tile" data-k="'+k+'"><img src="'+(cur||icons.appIcon(k))+'"><span>'+(ICON_NAMES[k]||k)+'</span>'+(cur?'<i class="ci-dot"></i>':'')+'</div>';
      });
      html += '</div></div>';
      ui.sheet('自定义图片', html, { buttons:[{ label:'全部恢复默认', danger:true, onClick:()=>{ window.L.store.resetAllCustom(); refreshAppearance(); ui.toast('已全部恢复默认'); } }] });
      ui.qa('.ci-row').forEach(row=>{
        const slot = row.dataset.slot;
        const max = (IMG_SLOTS.find(x=>x.key===slot)||{max:900}).max;
        row.querySelector('.set').addEventListener('click', ()=>{
          ui.pickImage(data=>{ window.L.store.setCustom(slot, data); refreshAppearance(); row.querySelector('img').src=data; row.querySelector('.ci-st').textContent='已自定义'; }, max);
        });
        row.querySelector('.rst').addEventListener('click', ()=>{
          window.L.store.resetCustom(slot); refreshAppearance(); row.querySelector('img').src = defSlot(slot); row.querySelector('.ci-st').textContent='默认';
        });
      });
      ui.qa('.ci-tile').forEach(tile=>{
        const k = tile.dataset.k;
        tile.addEventListener('click', ()=>{
          ui.pickImage(data=>{ window.L.store.setCustom('icon:'+k, data); refreshAppearance(); tile.querySelector('img').src=data; if(!tile.querySelector('.ci-dot')) tile.insertAdjacentHTML('beforeend','<i class="ci-dot"></i>'); }, 320);
        });
      });
    }
    list.appendChild(gImgs); list.appendChild(g1); list.appendChild(g2); list.appendChild(g3);
    list.appendChild(ui.h('<div class="set-foot">Leano v1.2 · 虚拟小手机<br>仅供 18 岁以上用户使用 · 数据仅存于本机浏览器</div>'));
    refreshImgCount();
    function editKey(){
      const s2 = window.L.store.get();
      ui.sheet('绑定我的 key', '<div style="margin-top:4px">二期接入真实 AI 后，这里填的 key 会用于让角色“活过来”。目前仅保存在本机，不会上传。</div>'+
        '<input class="le-input" type="password" id="keyin" placeholder="粘贴 API Key" style="margin-top:12px">', {
        buttons:[{label:'保存', onClick:()=>{ const v = ui.q('#keyin').value; window.L.store.setOwnKey(v); ui.toast('已保存'); }}]
      });
      const inp = ui.q('#keyin'); if (inp) inp.value = s2.ownKey||'';
    }
    function about(){
      ui.sheet('关于 Leano', '<b>Leano</b> 是一台黑白 ins 风的“虚拟小手机”。<br><br>· 仿 iPhone 操作<br>· AI 角色扮演恋爱互动（预设回复，二期接真实 AI）<br>· 数据仅存本机，断网可用<br>· 仅供 18 岁以上用户使用，请勿用于未成年人相关场景。', {buttons:[{label:'好的', onClick:()=>{}}]});
    }
    function clearAll(){
      ui.sheet('清空数据', '将删除本机保存的角色、聊天、照片与设置，且无法恢复。确定吗？', {
        buttons:[{label:'确认清空', danger:true, onClick:()=> window.L.store.reset()}]
      });
    }
  }

  /* 注册 */
  window.L.apps.register('roles', '角色', 'roleplay', function(el){ showHub(el, {}); });
  window.L.apps.register('photos', '照片', 'photos', buildPhotos);
  window.L.apps.register('clock', '时钟', 'clock', buildClock);
  window.L.apps.register('calc', '计算器', 'calc', buildCalc);
  window.L.apps.register('settings', '设置', 'gear', buildSettings);
  window.L.roles = ROLES;
})();