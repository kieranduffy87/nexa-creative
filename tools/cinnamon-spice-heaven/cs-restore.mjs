// Load an archived page, let every lazy image arrive, then save the DOM with
// absolute URLs so it can be served locally and recorded without the archive.
const [URL_, OUT, W, MOB] = process.argv.slice(2);
const fs = await import("node:fs");
const tabs=await (await fetch(`http://127.0.0.1:9243/json/list`)).json();
const ws=new WebSocket(tabs.find(x=>x.type==="page").webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0; const w=new Map(); ws.onmessage=e=>{const m=JSON.parse(e.data); if(w.has(m.id)){w.get(m.id)(m.result);w.delete(m.id);}};
const send=(m,p={})=>new Promise(r=>{const i=++id;w.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}));});
const js=async e=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.value;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable"); await send("Page.bringToFront"); await send("Emulation.setFocusEmulationEnabled",{enabled:true});
await send("Emulation.setDeviceMetricsOverride",{width:+W,height:900,deviceScaleFactor:MOB==="1"?3:1,mobile:MOB==="1"});
await send("Page.navigate",{url:URL_}); await wait(12000);
const H=await js("document.documentElement.scrollHeight");
for(let y=0;y<H;y+=300){await js(`scrollTo(0,${y})`);await wait(700);}
await wait(8000); await js("scrollTo(0,0)"); await wait(2000);
console.log(await js(`JSON.stringify({imgs:document.images.length, ok:[...document.images].filter(i=>i.naturalWidth>2).length, broken:[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.split('/').pop().slice(0,60))})`));
// absolutise and drop the archive's own banner
const html=await js(`(()=>{document.querySelectorAll('#wm-ipp-base,#wm-ipp,#donato,script[src*="archive.org/_static"],link[href*="archive.org/_static"]').forEach(e=>e.remove());
  document.querySelectorAll('[src]').forEach(e=>{if(e.src) e.setAttribute('src',e.src)});
  document.querySelectorAll('link[href]').forEach(e=>e.setAttribute('href',e.href));
  document.querySelectorAll('[srcset]').forEach(e=>e.removeAttribute('srcset'));
  return '<!doctype html>'+document.documentElement.outerHTML})()`);
fs.writeFileSync(OUT, html); console.log("saved", OUT, html.length);
ws.close(); process.exit(0);
