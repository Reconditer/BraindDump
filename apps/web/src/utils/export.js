import JSZip from 'jszip';
import { thoughtRepository, mediaRepository } from '@braindump/db';
/** Trigger a browser download of any Blob */
function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    // NICE FIX: defer revoke so the browser can actually read the URL first
    setTimeout(() => URL.revokeObjectURL(url), 0);
}
/** Export all thoughts as a JSON file */
export async function exportAsJSON() {
    const thoughts = await thoughtRepository.listNewestFirst(9999);
    const data = {
        exportedAt: new Date().toISOString(),
        version: 1,
        thoughts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    downloadBlob(blob, `braindump-export-${dateStamp()}.json`);
}
/**
 * Export everything as a ZIP:
 * - thoughts.json (all text + metadata)
 * - photos/ directory with original compressed JPEGs
 */
export async function exportAsZIP(onProgress) {
    const thoughts = await thoughtRepository.listNewestFirst(9999);
    const zip = new JSZip();
    // thoughts.json
    zip.file('thoughts.json', JSON.stringify({ exportedAt: new Date().toISOString(), version: 1, thoughts }, null, 2));
    // Photos
    const photoThoughts = thoughts.filter((t) => t.type === 'photo' && t.mediaId);
    const photosFolder = zip.folder('photos');
    for (let i = 0; i < photoThoughts.length; i++) {
        const thought = photoThoughts[i];
        if (!thought?.mediaId)
            continue;
        onProgress?.(i + 1, photoThoughts.length);
        const media = await mediaRepository.get(thought.mediaId);
        if (!media)
            continue;
        const filename = `${thought.id}.jpg`;
        photosFolder?.file(filename, media.data);
    }
    const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
    downloadBlob(zipBlob, `braindump-export-${dateStamp()}.zip`);
}
function dateStamp() {
    return new Date().toISOString().slice(0, 10);
}
//# sourceMappingURL=export.js.map