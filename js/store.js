/* store.js — localStorage 数据层 */
(function(){
  const KEY = 'leano.v1';
  const DAY = 86400000;
  function defaults(){
    return {
      v:1,
      adult:false,
      user:{ name:'Ariel', motif:'kiss' },
      added:['eric'],
      created:[],
      usedCodes:[],
      ownKey:'',
      chats:{ eric:[ { role:'char', text:'你来啦，等你好一会儿了。', ts:Date.now()-3600000 } ] },
      unread:{},
      photos:[],
      callLog:[],
      recents:[],
      custom:{},
      anniv:null,
      settings:{ dark:true, sound:true, haptic:true, brightness:1, reduce:false }
    };
  }
  let state = null;
  function load(){
    if (state) return state;
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch(e){}
    const d = defaults();
    if (raw) {
      try {
        const j = JSON.parse(raw);
        Object.keys(d).forEach(k=>{ if (j[k] !== undefined) d[k] = j[k]; });
        if (j.settings) Object.assign(d.settings, j.settings);
      } catch(e){}
    }
    state = d;
    return state;
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }
  function get(){ return load(); }

  /* ---- 角色 ---- */
  function presetById(id){ return L.data.CHARS[id] || null; }
  function charById(id){
    const p = presetById(id); if (p) return p;
    return (state.created||[]).find(c=>c.id===id) || null;
  }
  function isCreated(id){ return !presetById(id); }
  function isOwned(id){
    const s = get();
    return !!s.created.find(c=>c.id===id) || s.added.indexOf(id) >= 0;
  }
  function addedPresetChars(){
    const s = get();
    return s.added.map(presetById).filter(Boolean);
  }
  function myChars(){
    const s = get();
    const list = addedPresetChars().slice();
    s.created.slice().reverse().forEach(c=>list.push(c));
    return list;
  }
  function ensureChat(id){
    if (!state.chats[id]) state.chats[id] = [];
  }
  function addChar(id){
    const s = get();
    if (s.added.indexOf(id) < 0 && !s.created.find(c=>c.id===id)) s.added.push(id);
    ensureChat(id);
    save();
  }
  function addCreatedChar(obj){
    const s = get();
    s.created.push(obj);
    ensureChat(obj.id);
    save();
  }
  function removeChar(id){
    const s = get();
    s.added = s.added.filter(x=>x!==id);
    s.created = s.created.filter(c=>c.id!==id);
    save();
  }
  /* 会话 */
  function chatOf(id){ ensureChat(id); return state.chats[id]; }
  function pushMsg(id, role, text){
    const arr = chatOf(id);
    arr.push({ role:role, text:text, ts:Date.now() });
    if (arr.length > 300) arr.splice(0, arr.length-300);
    if (role==='char'){
      if (!state.unread[id]) state.unread[id]=0;
      state.unread[id]++;
    }
    save();
    return arr[arr.length-1];
  }
  function unreadOf(id){ return state.unread[id]||0; }
  function clearUnread(id){ if(state.unread[id]){ delete state.unread[id]; save(); } }
  function totalUnread(){ let n=0; Object.keys(state.unread||{}).forEach(k=>n+=state.unread[k]); return n; }
  function lastMsg(id){
    const arr = chatOf(id); return arr.length ? arr[arr.length-1] : null;
  }
  /* 照片 */
  function addPhoto(ph){ state.photos.unshift(ph); if(state.photos.length>80) state.photos.length=80; save(); }
  /* 通话记录 */
  function logCall(entry){ state.callLog.unshift(entry); if(state.callLog.length>40) state.callLog.length=40; save(); }
  /* 相恋天数 */
  function daysTogether(){
    const s = get();
    if (!s.anniv) { s.anniv = Date.now()-53*DAY; save(); }
    return Math.max(1, Math.floor((Date.now()-s.anniv)/DAY));
  }
  /* 设置 */
  function toggleSetting(k){
    const s = get(); s.settings[k] = !s.settings[k]; save(); return s.settings[k];
  }
  function setOwnKey(k){ state.ownKey = (k||'').trim(); save(); }
  function markAdult(){ state.adult = true; save(); }
  function useCode(code){
    const up = String(code||'').trim().toUpperCase();
    if (state.usedCodes.indexOf(up)>=0) return {ok:false, reason:'used'};
    const id = L.data.CODES[up];
    if (!id) return {ok:false, reason:'invalid'};
    state.usedCodes.push(up); save(); return {ok:true, id:id};
  }
  function reset(){
    try{ localStorage.removeItem(KEY); }catch(e){}
    state = null;
    location.reload();
  }
  function bumpRecents(appId){
    state.recents = state.recents.filter(x=>x!==appId);
    state.recents.unshift(appId);
    if (state.recents.length>12) state.recents.length=12;
    save();
  }

  window.L = window.L || {};
  window.L.store = { load:load, save:save, get:get, charById:charById, isOwned:isOwned, myChars:myChars,
    addChar:addChar, addCreatedChar:addCreatedChar, removeChar:removeChar, chatOf:chatOf, pushMsg:pushMsg,
    unreadOf:unreadOf, clearUnread:clearUnread, totalUnread:totalUnread, lastMsg:lastMsg,
    addPhoto:addPhoto, logCall:logCall, daysTogether:daysTogether, toggleSetting:toggleSetting,
    setOwnKey:setOwnKey, markAdult:markAdult, useCode:useCode, reset:reset, bumpRecents:bumpRecents,
    presetById:presetById,
    setCustom:function(k,v){ state.custom = state.custom||{}; state.custom[k]=v; save(); },
    getCustom:function(k){ return (state.custom||{})[k]; },
    resetCustom:function(k){ if(state.custom){ delete state.custom[k]; save(); } },
    resetAllCustom:function(){ state.custom={}; save(); }
  };
})();