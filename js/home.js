/* home.js — 主屏两页、Dock、翻页 */
(function(){
  const ui = window.L.ui, icons = window.L.icons;
  const st = { idx:0, rendered:false };

  function cellHTML(item, dock){
    const img = icons.appIcon(item.icon);
    return '<div class="app-cell" data-act="'+item.act+'" data-arg="'+(item.arg||'')+'">'+
      '<div class="ic">'+(item.badge!==false?'<span class="bdg" data-badge="1" style="display:none"></span>':'')+
      '<img src="'+img+'" alt="">'+(item.new?'<span class="badge-new">NEW</span>':'')+'</div>'+
      '<div class="lb">'+ui.esc(item.label)+'</div></div>';
  }
  function addRow(container, items){
    const row = ui.h('<div class="app-grid"></div>');
    items.forEach(it=> row.insertAdjacentHTML('beforeend', cellHTML(it)));
    container.appendChild(row);
    container.appendChild(ui.h('<div class="home-sec"></div>'));
  }

  function buildWidgetStrip(){
    const strip = ui.h('<div class="widget-strip"></div>');
    const timeCard = ui.h('<div class="widget-time ios-clock"><div class="wt-date"></div><div class="wt-time"></div><div class="wt-sub"></div></div>');
    strip.appendChild(timeCard);
    const ph = ui.h('<div class="w-photo"><img alt=""><span class="w-photo-tag">组件图</span></div>');
    const im = ph.querySelector('img');
    im.src = ui.slotURL('widget', icons.sceneURL('kiss', 240, 240));
    strip.appendChild(ph);
    strip._timeCard = {d:timeCard.querySelector('.wt-date'), t:timeCard.querySelector('.wt-time'), d2:timeCard.querySelector('.wt-sub')};
    return strip;
  }
  function tickWidgetStrip(strip){
    if (!strip || !strip._timeCard) return;
    const now = new Date();
    const wd = ['日','一','二','三','四','五','六'][now.getDay()];
    strip._timeCard.d.textContent = wd + ' · ' + (now.getMonth()+1) + '月' + now.getDate() + '日';
    strip._timeCard.t.textContent = ui.hm(now.getTime());
    strip._timeCard.d2.textContent = '上海 · 本地时间';
  }

  function buildCoupleCard(){
    const card = ui.h('<div class="couple-card" data-act="lovecard">'+
      '<div class="couple-avs"><div class="big ua"></div><div class="heart">♥</div><div class="big ca"></div></div>'+
      '<div class="couple-info"><div class="couple-names"><span class="uname"></span><span style="opacity:.5">×</span><span class="cname"></span></div>'+
      '<div class="couple-sub">双向奔赴 · 只对你可见</div><div class="couple-days"></div></div>'+
      '<button class="love-btn">Love me</button></div>');
    return card;
  }
  function refreshCouple(card){
    const s = window.L.store.get();
    const ua = card.querySelector('.ua'), ca = card.querySelector('.ca');
    ua.innerHTML=''; ca.innerHTML='';
    ua.appendChild(ui.avatarImg({id:'user', name:s.user.name||'Ariel', avatar:'motif', motif:s.user.motif||'kiss'}, 60));
    const eric = window.L.store.charById('eric') || {name:'Eric', avatar:'motif', motif:'swan'};
    ca.appendChild(ui.avatarImg(eric, 60));
    card.querySelector('.uname').textContent = s.user.name||'Ariel';
    card.querySelector('.cname').textContent = eric.name;
    card.querySelector('.couple-days').textContent = '相恋 '+window.L.store.daysTogether()+' 天';
  }

  function page1(){
    const page = ui.h('<div class="page"></div>');
    const ws = buildWidgetStrip();
    page.appendChild(ws);
    page._ws = ws;
    page.appendChild(ui.h('<div class="home-sec"></div>'));
    addRow(page, [
      {icon:'wechat', label:'微信', act:'chat', badge:true},
      {icon:'x', label:'X', act:'dev'},
      {icon:'vinyl', label:'Vinyl', act:'dev'},
      {icon:'douyin', label:'抖音', act:'dev'}
    ]);
    addRow(page, [
      {icon:'film', label:'放映室', act:'dev'},
      {icon:'camera', label:'相机', act:'camera'},
      {icon:'photos', label:'照片', act:'photos'},
      {icon:'calc', label:'计算器', act:'calc'}
    ]);
    const cc = buildCoupleCard();
    page.appendChild(cc);
    page._couple = cc;
    if (window.L.store.modeNow()==='airp') cc.style.display='none';
    addRow(page, [
      {icon:'worldbook', label:'世界书', act:'dev'},
      {icon:'phone', label:'电话', act:'phone'},
      {icon:'music', label:'音乐', act:'dev'},
      {icon:'spyphone', label:'查他手机', act:'dev'}
    ]);
    return page;
  }
  function buildLoverCard(){
    const card = ui.h('<div class="lover-card" data-act="lover">'+
      '<div class="av"></div><div style="flex:1;min-width:0"><div class="nm"></div><div class="tg"></div></div>'+
      '<div class="arr">›</div></div>');
    return card;
  }
  function refreshLover(card){
    const eric = window.L.store.charById('eric');
    const av = card.querySelector('.av'); av.innerHTML='';
    av.appendChild(ui.avatarImg(eric, 60));
    card.querySelector('.nm').textContent = eric.name;
    card.querySelector('.tg').textContent = eric.tagline || eric.bio || '';
  }
  function page2(){
    const page = ui.h('<div class="page"></div>');
    const top = ui.h('<div class="top2"></div>');
    const mini = ui.h('<div class="mini2"></div>');
    const tiles = [
      {icon:'browser', label:'浏览器', act:'dev'},
      {icon:'task', label:'任务设备', act:'dev'},
      {icon:'couple', label:'情侣空间', act:'roles'},
      {icon:'ai', label:'AI账户', act:'roles:key'}
    ];
    tiles.forEach(x=>{
      const d = ui.h('<div class="w-mini" data-act="'+x.act+'" style="cursor:pointer"><div class="wm-ico"></div><div class="wm-t" style="font-size:11px"></div></div>');
      d.querySelector('.wm-ico').innerHTML = icons.inlineHTML(x.icon, 20, '');
      d.querySelector('.wm-t').textContent = x.label;
      mini.appendChild(d);
    });
    top.appendChild(mini);
    const lc = buildLoverCard();
    top.appendChild(lc);
    if (window.L.store.modeNow()==='airp') lc.style.display='none';
    page.appendChild(top);
    page._lover = lc;
    const coll = ui.h('<div class="collage"></div>');
    const phs = [
      {scene:'wings', r:'-4deg', cap:'WINGS'},
      {scene:'swan', r:'0deg', cap:'SWAN'},
      {scene:'lily', r:'4deg', cap:'LILY'}
    ];
    phs.forEach((p,i)=>{
      const el = ui.h('<div class="ph" style="--r:'+p.r+';left:'+(30+i*84)+'px;z-index:'+(i+1)+'"></div>');
      const im = document.createElement('img');
      im.src = ui.slotURL('collage'+i, icons.sceneURL(p.scene, 220, 300));
      el.appendChild(im);
      el.insertAdjacentHTML('beforeend','<div class="cap">'+p.cap+'</div>');
      coll.appendChild(el);
    });
    page.appendChild(coll);
    addRow(page, [
      {icon:'waimai', label:'外卖', act:'dev'},
      {icon:'shop', label:'购物', act:'dev'},
      {icon:'plane', label:'云程', act:'dev'},
      {icon:'candle', label:'规则怪谈', act:'dev'}
    ]);
    addRow(page, [
      {icon:'door', label:'惊悚抉择', act:'dev'},
      {icon:'roleplay', label:'角色扮演', act:'roles'},
      {icon:'rose', label:'线下约会', act:'dev'},
      {icon:'clock', label:'时钟', act:'clock'}
    ]);
    return page;
  }
  function dockHTML(){
    const items = [
      {icon:'calendar', label:'日历', act:'dev'},
      {icon:'game', label:'游戏', act:'dev'},
      {icon:'mail', label:'邮件', act:'dev'},
      {icon:'gear', label:'设置', act:'settings'}
    ];
    return '<div class="dock-in">'+items.map(it=>cellHTML(it, true)).join('')+'</div>';
  }

  function build(){
    const home = ui.q('#home');
    home.innerHTML='';
    const bg = document.createElement('div'); bg.className='home-bg';
    bg.style.backgroundImage = 'url("'+ui.wallpaperURL()+'")';
    bg.style.filter = ui.customVal('wallpaper') ? 'brightness(.9) contrast(1.02)' : (ui.curTheme()==='white' ? 'none' : 'brightness(.78) saturate(.3)');
    home.appendChild(bg);
    home.appendChild(ui.h('<div class="home-shade"></div>'));
    const pagesWrap = ui.h('<div class="home-pages"><div class="home-track"></div></div>');
    const track = pagesWrap.querySelector('.home-track');
    const p1 = page1(), p2 = page2();
    track.appendChild(p1); track.appendChild(p2);
    home.appendChild(pagesWrap);
    home.appendChild(ui.h('<div class="dots"><i class="on"></i><i></i></div>'));
    const dock = ui.h('<div class="dock">'+dockHTML()+'</div>');
    home.appendChild(dock);

    home.addEventListener('click', onHomeClick);
    home._pages = {track:track, p1:p1, p2:p2};
    st.rendered = true;
    slideTo(0);
    refresh();
    return home;
  }
  function onHomeClick(e){
    const cell = e.target.closest('[data-act]');
    if (!cell) return;
    const act = cell.dataset.act, arg = cell.dataset.arg;
    if (act === 'lovecard'){
      // 点卡片本身打开与 Eric 的聊天；Love me 按钮单独处理
      if (e.target.closest('.love-btn')) { doLove(); return; }
      window.L.apps.openChat('eric');
      return;
    }
    if (act === 'lover'){ window.L.apps.openChat('eric'); return; }
    window.L.system.tapHaptic && window.L.system.tapHaptic();
    if (act === 'dev'){
      const lbel = (cell.querySelector('.lb') || cell.querySelector('.wm-t') || {}).textContent || '功能';
      window.L.ui.devSheet(lbel);
      return;
    }
    window.L.apps.run(act, arg);
  }
  function doLove(){
    const s = window.L.store.get();
    if (!window.L.store.isOwned('eric')) window.L.store.addChar('eric');
    window.L.store.clearUnread('eric');
    const u = window.L.store.pushMsg('eric','user','Love me 💘');
    window.L.store.pushMsg('eric','char','收到。这句话我收下了，不许反悔。');
    window.L.ui.toast('已向 '+s.user.name+' × Eric 表达爱意');
    refreshBadges();
  }
  function slideTo(i){
    if (i<0||i>1) return;
    st.idx = i;
    const track = ui.q('#home .home-track');
    if (track) track.style.transform = 'translateX('+(-i*402)+'px)';
    const dots = ui.qa('#home .dots i');
    dots.forEach((d,k)=>d.classList.toggle('on', k===i));
  }
  function refresh(){
    if (!st.rendered) return;
    const home = ui.q('#home');
    if (home._pages){
      tickWidgetStrip(home._pages.p1._ws);
      refreshCouple(home._pages.p1._couple);
      refreshLover(home._pages.p2._lover);
    }
    refreshBadges();
  }
  function refreshBadges(){
    const n = window.L.store.totalUnread();
    ui.qa('#home [data-act="chat"] .bdg, #home [data-act="roles"] .bdg').forEach(b=>{
      b.style.display = n>0?'flex':'none';
      b.textContent = n>99?'99+':n;
    });
    const s = window.L.store.get();
    ui.qa('#home .uname').forEach(x=> x.textContent = (s.user.name||'Ariel'));
  }

  window.L = window.L || {};
  window.L.home = { build:build, slideTo:slideTo, refresh:refresh, refreshBadges:refreshBadges, get idx(){return st.idx;} };
})();