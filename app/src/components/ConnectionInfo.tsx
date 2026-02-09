/**
 * Connection Info Component
 * Shows current connection type, speed, and network status
 * ShareIt-like beautiful UI with connection indicators
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    networkService,
    sessionManager,
    ConnectionMode,
    NetworkInfo
} from '../services/WiFiTransferService';
import { theme } from '../utils/theme';

interface ConnectionInfoProps {
    onPress?: () => void;
    showDetails?: boolean;
}

const ConnectionInfo: React.FC<ConnectionInfoProps> = ({ onPress, showDetails = true }) => {
    const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
    const [connectionMode, setConnectionMode] = useState<ConnectionMode>('offline');
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        loadNetworkInfo();

        // Refresh every 5 seconds
        const interval = setInterval(loadNetworkInfo, 5000);

        // Start pulse animation for active connection
        startPulseAnimation();

        return () => clearInterval(interval);
    }, []);

    const loadNetworkInfo = async () => {
        const info = await networkService.getNetworkInfo();
        setNetworkInfo(info);
        setConnectionMode(networkService.getOptimalConnectionMode(info));
    };

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const getConnectionIcon = (): string => {
        switch (connectionMode) {
            case 'wifi-direct':
                return 'radio';
            case 'hotspot':
                return 'hotspot';
            case 'same-network':
                return 'wifi';
            case 'internet':
                return 'globe';
            default:
                return 'cloud-offline';
        }
    };

    const getConnectionColor = (): string => {
        switch (connectionMode) {
            case 'wifi-direct':
                return '#22C55E'; // Green - fastest
            case 'hotspot':
                return '#3B82F6'; // Blue
            case 'same-network':
                return '#F59E0B'; // Amber
            case 'internet':
                return '#EF4444'; // Red
            default:
                return '#71717A'; // Gray
        }
    };

    const getConnectionDetails = () => {
        return networkService.getConnectionModeLabel(connectionMode);
    };

    const connectionDetails = getConnectionDetails();
    const connectionColor = getConnectionColor();

    if (!showDetails) {
        // Compact mode - just show icon
        return (
            <TouchableOpacity onPress={onPress} style={styles.compactContainer}>
                <View style={[styles.compactDot, { backgroundColor: connectionColor }]} />
                <Ionicons name={getConnectionIcon() as any} size={18} color={connectionColor} />
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}
            activeOpacity={0.8}
        >
            <LinearGradient
                colors={[`${connectionColor}20`, `${connectionColor}10`]}
                style={styles.gradient}
            >
                {/* Connection Icon with Pulse */}
                <View style={styles.iconContainer}>
                    <Animated.View
                        style={[
                            styles.pulseRing,
                            {
                                backgroundColor: `${connectionColor}30`,
                                transform: [{ scale: pulseAnim }],
                            }
                        ]}
                    />
                    <View style={[styles.iconBg, { backgroundColor: `${connectionColor}30` }]}>
                        <Ionicons
                            name={getConnectionIcon() as any}
                            size={24}
                            color={connectionColor}
                        />
                    </View>
                </View>

                {/* Connection Details */}
                <View style={styles.details}>
                    <Text style={[styles.label, { color: connectionColor }]}>
                        {connectionDetails.label}
                    </Text>
                    <Text style={styles.speed}>
                        Up to {connectionDetails.speed}
                    </Text>
                </View>

                {/* Speed Badge */}
                <View style={[styles.speedBadge, { backgroundColor: `${connectionColor}20` }]}>
                    <Ionicons name="flash" size={14} color={connectionColor} />
                    <Text style={[styles.speedBadgeText, { color: connectionColor }]}>
                        {connectionMode === 'wifi-direct' ? 'ULTRA' :
                            connectionMode === 'hotspot' ? 'FAST' :
                                connectionMode === 'same-network' ? 'QUICK' : 'SLOW'}
                    </Text>
                </View>
            </LinearGradient>

            {/* Network Status Indicator */}
            {networkInfo && (
                <View style={styles.statusBar}>
                    <View style={[styles.statusDot, {
                        backgroundColor: networkInfo.isConnected ? '#22C55E' : '#EF4444'
                    }]} />
                    <Text style={styles.statusText}>
                        {networkInfo.isConnected
                            ? `${networkInfo.type.toUpperCase()} Connected`
                            : 'No Connection'}
                    </Text>
                    {networkInfo.ipAddress && (
                        <Text style={styles.ipText}>
                            {networkInfo.ipAddress}
                        </Text>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    compactContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: theme.colors.bgCard,
        borderRadius: 20,
    },
    compactDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    iconContainer: {
        position: 'relative',
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    iconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    details: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
    },
    speed: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    speedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    speedBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    statusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: theme.colors.bgCard,
        borderTopWidth: 1,
        borderTopColor: theme.colors.glassBorder,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    ipText: {
        fontSize: 11,
        color: theme.colors.textMuted,
        marginLeft: 'auto',
        fontFamily: 'monospace',
    },
});

export default ConnectionInfo;
