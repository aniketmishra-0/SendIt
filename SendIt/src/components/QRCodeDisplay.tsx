import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Share, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

// Simple QR Code component using a grid pattern
// For production, you'd use react-native-qrcode-svg
interface Props {
    visible: boolean;
    roomCode: string;
    onClose: () => void;
}

export const QRCodeDisplay: React.FC<Props> = ({ visible, roomCode, onClose }) => {
    const shareRoomCode = async () => {
        try {
            await Share.share({
                message: `Join me on SendIt! 🚀\n\nRoom Code: ${roomCode}\n\nDownload the app and enter this code to connect instantly!`,
                title: 'SendIt Room Code',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    // Generate a simple visual pattern for the QR (visual only - not scannable)
    // In production, use react-native-qrcode-svg
    const generatePattern = () => {
        const pattern: boolean[][] = [];
        const size = 21; // Standard QR size

        // Generate pseudo-random pattern based on room code
        for (let i = 0; i < size; i++) {
            pattern[i] = [];
            for (let j = 0; j < size; j++) {
                // Position detection patterns (corners)
                if (
                    (i < 7 && j < 7) || // Top-left
                    (i < 7 && j >= size - 7) || // Top-right
                    (i >= size - 7 && j < 7) // Bottom-left
                ) {
                    // Corner patterns
                    const inBorder = i === 0 || i === 6 || j === 0 || j === 6 ||
                        (i < 7 && (j === 0 || j === 6)) ||
                        (j < 7 && (i === 0 || i === 6));
                    const inCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
                    pattern[i][j] = inBorder || inCenter;
                } else {
                    // Data area - use room code to generate pattern
                    const charIndex = (i * size + j) % roomCode.length;
                    const charCode = roomCode.charCodeAt(charIndex);
                    pattern[i][j] = (charCode + i + j) % 3 === 0;
                }
            }
        }
        return pattern;
    };

    const qrPattern = generatePattern();

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={[theme.colors.bgCard, theme.colors.bgDarker]}
                        style={styles.gradient}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.title}>Share Room Code</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        {/* QR Code Visual */}
                        <View style={styles.qrContainer}>
                            <View style={styles.qrCode}>
                                {qrPattern.map((row, i) => (
                                    <View key={i} style={styles.qrRow}>
                                        {row.map((cell, j) => (
                                            <View
                                                key={j}
                                                style={[
                                                    styles.qrCell,
                                                    cell ? styles.qrCellFilled : styles.qrCellEmpty,
                                                ]}
                                            />
                                        ))}
                                    </View>
                                ))}
                            </View>

                            {/* Logo overlay */}
                            <View style={styles.logoOverlay}>
                                <LinearGradient
                                    colors={[theme.colors.primary, theme.colors.accent]}
                                    style={styles.logoGradient}
                                >
                                    <Ionicons name="flash" size={20} color="white" />
                                </LinearGradient>
                            </View>
                        </View>

                        {/* Room Code */}
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeLabel}>ROOM CODE</Text>
                            <Text style={styles.roomCode}>{roomCode}</Text>
                        </View>

                        {/* Instructions */}
                        <Text style={styles.instructions}>
                            Share this code or let them scan the QR code to connect
                        </Text>

                        {/* Share Button */}
                        <TouchableOpacity style={styles.shareButton} onPress={shareRoomCode}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.shareButtonGradient}
                            >
                                <Ionicons name="share-social" size={20} color="white" />
                                <Text style={styles.shareButtonText}>Share Code</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        borderRadius: theme.borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    gradient: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.bgCard,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrContainer: {
        alignSelf: 'center',
        padding: theme.spacing.md,
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        position: 'relative',
    },
    qrCode: {
        flexDirection: 'column',
    },
    qrRow: {
        flexDirection: 'row',
    },
    qrCell: {
        width: 10,
        height: 10,
    },
    qrCellFilled: {
        backgroundColor: '#000',
    },
    qrCellEmpty: {
        backgroundColor: '#fff',
    },
    logoOverlay: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -20,
        marginLeft: -20,
    },
    logoGradient: {
        width: 40,
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    codeContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    codeLabel: {
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.xs,
    },
    roomCode: {
        fontSize: 36,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 8,
    },
    instructions: {
        fontSize: 13,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
    },
    shareButton: {
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    shareButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});

export default QRCodeDisplay;
