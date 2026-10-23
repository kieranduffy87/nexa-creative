// node sb-rec.mjs URL OUTDIR W H DPR MOBILE SECONDS [endFrac]
// Records a scroll through a live page, one screenshot per frame at 30fps.
// Down with an ease, a hold, then back to the top so the film loops.
// Moving parts are driven per frame, not left to run in real time (capture is
// several times slower than the film): carousels stop on their first slide,
// CSS animations are seeked to film time, and background videos ping-pong
// 0 -> N/2 frames -> 0 so the loop point matches.
const [url,OUT,W,H,DPR,MOB,SECS,ENDF]=process.argv.slice(2);
const fs=await import("node:fs"); fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const tabs=await (await fetch(`http://127.0.0.1:9243/json/list`)).json();
const ws=new WebSocket(tabs.find(x=>x.type==="page").webSocketDebuggerUrl); await new Promise(r=>ws.onopen=r);
let id=0; const w=new Map(); ws.onmessage=e=>{const m=JSON.parse(e.data); if(w.has(m.id)){w.get(m.id)(m.result);w.delete(m.id);}};
const send=(m,p={})=>new Promise(r=>{const i=++id;w.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}));});
const js=async e=>(await send("Runtime.evaluate",{expression:e,returnByValue:true,awaitPromise:true})).result?.value;
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await send("Page.enable"); await send("Page.bringToFront"); await send("Emulation.setFocusEmulationEnabled",{enabled:true});
await send("Emulation.setDeviceMetricsOverride",{width:+W,height:+H,deviceScaleFactor:+DPR,mobile:MOB==="1"});
await send("Page.navigate",{url}); await wait(6000);
await js(`(()=>{const b=[...document.querySelectorAll('button,a')].find(b=>/^deny$/i.test(b.textContent.trim()));b&&b.click()})()`); await wait(800);
await js(`(()=>{const s=document.createElement('style');s.textContent='.cmplz-cookiebanner,.cmplz-manage-consent,#cmplz-manage-consent{display:none!important} html{scroll-behavior:auto!important}';document.head.appendChild(s)})()`);
// load everything lazy and fire every entrance animation, then go home
const total=await js("document.documentElement.scrollHeight");
for(let y=0;y<total;y+=+H/3){await js(`scrollTo(0,${y})`);await wait(180);}
await wait(1500); await js("scrollTo(0,0)"); await wait(1500);
// freeze sliders so they do not race ahead while frames are captured slowly
await js(`(()=>{document.querySelectorAll('.swiper').forEach(s=>{try{s.swiper.autoplay&&s.swiper.autoplay.stop();s.swiper.slideTo(0,0)}catch(e){}})})()`);
await js(`(()=>{try{window.jQuery&&jQuery('.slider-pro').each((i,e)=>{const d=jQuery(e).data('sliderPro');if(d){d.destroyAutoplay?d.destroyAutoplay():d.stopAutoplay();d.gotoSlide(0)}})}catch(e){}})()`); await wait(3000);
const maxY=(await js("document.documentElement.scrollHeight"))-(+H);
const endY=Math.round(maxY*(+(ENDF||1)));
const N=Math.round(+SECS*30);
// 0-8% hold, 8-70% ease down, 70-80% hold, 80-100% ease back up
const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const yAt=f=>{const t=f/N; if(t<.08)return 0; if(t<.70)return endY*ease((t-.08)/.62); if(t<.80)return endY; return endY*(1-ease((t-.80)/.20));};
await js(`window.__anims=document.getAnimations();window.__anims.forEach(a=>a.pause());document.querySelectorAll('video').forEach(v=>v.pause())`);
for(let f=0;f<N;f++){
  const vt=(N/2/30)*(1-Math.abs(1-2*f/N));
  await js(`(async()=>{(window.__anims||[]).forEach(a=>{try{a.currentTime=${(f/30*1000).toFixed(1)}}catch(e){}});
    await Promise.all([...document.querySelectorAll('video')].map(v=>new Promise(r=>{if(!v.duration){r();return}const t=Math.min(v.duration-0.05,${vt.toFixed(3)});if(Math.abs(v.currentTime-t)<0.01){r();return}v.addEventListener('seeked',r,{once:true});v.currentTime=t;setTimeout(r,800)})));})()`);
  await js(`scrollTo(0,${Math.round(yAt(f))})`); await wait(70);
  const s=await send("Page.captureScreenshot",{format:"jpeg",quality:92});
  fs.writeFileSync(`${OUT}/f${String(f).padStart(4,"0")}.jpg`,Buffer.from(s.data,"base64"));
}
console.log("frames",N,"endY",endY,"page",maxY+(+H));
ws.close(); process.exit(0);
