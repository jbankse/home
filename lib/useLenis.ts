import Lenis from 'lenis';
import { useEffect, useRef } from 'react';

export function useLenis(onScroll?: (e: any) => void) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            touchMultiplier: 2,
        });
        lenisRef.current = lenis;

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (onScroll) {
            lenis.on('scroll', onScroll);
        }

        return () => {
            lenis.destroy();
        };
    }, [onScroll]); // Re-bind if onScroll changes, though usually it's stable or wrapped in useCallback

    return lenisRef;
}
