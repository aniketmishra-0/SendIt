import { Dimensions, PixelRatio, Platform } from 'react-native';

// Base design dimensions (iPhone 14 / standard 390x844)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Scale a value based on screen width relative to base design
 */
export const wp = (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Scale a value based on screen height relative to base design
 */
export const hp = (size: number): number => {
    const scale = SCREEN_HEIGHT / BASE_HEIGHT;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Moderate scaling - less aggressive than wp(), good for fonts and spacing
 * factor: 0 = no scaling, 1 = full scaling (default 0.5)
 */
export const ms = (size: number, factor: number = 0.5): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size + (scale - 1) * size * factor;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Font scaling using moderate scale
 */
export const fs = (size: number): number => {
    return ms(size, 0.3);
};

/**
 * Get responsive value based on screen width breakpoints
 */
export const responsive = <T>(options: {
    small?: T;    // < 360px (SE, small Android)
    medium?: T;   // 360-413px (most phones)
    large?: T;    // 414-767px (large phones, Plus/Max)
    tablet?: T;   // 768px+ (tablets)
    default: T;
}): T => {
    if (SCREEN_WIDTH >= 768 && options.tablet !== undefined) return options.tablet;
    if (SCREEN_WIDTH >= 414 && options.large !== undefined) return options.large;
    if (SCREEN_WIDTH >= 360 && options.medium !== undefined) return options.medium;
    if (options.small !== undefined) return options.small;
    return options.default;
};

/**
 * Check if screen is small (iPhone SE, small Android phones)
 */
export const isSmallScreen = SCREEN_WIDTH < 360;

/**
 * Check if screen is tablet
 */
export const isTablet = SCREEN_WIDTH >= 768;

/**
 * Get screen category
 */
export type ScreenCategory = 'small' | 'medium' | 'large' | 'tablet';
export const getScreenCategory = (): ScreenCategory => {
    if (SCREEN_WIDTH >= 768) return 'tablet';
    if (SCREEN_WIDTH >= 414) return 'large';
    if (SCREEN_WIDTH >= 360) return 'medium';
    return 'small';
};

/**
 * Platform-aware hitSlop for touch targets (44pt minimum)
 */
export const hitSlop = (size: number): { top: number; bottom: number; left: number; right: number } => {
    const minTarget = 44;
    const extra = Math.max(0, (minTarget - size) / 2);
    return {
        top: extra,
        bottom: extra,
        left: extra,
        right: extra,
    };
};

/**
 * Responsive spacing
 */
export const spacing = {
    xs: wp(4),
    sm: wp(8),
    md: wp(16),
    lg: wp(24),
    xl: wp(32),
    xxl: wp(48),
    screen: wp(20),  // standard screen horizontal padding
};

/**
 * Responsive font sizes
 */
export const fontSize = {
    xs: fs(10),
    sm: fs(12),
    md: fs(14),
    lg: fs(16),
    xl: fs(20),
    xxl: fs(28),
    hero: fs(32),
    display: fs(40),
};
