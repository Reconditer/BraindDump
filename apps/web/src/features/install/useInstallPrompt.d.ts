type Platform = 'ios' | 'android-chrome' | 'desktop' | 'already-installed' | null;
interface InstallState {
    platform: Platform;
    /** Android/Desktop: call this to show the native install dialog */
    promptInstall: (() => Promise<void>) | null;
    /** Dismiss the hint for this session */
    dismiss: () => void;
    visible: boolean;
}
export declare function useInstallPrompt(): InstallState;
export {};
//# sourceMappingURL=useInstallPrompt.d.ts.map