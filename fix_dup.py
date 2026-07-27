from pathlib import Path

about = Path('src/about.css').read_text()
old_about = """@media (max-width: 768px) {
  .about-hero-section {
    padding: 60px 20px;
  }

  .about-hero-title {
    font-size: 2rem;
    margin-bottom: 16px;
  }

  .section-title {
    font-size: 2rem;
  }"""
new_about = """@media (max-width: 768px) {
  .about-hero-section {
    padding: 48px 18px;
  }

  .about-hero-title {
    font-size: 1.75rem;
    margin-bottom: 14px;
  }

  .section-title {
    font-size: 1.65rem;
  }"""
if old_about in about:
    about = about.replace(old_about, new_about)
    Path('src/about.css').write_text(about)
    print('about.css: fixed')
else:
    print('about.css: not found')

oem = Path('src/components/oem.css').read_text()
old_oem = """@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-18px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide in from left (used by OEM heading) */
@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* ── animate-left helper ── */
.animate-left {
  opacity: 0;
  animation: slideInLeft 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  will-change: transform, opacity;
}

/* ── container ── */
"""
new_oem = """/* ── animate-left helper ── */
.animate-left {
  opacity: 0;
  animation: slideInLeft 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
  will-change: transform, opacity;
}

/* ── container ── */
"""
if old_oem in oem:
    oem = oem.replace(old_oem, new_oem)
    Path('src/components/oem.css').write_text(oem)
    print('oem.css: fixed')
else:
    print('oem.css: not found')
