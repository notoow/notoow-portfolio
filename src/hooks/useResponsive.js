import { useSyncExternalStore } from 'react';

const DEFAULT_STATE = { isMobile: false, isTablet: false };
const listeners = new Set();

let cachedState = DEFAULT_STATE;
let isSubscribed = false;
let cleanupWindowListeners = null;

function getResponsiveState() {
    if (typeof window === 'undefined') {
        return DEFAULT_STATE;
    }

    return {
        isMobile: window.innerWidth <= 768,
        isTablet: window.innerWidth <= 1024,
    };
}

function emitIfChanged() {
    const nextState = getResponsiveState();
    if (
        nextState.isMobile === cachedState.isMobile &&
        nextState.isTablet === cachedState.isTablet
    ) {
        return;
    }

    cachedState = nextState;
    listeners.forEach((listener) => listener());
}

function ensureWindowListeners() {
    if (typeof window === 'undefined' || isSubscribed) {
        return;
    }

    cachedState = getResponsiveState();

    const handleResize = () => {
        window.requestAnimationFrame(emitIfChanged);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    cleanupWindowListeners = () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
    };

    isSubscribed = true;
}

function subscribe(listener) {
    ensureWindowListeners();
    listeners.add(listener);

    return () => {
        listeners.delete(listener);

        if (listeners.size === 0 && cleanupWindowListeners) {
            cleanupWindowListeners();
            cleanupWindowListeners = null;
            isSubscribed = false;
        }
    };
}

function getSnapshot() {
    if (typeof window === 'undefined') {
        return DEFAULT_STATE;
    }

    cachedState = getResponsiveState();
    return cachedState;
}

export function useResponsive() {
    return useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT_STATE);
}
