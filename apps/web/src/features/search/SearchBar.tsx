import { useEffect, useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { thoughtRepository } from '@braindump/db';
import { debounce } from '@braindump/core';
import {
  hydrateSearchIndex,
  addToIndex,
  searchThoughts,
  type SearchResult,
} from './search-index';
import type { Thought } from '@braindump/core';

interface Props {
  onResults: (ids: string[] | null) => void;
}

/**
 * Fixes:
 * - WICHTIG: debounced search is cancelled on unmount
 * - WICHTIG: index stays in sync — every live-query update calls addToIndex
 *   for changed/new thoughts so search results are never stale
 */
export function SearchBar({ onResults }: Props) {
  const [query, setQuery] = useState('');
  const [indexReady, setIndexReady] = useState(false);
  const thoughts = useLiveQuery(
    () => thoughtRepository.listNewestFirst(500),
    [],
    [] as Thought[],
  );

  // Hydrate on first load; keep index in sync on every subsequent update
  useEffect(() => {
    if (thoughts.length === 0) return;
    if (!indexReady) {
      void hydrateSearchIndex(thoughts).then(() => setIndexReady(true));
    } else {
      // Incremental sync: re-add all thoughts (MiniSearch discards before re-adding)
      thoughts.forEach((t) => addToIndex(t));
    }
  }, [thoughts, indexReady]);

  const debouncedSearch = useMemo(
    () =>
      debounce((q: string) => {
        if (!q.trim()) { onResults(null); return; }
        const results: SearchResult[] = searchThoughts(q);
        onResults(results.map((r) => r.id));
      }, 250),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // WICHTIG FIX: cancel on unmount so onResults is never called after teardown
  useEffect(() => {
    return () => debouncedSearch.cancel();
  }, [debouncedSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setQuery('');
    onResults(null);
  };

  return (
    <div className="relative flex items-center">
      <SearchIcon />
      <input
        type="search"
        value={query}
        onChange={handleChange}
        placeholder="suchen…"
        className="w-full rounded-pill bg-white/60 py-2 pl-8 pr-8 text-sm text-ink placeholder:text-ink-faint focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent/40"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Suche löschen"
          className="absolute right-2 text-ink-faint hover:text-ink"
        >
          <XIcon />
        </button>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg className="absolute left-2.5 text-ink-faint" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M19 19l-4-4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
