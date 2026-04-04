export type Appearance = 'light';

export function initializeTheme() {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
}

export function useAppearance() {
    const appearance: Appearance = 'light';
    const updateAppearance = () => {};

    return { appearance, updateAppearance } as const;
}
