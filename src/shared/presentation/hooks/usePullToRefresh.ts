'use client';
import { useRef, useState, useEffect } from 'react';

export function usePullToRefresh(
  onRefresh: () => Promise<void>,
  options?: { threshold?: number },
) {
  const threshold = options?.threshold ?? 80;
  const containerRef = useRef<HTMLElement | null>(null);
  const startYRef = useRef(0);
  const rawDeltaRef = useRef(0);
  const isRefreshingRef = useRef(false);
  const wasAtTopRef = useRef(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      startYRef.current = e.touches[0].clientY;
      rawDeltaRef.current = 0;
      wasAtTopRef.current = window.scrollY === 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isRefreshingRef.current || !wasAtTopRef.current) return;
      const raw = e.touches[0].clientY - startYRef.current;
      if (raw <= 0) return;
      e.preventDefault();
      rawDeltaRef.current = raw;
      setPullDistance(raw * 0.4); // damped visual distance
    };
    const onTouchEnd = () => {
      const raw = rawDeltaRef.current;
      rawDeltaRef.current = 0;
      setPullDistance(0);
      if (raw >= threshold && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        setIsRefreshing(true);
        onRefresh().finally(() => {
          isRefreshingRef.current = false;
          setIsRefreshing(false);
        });
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false }); // non-passive to allow preventDefault
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [onRefresh, threshold]);

  return { containerRef, pullDistance, isRefreshing };
}
