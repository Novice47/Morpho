import { useEffect } from 'react';

export function useScrollAnimation(activeTab) {
  useEffect(() => {
    // We run the observer registration whenever activeTab changes, 
    // since tab switches unmount/mount page elements.
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, observerOptions);

    // Timeout to allow DOM updates after tab switches
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [activeTab]);
}
