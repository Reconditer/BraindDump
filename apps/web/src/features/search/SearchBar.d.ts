interface Props {
    onResults: (ids: string[] | null) => void;
}
/**
 * Fixes:
 * - WICHTIG: debounced search is cancelled on unmount
 * - WICHTIG: index stays in sync — every live-query update calls addToIndex
 *   for changed/new thoughts so search results are never stale
 */
export declare function SearchBar({ onResults }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SearchBar.d.ts.map