import { useEffect, useState } from 'react';
const DISMISSED_KEY = 'bd-install-dismissed';
function detectPlatform() {
    if (typeof window === 'undefined')
        return null;
    // Already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches ||
        ('standalone' in window.navigator && window.navigator.standalone)) {
        return 'already-installed';
    }
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) && !/chrome/i.test(ua);
    const isAndroidChrome = /android/i.test(ua) && /chrome/i.test(ua);
    const isDesktopChrome = !isIOS && !isAndroidChrome && /chrome/i.test(ua);
    if (isIOS)
        return 'ios';
    if (isAndroidChrome)
        return 'android-chrome';
    if (isDesktopChrome)
        return 'desktop';
    return null;
}
export function useInstallPrompt() {
    const [platform] = useState(() => detectPlatform());
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [dismissed, setDismissed] = useState(() => {
        try {
            return sessionStorage.getItem(DISMISSED_KEY) === '1';
        }
        catch {
            return false;
        }
    });
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const promptInstall = deferredPrompt
        ? async () => {
            const promptEvent = deferredPrompt;
            await promptEvent.prompt();
            await promptEvent.userChoice;
            setDeferredPrompt(null);
        }
        : null;
    const dismiss = () => {
        try {
            sessionStorage.setItem(DISMISSED_KEY, '1');
        }
        catch { /* ignore */ }
        setDismissed(true);
    };
    // Show hint only when:
    // - Platform is detected
    // - Not already installed
    // - Not dismissed
    // - For Android/Desktop: only when native prompt is available
    const visible = !dismissed &&
        platform !== null &&
        platform !== 'already-installed' &&
        (platform === 'ios' || deferredPrompt !== null);
    return { platform, promptInstall, dismiss, visible };
}
//# sourceMappingURL=useInstallPrompt.js.map