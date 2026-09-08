/* main.js — 入口 */
(function(){
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
    navigator.serviceWorker.register('sw.js').catch(function(){});
  }
  window.L.home.build();
  window.L.system.init();
  window.L.system.boot();
})();