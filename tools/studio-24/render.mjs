// usage: node render.mjs URL OUTDIR [t1,t2,...]   (no times = every frame)
const [URL_, OUT, TIMES] = [process.argv[2], process.argv[3], process.argv[4]];
const fs = await import("node:fs"); fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const tabs = await (await fetch(`http://127.0.0.1:9243/json/list`)).json();
const ws = new WebSocket(tabs.find(x => x.type === "page").webSocketDebuggerUrl);
await new Promise(r => ws.onopen = r); let id = 0; const m = new Map(); const errs = [];
ws.onmessage = e => { const d = JSON.parse(e.data);
  if (d.method === "Runtime.exceptionThrown") errs.push((d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text || "").slice(0, 200));
  if (m.has(d.id)) { m.get(d.id)(d.result); m.delete(d.id); } };
const send = (a, p = {}) => new Promise(r => { const i = ++id; m.set(i, r); ws.send(JSON.stringify({ id: i, method: a, params: p })); });
const js = async x => { const r = await send("Runtime.evaluate", { expression: x, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 400)); return r.result?.value; };
await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1920, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url: URL_ + (URL_.includes("?") ? "&" : "?") + "r=" + Date.now() });
await new Promise(r => setTimeout(r, 2500));
const meta = await js("window.ready");
await send("Emulation.setDeviceMetricsOverride", { width: meta.w, height: meta.h, deviceScaleFactor: 1, mobile: false });
await new Promise(r => setTimeout(r, 400));
const times = TIMES ? TIMES.split(",").map(Number) : Array.from({ length: Math.round(meta.duration * meta.fps) }, (_, i) => i / meta.fps);
const t0 = Date.now();
for (let i = 0; i < times.length; i++) {
  await js(`renderAt(${times[i]})`);
  const s = await send("Page.captureScreenshot", { format: "jpeg", quality: 93, clip: { x: 0, y: 0, width: meta.w, height: meta.h, scale: 1 } });
  fs.writeFileSync(`${OUT}/${TIMES ? "t" + String(times[i]).replace(".", "_") : "f" + String(i).padStart(4, "0")}.jpg`, Buffer.from(s.data, "base64"));
}
console.log(`done ${times.length} frames ${meta.w}x${meta.h} in ${Math.round((Date.now() - t0) / 1000)}s | errors: ${errs.length ? errs.join(" | ") : "none"}`);
ws.close(); process.exit(0);
