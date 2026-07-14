import { useEffect } from 'react';
import { gsap } from 'gsap';
import './motion-experience.css';

type CounterParts = {
  prefix: string;
  numeric: string;
  suffix: string;
  value: number;
  decimals: number;
  locale: 'en-IN' | 'en-US' | undefined;
};

const COUNTER_PATTERN = /^([^\d-]*)(-?\d[\d,.]*)(.*)$/;

function getCounterParts(value: string): CounterParts | null {
  const match = value.trim().match(COUNTER_PATTERN);
  if (!match) return null;

  const [, prefix, numeric, suffix] = match;
  const parsedValue = Number.parseFloat(numeric.replace(/,/g, ''));
  if (!Number.isFinite(parsedValue)) return null;

  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0;
  const locale = numeric.includes(',')
    ? /^\d{1,2},\d{2},\d{3}/.test(numeric)
      ? 'en-IN'
      : 'en-US'
    : undefined;

  return { prefix, numeric, suffix, value: parsedValue, decimals, locale };
}

function formatCounter(parts: CounterParts, value: number) {
  const formatted = parts.locale
    ? value.toLocaleString(parts.locale, {
        minimumFractionDigits: parts.decimals,
        maximumFractionDigits: parts.decimals,
      })
    : value.toFixed(parts.decimals);

  return `${parts.prefix}${formatted}${parts.suffix}`;
}

export default function MotionExperience() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const cleanups: Array<() => void> = [];
    const animations: gsap.core.Animation[] = [];

    const page = document.querySelector<HTMLElement>('.astikan-page-content');
    const progress = document.querySelector<HTMLElement>('.motion-progress');
    const cursorGlow = document.querySelector<HTMLElement>('.motion-cursor-glow');
    const firstSection = document.querySelector<HTMLElement>('main section:first-child');

    if (page) {
      animations.push(
        gsap.fromTo(
          page,
          { autoAlpha: 0, y: 16, filter: 'blur(7px)' },
          {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform,filter',
          },
        ),
      );
    }

    const updateProgress = () => {
      if (!progress) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
      gsap.set(progress, { scaleX: ratio });
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    cleanups.push(() => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    });

    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section'));
    sections.forEach((section, index) => {
      section.classList.add('motion-section');
      if (index === 0) section.classList.add('motion-hero');
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('motion-visible');
          sectionObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    cleanups.push(() => sectionObserver.disconnect());

    const cardSelector = [
      'main article',
      'main [class*="shadow-card"]',
      'main [data-animate-widget="true"]',
      'main [data-motion-card="true"]',
    ].join(',');
    const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSelector));

    cards.forEach((card) => {
      card.classList.add('motion-card');
      const icon = card.querySelector<HTMLElement>('svg, img');
      icon?.classList.add('motion-card-icon');

      const move = (event: PointerEvent) => {
        const bounds = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(event.clientX - bounds.left, bounds.width));
        const y = Math.max(0, Math.min(event.clientY - bounds.top, bounds.height));
        const normalizedX = bounds.width ? x / bounds.width - 0.5 : 0;
        const normalizedY = bounds.height ? y / bounds.height - 0.5 : 0;

        card.style.setProperty('--motion-x', `${x}px`);
        card.style.setProperty('--motion-y', `${y}px`);

        if (icon && desktopPointer) {
          gsap.to(icon, {
            x: normalizedX * 8,
            y: normalizedY * 8,
            rotation: normalizedX * 3,
            duration: 0.28,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      };

      const leave = () => {
        if (!icon) return;
        gsap.to(icon, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.45,
          ease: 'elastic.out(1, 0.55)',
          overwrite: 'auto',
        });
      };

      card.addEventListener('pointermove', move);
      card.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', leave);
      });
    });

    const ctas = Array.from(
      document.querySelectorAll<HTMLElement>(
        'header a[class*="bg-"], header button[class*="bg-"], main a[class*="bg-"], main button[class*="bg-"]',
      ),
    );
    ctas.forEach((cta) => cta.classList.add('motion-cta'));

    const bars = Array.from(document.querySelectorAll<HTMLElement>('main [style*="width"]'));
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const bar = entry.target as HTMLElement;
          animations.push(
            gsap.fromTo(
              bar,
              { scaleX: 0, transformOrigin: 'left center' },
              { scaleX: 1, duration: 1.1, ease: 'power3.out', clearProps: 'transform' },
            ),
          );
          barObserver.unobserve(bar);
        });
      },
      { threshold: 0.35 },
    );
    bars.forEach((bar) => barObserver.observe(bar));
    cleanups.push(() => barObserver.disconnect());

    const counterElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main [data-motion-counter], main [class*="font-extrabold"], main [class*="font-bold"]',
      ),
    ).filter((element) => {
      if (element.childElementCount > 0) return false;
      const text = element.textContent?.trim() ?? '';
      if (text.length === 0 || text.length > 18) return false;
      return /[%+,]|\d(?:\.\d+)?[MK]\+?$/i.test(text);
    });

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target as HTMLElement;
          const original = element.dataset.motionCounterOriginal ?? element.textContent?.trim() ?? '';
          const parts = getCounterParts(original);
          if (!parts) {
            counterObserver.unobserve(element);
            return;
          }

          element.dataset.motionCounterOriginal = original;
          const state = { value: 0 };
          animations.push(
            gsap.to(state, {
              value: parts.value,
              duration: 1.35,
              ease: 'power2.out',
              onUpdate: () => {
                element.textContent = formatCounter(parts, state.value);
              },
              onComplete: () => {
                element.textContent = original;
              },
            }),
          );
          counterObserver.unobserve(element);
        });
      },
      { threshold: 0.65 },
    );
    counterElements.forEach((element) => counterObserver.observe(element));
    cleanups.push(() => counterObserver.disconnect());

    if (desktopPointer && cursorGlow) {
      const moveX = gsap.quickTo(cursorGlow, 'x', { duration: 0.42, ease: 'power3.out' });
      const moveY = gsap.quickTo(cursorGlow, 'y', { duration: 0.42, ease: 'power3.out' });
      const showGlow = () => gsap.to(cursorGlow, { autoAlpha: 0.42, duration: 0.25 });
      const hideGlow = () => gsap.to(cursorGlow, { autoAlpha: 0, duration: 0.35 });
      const moveGlow = (event: PointerEvent) => {
        moveX(event.clientX - 150);
        moveY(event.clientY - 150);
      };

      window.addEventListener('pointermove', moveGlow, { passive: true });
      document.documentElement.addEventListener('pointerenter', showGlow);
      document.documentElement.addEventListener('pointerleave', hideGlow);
      cleanups.push(() => {
        window.removeEventListener('pointermove', moveGlow);
        document.documentElement.removeEventListener('pointerenter', showGlow);
        document.documentElement.removeEventListener('pointerleave', hideGlow);
      });
    }

    if (desktopPointer && firstSection) {
      const heroVisual = firstSection.querySelector<HTMLElement>(
        '.hero-visual, .astikan-device-stage, .pay-device-stage, figure',
      );

      if (heroVisual) {
        heroVisual.classList.add('motion-hero-visual');
        const moveHero = (event: PointerEvent) => {
          const bounds = firstSection.getBoundingClientRect();
          const x = bounds.width ? (event.clientX - bounds.left) / bounds.width - 0.5 : 0;
          const y = bounds.height ? (event.clientY - bounds.top) / bounds.height - 0.5 : 0;
          gsap.to(heroVisual, {
            x: x * 16,
            y: y * 12,
            rotationY: x * 1.4,
            rotationX: -y * 1.1,
            transformPerspective: 1200,
            duration: 0.75,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        };
        const resetHero = () => {
          gsap.to(heroVisual, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 1,
            ease: 'elastic.out(1, 0.55)',
            overwrite: 'auto',
          });
        };

        firstSection.addEventListener('pointermove', moveHero);
        firstSection.addEventListener('pointerleave', resetHero);
        cleanups.push(() => {
          firstSection.removeEventListener('pointermove', moveHero);
          firstSection.removeEventListener('pointerleave', resetHero);
        });
      }
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      animations.forEach((animation) => animation.kill());
      counterElements.forEach((element) => {
        if (element.dataset.motionCounterOriginal) {
          element.textContent = element.dataset.motionCounterOriginal;
        }
      });
    };
  }, []);

  return (
    <>
      <div className="motion-progress" aria-hidden="true" />
      <div className="motion-cursor-glow" aria-hidden="true" />
    </>
  );
}
