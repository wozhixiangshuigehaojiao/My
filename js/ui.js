/* ui.js — 通用 UI 工具 */
(function(){
  const icons = window.L.icons;
  function q(sel, root){ return (root||document).querySelector(sel); }
  function qa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
  function h(html){
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function appIconImg(key, size){
    const img = document.createElement('img');
    img.src = icons.appIcon(key);
    if (size){ img.style.width = size+'px'; img.style.height = size+'px'; }
    img.alt='';
    return img;
  }
  function charAvatarUrl(ch){
    if (!ch) return icons.avatarURL('?');
    try {
      const key = ch.id ? ('avatar:'+ch.id) : null;
      if (key && window.L && window.L.store){ const c = window.L.store.getCustom(key); if (c) return c; }
    } catch(e){}
    if (ch.avatar === 'motif') return icons.avatarMotifURL(ch.motif || 'heart');
    return icons.avatarURL(ch.name);
  }
  function avatarImg(ch, size){
    const img = document.createElement('img');
    img.src = charAvatarUrl(ch);
    if (size){ img.style.width=size+'px'; img.style.height=size+'px'; }
    img.alt='';
    return img;
  }
  function pad2(n){ return (n<10?'0':'')+n; }
  function hm(ts){
    const d = ts?new Date(ts):new Date();
    return pad2(d.getHours())+':'+pad2(d.getMinutes());
  }
  function hms(ts){
    const d = ts?new Date(ts):new Date();
    return pad2(d.getHours())+':'+pad2(d.getMinutes())+':'+pad2(d.getSeconds());
  }
  function dateCN(d){
    d = d||new Date();
    const wd = ['日','一','二','三','四','五','六'][d.getDay()];
    return (d.getFullYear())+'年'+(d.getMonth()+1)+'月'+d.getDate()+'日 星期'+wd;
  }
  function dateCN2(d){
    d = d||new Date();
    return (d.getFullYear())+'/'+(d.getMonth()+1)+'/'+d.getDate();
  }
  function fmtClock(ms){ // mm:ss 或 hh:mm:ss
    const s = Math.max(0, Math.floor(ms/1000));
    const hh = Math.floor(s/3600), mm = Math.floor((s%3600)/60), ss = s%60;
    return (hh>0? pad2(hh)+':' : '') + pad2(mm)+':'+pad2(ss);
  }

  let toastTimer = null;
  function toast(msg, ms){
    const el = q('#toast');
    el.innerHTML = esc(msg);
    el.classList.remove('hidden');
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.classList.add('hidden'), 260); }, ms||1800);
  }

  /* bottom sheet */
  function sheet(title, bodyHTML, opts){
    opts = opts||{};
    const sh = q('#sheet');
    const card = h('<div class="sh-card"><div class="sh-grip"></div>'+
      (title?'<div class="sh-title"></div>':'')+
      '<div class="sh-body"></div></div>');
    if (title) q('.sh-title', card).textContent = title;
    q('.sh-body', card).innerHTML = bodyHTML;
    if (opts.buttons && opts.buttons.length){
      const btns = q('.sh-body', card);
      opts.buttons.forEach(b=>{
        const btn = h('<button class="sh-btn"></button>');
        btn.textContent = b.label;
        btn.style.marginTop = '10px';
        if (b.danger) btn.classList.add('danger');
        btn.onclick = ()=>{ sh.classList.remove('open'); if (b.onClick) b.onClick(); };
        btns.appendChild(btn);
      });
    }
    sh.innerHTML=''; sh.appendChild(card);
    sh.classList.remove('hidden');
    const close = ()=>{ sh.classList.remove('open'); setTimeout(()=>sh.classList.add('hidden'), 260); sh.onclick=null; };
    sh.onclick = function(e){ if (e.target===sh) close(); };
    q('.sh-grip', card).addEventListener('click', close);
    if (opts.onClose) sh._onClose = opts.onClose;
    sh.classList.add('open');
    return { close:close };
  }
  /* 开发中占位 sheet */
  function devSheet(name, icon){
    sheet(name || '功能', '<div style="text-align:center;padding:6px 0 4px;">'+
      '<div style="font-size:40px;margin-bottom:8px;display:flex;justify-content:center;">'+icons.inlineHTML(icon||'gear',40,'')+'</div>'+
      '「'+(name||'该功能')+'」还在制作中<br>这一版先保留入口，二期会补上真实玩法。</div>');
  }
  /* 用户卡片 / 头像行 */
  function chip(text){ return '<span class="chip">'+esc(text)+'</span>'; }
  function customVal(key){ try{ return (window.L && window.L.store)? (window.L.store.getCustom(key)||'') : ''; }catch(e){ return ''; } }
  function wallpaperURL(){ return customVal('wallpaper') || icons.wallpaperURL(); }
  function lockURL(){ return customVal('lock') || customVal('wallpaper') || icons.wallpaperURL(); }
  function slotURL(key, fallback){ return customVal(key) || fallback; }
  function pickImage(cb, maxSize){
    const inp = document.createElement('input');
    inp.type='file'; inp.accept='image/*';
    inp.style.cssText='position:absolute;left:-9999px;top:0;';
    document.body.appendChild(inp);
    inp.onchange = function(){
      const f = inp.files && inp.files[0];
      inp.remove();
      if (!f) return;
      const reader = new FileReader();
      reader.onload = function(){
        const img = new Image();
        img.onload = function(){
          const max = maxSize || 900;
          let w = img.width, h = img.height;
          if (w>max || h>max){ const sc = max/Math.max(w,h); w=Math.max(1,Math.round(w*sc)); h=Math.max(1,Math.round(h*sc)); }
          const cv = document.createElement('canvas');
          cv.width = w; cv.height = h;
          const ctx = cv.getContext('2d');
          ctx.fillStyle = '#000'; ctx.fillRect(0,0,w,h);
          ctx.drawImage(img, 0, 0, w, h);
          cb(cv.toDataURL('image/jpeg', 0.86));
        };
        img.onerror = function(){ ui.toast('图片读取失败，请换一张'); };
        img.src = reader.result;
      };
      reader.onerror = function(){ ui.toast('图片读取失败'); };
      reader.readAsDataURL(f);
    };
    inp.click();
  }

  window.L = window.L || {};
  window.L.ui = { q:q, qa:qa, h:h, esc:esc, appIconImg:appIconImg, charAvatarUrl:charAvatarUrl, avatarImg:avatarImg,
    hm:hm, hms:hms, dateCN:dateCN, dateCN2:dateCN2, fmtClock:fmtClock, toast:toast, sheet:sheet, devSheet:devSheet, chip:chip,
    customVal:customVal, wallpaperURL:wallpaperURL, lockURL:lockURL, slotURL:slotURL, pickImage:pickImage };
})();