/* icons.js — 黑白 SVG 图标、头像、示例场景图 */
(function(){
  const NS='http://www.w3.org/2000/svg';
  const G={
    heart:'<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
    heartLine:'<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#fff" stroke-width="1.6"/>',
    wechat:'<path d="M12 3C6.9 3 2.8 6.5 2.8 10.7c0 2.3 1.2 4.3 3.2 5.7l-.9 2.9 3.2-1.6c.9.3 1.9.4 2.9.4h.4c-.3-.9-.4-1.8-.4-2.7 0-3.7 3.4-6.6 7.6-6.6h.3C18.1 5.4 15.3 3 12 3z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><circle cx="7.6" cy="10.8" r="1" fill="#fff"/><circle cx="11.6" cy="10.8" r="1" fill="#fff"/>',
    x:'<path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
    vinyl:'<circle cx="12" cy="12" r="9" fill="#fff"/><circle cx="12" cy="12" r="6.2" fill="#0a0a0a"/><circle cx="12" cy="12" r="2.6" fill="#fff"/><circle cx="9.4" cy="8.6" r=".7" fill="#0a0a0a"/><circle cx="12" cy="12" r=".9" fill="#0a0a0a"/>',
    douyin:'<circle cx="10" cy="16.5" r="3.2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M13.2 16.5V5.5c1.2 1.2 2.5 1.8 4 1.8" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>',
    film:'<rect x="3" y="4.5" width="18" height="15" rx="2.4" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M10 9.2l5 2.8-5 2.8z" fill="#fff"/><path d="M6.2 5v2M6.2 17v2M17.8 5v2M17.8 17v2" stroke="#fff" stroke-width="1.4"/>',
    camera:'<path d="M3 8.2c0-1.2 1-2.2 2.2-2.2h1.4l1.2-2h7.6l1.2 2h1.4c1.2 0 2.2 1 2.2 2.2v8.6c0 1.2-1 2.2-2.2 2.2H5.2c-1.2 0-2.2-1-2.2-2.2V8.2z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12.4" r="3.4" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="12" cy="12.4" r="1.3" fill="#fff"/>',
    photos:'<rect x="3.4" y="5.2" width="17.2" height="13.6" rx="2.2" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="9" cy="9.6" r="1.5" fill="#fff"/><path d="M4.5 16.4l4.6-4.5 3.4 3.2 2.6-2.4 4.4 4.3" fill="none" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/>',
    calc:'<rect x="4.5" y="3.5" width="15" height="17" rx="2" fill="none" stroke="#fff" stroke-width="1.7"/><rect x="7.5" y="6" width="9" height="3.4" rx="1" fill="#fff"/><circle cx="8.6" cy="13.4" r="1" fill="#fff"/><circle cx="12" cy="13.4" r="1" fill="#fff"/><circle cx="15.4" cy="13.4" r="1" fill="#fff"/><circle cx="8.6" cy="17.4" r="1" fill="#fff"/><circle cx="12" cy="17.4" r="1" fill="#fff"/><circle cx="15.4" cy="17.4" r="1" fill="#fff"/>',
    clock:'<circle cx="12" cy="12" r="8.6" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M12 7.4V12l3.2 2" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    phone:'<path d="M6.6 10.8c1.4 2.7 3.8 5 6.6 6.4l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.3 0 .7-.2 1l-2.3 2.3z" fill="#fff"/>',
    music:'<path d="M9 17.6V6.2l9-1.8v10.6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6.6" cy="17.6" r="2.4" fill="#fff"/><circle cx="15.6" cy="15" r="2.4" fill="#fff"/>',
    spyphone:'<rect x="5" y="2.8" width="11" height="17" rx="2.4" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="15" cy="16.6" r="4.6" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M18.4 20l3 3" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/><circle cx="10.5" cy="8.6" r="1" fill="#fff"/>',
    calendar:'<rect x="3.4" y="5" width="17.2" height="15.6" rx="2.2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M3.4 9.6h17.2M8 3v3.6M16 3v3.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><rect x="7" y="13" width="3" height="3" rx=".8" fill="#fff"/><rect x="12.4" y="13" width="3" height="3" rx=".8" fill="#fff"/><rect x="17.6" y="13" width="3" height="3" rx=".8" fill="none" stroke="#fff" stroke-width="1"/>',
    game:'<path d="M7.2 6.5h9.6c3 0 5.4 2.3 5.4 5.2v3.4c0 2-1.7 3.4-3.6 2.9l-2.2-.6c-.7-.2-1.4 0-2 .5L12 19.9l-2.4-2c-.6-.5-1.3-.7-2-.5l-2.2.6c-1.9.5-3.6-.9-3.6-2.9V11.7c0-2.9 2.4-5.2 5.4-5.2z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><circle cx="8.6" cy="11.8" r="1.1" fill="#fff"/><circle cx="12.2" cy="11.8" r="1.1" fill="#fff"/><path d="M15.8 10.4v3M14.3 11.9h3" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>',
    mail:'<rect x="3" y="5.2" width="18" height="13.6" rx="2.2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M4 7.4l8 6 8-6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/>',
    gear:'<circle cx="12" cy="12" r="3.2" fill="#fff"/><path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.9 5.9l1.7 1.7M16.4 16.4l1.7 1.7M18.1 5.9l-1.7 1.7M7.6 16.4l-1.7 1.7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    browser:'<circle cx="12" cy="12" r="8.6" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M15.6 8.4l-2.2 5-5 2.2 2.2-5z" fill="#fff"/>',
    task:'<rect x="3.6" y="3.6" width="16.8" height="16.8" rx="2.4" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M7.6 12.2l2.6 2.6 6.2-6.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    couple:'<path d="M9.4 6.6c-.9-1.6-3.1-1.7-4.1-.1-1 1.6.6 3.6 4.1 6 3.5-2.4 5.1-4.4 4.1-6-1-1.6-3.2-1.5-4.1.1z" fill="#fff"/><path d="M15 7.2c-.5-.9-1.7-1-2.3-.1-.3.5-.2 1.2.3 1.7.5-.5.6-1.2.3-1.7" fill="#fff" opacity="0"/><path d="M16.4 6.8c-.6-1-2-1.1-2.6-.1-.7 1 .4 2.3 2.6 3.8 2.2-1.5 3.3-2.8 2.6-3.8-.6-1-2-.9-2.6.1z" fill="#fff"/>',
    ai:'<rect x="4.5" y="4.5" width="15" height="15" rx="3" fill="none" stroke="#fff" stroke-width="1.7"/><rect x="9" y="9" width="6" height="6" rx="1.2" fill="#fff"/><path d="M9.5 4.5V2M14.5 4.5V2M9.5 22v-2.5M14.5 22v-2.5M4.5 9.5H2M4.5 14.5H2M22 9.5h-2.5M22 14.5h-2.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>',
    waimai:'<path d="M4.5 9h15l-1.1 10.2c-.1 1.1-1 1.8-2.1 1.8H7.7c-1.1 0-2-.7-2.1-1.8z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.6 9V7a3.4 3.4 0 016.8 0v2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M10.6 13.6v3.4M14.4 13.6v3.4" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    shop:'<path d="M5 8h14l-1 12.2c-.1 1.1-1 1.8-2.1 1.8H8.1c-1.1 0-2-.7-2.1-1.8z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.8 10.6V6.4a3.2 3.2 0 016.4 0v4.2" fill="none" stroke="#fff" stroke-width="1.7"/>',
    plane:'<path d="M12 3l2.6 6.2 5.4 1-1.8 2.2-4.4-.7-3 3.2 1 3.8-1.8.8-2-4.5-4.6-1.9.9-1.8 3.8.8 2.9-3.4-.5-4.3 1.6-1.9z" fill="#fff"/>',
    candle:'<rect x="8.6" y="8" width="6.8" height="12" rx="1.4" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M12 4.6c1.8 2 1.8 3.4 0 4-1.8-.6-1.8-2 0-4z" fill="#fff"/><path d="M12 2.6v2" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/>',
    door:'<rect x="5" y="3.6" width="14" height="16.8" rx="2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M9 20.4v-7h6v7" fill="none" stroke="#fff" stroke-width="1.7"/><circle cx="13.2" cy="5.4" r="1.4" fill="#fff"/>',
    roleplay:'<circle cx="8.8" cy="14" r="6" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="15.4" cy="14" r="6" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M8.8 14v-1.6M8.8 14v1.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><circle cx="15.4" cy="13" r=".8" fill="#fff"/><circle cx="15.4" cy="15.4" r=".8" fill="#fff"/><path d="M2.8 14h12" stroke="#fff" stroke-width="1" opacity="0"/>',
    rose:'<path d="M12 21c-4-2.6-7-5.8-7-9.2C5 8.8 7.4 7 9.4 7c1.2 0 2.1.6 2.6 1.4C12.5 7.6 13.4 7 14.6 7c2 0 4.4 1.8 4.4 4.8 0 3.4-3 6.6-7 9.2z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 21c-1.6-2.8-2.4-5.6-2.4-8.2 0-1.6.6-2.8 1.4-3.4M12 21c1.6-2.8 2.4-5.6 2.4-8.2 0-1.6-.6-2.8-1.4-3.4" stroke="#fff" stroke-width="1.4" opacity="0"/>',
    battery:'<rect x="2.6" y="8" width="17" height="8.6" rx="2" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M21.4 10.8v3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/><rect x="4.6" y="10" width="9.4" height="4.6" rx="1" fill="#fff"/>',
    rain:'<path d="M7 10.4c-2.6 0-4 1.8-4 3.8 0 2 1.6 3.4 3.8 3.4h8.6c2.4 0 4-1.5 4-3.6 0-2.1-1.6-3.6-4-3.6-.4-2.4-2.3-4-4.8-4-2.2 0-3.2 1.2-3.6 4z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.4 18.4v2.4M12 18.4v2.4M15.6 18.4v2.4" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    storage:'<ellipse cx="12" cy="5.6" rx="7.6" ry="2.8" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M4.4 5.6v6c0 1.5 3.4 2.8 7.6 2.8s7.6-1.3 7.6-2.8v-6" fill="none" stroke="#fff" stroke-width="1.6"/><path d="M4.4 11.6v6c0 1.5 3.4 2.8 7.6 2.8s7.6-1.3 7.6-2.8v-6" fill="none" stroke="#fff" stroke-width="1.6"/>',
    flash:'<path d="M13.5 2.6L6 13.4h4.6l-1.5 8 8-11.4h-4.8z" fill="#fff"/>',
    wifi:'<path d="M4 9.6C7.6 6.2 16.4 6.2 20 9.6M6.6 13c2.9-2.6 7.9-2.6 10.8 0M9.4 16.2c1.4-1.3 3.8-1.3 5.2 0" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/><circle cx="12" cy="19.4" r="1.2" fill="#fff"/>',
    bt:'<path d="M12 2.8v18.4M15 6.6L8.6 12l6.4 5.4M15 6.6L12 4.6M8.6 12L12 9.6M12 14.4l3 2" stroke="#fff" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    planeMode:'<path d="M12 3l2.6 6.2 5.4 1-1.8 2.2-4.4-.7-3 3.2 1 3.8-1.8.8-2-4.5-4.6-1.9.9-1.8 3.8.8 2.9-3.4-.5-4.3 1.6-1.9z" fill="#fff"/>',
    moon:'<path d="M20 14.5A8.2 8.2 0 019.5 4 8.5 8.5 0 1020 14.5z" fill="#fff"/>',
    sun:'<circle cx="12" cy="12" r="4.4" fill="#fff"/><path d="M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
    lock:'<rect x="5" y="10" width="14" height="10" rx="2.4" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M8 10V7.6a4 4 0 018 0V10" fill="none" stroke="#fff" stroke-width="1.8"/><circle cx="12" cy="15" r="1.4" fill="#fff"/>',
    key:'<circle cx="8" cy="12" r="4.4" fill="none" stroke="#fff" stroke-width="1.9"/><path d="M11.2 12H21M18 12v3M15.4 12v3" stroke="#fff" stroke-width="1.9" stroke-linecap="round"/>',
    plus:'<path d="M12 5v14M5 12h14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>',
    back:'<path d="M15 4.5L7.5 12l7.5 7.5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    mic:'<rect x="9" y="3.6" width="6" height="10.8" rx="3" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M5.4 11.6c0 3.6 3 6.4 6.6 6.4s6.6-2.8 6.6-6.4M12 18v3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
    send:'<path d="M3 11.4L21 3.6l-5.6 17.2-4.2-7z" fill="#fff"/>',
    video:'<rect x="3" y="6.4" width="12.6" height="11.2" rx="2.2" fill="none" stroke="#fff" stroke-width="1.7"/><path d="M15.6 10.8l5.4-3v8.4l-5.4-3z" fill="#fff"/>',
    endcall:'<path d="M8.4 11.6c.8 2 2.3 3.5 4.2 4.3l1.6-1.6c.2-.2.5-.3.8-.1.8.3 1.7.5 2.6.5.4 0 .8.3.8.8v2.1c0 .4-.4.8-.8.8C9.6 18.4 5 13.8 5 6.2c0-.4.4-.8.8-.8H8c.4 0 .8.3.8.8 0 .9.2 1.8.5 2.6.1.3 0 .6-.2.8l-1.5 1.5c.3.2.5.4.8.5z" fill="#fff" transform="rotate(135 12 12)"/>',
    speaker:'<path d="M4 9.6v4.8h3.4L12 18.6V5.4L7.4 9.6z" fill="#fff"/><path d="M15.2 9.2c1 1.6 1 4 0 5.6M17.6 7c2.2 2.8 2.2 9.2 0 12" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    flip:'<path d="M20 12a8 8 0 01-8 8c-2.5 0-4.8-1-6.4-2.8L4 15.6M4 12a8 8 0 018-8c2.5 0 4.8 1 6.4 2.8l1.6 1.6" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M4 5.4v5h5M20 18.6v-5h-5" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    chev:'<path d="M9 5l7 7-7 7" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
    user:'<circle cx="12" cy="8.4" r="4" fill="none" stroke="#fff" stroke-width="1.8"/><path d="M4.6 20.4c1.4-3.6 4.2-5.4 7.4-5.4s6 1.8 7.4 5.4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>',
    home:'<path d="M4 11.2L12 4l8 7.2M6.4 9.8V20h11.2V9.8" fill="none" stroke="#fff" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>',
    trash:'<path d="M4.5 6.6h15M9.4 6.6V4.9h5.2v1.7M6.6 6.6l1 13.2h8.8l1-13.2M10 10.2v6M14 10.2v6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>',
    check:'<path d="M5 12.6l4.6 4.6L19 7.6" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>',
    arrowUp:'<path d="M12 19V5M5.6 11.4L12 5l6.4 6.4" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>',
    test:'<path d="M10 3.2h4M11 3.2v6l-5.6 8.4c-.6.9 0 2.2 1.2 2.2h10.8c1.2 0 1.8-1.3 1.2-2.2L13 9.2v-6" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.4 16.4h7.2" stroke="#fff" stroke-width="1.6"/>',
    refresh:'<path d="M20 12a8 8 0 11-2.3-5.7M20 4.6v4h-4" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
    signal:'<path d="M4 17.4h3M8 14.4h3M12 11.4h3M16 8.4h3" stroke="#fff" stroke-width="2" stroke-linecap="round"/>',
    bell:'<path d="M12 3.4c-3.4 0-5.4 2.4-5.4 5.6v3.6l-1.9 3.2h14.6l-1.9-3.2V9c0-3.2-2-5.6-5.4-5.6z" fill="none" stroke="#fff" stroke-width="1.7" stroke-linejoin="round"/><path d="M9.7 18.8a2.3 2.3 0 004.6 0" fill="none" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>'
  };
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
  function svgStr(inner, w, h){ return '<svg xmlns="'+NS+'" viewBox="0 0 24 24" width="'+(w||24)+'" height="'+(h||24)+'">'+inner+'</svg>'; }
  function cur(inner){ return inner.replace(/#fff/g,'currentColor'); }
  function dataURL(str){ return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(str); }

  /* 应用图标：黑色圆角方块 + 白色图形 */
  function appIcon(key, bg){
    try {
      const cst = window.L && window.L.store ? window.L.store.getCustom('icon:'+key) : null;
      if (cst) return cst;
    } catch(e){}
    bg = bg || '#1b1b1b';
    const inner = G[key] ? svgStr(G[key]) : svgStr(G.task);
    const svg = '<svg xmlns="'+NS+'" viewBox="0 0 64 64" width="64" height="64">'+
      '<rect width="64" height="64" rx="15" fill="'+bg+'"/>'+
      '<g transform="translate(12,12) scale(40/24)">'+G[key]+'</g></svg>';
    return dataURL(svg);
  }
  function inlineHTML(key, size, cls, color){
    const inner = G[key] || G.task;
    return '<svg class="'+(cls||'')+'" viewBox="0 0 24 24" width="'+(size||18)+'" height="'+(size||18)+'" style="color:'+(color||'currentColor')+'">'+cur(inner)+'</svg>';
  }
  function inlineEl(key, size, color){
    const d = document.createElement('div');
    d.innerHTML = inlineHTML(key, size, '', color);
    return d.firstElementChild;
  }

  /* 头像：黑白，首字 */
  function avatarURL(name, seed){
    const letter = esc((name||'?').trim().slice(0,1));
    const bg = '#d8d5cc';
    const svg = '<svg xmlns="'+NS+'" viewBox="0 0 128 128">'+
      '<defs><radialGradient id="g" cx="38%" cy="32%" r="80%"><stop offset="0%" stop-color="#f6f4ee"/><stop offset="100%" stop-color="#b9b6ac"/></radialGradient></defs>'+
      '<circle cx="64" cy="64" r="64" fill="url(#g)"/>'+
      '<circle cx="64" cy="64" r="58" fill="none" stroke="#111" stroke-width="2" opacity=".25"/>'+
      '<text x="64" y="84" font-family="Georgia,serif" font-size="58" font-weight="bold" fill="#161616" text-anchor="middle">'+letter+'</text></svg>';
    return dataURL(svg);
  }
  /* 情侣/恋人默认头像：剪影 */
  function avatarMotifURL(kind){
    const parts = {
      kiss:'<path d="M30 96c0-18 14-32 32-32s32 14 32 32" fill="none" stroke="#fff" stroke-width="5"/><path d="M58 78c8 8 20 8 28 0" fill="none" stroke="#fff" stroke-width="4"/>',
      swan:'<path d="M18 96c10-22 30-26 40-14-8-2-18 2-22 14z" fill="#fff"/><path d="M46 82c-2-26 20-44 46-40-14 2-22 14-22 26" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>',
      heart:'<path d="M64 96c-26-16-44-32-44-50 0-12 9-20 20-20 8 0 15 4 24 12 9-8 16-12 24-12 11 0 20 8 20 20 0 18-18 34-44 50z" fill="#fff"/>',
      ring:'<circle cx="64" cy="70" r="26" fill="none" stroke="#fff" stroke-width="6"/><path d="M64 70l10-34M70 40l6 8-6 8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'
    }[kind] || '';
    const svg = '<svg xmlns="'+NS+'" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#151515"/>'+parts+'</svg>';
    return dataURL(svg);
  }

  /* 场景图：黑白示例照片 */
  function scene(name){
    const S={};
    S.trees = (function(){ let p='<rect width="402" height="874" fill="#101010"/>'; const xs=[40,110,180,255,330,372]; xs.forEach((x,i)=>{ const w=20+i*4; p+='<path d="M'+x+' 874 L'+(x-w/2)+' '+(480-i*10)+' L'+x+' '+(560-i*12)+' L'+(x+w/2)+' '+(480-i*10)+' Z" fill="#1e1e1e"/>'; p+='<rect x="'+(x-6)+'" y="560" width="12" height="314" fill="#0c0c0c"/>'; }); p+='<ellipse cx="90" cy="430" rx="130" ry="60" fill="#fff" opacity=".07"/>'; p+='<ellipse cx="300" cy="380" rx="150" ry="70" fill="#fff" opacity=".05"/>'; p+='<rect width="402" height="874" fill="url(#vg)"/>'; return p; })();
    S.forest = S.trees;
    S.treeslight = '<rect width="402" height="874" fill="#e8e6df"/><ellipse cx="90" cy="430" rx="150" ry="70" fill="#ffffff" opacity=".5"/><ellipse cx="300" cy="390" rx="170" ry="80" fill="#ffffff" opacity=".45"/><path d="M40 874 L18 520 L40 600 L62 520 Z" fill="#c7c3b8"/><path d="M110 874 L86 470 L110 560 L134 470 Z" fill="#b9b5a9"/><path d="M185 874 L160 500 L185 590 L210 500 Z" fill="#cecabf"/><path d="M255 874 L232 440 L255 540 L278 440 Z" fill="#b4b0a4"/><path d="M330 874 L306 520 L330 600 L354 520 Z" fill="#c2beb2"/><path d="M370 874 L356 560 L370 620 L384 560 Z" fill="#bab6aa"/><rect width="402" height="874" fill="url(#none)" opacity="0"/>';
    S.swan = '<rect width="402" height="874" fill="#0d0d0d"/><ellipse cx="200" cy="620" rx="200" ry="230" fill="#161616"/><path d="M120 640c6-120 120-190 230-150-60 8-110 50-130 110z" fill="#efede6"/><path d="M210 520c-4-120 80-230 200-260-60 20-100 70-120 150" fill="none" stroke="#efede6" stroke-width="14" stroke-linecap="round"/><circle cx="258" cy="452" r="7" fill="#0d0d0d"/><path d="M120 640c40-30 90-40 140-30" stroke="#efede6" stroke-width="10" stroke-linecap="round" opacity=".5"/><ellipse cx="60" cy="300" rx="90" ry="40" fill="#fff" opacity=".06"/>';
    S.lily = '<rect width="402" height="874" fill="#0a0a0a"/><g transform="translate(201,470)"><g fill="#f1efe8"><ellipse cx="0" cy="-70" rx="26" ry="66"/><ellipse cx="58" cy="-38" rx="26" ry="66" transform="rotate(60 0 0)"/><ellipse cx="58" cy="38" rx="26" ry="66" transform="rotate(120 0 0)"/><ellipse cx="0" cy="70" rx="26" ry="66" transform="rotate(180 0 0)"/><ellipse cx="-58" cy="38" rx="26" ry="66" transform="rotate(240 0 0)"/><ellipse cx="-58" cy="-38" rx="26" ry="66" transform="rotate(300 0 0)"/></g><circle r="26" fill="#1a1a1a"/><circle r="12" fill="#ece9df"/></g><path d="M201 560c-20 120-60 220-110 314M201 560c10 120 30 220 80 314" stroke="#2c2c2c" stroke-width="14" fill="none" stroke-linecap="round"/>';
    S.wings = '<rect width="402" height="874" fill="#0b0b0b"/><g transform="translate(201,460)"><g fill="#ece9df"><ellipse cx="-20" cy="-10" rx="34" ry="66" transform="rotate(-28)"/><ellipse cx="20" cy="-10" rx="34" ry="66" transform="rotate(28)"/><ellipse cx="-70" cy="-14" rx="30" ry="60" transform="rotate(-24)"/><ellipse cx="70" cy="-14" rx="30" ry="60" transform="rotate(24)"/><ellipse cx="-118" cy="-20" rx="26" ry="52" transform="rotate(-20)"/><ellipse cx="118" cy="-20" rx="26" ry="52" transform="rotate(20)"/><ellipse cx="0" cy="-40" rx="20" ry="40"/></g></g><circle cx="200" cy="430" r="60" fill="#fff" opacity=".05"/>';
    S.kiss = '<rect width="402" height="874" fill="#0d0d0d"/><g fill="#eae8e0"><path d="M80 520c0-90 50-160 122-160 34 0 60 12 80 34-50 10-90 46-108 92-10-6-22-10-34-10-22 0-42 12-60 44z"/><path d="M322 520c0-90-50-160-122-160-34 0-60 12-80 34 50 10 90 46 108 92 10-6 22-10 34-10 22 0 42 12 60 44z"/></g><circle cx="201" cy="500" r="26" fill="#141414"/><path d="M172 500c20 18 40 18 58 0" stroke="#141414" stroke-width="6" fill="none"/>';
    S.moon = '<rect width="402" height="874" fill="#0b0b0b"/><circle cx="200" cy="360" r="150" fill="#e8e6de"/><circle cx="248" cy="316" r="130" fill="#0b0b0b"/><circle cx="120" cy="600" r="3" fill="#fff" opacity=".4"/><circle cx="300" cy="520" r="2" fill="#fff" opacity=".3"/><circle cx="90" cy="420" r="2" fill="#fff" opacity=".3"/>';
    return S[name] || S.moon;
  }
  function sceneURL(name, w, h){
    const body = scene(name);
    const svg = '<svg xmlns="'+NS+'" viewBox="0 0 402 874" width="'+(w||402)+'" height="'+(h||874)+'" preserveAspectRatio="xMidYMid slice">'+body+'</svg>';
    return dataURL(svg);
  }
  function wallpaperURL(){ return sceneURL('trees'); }

  window.L = window.L || {};
  window.L.icons = { G:G, svgStr:svgStr, dataURL:dataURL, appIcon:appIcon, inlineHTML:inlineHTML, inlineEl:inlineEl, avatarURL:avatarURL, avatarMotifURL:avatarMotifURL, scene:scene, sceneURL:sceneURL, wallpaperURL:wallpaperURL };
})();