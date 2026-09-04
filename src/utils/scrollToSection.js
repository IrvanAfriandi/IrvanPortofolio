import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let scrollTween = null;

function resolveScrollY(target, offsetY) {
  // Gunakan posisi element langsung tanpa refresh ScrollTrigger (menghindari race condition)
  const rect = target.getBoundingClientRect();
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  return Math.max(0, rect.top + scrollY - offsetY);
}

function runScroll(y, onDone) {
  const html = document.documentElement;
  const body = document.body;
  const previousHtmlBehavior = html.style.scrollBehavior;
  const previousBodyBehavior = body.style.scrollBehavior;

  html.style.scrollBehavior = 'auto';
  body.style.scrollBehavior = 'auto';

  const currentY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;
  const scrollState = { y: currentY };

  const finish = () => {
    html.style.scrollBehavior = previousHtmlBehavior;
    body.style.scrollBehavior = previousBodyBehavior;
    scrollTween = null;
    onDone?.();
  };

  scrollTween = gsap.to(scrollState, {
    y,
    duration: 0.75,
    ease: 'power3.inOut',
    overwrite: 'auto',
    onUpdate: () => {
      // Pakai window.scrollTo untuk kompatibilitas semua browser + mobile
      window.scrollTo(0, scrollState.y);
    },
    onComplete: finish,
    onInterrupt: finish,
  });
}

export function scrollToSection(hash, offsetY = 120) {
  scrollTween?.kill();
  scrollTween = null;

  if (!hash || hash === '#') {
    runScroll(0);
    return;
  }

  const id = hash.replace(/^#/, '');
  const target = document.getElementById(id);
  if (!target) return;

  const y = resolveScrollY(target, offsetY);
  runScroll(y);
}

export function killScrollTween() {
  scrollTween?.kill();
  scrollTween = null;
}
