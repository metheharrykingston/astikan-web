import React, { useEffect } from 'react';
import AOS from 'aos';
import App from './App';
import SiteHeader from './components/SiteHeader';
import AstikanPage from './pages/AstikanPage';
import AstikanPayPage from './pages/AstikanPayPage';
import TechnologyPage from './pages/TechnologyPage';
import PartnersPage from './pages/PartnersPage';
import TrustPage from './pages/TrustPage';
import ShopPage from './pages/ShopPage';

export default function RootApp() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';

  useEffect(() => {
    AOS.init({
      duration: 720,
      easing: 'ease-out-cubic',
      once: true,
      offset: 70,
      anchorPlacement: 'top-bottom',
    });

    let observer;
    let refreshTimer;
    let secondRefreshTimer;

    const prepareAnimations = () => {
      AOS.refreshHard();

      const animatedElements = document.querySelectorAll('[data-aos]');
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
          rootMargin: '0px 0px 120px 0px',
        },
      );

      animatedElements.forEach((element) => observer.observe(element));
    };

    const animationFrame = window.requestAnimationFrame(prepareAnimations);
    refreshTimer = window.setTimeout(() => AOS.refreshHard(), 250);
    secondRefreshTimer = window.setTimeout(() => AOS.refreshHard(), 1000);

    const refreshAnimations = () => AOS.refreshHard();
    window.addEventListener('load', refreshAnimations);
    window.addEventListener('resize', refreshAnimations);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(refreshTimer);
      window.clearTimeout(secondRefreshTimer);
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

  if (path === '/astikan') return <AstikanPage />;
  if (path === '/astikan-pay') return <AstikanPayPage />;
  if (path === '/technology') return <TechnologyPage />;
  if (path === '/partners') return <PartnersPage />;
  if (path === '/trust') return <TrustPage />;
  if (path === '/shop') return <ShopPage />;

  return (
    <>
      <SiteHeader />
      <div className="astikan-home-shell"><App /></div>
      <style>{`
        .astikan-home-shell > div > header { display: none !important; }
        .astikan-home-shell a[href="#contact"] { display: none !important; }
        .astikan-home-shell section#contact { display: none !important; }
      `}</style>
    </>
  );
}
