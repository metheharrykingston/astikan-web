import React, { useEffect } from 'react';
import AOS from 'aos';
import App from './App';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import AstikanPage from './pages/AstikanPage';
import AstikanPayPage from './pages/AstikanPayPage';
import KioskPage from './pages/KioskPageClean';
import TechnologyPage from './pages/TechnologyPage';
import PartnersPage from './pages/PartnersPage';
import TrustPage from './pages/TrustPage';
import ShopPage from './pages/ShopPage';

function UniversalPage({ children }) {
  return (
    <>
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

export default function RootApp() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  useEffect(() => {
    AOS.init({
      duration: 760,
      easing: 'ease-out-cubic',
      once: true,
      offset: 64,
      anchorPlacement: 'top-bottom',
    });

    let observer;
    let refreshTimer;
    let secondRefreshTimer;
    let thirdRefreshTimer;

    const decoratePageAnimations = () => {
      const selectors = [
        'main section:not(:first-child) h2:not([data-aos])',
        'main article:not([data-aos])',
        'main [class*="shadow-card"]:not([data-aos])',
        'main [class*="shadow-dashboard"]:not([data-aos])',
        'main [data-animate-widget="true"]:not([data-aos])',
      ];

      const candidates = [...new Set(selectors.flatMap((selector) => [...document.querySelectorAll(selector)]))];
      let animationIndex = 0;

      candidates.forEach((element) => {
        if (element.parentElement?.closest('[data-aos]')) return;

        element.setAttribute('data-aos', element.tagName === 'H2' ? 'fade-up' : 'fade-up');
        element.setAttribute('data-aos-delay', String((animationIndex % 6) * 45));
        animationIndex += 1;
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
        {
          threshold: 0.01,
          rootMargin: '0px 0px 140px 0px',
        },
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
    if (path !== '/') return undefined;

    const routePageLinks = (event) => {
      const link = event.target.closest('a[href="#technology"], a[href="#partners"], a[href="#trust"]');
      if (!link) return;

      const destinationByHash = {
        '#technology': '/technology',
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
  if (path === '/technology') return <UniversalPage><TechnologyPage /></UniversalPage>;
  if (path === '/partners') return <UniversalPage><PartnersPage /></UniversalPage>;
  if (path === '/trust') return <UniversalPage><TrustPage /></UniversalPage>;
  if (path === '/shop') return <UniversalPage><ShopPage /></UniversalPage>;

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
