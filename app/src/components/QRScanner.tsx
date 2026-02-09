import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

interface Props {
    visible: boolean;
    onClose: () => void;
    onScan: (code: string) => void;
}

const { width } = Dimensions.get('window');
const SCANNER_SIZE = width * 0.7;

export const QRScanner: React.FC<Props> = ({ visible, onClose, onScan }) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        if (visible) {
            setScanned(false);
        }
    }, [visible]);

    const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (scanned) return;

        // Check if it's a SendIt QR code
        if (data.startsWith('SENDIT:')) {
            const code = data.replace('SENDIT:', '');
            if (code.length === 6) {
                setScanned(true);
                onScan(code);
                onClose();
            }
        } else if (data.length === 6 && /^[A-Z0-9]+$/.test(data)) {
            // Direct room code
            setScanned(true);
            onScan(data);
            onClose();
        }
    };

    if (!permission) {
        return null;
    }

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {!permission.granted ? (
                    <View style={styles.permissionContainer}>
                        <Ionicons name="camera-outline" size={64} color={theme.colors.textMuted} />
                        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
                        <Text style={styles.permissionText}>
                            We need camera access to scan QR codes for quick room joining
                        </Text>
                        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                            <Text style={styles.permissionButtonText}>Grant Permission</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <CameraView
                            style={StyleSheet.absoluteFillObject}
                            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                            barcodeScannerSettings={{
                                barcodeTypes: ['qr'],
                            }}
                        />

                        {/* Overlay */}
                        <View style={styles.overlay}>
                            {/* Top */}
                            <View style={styles.overlayTop}>
                                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                    <Ionicons name="close" size={28} color="white" />
                                </TouchableOpacity>
                                <Text style={styles.title}>Scan QR Code</Text>
                                <View style={{ width: 44 }} />
                            </View>

                            {/* Middle with scanner frame */}
                            <View style={styles.overlayMiddle}>
                                <View style={styles.overlayLeft} />
                                <View style={styles.scannerFrame}>
                                    {/* Corner markers */}
                                    <View style={[styles.corner, styles.cornerTL]} />
                                    <View style={[styles.corner, styles.cornerTR]} />
                                    <View style={[styles.corner, styles.cornerBL]} />
                                    <View style={[styles.corner, styles.cornerBR]} />
                                </View>
                                <View style={styles.overlayRight} />
                            </View>

                            {/* Bottom */}
                            <View style={styles.overlayBottom}>
                                <Text style={styles.instructions}>
                                    Point your camera at a SendIt QR code
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.bgDark,
    },
    permissionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.lg,
        marginBottom: theme.spacing.sm,
    },
    permissionText: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    permissionButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    cancelButton: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
    },
    cancelButtonText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayTop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingTop: 50,
        paddingHorizontal: theme.spacing.md,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginTop: 10,
    },
    overlayMiddle: {
        flexDirection: 'row',
    },
    overlayLeft: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    overlayRight: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    scannerFrame: {
        width: SCANNER_SIZE,
        height: SCANNER_SIZE,
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: 30,
        height: 30,
        borderColor: theme.colors.primary,
    },
    cornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 8,
    },
    cornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 8,
    },
    cornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 8,
    },
    cornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 8,
    },
    overlayBottom: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
    },
    instructions: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
    },
});

export default QRScanner;
