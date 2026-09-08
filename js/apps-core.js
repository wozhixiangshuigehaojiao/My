/* apps-core.js — 应用注册表 + 聊天/电话/相机 */
(function(){
  const ui = window.L.ui, icons = window.L.icons;
  const DEFS = {};

  function register(id, title, icon, builder){
    DEFS[id] = { title:title, icon:icon, build:builder };
  }
  function build(id, opts){
    const d = DEFS[id];
    if (!d) return ui.h('<div class="app"><div class="body"></div></div>');
    const el = ui.h('<div class="app app-view-anim"></div>');
    d.build(el, opts||{});
    return el;
  }
  function run(act, arg){
    const map = { chat:'chat', phone:'phone', camera:'camera', photos:'photos', calc:'calc', clock:'clock', settings:'settings', roles:'roles' };
    const id = map[act];
    if (id) window.L.system.openApp(id, arg?{arg:arg}:{});
    else if (act==='roles:key') window.L.system.openApp('roles', {tab:'key'});
    else ui.devSheet('功能');
  }
  function openChat(charId){
    window.L.system.openApp('chat', {charId:charId||null});
  }

  /* ================= 聊天 ================= */
  function buildChat(el){
    el.classList.add('chat-app');
    const bg = document.createElement('div'); bg.className='bg-img';
    bg.style.backgroundImage='url('+ui.wallpaperURL()+')';
    el.appendChild(bg); el.appendChild(ui.h('<div class="bg-shade"></div>'));
    const head = ui.h('<div class="app-head"><div class="ah-t">微信 · Leano</div>'+
      '<div class="ah-side" style="margin-left:auto"></div></div>');
    head.querySelector('.ah-side').innerHTML = icons.inlineHTML('plus', 18, 'ah-btn');
    head.querySelector('.ah-side').firstElementChild.addEventListener('click', ()=> showHub(el, 'plaza'));
    el.appendChild(head);
    const body = ui.h('<div class="body"></div>');
    el.appendChild(body);
    el._body = body;
    showList(el);
  }
  function sortedChats(){
    const chars = window.L.store.myCharsMode();
    return chars.slice().sort((a,b)=>{
      const la = window.L.store.lastMsg(a.id), lb = window.L.store.lastMsg(b.id);
      return (lb?lb.ts:0)-(la?la.ts:0);
    });
  }
  function showList(el){
    let body = (el._body && el.contains(el._body)) ? el._body : null;
    if (!body){ body = ui.h('<div class="body"></div>'); el.appendChild(body); }
    el._body = body;
    body.innerHTML='';
    const head = el.querySelector('.app-head');
    if (head){ const listTitle = window.L.store.modeNow()==='airp' ? 'airp · 对话' : '微信 · Leano'; head.innerHTML = '<div class="ah-t">'+listTitle+'</div><div class="ah-side" style="margin-left:auto"></div>'; const hs = head.querySelector('.ah-side'); hs.innerHTML = icons.inlineHTML('plus', 18, 'ah-btn'); hs.firstElementChild.addEventListener('click', ()=> showHub(el, 'plaza')); }
    if (!el.querySelector('.bg-img')){
      const b1 = document.createElement('div'); b1.className='bg-img'; b1.style.backgroundImage='url('+ui.wallpaperURL()+')';
      const b2 = ui.h('<div class="bg-shade"></div>');
      el.insertBefore(b1, el.firstChild);
      el.insertBefore(b2, b1.nextSibling);
    }
    const list = ui.h('<div class="chat-list"></div>');
    const chars = sortedChats();
    if (!chars.length){
      const empty = ui.h('<div class="chat-empty"><div class="ce-ic">'+icons.inlineHTML('heartLine',34,'')+'</div><div>还没有角色，去添加一个吧</div></div>');
      body.appendChild(empty);
    } else {
      chars.forEach(ch=>{
        const lm = window.L.store.lastMsg(ch.id);
        const card = ui.h('<div class="chat-card"><div class="av"></div><div class="cc-info"><div class="cc-name"></div><div class="cc-last"></div></div>'+
          '<div class="cc-meta"><div class="cc-time"></div><div class="cc-bdg" style="display:none"></div></div></div>');
        card.querySelector('.av').appendChild(ui.avatarImg(ch,50));
        card.querySelector('.cc-name').textContent = ch.name;
        const txt = lm? (lm.role==='char'?'':('我: '))+lm.text : '说点什么吧…';
        card.querySelector('.cc-last').textContent = txt;
        if (lm) card.querySelector('.cc-time').textContent = ui.hm(lm.ts);
        const un = window.L.store.unreadOf(ch.id);
        const bdg = card.querySelector('.cc-bdg');
        if (un>0){ bdg.style.display='flex'; bdg.textContent = un>99?'99+':un; }
        card.addEventListener('click', ()=> openConv(el, ch.id));
        list.appendChild(card);
      });
      body.appendChild(list);
    }
    // 底部“去角色广场”按钮
    const go = ui.h('<div style="padding:2px 16px 14px;text-align:center"><button class="le-btn ghost" style="width:100%">＋ 角色广场 / 接key / 自建</button></div>');
    go.querySelector('button').onclick = ()=> showHub(el, 'plaza');
    body.appendChild(go);
    el._body = body;
  }
  function openConv(el, charId){
    const ch = window.L.store.charById(charId);
    if (!ch) return;
    window.L.store.clearUnread(charId);
    const body = el._body;
    body.innerHTML='';
    const conv = ui.h('<div class="conv"><div class="airp-status" style="display:none"></div><div class="conv-msgs"></div><div class="conv-bar"></div></div>');
    body.appendChild(conv);
    // 若历史为空，先给一句开场白
    const arr = window.L.store.chatOf(charId);
    if (!arr.length){ window.L.store.pushMsg(charId,'char', window.L.engine.greeting(ch)); }
    const msgs = conv.querySelector('.conv-msgs');
    const airpMode = window.L.store.modeNow() === 'airp';
    const statusEl = conv.querySelector('.airp-status');
    if (airpMode && statusEl){
      const av = document.createElement('div'); av.className='as-av'; av.appendChild(ui.avatarImg(ch, 40));
      const mid = ui.h('<div class="as-mid"><div class="as-name"></div><div class="as-line"></div></div>');
      mid.querySelector('.as-name').textContent = ch.name;
      mid.querySelector('.as-line').textContent = ch.airpLine || '空气里都是你。';
      const tag = ui.h('<div class="as-tag">airp · 18+</div>');
      statusEl.appendChild(av); statusEl.appendChild(mid); statusEl.appendChild(tag);
      statusEl.style.display = 'flex';
    }
    function render(){
      msgs.innerHTML='';
      const list = window.L.store.chatOf(charId);
      list.forEach(m=>{
        const mine = m.role==='user';
        const row = ui.h('<div class="msg '+(mine?'me':'them')+'">'+(mine?'':'<div class="m-av"></div>')+
          '<div class="m-bub"></div><div class="m-time"></div>'+(mine?'':'')+'</div>');
        if (!mine) row.querySelector('.m-av').appendChild(ui.avatarImg(ch,30));
        row.querySelector('.m-bub').textContent = m.text;
        row.querySelector('.m-time').textContent = ui.hm(m.ts);
        msgs.appendChild(row);
      });
      msgs.scrollTop = msgs.scrollHeight;
    }
    render();
    const bar = conv.querySelector('.conv-bar');
    const input = ui.h('<input type="text" placeholder="发消息…" maxlength="500">');
    const callb = ui.h('<button class="callb" title="通话">'+icons.inlineHTML('phone',16,'')+'</button>');
    const send = ui.h('<button class="send" title="发送">'+icons.inlineHTML('send',16,'')+'</button>');
    if (window.L.store.modeNow()==='airp'){
      const vb = ui.h('<button class="callb voiceb" title="语音">'+icons.inlineHTML('mic',16,'')+'</button>');
      vb.addEventListener('click', ()=> ui.toast('AI 语音将在二期接入'));
      bar.appendChild(vb);
    }
    bar.appendChild(input); bar.appendChild(callb); bar.appendChild(send);
    input.focus && input.focus();
    function sendMsg(){
      const txt = input.value.trim();
      if (!txt) return;
      input.value='';
      window.L.store.pushMsg(charId,'user',txt);
      render();
      const typing = ui.h('<div class="typing"><div class="bub"><i></i><i></i><i></i></div></div>');
      msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
      const reply = window.L.engine.getReply(ch, window.L.store.chatOf(charId).slice(0,-1));
      setTimeout(()=>{
        if (typing.parentNode) typing.remove();
        window.L.store.pushMsg(charId,'char',reply);
        render();
      }, window.L.engine.typingMs(reply));
    }
    send.addEventListener('click', sendMsg);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') sendMsg(); });
    callb.addEventListener('click', ()=> openCall({name:ch.name, avatar:ch, number:'LEANO'}, ()=>{ openConv(el, charId); }));
    // 顶部头部改为返回 + 名字 + 通话
    const head = el.querySelector('.app-head');
    head.innerHTML = '<div class="ah-side"><button class="ah-btn backb">'+icons.inlineHTML('back',18,'')+'</button></div>'+
      '<div class="ah-t" style="position:static;transform:none"></div>'+
      '<div class="ah-side"><button class="ah-btn phoneb">'+icons.inlineHTML('phone',16,'')+'</button></div>';
    head.querySelector('.ah-t').textContent = ch.name;
    head.querySelector('.backb').onclick = ()=> showList(el);
    head.querySelector('.phoneb').onclick = ()=> openCall({name:ch.name, avatar:ch, number:'LEANO'}, ()=>{ openConv(el, charId); });
    // 还原 head 布局（ah-t 绝对定位样式被覆盖）
    const t = head.querySelector('.ah-t');
    t.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:16px;font-weight:700;max-width:60%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
  }
  function showHub(el, tab){
    if (window.L.roles && window.L.roles.showHub){
      window.L.roles.showHub(el, {tab:tab, back:()=>{ const t = el._returnTo||'list'; if(t==='list') showList(el); else window.L.system.goHome(); }});
    }
  }

  /* ================= 电话 ================= */
  function buildPhone(el){
    el.classList.add('phone-app');
    el.appendChild(ui.h('<div class="app-head"><div class="ah-t">电话</div><div class="ah-spacer"></div><div class="ah-side"></div></div>'));
    const body = ui.h('<div class="body"></div>');
    el.appendChild(body);
    const tabs = ui.h('<div class="seg phone-tabs"><button data-t="recents">最近</button><button data-t="contacts">联系人</button><button data-t="dial" class="on">拨号</button></div>');
    el.appendChild(tabs);
    const pbody = ui.h('<div class="phone-body"></div>');
    el.appendChild(pbody);
    const showTab = (t)=>{
      tabs.querySelectorAll('button').forEach(b=>b.classList.toggle('on', b.dataset.t===t));
      pbody.innerHTML='';
      if (t==='dial') drawDial(pbody);
      else if (t==='recents') drawRecents(pbody);
      else drawContacts(pbody);
    };
    tabs.addEventListener('click', e=>{ const b=e.target.closest('button'); if(b) showTab(b.dataset.t); });
    showTab('dial');
  }
  function drawRecents(pbody){
    const log = window.L.store.get().callLog;
    const box = ui.h('<div class="recents"></div>');
    if (!log.length){
      box.appendChild(ui.h('<div class="chat-empty"><div class="ce-ic">'+icons.inlineHTML('phone',30,'')+'</div><div>暂无通话记录</div></div>'));
    } else {
      log.forEach(r=>{
        const row = ui.h('<div class="rec-row"><div class="rr-av"></div><div><div class="rr-n"></div><div class="rr-s"></div></div><div class="rr-ic">↩</div></div>');
        const ch = r.avatar;
        row.querySelector('.rr-av').appendChild(ui.avatarImg(ch,42));
        row.querySelector('.rr-n').textContent = r.name || r.number || '未知';
        row.querySelector('.rr-s').textContent = r.kind + ' · ' + ui.hm(r.ts);
        row.addEventListener('click', ()=> openCall(r, ()=>{}));
        box.appendChild(row);
      });
    }
    pbody.appendChild(box);
  }
  function drawContacts(pbody){
    const chars = window.L.store.myCharsMode();
    const box = ui.h('<div class="recents"></div>');
    if (!chars.length){
      box.appendChild(ui.h('<div class="chat-empty"><div class="ce-ic">'+icons.inlineHTML('user',30,'')+'</div><div>还没有联系人，去角色广场添加</div></div>'));
    } else {
      chars.forEach(ch=>{
        const row = ui.h('<div class="rec-row"><div class="rr-av"></div><div><div class="rr-n"></div><div class="rr-s"></div></div><div class="rr-ic">'+icons.inlineHTML('phone',15,'')+'</div></div>');
        row.querySelector('.rr-av').appendChild(ui.avatarImg(ch,42));
        row.querySelector('.rr-n').textContent = ch.name;
        row.querySelector('.rr-s').textContent = (ch.role||'恋人')+' · '+(ch.age||'')+'岁';
        row.addEventListener('click', ()=> openCall({name:ch.name, avatar:ch, number:'LEANO'}, ()=>{}));
        box.appendChild(row);
      });
    }
    pbody.appendChild(box);
  }
  function drawDial(pbody){
    const num = ui.h('<div class="dial-num"></div>');
    const pad = ui.h('<div class="dialpad"></div>');
    const keys = [
      ['1','',''],['2','ABC',''],['3','DEF',''],
      ['4','GHI',''],['5','JKL',''],['6','MNO',''],
      ['7','PQRS',''],['8','TUV',''],['9','WXYZ',''],
      ['*','',''],['0','+',''],['#','','']
    ];
    keys.forEach(k=>{
      const r = pad.querySelector('.dial-row');
      if (!r || r.children.length>=3){
        if (r) pad.appendChild(r);
        pad.appendChild(ui.h('<div class="dial-row"></div>'));
      }
      const lastRow = pad.lastElementChild;
      const key = ui.h('<button class="dial-key"><span class="dk-n"></span><span class="dk-l"></span></button>');
      key.querySelector('.dk-n').textContent = k[0];
      key.querySelector('.dk-l').textContent = k[1]||'';
      key.addEventListener('click', ()=> num.textContent = (num.textContent + k[0]).slice(0,20));
      lastRow.appendChild(key);
    });
    const ops = ui.h('<div class="dial-ops"><button class="del-btn">⌫</button><button class="call-btn">'+icons.inlineHTML('phone',26,'')+'</button></div>');
    ops.querySelector('.del-btn').addEventListener('click', ()=> num.textContent = num.textContent.slice(0,-1));
    ops.querySelector('.call-btn').addEventListener('click', ()=>{
      const number = num.textContent || '';
      if (!number) return;
      const ch = window.L.store.myChars().find(c=> c.name===number || c.number===number);
      openCall({name: ch?ch.name:number, avatar: ch||null, number:number}, ()=>{});
    });
    pbody.appendChild(num); pbody.appendChild(pad); pbody.appendChild(ops);
  }

  /* ============ 通话界面 ============ */
  function openCall(opts, onEnd){
    const overlay = ui.h('<div class="call-screen"></div>');
    const avatar = opts.avatar;
    const bg = document.createElement('div'); bg.className='cs-bg';
    bg.style.backgroundImage = 'url("'+ (avatar? ui.charAvatarUrl(avatar) : ui.wallpaperURL()) +'")';
    overlay.appendChild(bg); overlay.appendChild(ui.h('<div class="cs-shade"></div>'));
    const inr = ui.h('<div class="cs-in"><div class="cs-state">正在连接…</div><div class="cs-av"></div><div class="cs-name"></div><div class="cs-sub"></div></div>');
    overlay.appendChild(inr);
    inr.querySelector('.cs-av').appendChild(ui.avatarImg(avatar||{name:opts.name||'号码', avatar:'motif', motif:'heart'},110));
    inr.querySelector('.cs-name').textContent = opts.name || opts.number || '未知';
    const sub = inr.querySelector('.cs-sub');
    const ops = ui.h('<div class="cs-ops"><button class="cs-op spk">'+icons.inlineHTML('speaker',22,'')+'</button><button class="cs-op end">'+icons.inlineHTML('endcall',24,'')+'</button><button class="cs-op mute">'+icons.inlineHTML('mic',22,'')+'</button></div>');
    overlay.appendChild(ops);
    window.L.system.hideHomeIndicator && window.L.system.hideHomeIndicator();
    const av = window.L.q ? ui.q('#appview') : document.querySelector('#appview');
    av.appendChild(overlay);
    let sec = 0, timer=null;
    const t0 = Date.now();
    const conn = setTimeout(()=>{
      inr.querySelector('.cs-state').textContent = '通话中';
      timer = setInterval(()=>{
        sec++;
        sub.textContent = '00:'+ui.fmtClock(sec*1000);
      }, 1000);
      const caption = ui.h('<div class="cs-caption"></div>');
      caption.textContent = (avatar && window.L.engine ? window.L.engine.greeting(avatar) : '你好呀，接通啦。');
      overlay.appendChild(caption);
      setTimeout(()=>{ if(caption.parentNode) caption.remove(); }, 4000);
    }, 1600);
    function end(){
      clearTimeout(conn); clearInterval(timer);
      window.L.store.logCall({name:opts.name||opts.number||'未知', avatar:avatar||{name:'未知',avatar:'motif',motif:'heart'}, number:opts.number||'', kind:'呼出', ts:Date.now()});
      overlay.remove();
      window.L.system.showHomeIndicator && window.L.system.showHomeIndicator();
      onEnd && onEnd();
    }
    ops.querySelector('.end').addEventListener('click', end);
    ops.querySelector('.mute').addEventListener('click', function(){ this.classList.toggle('on'); });
    ops.querySelector('.spk').addEventListener('click', function(){ this.classList.toggle('on'); });
  }

  register('chat', '微信 · Leano', 'wechat', buildChat);
  register('phone', '电话', 'phone', buildPhone);
  register('camera', '相机', 'camera', buildCamera);

  function buildCamera(el){
    el.classList.add('camera-app');
    el.style.background='#000';
    const stage = ui.h('<div class="cam-stage"><canvas class="cam-canvas"></canvas><div class="cam-gridlines"></div><div class="cam-mode">拍照</div><div class="cam-flash"></div>'+
      '<div class="cam-ops"><button class="cam-side">'+icons.inlineHTML('flash',18,'')+'</button><button class="shutter"></button><button class="cam-side">'+icons.inlineHTML('flip',20,'')+'</button></div></div>');
    el.appendChild(stage);
    const canvas = stage.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let raf = 0, flip = false;
    function size(){
      const r = canvas.parentElement.getBoundingClientRect();
      canvas.width = r.width; canvas.height = r.height;
    }
    const t0 = Date.now();
    function frame(){
      const r = canvas.parentElement.getBoundingClientRect();
      const w = Math.max(1, Math.round(r.width));
      const h = Math.max(1, Math.round(r.height));
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;
      if (!w || !h){ raf = requestAnimationFrame(frame); return; }
      ctx.fillStyle = '#0b0b0b'; ctx.fillRect(0,0,w,h);
      const t = (Date.now()-t0)/1000;
      // 黑白“取景”噪点感
      for (let i=0;i<34;i++){
        const x = (i*137.5 + t*6)%(w+80)-40;
        const y = ((i*97.3)%h + Math.sin(t*0.4+i)*14);
        const rad = 18+(i%5)*9;
        const g = ctx.createRadialGradient(x,y,2,x,y,rad);
        g.addColorStop(0,'rgba(255,255,255,'+(0.03+ (i%4)*0.012)+')');
        g.addColorStop(1,'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x,y,rad,0,6.283); ctx.fill();
      }
      // 中心主体轮廓（黑白剪影，翻转时换边）
      const cx = w/2, cy = h*0.5;
      const s = Math.min(w,h)/300;
      ctx.save();
      ctx.translate(cx, cy); ctx.scale(s,s);
      ctx.fillStyle='rgba(235,233,225,0.9)';
      if (!flip){
        ctx.beginPath();
        ctx.moveTo(-70,-20); ctx.bezierCurveTo(-70,-120,10,-170,90,-150);
        ctx.bezierCurveTo(10,-120,-10,-70,-10,-20); ctx.closePath(); ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(70,-20); ctx.bezierCurveTo(70,-120,-10,-170,-90,-150);
        ctx.bezierCurveTo(-10,-120,10,-70,10,-20); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    const flash = stage.querySelector('.cam-flash');
    stage.querySelector('.shutter').addEventListener('click', ()=>{
      flash.classList.remove('on'); void flash.offsetWidth; flash.classList.add('on');
      const data = canvas.toDataURL('image/png');
      window.L.store.addPhoto({ id:'p'+Date.now(), data:data, cap:'此刻 · '+ui.hm(Date.now()), ts:Date.now() });
      ui.toast('已存入相册');
      if (window.L.system && window.L.system.tapHaptic) window.L.system.tapHaptic();
          });
    stage.querySelector('.cam-side:last-child').addEventListener('click', ()=>{ flip=!flip; });
    stage.querySelector('.cam-side:first-child').addEventListener('click', function(){
      this.style.color = this.style.color==='rgb(255, 255, 255)' ? '#ffd60a' : '#ffffff';
      ui.toast('闪光灯（模拟）');
    });
    el._cleanup = ()=>{ cancelAnimationFrame(raf); };
  }

  window.L = window.L || {};
  window.L.apps = { build:build, run:run, openChat:openChat, register:register, openCall:openCall, _defs:DEFS };
})();