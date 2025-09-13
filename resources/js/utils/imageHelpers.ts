/**
 * Utility functions for handling image URLs in the application
 */

/**
 * Get the correct image URL for user/provider photos
 * Handles both seeded data (absolute paths) and uploaded data (relative paths)
 * 
 * @param photo - The photo path from the database
 * @returns The correct URL to display the image, or undefined if no photo
 */
export const getImageUrl = (photo?: string | null): string | undefined => {
    if (!photo) return undefined;
    
    if (photo.startsWith('/')) {
        return photo;
    }
    return `/storage/${photo}`;
};

/**
 * Get the correct image URL for doctor application photos
 * These are always stored in the storage directory
 * 
 * @param photo - The photo path from the doctor application
 * @returns The correct URL to display the image, or undefined if no photo
 */
export const getDoctorApplicationImageUrl = (photo?: string | null): string | undefined => {
    if (!photo) return undefined;
    return `/storage/${photo}`;
};