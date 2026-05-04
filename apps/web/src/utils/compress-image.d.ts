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
export interface CompressedImage {
    main: Blob;
    thumb: Blob;
    width: number;
    height: number;
    mimeType: 'image/jpeg';
}
export declare function compressImage(file: File): Promise<CompressedImage>;
//# sourceMappingURL=compress-image.d.ts.map