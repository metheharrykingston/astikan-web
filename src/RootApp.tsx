import React, { useEffect } from 'react';
import AOS from 'aos';
import { gsap } from 'gsap';
import App from './App';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import MotionExperience from './components/MotionExperience';
import AstikanPage from './pages/AstikanPage';
import AstikanPayPage from './pages/AstikanPayPage';
import KioskPage from './pages/KioskPageClean';
import ResearchPage from './pages/ResearchPage';
import { CompanyPage } from './pages/BrandPages';
import MissionPage from './pages/MissionPage';
import PartnersPage from './pages/PartnersPage';
import TrustPage from './pages/TrustPage';

function UniversalPage({ children }) {
  return (
    <>
      <MotionExperience />
      <div className="astikan-page-content min-h-screen">{children}</div>
      <SiteFooter />
      <style>{`
        .astikan-page-content [data-universal-footer="true"] {
          display: none !important;
        }
      `}</style>
    </>
  );
}

function RouteRedirect({ to }) {
  useEffect(() => {
    window.location.replace(to);
  }, [to]);

  return null;
}

export default function RootApp() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  useEffect(() => {
    const compactMotion = window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;
    AOS.init({
      duration: compactMotion ? 880 : 1050,
      easing: 'ease-out-cubic',
      once: true,
      offset: compactMotion ? 18 : 54,
      anchorPlacement: 'top-bottom',
      disable: false,
    });

    let observer;
    let refreshTimer;
    let secondRefreshTimer;
    let thirdRefreshTimer;

    const decoratePageAnimations = () => {
      const scopes = document.querySelectorAll(
        'main section:not(:first-child), footer section, [data-universal-footer="true"] > section',
      );
      const selector = [
        'h2',
        'h3',
        'p',
        'article',
        'li',
        'figure',
        'img',
        'video',
        'form',
        'blockquote',
        '[class*="grid"] > div',
        '[class*="grid"] > a',
        '[class*="flex"] > a',
        '[class*="shadow-card"]',
        '[class*="shadow-dashboard"]',
        '[data-animate-widget="true"]',
      ].map((item) => `${item}:not([data-aos])`).join(',');
      const animationCycle = ['fade-up', 'fade-right', 'fade-left', 'zoom-in-up', 'fade-up'];

      scopes.forEach((scope, scopeIndex) => {
        let itemIndex = 0;
        scope.querySelectorAll(selector).forEach((element) => {
          const animation = animationCycle[(itemIndex + scopeIndex) % animationCycle.length];
          element.setAttribute('data-aos', animation);
          element.setAttribute('data-aos-delay', String((itemIndex % 6) * (compactMotion ? 42 : 70)));
          element.setAttribute('data-aos-duration', String((compactMotion ? 820 : 900) + (itemIndex % 3) * (compactMotion ? 90 : 110)));
          itemIndex += 1;
        });
      });
    };

    const prepareAnimations = () => {
      decoratePageAnimations();
      AOS.refreshHard();

      const animatedElements = document.querySelectorAll('[data-aos]');

      if (!('IntersectionObserver' in window)) {
        animatedElements.forEach((element) => element.classList.add('aos-animate'));
        return;
      }

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('aos-animate');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.01, rootMargin: '0px 0px 140px 0px' },
      );

      animatedElements.forEach((element) => observer.observe(element));
    };

    const animationFrame = window.requestAnimationFrame(prepareAnimations);
    refreshTimer = window.setTimeout(prepareAnimations, 280);
    secondRefreshTimer = window.setTimeout(prepareAnimations, 1000);
    thirdRefreshTimer = window.setTimeout(() => AOS.refreshHard(), 1800);

    const refreshAnimations = () => prepareAnimations();
    window.addEventListener('load', refreshAnimations);
    window.addEventListener('resize', refreshAnimations);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(refreshTimer);
      window.clearTimeout(secondRefreshTimer);
      window.clearTimeout(thirdRefreshTimer);
      window.removeEventListener('load', refreshAnimations);
      window.removeEventListener('resize', refreshAnimations);
      observer?.disconnect();
    };
  }, [path]);

  useEffect(() => {
    let hoverCleanups = [];
    let sectionObserver;
    const context = gsap.context(() => {
      gsap.fromTo(
        'body > #root header',
        { y: -24, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', clearProps: 'transform,opacity,visibility' },
      );

      const heroDecorations = gsap.utils.toArray(
        'main section:first-child > [class*="absolute"], main section:first-child [aria-hidden="true"]',
      ).slice(0, 8);

      heroDecorations.forEach((element, index) => {
        gsap.to(element, {
          y: index % 2 === 0 ? -9 : 8,
          x: index % 3 === 0 ? 5 : -4,
          rotation: index % 2 === 0 ? 0.8 : -0.6,
          duration: 4.2 + (index % 4) * 0.55,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      const interactiveCards = gsap.utils.toArray(
        'main article, main a[class*="shadow-card"], main [class*="shadow-dashboard"]',
      );

      hoverCleanups = interactiveCards.map((card) => {
        const enter = () => gsap.to(card, { y: -7, scale: 1.012, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
        const leave = () => gsap.to(card, { y: 0, scale: 1, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        card.addEventListener('pointerenter', enter);
        card.addEventListener('pointerleave', leave);
        card.addEventListener('focusin', enter);
        card.addEventListener('focusout', leave);
        return () => {
          card.removeEventListener('pointerenter', enter);
          card.removeEventListener('pointerleave', leave);
          card.removeEventListener('focusin', enter);
          card.removeEventListener('focusout', leave);
        };
      });

      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const accents = entry.target.querySelectorAll(
              ':scope > [class*="absolute"], :scope > div > [class*="absolute"]',
            );
            if (accents.length) {
              gsap.fromTo(
                accents,
                { scale: 0.94, autoAlpha: 0.45 },
                { scale: 1, autoAlpha: 1, duration: 1.15, stagger: 0.08, ease: 'power2.out' },
              );
            }
            sectionObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.16 },
      );

      document.querySelectorAll('main section:not(:first-child)').forEach((section) => sectionObserver.observe(section));

    });

    return () => {
      hoverCleanups.forEach((cleanup) => cleanup());
      sectionObserver?.disconnect();
      context.revert();
    };
  }, [path]);

  useEffect(() => {
    if (path !== '/') return undefined;

    const routePageLinks = (event) => {
      const link = event.target.closest('a[href="#partners"], a[href="#trust"]');
      if (!link) return;

      const destinationByHash = {
        '#partners': '/partners',
        '#trust': '/trust',
      };

      event.preventDefault();
      window.location.assign(destinationByHash[link.getAttribute('href')]);
    };

    document.addEventListener('click', routePageLinks);
    return () => document.removeEventListener('click', routePageLinks);
  }, [path]);

  if (path === '/astikan') return <UniversalPage><AstikanPage /></UniversalPage>;
  if (path === '/astikan-pay') return <UniversalPage><AstikanPayPage /></UniversalPage>;
  if (path === '/the-kiosk') return <UniversalPage><KioskPage /></UniversalPage>;
  if (path === '/research') return <UniversalPage><ResearchPage /></UniversalPage>;
  if (path === '/mission') return <UniversalPage><MissionPage /></UniversalPage>;
  if (path === '/company') return <UniversalPage><CompanyPage /></UniversalPage>;
  if (path === '/technology') return <RouteRedirect to="/astikan" />;
  if (path === '/partners') return <UniversalPage><PartnersPage /></UniversalPage>;
  if (path === '/trust') return <UniversalPage><TrustPage /></UniversalPage>;

  return (
    <UniversalPage>
      <SiteHeader />
      <div className="astikan-home-shell"><App /></div>
      <style>{`
        .astikan-home-shell > div > header,
        .astikan-home-shell > div > footer {
          display: none !important;
        }
        .astikan-home-shell a[href="#contact"],
        .astikan-home-shell section#contact {
          display: none !important;
        }
      `}</style>
    </UniversalPage>
  );
}
