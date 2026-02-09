import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Modal,
    FlatList,
    Image,
    Alert,
    Platform,
    Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Clipboard from 'expo-clipboard';
import { theme } from '../utils/theme';
import {
    formatFileSize,
    formatSpeed,
    p2pManager,
    FileTransfer,
    PeerInfo,
} from '../services/P2PService';
import { QRCodeDisplay } from '../components/QRCodeDisplay';

interface Props {
    roomCode: string;
    isHost: boolean;
    onLeave: () => void;
}

interface SelectedFile {
    id: string;
    name: string;
    size: number;
    uri: string;
    type: 'image' | 'video' | 'file' | 'app' | 'audio';
    thumbnail?: string;
    mimeType?: string;
}

type FileCategory = 'images' | 'videos' | 'files' | 'apps' | 'audio';

const FILE_CATEGORIES = [
    { id: 'images' as FileCategory, icon: 'images', label: 'Photos', color: '#22C55E' },
    { id: 'videos' as FileCategory, icon: 'videocam', label: 'Videos', color: '#EF4444' },
    { id: 'audio' as FileCategory, icon: 'musical-notes', label: 'Music', color: '#F59E0B' },
    { id: 'files' as FileCategory, icon: 'document', label: 'Files', color: '#3B82F6' },
    { id: 'apps' as FileCategory, icon: 'apps', label: 'Apps', color: '#EF4444' },
];

export const RoomScreen: React.FC<Props> = ({ roomCode, isHost, onLeave }) => {
    const insets = useSafeAreaInsets();
    const [isConnected, setIsConnected] = useState(false);
    const [peers, setPeers] = useState<PeerInfo[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
    const [transfers, setTransfers] = useState<FileTransfer[]>([]);
    const [showFilePicker, setShowFilePicker] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);
    const [activeCategory, setActiveCategory] = useState<FileCategory>('images');
    const [mediaAssets, setMediaAssets] = useState<MediaLibrary.Asset[]>([]);
    const [hasMediaPermission, setHasMediaPermission] = useState(false);

    useEffect(() => {
        // Request permissions on mount
        requestPermissions();

        // Simulate peer connection after 2 seconds
        const timer = setTimeout(() => {
            setIsConnected(true);
            const demoPeer: PeerInfo = {
                id: 'demo-peer',
                name: 'Connected Device',
                platform: Platform.OS === 'ios' ? 'iPhone' : 'Android',
            };
            setPeers([demoPeer]);
        }, 2000);

        p2pManager.onTransferUpdate((transfer) => {
            setTransfers((prev) => {
                const existing = prev.findIndex((t) => t.id === transfer.id);
                if (existing >= 0) {
                    const updated = [...prev];
                    updated[existing] = transfer;
                    return updated;
                }
                return [...prev, transfer];
            });
        });

        return () => {
            clearTimeout(timer);
            p2pManager.disconnect();
        };
    }, []);

    const requestPermissions = async () => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        setHasMediaPermission(status === 'granted');
        if (status === 'granted') {
            loadMediaAssets('images');
        }
    };

    const loadMediaAssets = async (category: FileCategory) => {
        try {
            let mediaType: MediaLibrary.MediaTypeValue[] = [];

            switch (category) {
                case 'images':
                    mediaType = [MediaLibrary.MediaType.photo];
                    break;
                case 'videos':
                    mediaType = [MediaLibrary.MediaType.video];
                    break;
                case 'audio':
                    mediaType = [MediaLibrary.MediaType.audio];
                    break;
                default:
                    return;
            }

            const { assets } = await MediaLibrary.getAssetsAsync({
                mediaType,
                first: 100,
                sortBy: MediaLibrary.SortBy.creationTime,
            });

            setMediaAssets(assets);
        } catch (error) {
            console.error('Error loading media:', error);
        }
    };

    const copyRoomCode = async () => {
        await Clipboard.setStringAsync(roomCode);
        Alert.alert('Copied!', 'Room code copied to clipboard');
    };

    const openFilePicker = (category: FileCategory) => {
        setActiveCategory(category);

        if (category === 'images' || category === 'videos' || category === 'audio') {
            loadMediaAssets(category);
            setShowFilePicker(true);
        } else if (category === 'files') {
            pickDocuments();
        } else if (category === 'apps') {
            pickApps();
        }
    };

    const pickDocuments = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets) {
                const files: SelectedFile[] = result.assets.map((asset, index) => ({
                    id: `file-${Date.now()}-${index}`,
                    name: asset.name,
                    size: asset.size || 0,
                    uri: asset.uri,
                    type: 'file',
                    mimeType: asset.mimeType,
                }));
                setSelectedFiles((prev) => [...prev, ...files]);
            }
        } catch (error) {
            console.error('Error picking files:', error);
        }
    };

    const pickApps = async () => {
        // On Android, we can let user pick APK files
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/vnd.android.package-archive',
                multiple: true,
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets) {
                const files: SelectedFile[] = result.assets.map((asset, index) => ({
                    id: `app-${Date.now()}-${index}`,
                    name: asset.name,
                    size: asset.size || 0,
                    uri: asset.uri,
                    type: 'app',
                    mimeType: asset.mimeType,
                }));
                setSelectedFiles((prev) => [...prev, ...files]);
            }
        } catch (error) {
            Alert.alert('Info', 'To share apps, select the APK file from your Downloads or file manager.');
        }
    };

    const selectMediaAsset = async (asset: MediaLibrary.Asset) => {
        const assetInfo = await MediaLibrary.getAssetInfoAsync(asset);

        const file: SelectedFile = {
            id: asset.id,
            name: asset.filename,
            size: assetInfo.fileSize as number || 0,
            uri: assetInfo.localUri || asset.uri,
            type: asset.mediaType === 'photo' ? 'image' : asset.mediaType === 'video' ? 'video' : 'audio',
            thumbnail: asset.uri,
        };

        // Check if already selected
        if (selectedFiles.find((f) => f.id === file.id)) {
            setSelectedFiles((prev) => prev.filter((f) => f.id !== file.id));
        } else {
            setSelectedFiles((prev) => [...prev, file]);
        }
    };

    const removeFile = (id: string) => {
        setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const sendFiles = async () => {
        if (!isConnected || selectedFiles.length === 0) return;

        for (const file of selectedFiles) {
            await p2pManager.sendFile('demo-peer', {
                name: file.name,
                size: file.size,
                uri: file.uri,
            });
        }

        setSelectedFiles([]);
        Alert.alert('Success', 'All files sent successfully!');
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image': return 'image';
            case 'video': return 'videocam';
            case 'audio': return 'musical-note';
            case 'app': return 'apps';
            default: return 'document';
        }
    };

    const getFileColor = (type: string) => {
        switch (type) {
            case 'image': return '#22C55E';
            case 'video': return '#EF4444';
            case 'audio': return '#F59E0B';
            case 'app': return '#EF4444';
            default: return '#3B82F6';
        }
    };

    const renderMediaItem = ({ item }: { item: MediaLibrary.Asset }) => {
        const isSelected = selectedFiles.some((f) => f.id === item.id);

        return (
            <TouchableOpacity
                style={[styles.mediaItem, isSelected && styles.mediaItemSelected]}
                onPress={() => selectMediaAsset(item)}
                activeOpacity={0.7}
            >
                <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
                {item.mediaType === 'video' && (
                    <View style={styles.videoIndicator}>
                        <Ionicons name="play" size={16} color="white" />
                        <Text style={styles.videoDuration}>
                            {Math.floor(item.duration / 60)}:{String(Math.floor(item.duration % 60)).padStart(2, '0')}
                        </Text>
                    </View>
                )}
                {isSelected && (
                    <View style={styles.selectedOverlay}>
                        <Ionicons name="checkmark-circle" size={32} color={theme.colors.primary} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Background */}
            <View style={styles.backgroundEffects}>
                <LinearGradient
                    colors={[theme.colors.primaryGlow, 'transparent']}
                    style={[styles.orb, styles.orb1]}
                />
                <LinearGradient
                    colors={[theme.colors.accentGlow, 'transparent']}
                    style={[styles.orb, styles.orb2]}
                />
            </View>

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <View style={styles.roomInfo}>
                    <Text style={styles.roomLabel}>ROOM CODE</Text>
                    <View style={styles.roomCodeRow}>
                        <Text style={styles.roomCode}>{roomCode}</Text>
                        <TouchableOpacity style={styles.copyButton} onPress={copyRoomCode}>
                            <Ionicons name="copy-outline" size={18} color={theme.colors.textSecondary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.qrButton} onPress={() => setShowQRCode(true)}>
                            <Ionicons name="qr-code" size={18} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={[styles.statusBadge, isConnected && styles.statusConnected]}>
                    <View style={[styles.statusDot, isConnected && styles.statusDotConnected]} />
                    <Text style={styles.statusText}>
                        {isConnected ? 'Connected' : 'Waiting...'}
                    </Text>
                </View>

                <TouchableOpacity style={styles.leaveButton} onPress={onLeave}>
                    <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {/* WiFi Speed Info */}
                <View style={styles.speedInfoCard}>
                    <View style={styles.speedIconContainer}>
                        <Ionicons name="wifi" size={24} color={theme.colors.success} />
                    </View>
                    <View style={styles.speedInfo}>
                        <Text style={styles.speedTitle}>Ultra-Fast Local WiFi</Text>
                        <Text style={styles.speedValue}>Up to 50 MB/s transfer speed</Text>
                    </View>
                    <View style={styles.speedBadge}>
                        <Ionicons name="flash" size={14} color={theme.colors.warning} />
                        <Text style={styles.speedBadgeText}>FAST</Text>
                    </View>
                </View>

                {/* Connected Peers */}
                {peers.length > 0 && (
                    <View style={styles.peerSection}>
                        {peers.map((peer) => (
                            <View key={peer.id} style={styles.peerCard}>
                                <View style={styles.peerIcon}>
                                    <Ionicons name="phone-portrait" size={24} color={theme.colors.success} />
                                </View>
                                <View style={styles.peerInfo}>
                                    <Text style={styles.peerName}>{peer.name}</Text>
                                    <Text style={styles.peerStatus}>Ready to receive</Text>
                                </View>
                                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                            </View>
                        ))}
                    </View>
                )}

                {/* File Categories */}
                <Text style={styles.sectionTitle}>SELECT FILES TO SEND</Text>
                <View style={styles.categoriesGrid}>
                    {FILE_CATEGORIES.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={styles.categoryCard}
                            onPress={() => openFilePicker(category.id)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={[`${category.color}20`, `${category.color}10`]}
                                style={styles.categoryGradient}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: `${category.color}30` }]}>
                                    <Ionicons name={category.icon as any} size={28} color={category.color} />
                                </View>
                                <Text style={styles.categoryLabel}>{category.label}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>SELECTED ({selectedFiles.length})</Text>
                            <TouchableOpacity onPress={() => setSelectedFiles([])}>
                                <Text style={styles.clearText}>Clear All</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectedScroll}>
                            {selectedFiles.map((file) => (
                                <View key={file.id} style={styles.selectedFileCard}>
                                    {file.thumbnail ? (
                                        <Image source={{ uri: file.thumbnail }} style={styles.selectedFileThumbnail} />
                                    ) : (
                                        <View style={[styles.selectedFileIcon, { backgroundColor: `${getFileColor(file.type)}20` }]}>
                                            <Ionicons name={getFileIcon(file.type) as any} size={24} color={getFileColor(file.type)} />
                                        </View>
                                    )}
                                    <Text style={styles.selectedFileName} numberOfLines={1}>{file.name}</Text>
                                    <Text style={styles.selectedFileSize}>{formatFileSize(file.size)}</Text>
                                    <TouchableOpacity
                                        style={styles.removeFileButton}
                                        onPress={() => removeFile(file.id)}
                                    >
                                        <Ionicons name="close-circle" size={20} color={theme.colors.danger} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.sendButton, !isConnected && styles.sendButtonDisabled]}
                            onPress={sendFiles}
                            disabled={!isConnected}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={isConnected ? [theme.colors.primary, theme.colors.accent] : ['#444', '#444']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.sendButtonGradient}
                            >
                                <Ionicons name="send" size={22} color="white" />
                                <Text style={styles.sendButtonText}>Send {selectedFiles.length} Files</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Active Transfers */}
                {transfers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>TRANSFERS</Text>
                        {transfers.map((transfer) => (
                            <View key={transfer.id} style={styles.transferItem}>
                                <View style={styles.transferHeader}>
                                    <View style={[styles.transferDirection,
                                    transfer.direction === 'send' ? styles.transferUpload : styles.transferDownload
                                    ]}>
                                        <Ionicons
                                            name={transfer.direction === 'send' ? 'arrow-up' : 'arrow-down'}
                                            size={16}
                                            color={transfer.direction === 'send' ? theme.colors.primary : theme.colors.accent}
                                        />
                                    </View>
                                    <View style={styles.transferInfo}>
                                        <Text style={styles.transferName} numberOfLines={1}>{transfer.fileName}</Text>
                                        <Text style={styles.transferStats}>
                                            {formatFileSize(transfer.fileSize)} • {formatSpeed(transfer.speed)}
                                        </Text>
                                    </View>
                                    {transfer.status === 'completed' && (
                                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                                    )}
                                </View>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            { width: `${transfer.progress}%` },
                                            transfer.status === 'completed' && styles.progressComplete
                                        ]}
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Media Picker Modal */}
            <Modal
                visible={showFilePicker}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowFilePicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setShowFilePicker(false)}>
                            <Ionicons name="close" size={28} color={theme.colors.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            Select {activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
                        </Text>
                        <TouchableOpacity onPress={() => setShowFilePicker(false)}>
                            <Text style={styles.modalDone}>Done ({selectedFiles.filter(f =>
                                (activeCategory === 'images' && f.type === 'image') ||
                                (activeCategory === 'videos' && f.type === 'video') ||
                                (activeCategory === 'audio' && f.type === 'audio')
                            ).length})</Text>
                        </TouchableOpacity>
                    </View>

                    {hasMediaPermission ? (
                        <FlatList
                            data={mediaAssets}
                            renderItem={renderMediaItem}
                            keyExtractor={(item) => item.id}
                            numColumns={3}
                            contentContainerStyle={styles.mediaGrid}
                            showsVerticalScrollIndicator={false}
                        />
                    ) : (
                        <View style={styles.permissionRequired}>
                            <Ionicons name="lock-closed" size={48} color={theme.colors.textMuted} />
                            <Text style={styles.permissionText}>Permission required to access media</Text>
                            <TouchableOpacity style={styles.permissionButton} onPress={requestPermissions}>
                                <Text style={styles.permissionButtonText}>Grant Permission</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
                <Ionicons name="shield-checkmark" size={14} color={theme.colors.success} />
                <Text style={styles.footerText}>End-to-end encrypted • No data stored</Text>
            </View>

            {/* QR Code Display Modal */}
            <QRCodeDisplay
                visible={showQRCode}
                roomCode={roomCode}
                onClose={() => setShowQRCode(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bgDark,
    },
    backgroundEffects: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    orb: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
    },
    orb1: {
        top: -100,
        right: -50,
        opacity: 0.3,
    },
    orb2: {
        bottom: 100,
        left: -100,
        opacity: 0.3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.glassBorder,
        backgroundColor: theme.colors.glassBg,
        gap: 10,
    },
    roomInfo: {
        flex: 1,
    },
    roomLabel: {
        fontSize: 10,
        fontWeight: '600',
        letterSpacing: 1,
        color: theme.colors.textMuted,
    },
    roomCodeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    roomCode: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.primary,
        letterSpacing: 3,
    },
    copyButton: {
        padding: 6,
    },
    qrButton: {
        padding: 6,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        borderRadius: theme.borderRadius.sm,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 6,
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.full,
    },
    statusConnected: {},
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.warning,
    },
    statusDotConnected: {
        backgroundColor: theme.colors.success,
    },
    statusText: {
        fontSize: 12,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    leaveButton: {
        padding: 10,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        borderRadius: theme.borderRadius.md,
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: theme.spacing.md,
        gap: theme.spacing.lg,
    },
    speedInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        gap: theme.spacing.md,
    },
    speedIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    speedInfo: {
        flex: 1,
    },
    speedTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.success,
    },
    speedValue: {
        fontSize: 12,
        color: theme.colors.textSecondary,
    },
    speedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        borderRadius: theme.borderRadius.full,
    },
    speedBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.warning,
    },
    peerSection: {
        gap: theme.spacing.sm,
    },
    peerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.md,
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        gap: theme.spacing.md,
    },
    peerIcon: {
        width: 44,
        height: 44,
        borderRadius: theme.borderRadius.md,
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    peerInfo: {
        flex: 1,
    },
    peerName: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    peerStatus: {
        fontSize: 12,
        color: theme.colors.success,
    },
    section: {
        gap: theme.spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        color: theme.colors.textMuted,
    },
    clearText: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '500',
    },
    categoriesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    categoryCard: {
        width: '31%',
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    categoryGradient: {
        padding: theme.spacing.md,
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    categoryIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    selectedScroll: {
        marginHorizontal: -theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
    },
    selectedFileCard: {
        width: 100,
        marginRight: theme.spacing.sm,
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        alignItems: 'center',
        position: 'relative',
    },
    selectedFileThumbnail: {
        width: 70,
        height: 70,
        borderRadius: theme.borderRadius.sm,
        marginBottom: theme.spacing.xs,
    },
    selectedFileIcon: {
        width: 70,
        height: 70,
        borderRadius: theme.borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    selectedFileName: {
        fontSize: 11,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    selectedFileSize: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
    removeFileButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: theme.colors.bgDark,
        borderRadius: 10,
    },
    sendButton: {
        marginTop: theme.spacing.sm,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingVertical: theme.spacing.md,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'white',
    },
    transferItem: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.bgCard,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    transferHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    transferDirection: {
        width: 32,
        height: 32,
        borderRadius: theme.borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transferUpload: {
        backgroundColor: 'rgba(0, 212, 255, 0.2)',
    },
    transferDownload: {
        backgroundColor: 'rgba(168, 85, 247, 0.2)',
    },
    transferInfo: {
        flex: 1,
    },
    transferName: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.textPrimary,
    },
    transferStats: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    progressBar: {
        height: 6,
        backgroundColor: theme.colors.bgDarker,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.full,
    },
    progressComplete: {
        backgroundColor: theme.colors.success,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: theme.colors.bgDark,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.md,
        paddingTop: 50,
        paddingBottom: theme.spacing.md,
        backgroundColor: theme.colors.glassBg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.glassBorder,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    modalDone: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.primary,
    },
    mediaGrid: {
        padding: 2,
    },
    mediaItem: {
        flex: 1 / 3,
        aspectRatio: 1,
        margin: 2,
        borderRadius: 4,
        overflow: 'hidden',
    },
    mediaItemSelected: {
        borderWidth: 3,
        borderColor: theme.colors.primary,
    },
    mediaThumbnail: {
        width: '100%',
        height: '100%',
    },
    videoIndicator: {
        position: 'absolute',
        bottom: 4,
        left: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    videoDuration: {
        fontSize: 11,
        color: 'white',
        fontWeight: '500',
    },
    selectedOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 212, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    permissionRequired: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    permissionText: {
        fontSize: 16,
        color: theme.colors.textSecondary,
    },
    permissionButton: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
    },
    permissionButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingTop: 12,
        backgroundColor: theme.colors.bgDark,
        borderTopWidth: 1,
        borderTopColor: theme.colors.glassBorder,
    },
    footerText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
});

export default RoomScreen;
