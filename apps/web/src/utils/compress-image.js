/**
 * Client-side image compression.
 * - Resizes to max 1600px on longest edge
 * - Strips EXIF by redrawing through Canvas
 * - Returns main blob + 200px square thumb
 *
 * Fixes:
 * - bitmap.close() is now in a finally block so it always runs
 * - <img> fallback for iOS HEIC when createImageBitmap fails
 */
const MAX_SIZE = 1600;
const THUMB_SIZE = 200;
const QUALITY = 0.85;
const THUMB_QUALITY = 0.8;
export async function compressImage(file) {
    // Try createImageBitmap first; fall back to <img> for HEIC / exotic formats
    let bitmap;
    try {
        bitmap = await createImageBitmap(file);
    }
    catch {
        bitmap = await bitmapFromImg(file);
    }
    const { width: origW, height: origH } = bitmap;
    const scale = Math.min(1, MAX_SIZE / Math.max(origW, origH));
    const w = Math.round(origW * scale);
    const h = Math.round(origH * scale);
    try {
        const main = await drawToBlob(bitmap, w, h, QUALITY);
        const thumbSize = Math.min(origW, origH);
        const sx = (origW - thumbSize) / 2;
        const sy = (origH - thumbSize) / 2;
        const thumb = await drawToBlob(bitmap, THUMB_SIZE, THUMB_SIZE, THUMB_QUALITY, {
            sx, sy, sw: thumbSize, sh: thumbSize,
        });
        return { main, thumb, width: w, height: h, mimeType: 'image/jpeg' };
    }
    finally {
        // WICHTIG FIX: always free GPU memory regardless of success/failure
        bitmap.close();
    }
}
/** Fallback for HEIC / formats createImageBitmap can't handle directly */
function bitmapFromImg(file) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            createImageBitmap(img).then(resolve).catch(reject);
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Image load failed'));
        };
        img.src = url;
    });
}
function drawToBlob(bitmap, destW, destH, quality, crop) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = destW;
        canvas.height = destH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Canvas 2D unavailable'));
            return;
        }
        if (crop) {
            ctx.drawImage(bitmap, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, destW, destH);
        }
        else {
            ctx.drawImage(bitmap, 0, 0, destW, destH);
        }
        canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('toBlob returned null')), 'image/jpeg', quality);
    });
}
//# sourceMappingURL=compress-image.js.map