interface Props {
    mediaId: string;
    size?: number;
    className?: string;
}
/**
 * Lazy-loads a thumbnail from Dexie (Blob → object URL).
 * Revokes the object URL on unmount to avoid memory leaks.
 */
export declare function PhotoThumb({ mediaId, size, className }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PhotoThumb.d.ts.map