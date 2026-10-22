// usage: node render.mjs OUT [t1,t2,...]   (no times = every frame)
const PORT=9243, OUT=process.argv[2], TIMES=process.argv[3];
const fs=await import("node:fs"); fs.mkdirSync(OUT,{recursive:true});
const tabs=await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
const ws=new WebSocket(tabs.find(x=>x.type==="page").webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);
let id=0; const w=new Map(); const errs=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);
  if(m.method==="Runtime.exceptionThrown") errs.push((m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text||'').slice(0,200));
  if(w.has(m.id)){w.get(m.id)(m.result);w.delete(m.id);}};
const send=(m,p={})=>new Promise(r=>{const i=++id;w.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}));});
const js=async e=>{const r=await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true}); if(r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0,300)); return r.result?.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1920,height:1080,deviceScaleFactor:1,mobile:false});
await send("Page.navigate",{url:`http://127.0.0.1:8790/index.html?r=${Date.now()}`});
await wait(2500);
const meta = await js("window.ready");
console.log("ready", JSON.stringify(meta));
const times = TIMES ? TIMES.split(",").map(Number) : Array.from({length: Math.round(meta.duration*meta.fps)}, (_, i) => i/meta.fps);
const t0 = Date.now();
for (let i=0;i<times.length;i++){
  await js(`renderAt(${times[i]})`);
  const s=await send("Page.captureScreenshot",{format:"jpeg",quality:92});
  fs.writeFileSync(`${OUT}/${TIMES ? "t"+String(times[i]).replace(".","_") : "f"+String(i).padStart(4,"0")}.jpg`, Buffer.from(s.data,"base64"));
  if (!TIMES && i%150===0) console.log("frame", i, "/", times.length, Math.round((Date.now()-t0)/1000)+"s");
}
console.log("done", times.length, "frames in", Math.round((Date.now()-t0)/1000)+"s", "| errors:", errs.length?errs.join(" | "):"none");
ws.close(); process.exit(0);
