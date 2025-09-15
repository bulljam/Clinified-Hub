export type Appearance = 'light';

export function initializeTheme() {
    // Force light mode only
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
}

export function useAppearance() {
    const appearance: Appearance = 'light';

    const updateAppearance = () => {
        // Do nothing - always light mode
    };

    return { appearance, updateAppearance } as const;
}