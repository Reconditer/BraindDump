import type { Thought, ThoughtDraft } from '@braindump/core';
import { type Observable } from 'dexie';
export declare class ThoughtRepository {
    create(draft: ThoughtDraft): Promise<Thought>;
    save(thought: Thought): Promise<Thought>;
    get(id: string): Promise<Thought | undefined>;
    /**
     * WICHTIG FIX: cascade-deletes the associated media blob in a single
     * Dexie transaction so no orphaned blobs can accumulate.
     */
    remove(id: string): Promise<void>;
    listNewestFirst(limit?: number): Promise<Thought[]>;
    count(): Promise<number>;
    observeNewestFirst(limit?: number): Observable<Thought[]>;
}
export declare const thoughtRepository: ThoughtRepository;
//# sourceMappingURL=thought-repository.d.ts.map