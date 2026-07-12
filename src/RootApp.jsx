import React, { useEffect } from 'react';
import AOS from 'aos';
import App from './App';
import TechnologyPage from './pages/TechnologyPage';

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

    const routeTechnology = (event) => {
      const link = event.target.closest('a[href="#technology"]');
      if (!link) return;
      event.preventDefault();
      window.location.assign('/technology');
    };

    document.addEventListener('click', routeTechnology);
    return () => document.removeEventListener('click', routeTechnology);
  }, [path]);

  return path === '/technology' ? <TechnologyPage /> : <App />;
}
