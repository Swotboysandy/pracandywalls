import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, NativeModules, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { colors } from '../../src/theme/colors';

const { width, height } = Dimensions.get('window');
const { WallpaperModule } = NativeModules;

export default function ImageScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { wallpapers, toggleFavorite, favorites } = useStore();
    const wallpaper = wallpapers.find(w => w.id === id) || favorites.find(f => f.id === id);

    const [downloading, setDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState('');
    const [previewVisible, setPreviewVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);

    // SUCCESS UI COMPONENT
    const renderSuccessOverlay = () => {
        if (!successVisible) return null;
        return (
            <View style={[StyleSheet.absoluteFill, { zIndex: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                <View style={{ width: 180, height: 180, backgroundColor: '#1A1A1A', borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 10, borderWidth: 1, borderColor: '#333' }}>
                    <Ionicons name="checkmark-circle" size={64} color={colors.accent} />
                    <Text style={{ color: 'white', marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>Success!</Text>
                    <Text style={{ color: '#888', marginTop: 4, fontSize: 14 }}>Wallpaper Updated</Text>
                </View>
            </View>
        );
    };

    // PREVIEW UI COMPONENTS
    const renderPreviewOverlay = () => {
        if (!previewVisible) return null;
        return (
            <View style={[StyleSheet.absoluteFill, { zIndex: 100, justifyContent: 'space-between' }]}>
                {/* Status Bar / Clock Area */}
                <View style={{ paddingTop: 60, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 4 }}>12:00</Text>
                    <View style={{ flexDirection: 'row', gap: 6 }}>
                        <Ionicons name="wifi" size={16} color="white" />
                        <Ionicons name="battery-full" size={16} color="white" />
                    </View>
                </View>

                {/* Simulated Home Screen Icons */}
                <View style={{ marginBottom: 200, flexDirection: 'row', justifyContent: 'space-evenly', width: '100%', paddingHorizontal: 20 }}>
                    {[1, 2, 3, 4, 5].map(i => (
                        <View key={i} style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
                    ))}
                </View>

                {/* Action Buttons Bottom Sheet */}
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#111', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 }}>
                    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>Set Wallpaper</Text>

                    {downloading ? (
                        <View style={{ padding: 30, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={colors.accent} />
                            <Text style={{ color: '#888', marginTop: 10 }}>Applied...</Text>
                        </View>
                    ) : (
                        <View style={{ gap: 12 }}>
                            <TouchableOpacity onPress={() => confirmSetWallpaper('home')} style={styles.optionButton}>
                                <Ionicons name="home-outline" size={20} color="white" style={{ marginRight: 10 }} />
                                <Text style={styles.optionText}>Home Screen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmSetWallpaper('lock')} style={styles.optionButton}>
                                <Ionicons name="lock-closed-outline" size={20} color="white" style={{ marginRight: 10 }} />
                                <Text style={styles.optionText}>Lock Screen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmSetWallpaper('both')} style={styles.optionButton}>
                                <Ionicons name="phone-portrait-outline" size={20} color="white" style={{ marginRight: 10 }} />
                                <Text style={styles.optionText}>Both Screens</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setPreviewVisible(false)} style={[styles.optionButton, { backgroundColor: '#222', marginTop: 8 }]}>
                                <Text style={[styles.optionText, { color: '#FF4444' }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const pinch = Gesture.Pinch()
        .onUpdate((e) => {
            scale.value = savedScale.value * e.scale;
        })
        .onEnd(() => {
            if (scale.value < 1) {
                scale.value = withSpring(1);
            }
            savedScale.value = scale.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const isFav = wallpaper ? favorites.some(f => f.id === wallpaper.id) : false;

    // DOWNLOAD: Uses standard Expo Share (Reliable fallback)
    const handleDownload = async () => {
        if (!wallpaper) return;
        setDownloading(true);
        setDownloadProgress('Starting...');

        try {
            const targetDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
            if (!targetDir) throw new Error('Storage unavailable on device');

            const filename = `wall_${wallpaper.id.replace(/[^a-z0-9]/gi, '_')}.jpg`;
            const fileUri = targetDir + filename;

            setDownloadProgress('Downloading...');

            try {
                const info = await FileSystem.getInfoAsync(fileUri);
                if (info.exists) await FileSystem.deleteAsync(fileUri);
            } catch { }

            const downloadRes = await FileSystem.downloadAsync(wallpaper.url, fileUri);

            if (downloadRes.status !== 200) throw new Error(`Download failed with status ${downloadRes.status}`);

            setDownloadProgress('Saving...');

            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadRes.uri, {
                    dialogTitle: 'Save to Gallery',
                    mimeType: 'image/jpeg',
                    UTI: 'public.jpeg'
                });
            } else {
                Alert.alert('Saved', 'Image saved to: ' + fileUri);
            }

        } catch (e: any) {
            console.error('Download Error:', e);
            Alert.alert('Download Error', e.message || 'Check your internet or storage permissions.');
        } finally {
            setDownloading(false);
            setDownloadProgress('');
        }
    };

    // 1. Trigger Preview
    const handleSetWallpaper = () => {
        setPreviewVisible(true);
    };

    // 2. Actually Set Wallpaper (Called from Preview)
    const confirmSetWallpaper = async (screenType: 'home' | 'lock' | 'both') => {
        if (!wallpaper) return;

        setDownloading(true); // Shows spinner in preview
        setDownloadProgress('Setting...');

        try {
            if (WallpaperModule) {
                console.log(`Setting wallpaper on ${screenType}...`);

                // Artificial delay to let the spinner show (feels better)
                await new Promise(r => setTimeout(r, 500));

                await WallpaperModule.setWallpaper(wallpaper.url, screenType);

                // Show Success UI
                setPreviewVisible(false);
                setSuccessVisible(true);

                // Hide Success UI after 2 seconds
                setTimeout(() => {
                    setSuccessVisible(false);
                }, 2000);

            } else {
                console.warn("WallpaperModule not found");
                Alert.alert('Error', 'Native Module not found. Please rebuild app.');
            }
        } catch (e: any) {
            console.error('Native Wallpaper Error:', e);
            Alert.alert('Error', 'Failed to set wallpaper: ' + e.message);
        } finally {
            setDownloading(false);
            setDownloadProgress('');
        }
    };

    if (!wallpaper) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Wallpaper not found</Text>
                <Link href="/" style={{ marginTop: 20, color: colors.accent }}>Go Back</Link>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Show Overlay if Preview Mode is ON */}
            {renderPreviewOverlay()}
            {renderSuccessOverlay()}

            <GestureDetector gesture={pinch}>
                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                    <Image
                        source={{ uri: wallpaper.url }}
                        style={styles.image}
                        contentFit={previewVisible ? "cover" : "contain"} // Cover when previewing (full bleed)
                        transition={300}
                    />
                </Animated.View>
            </GestureDetector>

            {/* Hide controls when preview is visible */}
            {!previewVisible && (
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View style={styles.actionRow}>
                        <TouchableOpacity onPress={() => toggleFavorite(wallpaper)} style={styles.iconButton}>
                            <Ionicons name={isFav ? "heart" : "heart-outline"} size={26} color={isFav ? "#FF375F" : "white"} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleDownload} style={styles.mainButton} disabled={downloading}>
                            {downloading && downloadProgress.includes('Download') ? (
                                <Text style={styles.btnText}>...</Text>
                            ) : (
                                <>
                                    <Ionicons name="download-outline" size={20} color="#000" style={{ marginRight: 6 }} />
                                    <Text style={styles.btnText}>Download</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleSetWallpaper} style={[styles.mainButton, { backgroundColor: colors.accent }]} disabled={downloading}>
                            {downloading && downloadProgress.includes('Setting') ? (
                                <Text style={styles.btnText}>...</Text>
                            ) : (
                                <>
                                    <Ionicons name="color-wand-outline" size={20} color="#000" style={{ marginRight: 6 }} />
                                    <Text style={styles.btnText}>Set Wall</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
    },
    imageContainer: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    controls: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        gap: 12,
    },
    iconButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainButton: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#E57697',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        flexDirection: 'row',
    },
    btnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 14,
    },
    optionButton: {
        height: 50,
        backgroundColor: '#333',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#444'
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    }
});
