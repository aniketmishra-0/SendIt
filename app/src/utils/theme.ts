// Theme constants for the app - SendIt Brand Colors
// Logo gradient: Amber #F59E0B → Red #EF4444

export const colors = {
    // Brand Colors (from logo)
    brand: {
        primary: '#F59E0B',      // Amber
        secondary: '#EF4444',    // Red
        gradient: ['#F59E0B', '#EF4444'],
    },
};

export const darkTheme = {
    mode: 'dark' as const,
    colors: {
        // Primary - Warm Amber (from logo)
        primary: '#F59E0B',
        primaryLight: '#FBBF24',
        primaryDark: '#D97706',
        primaryGlow: 'rgba(245, 158, 11, 0.4)',

        // Accent - Vibrant Red (from logo)
        accent: '#EF4444',
        accentLight: '#F87171',
        accentDark: '#DC2626',
        accentGlow: 'rgba(239, 68, 68, 0.4)',

        // Status colors
        success: '#22C55E',
        successGlow: 'rgba(34, 197, 94, 0.3)',
        warning: '#EAB308',
        warningGlow: 'rgba(234, 179, 8, 0.3)',
        danger: '#EF4444',
        dangerGlow: 'rgba(239, 68, 68, 0.3)',
        info: '#3B82F6',
        infoGlow: 'rgba(59, 130, 246, 0.3)',

        // Background - Dark Mode
        background: '#0F0F0F',
        backgroundSecondary: '#1A1A1A',
        backgroundTertiary: '#262626',
        card: 'rgba(26, 26, 26, 0.8)',
        cardHover: 'rgba(38, 38, 38, 0.9)',

        // Glass effect
        glassBg: 'rgba(26, 26, 26, 0.6)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        glassShadow: 'rgba(0, 0, 0, 0.4)',

        // Text - Dark Mode
        text: '#FFFFFF',
        textPrimary: '#F8FAFC',
        textSecondary: '#A1A1AA',
        textMuted: '#71717A',
        textInverse: '#0F0F0F',

        // Borders
        border: 'rgba(255, 255, 255, 0.1)',
        borderLight: 'rgba(255, 255, 255, 0.05)',
        borderFocus: '#F59E0B',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.7)',
    },
};

export const lightTheme = {
    mode: 'light' as const,
    colors: {
        // Primary - Warm Amber (from logo)
        primary: '#F59E0B',
        primaryLight: '#FCD34D',
        primaryDark: '#B45309',
        primaryGlow: 'rgba(245, 158, 11, 0.25)',

        // Accent - Vibrant Red (from logo)
        accent: '#EF4444',
        accentLight: '#FCA5A5',
        accentDark: '#B91C1C',
        accentGlow: 'rgba(239, 68, 68, 0.25)',

        // Status colors
        success: '#16A34A',
        successGlow: 'rgba(22, 163, 74, 0.2)',
        warning: '#CA8A04',
        warningGlow: 'rgba(202, 138, 4, 0.2)',
        danger: '#DC2626',
        dangerGlow: 'rgba(220, 38, 38, 0.2)',
        info: '#2563EB',
        infoGlow: 'rgba(37, 99, 235, 0.2)',

        // Background - Light Mode
        background: '#FFFFFF',
        backgroundSecondary: '#F9FAFB',
        backgroundTertiary: '#F3F4F6',
        card: 'rgba(255, 255, 255, 0.9)',
        cardHover: 'rgba(249, 250, 251, 1)',

        // Glass effect
        glassBg: 'rgba(255, 255, 255, 0.7)',
        glassBorder: 'rgba(0, 0, 0, 0.08)',
        glassShadow: 'rgba(0, 0, 0, 0.1)',

        // Text - Light Mode
        text: '#0F0F0F',
        textPrimary: '#111827',
        textSecondary: '#4B5563',
        textMuted: '#9CA3AF',
        textInverse: '#FFFFFF',

        // Borders
        border: 'rgba(0, 0, 0, 0.1)',
        borderLight: 'rgba(0, 0, 0, 0.05)',
        borderFocus: '#F59E0B',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.5)',
    },
};

// Default theme (dark mode) with additional aliases for components
export const theme = {
    ...darkTheme,
    colors: {
        ...darkTheme.colors,
        // Aliases for component compatibility
        bgCard: darkTheme.colors.card,
        bgCardHover: darkTheme.colors.cardHover,
        bgTertiary: darkTheme.colors.backgroundTertiary,
        bgSecondary: darkTheme.colors.backgroundSecondary,
        bgPrimary: darkTheme.colors.background,
        bgDark: darkTheme.colors.background,          // #0F0F0F
        bgDarker: '#090909',                           // Extra dark
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
        full: 9999,
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 24,
        xxl: 32,
        hero: 48,
    },
};

// Type definitions
export type ThemeMode = 'dark' | 'light';
export type ThemeColors = typeof darkTheme.colors;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeBorderRadius = typeof theme.borderRadius;
export type ThemeFontSize = typeof theme.fontSize;

export interface Theme {
    mode: ThemeMode;
    colors: ThemeColors;
    spacing: ThemeSpacing;
    borderRadius: ThemeBorderRadius;
    fontSize: ThemeFontSize;
}
