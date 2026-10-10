import { useEffect, useState } from 'react';
export function useCompact() {
  const [compact, setCompact] = useState(() => window.innerWidth < 900);
  useEffect(() => {
    const listener = () => setCompact(window.innerWidth < 900);
    window.addEventListener('resize', listener);
    return () => window.removeEventListener('resize', listener);
  }, []);
  return compact;
}
