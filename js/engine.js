/* engine.js — 预设回复引擎（二期可替换为真实 AI 适配器） */
(function(){
  const counters = {};
  const TAG2ARC = { '温柔':'wenrou','高冷':'gaoleng','活泼':'huopo','粘人':'zhannian','毒舌':'dushe','浪漫':'langman' };

  function scriptOf(char){
    if (char.script) return char.script;
    const arc = L.data.ARCHETYPES[TAG2ARC[(char.tags||[])[0]]] || L.data.ARCHETYPES.wenrou;
    return arc.script;
  }
  function genericKW(char){
    return [
      {re:/想你|在吗|在干嘛|在不在|忙不忙|睡了吗|在忙/, key:'miss'},
      {re:/喜欢|爱|亲|抱|乖|在乎|想我/, key:'love'},
      {re:/早安|晚安|吃饭|饿|累|困|上班|下班|熬夜/, key:'daily'},
      {re:/生气|哼|不理|难过|哭|委屈|烦/, key:'daily'}
    ];
  }
  function next(saltKey, len){
    counters[saltKey] = (counters[saltKey]||0)+1;
    return (counters[saltKey] + (len||0)) ;
  }
  function pick(arr, saltKey, len){
    if (!arr || !arr.length) return '嗯，我在听。';
    return arr[next(saltKey, len) % arr.length];
  }
  function match(text, char){
    const s = scriptOf(char);
    const kws = char.kw || genericKW(char);
    for (let i=0;i<kws.length;i++){
      if (kws[i].re.test(text)) return kws[i].key;
    }
    return 'fallback';
  }

  /* 真实 AI 适配器接口：二期把 adapter 替换成调用后端/大模型的对象
     adapter = { async ask(char, history){ return '回复文本' } }
     返回非空字符串时优先使用。 */
  let adapter = null;

  function getReply(char, history){
    if (adapter && typeof adapter.ask === 'function'){
      // 同步路径：二期可在此改为 async 调用
      return null;
    }
    const s = scriptOf(char);
    const last = history && history.length ? (history[history.length-1].text||'') : '';
    const key = last ? match(last, char) : 'greet';
    const pool = s[key] || s.fallback;
    const name = char.id + ':' + key;
    let text = pick(pool, name, history?history.length:0);
    // 人设点缀：本地角色偶尔插入一句风格化小尾巴
    if (char.kind==='local'){
      const arc = L.data.ARCHETYPES[TAG2ARC[(char.tags||[])[0]]];
      if (arc && Math.random()<0.25) text = text;
    }
    return text;
  }
  function greeting(char){
    const s = scriptOf(char);
    return pick(s.greet||s.fallback, char.id+':greet', 0);
  }
  function typingMs(text){
    return 700 + Math.min(2200, (text?text.length:0)*55) + Math.random()*500;
  }

  window.L = window.L || {};
  window.L.engine = { getReply:getReply, greeting:greeting, typingMs:typingMs, setAdapter:function(a){adapter=a;}, getAdapter:function(){return adapter;}, scriptOf:scriptOf };
})();