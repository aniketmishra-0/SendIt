import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import { QRScanner } from '../components/QRScanner';

interface Props {
    onCreateRoom: () => void;
    onJoinRoom: (code: string) => void;
}

const { width, height } = Dimensions.get('window');

export const HomeScreen: React.FC<Props> = ({ onCreateRoom, onJoinRoom }) => {
    const [joinCode, setJoinCode] = useState('');
    const [showScanner, setShowScanner] = useState(false);
    const insets = useSafeAreaInsets();

    const handleJoinRoom = () => {
        if (joinCode.length === 6) {
            onJoinRoom(joinCode.toUpperCase());
        }
    };

    const handleScanResult = (code: string) => {
        setJoinCode(code);
        onJoinRoom(code);
    };

    return (
        <View style={styles.container}>
            {/* Animated Background Orbs */}
            <View style={styles.backgroundEffects}>
                <LinearGradient
                    colors={[theme.colors.primaryGlow, 'transparent']}
                    style={[styles.orb, styles.orb1]}
                />
                <LinearGradient
                    colors={[theme.colors.accentGlow, 'transparent']}
                    style={[styles.orb, styles.orb2]}
                />
                <LinearGradient
                    colors={['rgba(59, 130, 246, 0.2)', 'transparent']}
                    style={[styles.orb, styles.orb3]}
                />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingTop: insets.top + 10, paddingBottom: insets.bottom + 20 }
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
                                style={styles.logoIcon}
                            >
                                <Ionicons name="send" size={28} color="white" />
                            </LinearGradient>
                            <Text style={styles.logoText}>SendIt</Text>
                        </View>

                        <View style={styles.badges}>
                            <View style={[styles.badge, styles.badgeSecure]}>
                                <Ionicons name="shield-checkmark" size={12} color={theme.colors.success} />
                                <Text style={styles.badgeTextSecure}>Secure</Text>
                            </View>
                        </View>
                    </View>

                    {/* Main Content */}
                    <View style={styles.content}>
                        <Text style={styles.title}>Share Files{'\n'}Instantly</Text>
                        <Text style={styles.subtitle}>
                            Transfer photos, videos, files & apps between any device
                        </Text>

                        {/* Create Room Card */}
                        <TouchableOpacity
                            style={styles.card}
                            onPress={onCreateRoom}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={[theme.colors.primary, theme.colors.accent]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.createRoomGradient}
                            >
                                <View style={styles.createRoomContent}>
                                    <View style={styles.createRoomIcon}>
                                        <Ionicons name="add-circle" size={32} color="white" />
                                    </View>
                                    <View style={styles.createRoomText}>
                                        <Text style={styles.createRoomTitle}>Create Room</Text>
                                        <Text style={styles.createRoomDescription}>
                                            Get a code to share with others
                                        </Text>
                                    </View>
                                    <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.8)" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or join a room</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Join Room Section */}
                        <View style={styles.joinSection}>
                            {/* Scan QR Button */}
                            <TouchableOpacity
                                style={styles.scanButton}
                                onPress={() => setShowScanner(true)}
                                activeOpacity={0.8}
                            >
                                <View style={styles.scanButtonContent}>
                                    <View style={styles.scanIcon}>
                                        <Ionicons name="qr-code" size={24} color={theme.colors.primary} />
                                    </View>
                                    <View style={styles.scanTextContainer}>
                                        <Text style={styles.scanTitle}>Scan QR Code</Text>
                                        <Text style={styles.scanDescription}>Quick way to join</Text>
                                    </View>
                                    <Ionicons name="camera" size={22} color={theme.colors.textMuted} />
                                </View>
                            </TouchableOpacity>

                            <Text style={styles.orText}>or enter code manually</Text>

                            {/* Code Input */}
                            <View style={styles.codeInputContainer}>
                                <TextInput
                                    style={styles.codeInput}
                                    value={joinCode}
                                    onChangeText={(text) => setJoinCode(text.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                                    placeholder="ABC123"
                                    placeholderTextColor={theme.colors.textMuted}
                                    maxLength={6}
                                    autoCapitalize="characters"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={[styles.joinButton, joinCode.length !== 6 && styles.joinButtonDisabled]}
                                    onPress={handleJoinRoom}
                                    disabled={joinCode.length !== 6}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={joinCode.length === 6
                                            ? [theme.colors.primary, theme.colors.accent]
                                            : [theme.colors.bgCard, theme.colors.bgCard]}
                                        style={styles.joinButtonGradient}
                                    >
                                        <Ionicons
                                            name="arrow-forward"
                                            size={22}
                                            color={joinCode.length === 6 ? 'white' : theme.colors.textMuted}
                                        />
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Features */}
                        <View style={styles.features}>
                            <View style={styles.featureItem}>
                                <View style={[styles.featureIcon, { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                                    <Ionicons name="images" size={18} color="#22c55e" />
                                </View>
                                <Text style={styles.featureText}>Photos</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <View style={[styles.featureIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                    <Ionicons name="videocam" size={18} color="#ef4444" />
                                </View>
                                <Text style={styles.featureText}>Videos</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <View style={[styles.featureIcon, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                                    <Ionicons name="document" size={18} color="#3b82f6" />
                                </View>
                                <Text style={styles.featureText}>Files</Text>
                            </View>
                            <View style={styles.featureItem}>
                                <View style={[styles.featureIcon, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                                    <Ionicons name="apps" size={18} color="#EF4444" />
                                </View>
                                <Text style={styles.featureText}>Apps</Text>
                            </View>
                        </View>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <View style={styles.privacyBadge}>
                            <Ionicons name="lock-closed" size={12} color={theme.colors.success} />
                            <Text style={styles.footerText}>
                                Your files never touch our servers
                            </Text>
                        </View>
                        <Text style={styles.platformText}>
                            Works on Android • iOS • Windows • Mac • Web
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* QR Scanner Modal */}
            <QRScanner
                visible={showScanner}
                onClose={() => setShowScanner(false)}
                onScan={handleScanResult}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.bgDark,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        minHeight: height,
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
        borderRadius: 9999,
    },
    orb1: {
        width: 300,
        height: 300,
        top: -100,
        right: -80,
        opacity: 0.5,
    },
    orb2: {
        width: 280,
        height: 280,
        bottom: -80,
        left: -80,
        opacity: 0.4,
    },
    orb3: {
        width: 200,
        height: 200,
        top: '40%',
        left: '50%',
        marginLeft: -100,
        opacity: 0.3,
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    logoIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 22,
        fontWeight: '800',
        color: theme.colors.textPrimary,
    },
    badges: {
        flexDirection: 'row',
        gap: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 20,
    },
    badgeSecure: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
    },
    badgeTextSecure: {
        fontSize: 11,
        fontWeight: '600',
        color: theme.colors.success,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: theme.colors.textPrimary,
        lineHeight: 40,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: 24,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    createRoomGradient: {
        padding: 16,
    },
    createRoomContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    createRoomIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    createRoomText: {
        flex: 1,
    },
    createRoomTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white',
    },
    createRoomDescription: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
        gap: 12,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.glassBorder,
    },
    dividerText: {
        fontSize: 12,
        color: theme.colors.textMuted,
        fontWeight: '500',
    },
    joinSection: {
        gap: 12,
    },
    scanButton: {
        backgroundColor: theme.colors.bgCard,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
        overflow: 'hidden',
    },
    scanButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        gap: 12,
    },
    scanIcon: {
        width: 44,
        height: 44,
        borderRadius: 10,
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanTextContainer: {
        flex: 1,
    },
    scanTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.textPrimary,
    },
    scanDescription: {
        fontSize: 12,
        color: theme.colors.textMuted,
    },
    orText: {
        textAlign: 'center',
        fontSize: 11,
        color: theme.colors.textMuted,
        marginVertical: 4,
    },
    codeInputContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    codeInput: {
        flex: 1,
        height: 52,
        backgroundColor: theme.colors.bgCard,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: theme.colors.glassBorder,
        paddingHorizontal: 16,
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.textPrimary,
        letterSpacing: 5,
        textAlign: 'center',
    },
    joinButton: {
        width: 52,
        height: 52,
        borderRadius: 14,
        overflow: 'hidden',
    },
    joinButtonDisabled: {
        opacity: 0.5,
    },
    joinButtonGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 24,
        paddingVertical: 14,
        backgroundColor: theme.colors.bgCard,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.glassBorder,
    },
    featureItem: {
        alignItems: 'center',
        gap: 6,
    },
    featureIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 10,
        fontWeight: '600',
        color: theme.colors.textSecondary,
    },
    footer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
        gap: 8,
    },
    privacyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderRadius: 20,
    },
    footerText: {
        fontSize: 11,
        color: theme.colors.textSecondary,
    },
    platformText: {
        fontSize: 10,
        color: theme.colors.textMuted,
    },
});

export default HomeScreen;
