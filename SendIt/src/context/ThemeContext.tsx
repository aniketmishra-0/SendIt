import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, theme as defaultTheme, Theme } from '../utils/theme';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    mode: ThemeMode;
    isDark: boolean;
    setMode: (mode: ThemeMode) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');

    const isDark = mode === 'system' 
        ? systemColorScheme === 'dark' 
        : mode === 'dark';

    const currentTheme: Theme = {
        mode: isDark ? 'dark' : 'light',
        colors: isDark ? darkTheme.colors : lightTheme.colors,
        spacing: defaultTheme.spacing,
        borderRadius: defaultTheme.borderRadius,
        fontSize: defaultTheme.fontSize,
    };

    const toggleTheme = () => {
        setMode(prev => {
            if (prev === 'system') return 'light';
            if (prev === 'light') return 'dark';
            return 'system';
        });
    };

    return (
        <ThemeContext.Provider value={{ 
            theme: currentTheme, 
            mode, 
            isDark,
            setMode, 
            toggleTheme 
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Export a hook for just getting the colors
export const useColors = () => {
    const { theme } = useTheme();
    return theme.colors;
};

export default ThemeContext;
