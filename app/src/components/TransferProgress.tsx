/**
 * Transfer Progress Component
 * ShareIt-like beautiful transfer progress UI
 * Shows file icon, progress bar, speed, and time remaining
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    TransferItem,
    formatFileSize,
    formatSpeed,
    formatTime
} from '../services/WiFiTransferService';
import { theme } from '../utils/theme';

interface TransferProgressProps {
    transfer: TransferItem;
    onPause?: () => void;
    onResume?: () => void;
    onCancel?: () => void;
    onRetry?: () => void;
}

const TransferProgress: React.FC<TransferProgressProps> = ({
    transfer,
    onPause,
    onResume,
    onCancel,
    onRetry,
}) => {
    const progressAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animate progress bar
        Animated.timing(progressAnim, {
            toValue: transfer.progress / 100,
            duration: 200,
            useNativeDriver: false,
        }).start();

        // Pulse animation when transferring
        if (transfer.status === 'transferring') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.05,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [transfer.progress, transfer.status]);

    const getFileIcon = (): { name: string; color: string } => {
        switch (transfer.file.type) {
            case 'image':
                return { name: 'image', color: '#22C55E' };
            case 'video':
                return { name: 'videocam', color: '#EF4444' };
            case 'audio':
                return { name: 'musical-notes', color: '#A855F7' };
            case 'document':
                return { name: 'document-text', color: '#3B82F6' };
            case 'app':
                return { name: 'cube', color: '#F59E0B' };
            default:
                return { name: 'folder', color: '#71717A' };
        }
    };

    const getStatusColor = (): string => {
        switch (transfer.status) {
            case 'completed':
                return '#22C55E';
            case 'failed':
            case 'cancelled':
                return '#EF4444';
            case 'paused':
                return '#EAB308';
            case 'transferring':
                return theme.colors.primary;
            default:
                return theme.colors.textMuted;
        }
    };

    const getStatusText = (): string => {
        switch (transfer.status) {
            case 'queued':
                return 'Waiting...';
            case 'connecting':
                return 'Connecting...';
            case 'transferring':
                const remaining = transfer.speed > 0
                    ? (transfer.file.size - transfer.bytesTransferred) / transfer.speed
                    : 0;
                return `${formatTime(remaining)} remaining`;
            case 'paused':
                return 'Paused';
            case 'completed':
                return 'Completed';
            case 'failed':
                return transfer.error || 'Failed';
            case 'cancelled':
                return 'Cancelled';
            default:
                return '';
        }
    };

    const fileIcon = getFileIcon();
    const statusColor = getStatusColor();

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
                colors={[theme.colors.bgCard, theme.colors.bgCardHover]}
                style={styles.gradient}
            >
                {/* Direction Arrow */}
                <View style={[
                    styles.directionBadge,
                    { backgroundColor: transfer.direction === 'send' ? '#F59E0B20' : '#22C55E20' }
                ]}>
                    <Ionicons
                        name={transfer.direction === 'send' ? 'arrow-up' : 'arrow-down'}
                        size={16}
                        color={transfer.direction === 'send' ? '#F59E0B' : '#22C55E'}
                    />
                </View>

                {/* File Icon */}
                <View style={[styles.iconContainer, { backgroundColor: `${fileIcon.color}20` }]}>
                    <Ionicons name={fileIcon.name as any} size={28} color={fileIcon.color} />
                </View>

                {/* File Info */}
                <View style={styles.info}>
                    <Text style={styles.fileName} numberOfLines={1}>
                        {transfer.file.name}
                    </Text>

                    <View style={styles.statsRow}>
                        <Text style={styles.fileSize}>
                            {formatFileSize(transfer.bytesTransferred)} / {formatFileSize(transfer.file.size)}
                        </Text>
                        {transfer.status === 'transferring' && (
                            <>
                                <View style={styles.dot} />
                                <Text style={styles.speed}>
                                    {formatSpeed(transfer.speed)}
                                </Text>
                            </>
                        )}
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBg}>
                            <Animated.View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%'],
                                        }),
                                        backgroundColor: statusColor,
                                    }
                                ]}
                            />
                            {/* Shine effect */}
                            {transfer.status === 'transferring' && (
                                <View style={styles.progressShine} />
                            )}
                        </View>
                        <Text style={[styles.percentage, { color: statusColor }]}>
                            {Math.round(transfer.progress)}%
                        </Text>
                    </View>

                    {/* Status */}
                    <Text style={[styles.status, { color: statusColor }]}>
                        {getStatusText()}
                    </Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    {transfer.status === 'transferring' && onPause && (
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onPause}
                        >
                            <Ionicons name="pause" size={20} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                    )}

                    {transfer.status === 'paused' && onResume && (
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onResume}
                        >
                            <Ionicons name="play" size={20} color="#22C55E" />
                        </TouchableOpacity>
                    )}

                    {transfer.status === 'failed' && onRetry && (
                        <TouchableOpacity
                            style={styles.actionBtn}
                            onPress={onRetry}
                        >
                            <Ionicons name="refresh" size={20} color="#F59E0B" />
                        </TouchableOpacity>
                    )}

                    {transfer.status === 'completed' && (
                        <View style={[styles.actionBtn, styles.completedIcon]}>
                            <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                        </View>
                    )}

                    {(transfer.status === 'transferring' ||
                        transfer.status === 'paused' ||
                        transfer.status === 'queued') && onCancel && (
                            <TouchableOpacity
                                style={styles.actionBtn}
                                onPress={onCancel}
                            >
                                <Ionicons name="close" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        )}
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        overflow: 'hidden',
        marginVertical: 6,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    directionBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        flex: 1,
        marginRight: 40,
    },
    fileName: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text,
        marginBottom: 4,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    fileSize: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.textMuted,
    },
    speed: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    progressBg: {
        flex: 1,
        height: 6,
        backgroundColor: theme.colors.bgTertiary,
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressShine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    percentage: {
        fontSize: 12,
        fontWeight: '700',
        minWidth: 36,
        textAlign: 'right',
    },
    status: {
        fontSize: 11,
        marginTop: 4,
        fontWeight: '500',
    },
    actions: {
        flexDirection: 'column',
        gap: 4,
    },
    actionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.bgTertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    completedIcon: {
        backgroundColor: 'transparent',
    },
});

export default TransferProgress;
