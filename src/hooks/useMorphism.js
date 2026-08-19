import { useState, useEffect } from 'react';

export function useMorphism() {
  const [morphism, setMorphism] = useState(() => {
    const saved = localStorage.getItem('morph-morphism');
    return saved || 'glass';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-morphism', morphism);
    localStorage.setItem('morph-morphism', morphism);
  }, [morphism]);

  return { morphism, setMorphism };
}
