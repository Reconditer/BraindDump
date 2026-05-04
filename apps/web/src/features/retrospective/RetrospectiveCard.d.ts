import { type Thought } from '@braindump/core';
interface Props {
    thoughts: Thought[];
}
/**
 * Magic #1: Rückblick — zero AI, pure date query.
 *
 * Fixes:
 * - WICHTIG: localStorage wrapped in try/catch for restricted/private contexts
 * - WICHTIG: date matching uses local calendar days, not ms arithmetic,
 *   so DST transitions and time-of-day differences don't cause misses
 */
export declare function RetrospectiveCard({ thoughts }: Props): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=RetrospectiveCard.d.ts.map