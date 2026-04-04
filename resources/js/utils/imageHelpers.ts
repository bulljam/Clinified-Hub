export const getImageUrl = (photo?: string | null): string | undefined => {
    if (!photo) return undefined;

    if (photo.startsWith('/')) {
        return photo;
    }
    return `/storage/${photo}`;
};

export const getDoctorApplicationImageUrl = (photo?: string | null): string | undefined => {
    if (!photo) return undefined;
    return `/storage/${photo}`;
};
