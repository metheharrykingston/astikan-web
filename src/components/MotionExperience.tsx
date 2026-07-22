import { useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';
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
  useLayoutEffect(() => {
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const compactMotion = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: Array<() => void> = [];
    const animations: gsap.core.Animation[] = [];
    const lenis = reducedMotion
      ? null
      : new Lenis({
          autoRaf: true,
          smoothWheel: true,
          duration: compactMotion ? 1.65 : 2.15,
          easing: (value: number) => value * value * value * (value * (value * 6 - 15) + 10),
          wheelMultiplier: compactMotion ? 0.42 : 0.3,
          syncTouch: false,
          syncTouchLerp: 0.05,
          touchMultiplier: 0.52,
          virtualScroll: (data) => {
            if (!(data.event instanceof WheelEvent)) return true;
            const maximumWheelStep = 64;
            data.deltaY = Math.max(-maximumWheelStep, Math.min(maximumWheelStep, data.deltaY));
            data.deltaX = Math.max(-maximumWheelStep, Math.min(maximumWheelStep, data.deltaX));
            return true;
          },
        });
    if (lenis) cleanups.push(() => lenis.destroy());

    if (compactMotion && lenis) {
      let touchStartY = 0;
      let touchStartX = 0;
      let trackingGesture = false;
      let scrollLocked = false;
      const ignoredTouchTarget = (target: EventTarget | null) => (
        target instanceof Element
        && Boolean(target.closest('[data-lenis-prevent], [data-native-scroll], input, textarea, select'))
      );
      const smootherStep = (value: number) => (
        value * value * value * (value * (value * 6 - 15) + 10)
      );

      const handleTouchStart = (event: TouchEvent) => {
        if (ignoredTouchTarget(event.target) || event.touches.length !== 1) {
          trackingGesture = false;
          return;
        }
        trackingGesture = true;
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
      };

      const handleTouchMove = (event: TouchEvent) => {
        if (!trackingGesture || event.touches.length !== 1) return;
        const verticalDistance = Math.abs(event.touches[0].clientY - touchStartY);
        const horizontalDistance = Math.abs(event.touches[0].clientX - touchStartX);
        if (verticalDistance > horizontalDistance && event.cancelable) event.preventDefault();
      };

      const handleTouchEnd = (event: TouchEvent) => {
        if (!trackingGesture) return;
        trackingGesture = false;
        const touch = event.changedTouches[0];
        if (!touch || scrollLocked) return;
        const distanceY = touchStartY - touch.clientY;
        const distanceX = touchStartX - touch.clientX;
        if (Math.abs(distanceY) < 22 || Math.abs(distanceY) <= Math.abs(distanceX)) return;

        scrollLocked = true;
        const direction = Math.sign(distanceY);
        const travel = Math.min(window.innerHeight * 0.72, 620);
        const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
        const destination = Math.max(0, Math.min(maximumScroll, window.scrollY + direction * travel));
        if (Math.abs(destination - window.scrollY) < 1) {
          scrollLocked = false;
          return;
        }
        lenis.scrollTo(destination, {
          duration: 1.9,
          easing: smootherStep,
          lock: true,
          force: true,
          onComplete: () => { scrollLocked = false; },
        });
      };

      document.addEventListener('touchstart', handleTouchStart, { capture: true, passive: true });
      document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false });
      document.addEventListener('touchend', handleTouchEnd, { capture: true, passive: true });
      cleanups.push(() => {
        document.removeEventListener('touchstart', handleTouchStart, true);
        document.removeEventListener('touchmove', handleTouchMove, true);
        document.removeEventListener('touchend', handleTouchEnd, true);
      });
    }

    const page = document.querySelector<HTMLElement>('.astikan-page-content');
    const progress = document.querySelector<HTMLElement>('.motion-progress');
    const cursorGlow = document.querySelector<HTMLElement>('.motion-cursor-glow');
    const firstSection = document.querySelector<HTMLElement>('main section:first-child');

    if (page) {
      animations.push(
        gsap.fromTo(
          page,
          { autoAlpha: 0.72, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'opacity,visibility,transform',
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
      compactMotion
        ? { threshold: 0.025, rootMargin: '0px 0px 12% 0px' }
        : { threshold: 0.12, rootMargin: '0px 0px -7% 0px' },
    );
    sections.forEach((section) => sectionObserver.observe(section));
    cleanups.push(() => sectionObserver.disconnect());

    const textElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'main section h1, main section h2, main section h3, main section p',
      ),
    ).filter((element) => {
      if (element.hasAttribute('data-aos')) return false;
      if (element.closest('article, nav, form, [data-motion-text="off"]')) return false;
      const text = element.textContent?.trim() ?? '';
      return text.length > 2;
    });

    textElements.forEach((element, index) => {
      element.classList.add('motion-text-reveal');
      element.dataset.motionTextIndex = String(index);
      element.style.setProperty('--motion-reveal-delay', `${(index % 4) * 70}ms`);
    });

    const textObserver = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        visibleEntries.forEach((entry, entryIndex) => {
          const element = entry.target as HTMLElement;
          element.style.setProperty('--motion-reveal-delay', `${entryIndex * 90}ms`);
          element.classList.add('motion-text-visible');
          textObserver.unobserve(element);
        });
      },
      compactMotion
        ? { threshold: 0.025, rootMargin: '0px 0px 14% 0px' }
        : { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    textElements.forEach((element) => textObserver.observe(element));
    cleanups.push(() => {
      textObserver.disconnect();
      textElements.forEach((element) => {
        element.classList.remove('motion-text-reveal', 'motion-text-visible');
        delete element.dataset.motionTextIndex;
        element.style.removeProperty('--motion-reveal-delay');
      });
    });

    if (compactMotion) {
      let safetyFrame = 0;
      const revealVisibleElements = () => {
        safetyFrame = 0;
        const viewportTrigger = window.innerHeight * 1.12;

        document.querySelectorAll<HTMLElement>('.motion-text-reveal:not(.motion-text-visible)').forEach((element) => {
          const bounds = element.getBoundingClientRect();
          if (bounds.top <= viewportTrigger && bounds.bottom >= -80) {
            element.classList.add('motion-text-visible');
            textObserver.unobserve(element);
          }
        });

        document.querySelectorAll<HTMLElement>('[data-aos]:not(.aos-animate)').forEach((element) => {
          const bounds = element.getBoundingClientRect();
          if (bounds.top <= viewportTrigger && bounds.bottom >= -80) element.classList.add('aos-animate');
        });
      };
      const scheduleSafetyReveal = () => {
        if (safetyFrame) return;
        safetyFrame = window.requestAnimationFrame(revealVisibleElements);
      };

      const safetyTimer = window.setTimeout(revealVisibleElements, 450);
      window.addEventListener('scroll', scheduleSafetyReveal, { passive: true });
      window.addEventListener('resize', scheduleSafetyReveal);
      cleanups.push(() => {
        window.clearTimeout(safetyTimer);
        window.cancelAnimationFrame(safetyFrame);
        window.removeEventListener('scroll', scheduleSafetyReveal);
        window.removeEventListener('resize', scheduleSafetyReveal);
      });
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      let target: HTMLElement | null = null;
      try {
        target = document.querySelector<HTMLElement>(hash);
      } catch {
        return;
      }
      if (!target) return;

      event.preventDefault();
      const headerHeight = document.querySelector<HTMLElement>('header')?.offsetHeight ?? 76;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      if (lenis) {
        lenis.scrollTo(Math.max(0, targetTop), {
          duration: 1.35,
          easing: (value: number) => 1 - Math.pow(1 - value, 4),
        });
      } else {
        window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      }
      window.history.replaceState(null, '', hash);
    };

    document.addEventListener('click', handleAnchorClick);
    cleanups.push(() => document.removeEventListener('click', handleAnchorClick));

    const cardSelector = [
      'main article',
      'main [class*="shadow-card"]',
      'main [data-animate-widget="true"]',
      'main [data-motion-card="true"]',
    ].join(',');
    const cards = Array.from(document.querySelectorAll<HTMLElement>(cardSelector));

    const cardRevealObserver = new IntersectionObserver(
      (entries) => {
        entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          .forEach((entry, index) => {
            const card = entry.target as HTMLElement;
            card.style.setProperty('--motion-card-delay', `${Math.min(index * 85, 340)}ms`);
            card.classList.add('motion-card-visible');
            cardRevealObserver.unobserve(card);
          });
      },
      compactMotion
        ? { threshold: 0.035, rootMargin: '0px 0px 12% 0px' }
        : { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    );

    cards.forEach((card) => {
      card.classList.add('motion-card');
      if (!card.hasAttribute('data-aos')) {
        card.classList.add('motion-card-reveal');
        cardRevealObserver.observe(card);
      }
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
    cleanups.push(() => {
      cardRevealObserver.disconnect();
      cards.forEach((card) => {
        card.classList.remove('motion-card-reveal', 'motion-card-visible');
        card.style.removeProperty('--motion-card-delay');
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
