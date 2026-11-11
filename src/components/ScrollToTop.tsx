import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * On route change: scroll to the `#hash` target if there is one
 * (e.g. /members#suspension-team), otherwise to the top of the page.
 * Retries briefly so sections rendered after data loads can still be found.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer: number | undefined;

    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tries++ < 10) {
        timer = window.setTimeout(attempt, 100);
      }
    };

    window.scrollTo(0, 0);
    timer = window.setTimeout(attempt, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
