interface Props {
    onSaved: (thoughtId: string) => void;
}
/**
 * Foto-Capture button + hidden file input.
 *
 * Fixes applied:
 * - WICHTIG: media + thought creation wrapped in a single Dexie transaction
 *   so a partial failure cannot leave orphaned blobs.
 * - WICHTIG: preview object URL always revoked (in finally).
 */
export declare function PhotoCapture({ onSaved }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PhotoCapture.d.ts.map