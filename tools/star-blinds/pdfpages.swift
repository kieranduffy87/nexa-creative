import PDFKit
import AppKit
let a = CommandLine.arguments
let doc = PDFDocument(url: URL(fileURLWithPath: a[1]))!
let out = a[2]; let width = Double(a[3]) ?? 2000
print("pages", doc.pageCount)
for i in 0..<doc.pageCount {
  let p = doc.page(at: i)!
  let b = p.bounds(for: .trimBox)
  let s = width / b.width
  let W = Int(b.width * s), H = Int(b.height * s)
  let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: W, pixelsHigh: H, bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false, colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
  NSGraphicsContext.saveGraphicsState()
  let ctx = NSGraphicsContext(bitmapImageRep: rep)!
  NSGraphicsContext.current = ctx
  let cg = ctx.cgContext
  cg.setFillColor(NSColor.white.cgColor); cg.fill(CGRect(x: 0, y: 0, width: W, height: H))
  cg.scaleBy(x: s, y: s); cg.translateBy(x: -b.minX, y: -b.minY)
  p.draw(with: .trimBox, to: cg)
  NSGraphicsContext.restoreGraphicsState()
  try! rep.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "\(out)-\(String(format: "%02d", i+1)).png"))
}
