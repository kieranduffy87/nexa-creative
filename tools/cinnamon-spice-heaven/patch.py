"""Turn a saved archive DOM into a page that renders locally: local copy of the
combined stylesheet, images pulled through the archive, the hero image and
logos from the brand folder, no scripts, no cookie bar."""
import re, sys
src, dst = sys.argv[1:3]
s = open(src).read()
s = re.sub(r'href="https://cinnamonspiceheaven\.ie/wp-content/uploads/siteground-optimizer-assets/[^"]+\.css"', 'href="combined.css"', s)
s = re.sub(r'\s(srcset|sizes|data-srcset)="[^"]*"', '', s)
s = re.sub(r'(src|href)="https://cinnamonspiceheaven\.ie/(wp-content|wp-includes)/', r'\1="https://web.archive.org/web/20230613im_/https://cinnamonspiceheaven.ie/\2/', s)
s = re.sub(r'src="[^"]*slider-1\.jpg"', 'src="slider-1.jpg"', s)
s = re.sub(r'url\((["\']?)[^)"\']*slider-1\.jpg', r'url(\1slider-1.jpg', s)
s = re.sub(r'src="[^"]*csh-logo-web\.svg"', 'src="csh-logo-web.svg"', s)
s = re.sub(r'src="[^"]*cinnamon-spice-heaven-logo-white\.svg"', 'src="csh-logo-white.svg"', s)
s = re.sub(r'<script\b[^>]*>.*?</script>', '', s, flags=re.S)
s = s.replace("</head>", """<style>#cookie-law-info-bar,.cli-modal,.cli-modal-backdrop,#cookie-law-info-again,.cli-bar-container{display:none!important}
img.lazyload,img.lazyloading{opacity:1!important}img{font-size:0;color:transparent}
img[src*="haldirams-brand"],img[src*="pillsbury-brand"],img[src*="rubicon-brand"]{visibility:hidden}</style></head>""", 1)
# the one product image the archive never captured: a blank, not a substitute
s = re.sub(r'src="[^"]*Dal-Tadka[^"]*"', 'src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="', s)
open(dst, "w").write(s)
print(dst, len(s))
