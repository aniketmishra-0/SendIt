import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';

interface Props {
    size?: number;
}

/**
 * Original SendIt logo: Dark rounded-rect background with an S-curve arrow
 * in amber (#F59E0B) → red (#EF4444) gradient.
 */
export const Logo: React.FC<Props> = ({ size = 42 }) => {
    return (
        <View style={[styles.container, { width: size, height: size, borderRadius: size * 0.22 }]}>
            <Svg width={size} height={size} viewBox="0 0 100 100">
                <Defs>
                    <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <Stop offset="0%" stopColor="#F59E0B" />
                        <Stop offset="100%" stopColor="#EF4444" />
                    </LinearGradient>
                </Defs>

                {/* Dark background */}
                <Rect width="100" height="100" rx="22" fill="#1A1A1A" />

                {/* S-curve */}
                <Path
                    d="M 62 28 C 35 28 35 44 50 50 C 65 56 65 72 38 72"
                    fill="none"
                    stroke="url(#logoGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Arrow head */}
                <Path
                    d="M 45 66 L 38 72 L 45 78"
                    fill="none"
                    stroke="url(#logoGrad)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
});

export default Logo;
