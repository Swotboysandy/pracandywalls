import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Dimensions, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useStore } from '../../src/store/useStore';
import { Colors } from '../../src/theme/colors';

const { width, height } = Dimensions.get('window');

export default function ImageScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { wallpapers, toggleFavorite, favorites } = useStore();
    const wallpaper = wallpapers.find(w => w.id === id) || favorites.find(f => f.id === id);

    const [downloading, setDownloading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState('');

    // Animation values
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    // Pinch Gesture
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

    const handleDownload = async () => {
        if (!wallpaper) return;

        // Request Permission
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'We need storage permission to save wallpapers.');
            return;
        }

        const fs = FileSystem as any;
        if (!fs.documentDirectory) {
            Alert.alert('Error', 'Device storage not available.');
            return;
        }

        setDownloading(true);
        setDownloadProgress('Downloading...');
        try {
            const fileUri = fs.documentDirectory + wallpaper.id + '.jpg';
            const { uri } = await FileSystem.downloadAsync(wallpaper.url, fileUri);

            setDownloadProgress('Saving to gallery...');
            await MediaLibrary.createAssetAsync(uri);

            // Track download
            const { markDownloaded } = useStore.getState();
            markDownloaded(wallpaper.id);

            setDownloadProgress('');
            Alert.alert('✅ Downloaded!', 'Wallpaper saved to your gallery.', [
                { text: 'OK' },
                { text: 'Set as Wallpaper', onPress: () => setShowPreview(true) }
            ]);
        } catch (e) {
            console.error('Download error:', e);
            setDownloadProgress('');
            Alert.alert('Download Failed', 'Please check your internet connection and try again.');
        } finally {
            setDownloading(false);
        }
    };

    const handleSetWallpaper = async (option: 'home' | 'lock' | 'both') => {
        const fs = FileSystem as any;
        if (!wallpaper || !fs.documentDirectory) return;

        setShowPreview(false);
        setDownloading(true);
        setDownloadProgress('Preparing...');

        try {
            const fileUri = fs.documentDirectory + wallpaper.id + '.jpg';

            setDownloadProgress('Downloading...');
            const { uri } = await FileSystem.downloadAsync(wallpaper.url, fileUri);

            if (Platform.OS === 'android') {
                setDownloadProgress('Setting wallpaper...');
                const contentUri = await FileSystem.getContentUriAsync(uri);

                await IntentLauncher.startActivityAsync('android.intent.action.SET_WALLPAPER', {
                    data: contentUri,
                    type: 'image/jpeg',
                    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                    category: 'android.intent.category.DEFAULT',
                });

                setDownloadProgress('');
            } else {
                setDownloadProgress('Opening share...');
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/jpeg',
                    dialogTitle: 'Set as Wallpaper'
                });
                setDownloadProgress('');
            }
        } catch (e: any) {
            console.error('Set wallpaper error:', e);
            setDownloadProgress('');

            if (e.message?.includes('User cancelled')) {
                return;
            }

            Alert.alert('Could not set wallpaper', 'Please download the wallpaper and set it manually from your gallery.');
        } finally {
            setDownloading(false);
        }
    };

    if (!wallpaper) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'white' }}>Wallpaper not found</Text>
                <Link href="/" style={{ marginTop: 20, color: Colors.dark.primary }}>Go Back</Link>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <GestureDetector gesture={pinch}>
                <Animated.View style={[styles.imageContainer, animatedStyle]}>
                    <Image
                        source={{ uri: wallpaper.url }}
                        style={styles.image}
                        contentFit="contain"
                        transition={300}
                    />
                </Animated.View>
            </GestureDetector>

            {/* Controls Overlay */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>

                <View style={styles.actionRow}>
                    <TouchableOpacity onPress={() => toggleFavorite(wallpaper)} style={styles.iconButton}>
                        <Ionicons name={isFav ? "heart" : "heart-outline"} size={26} color={isFav ? Colors.dark.error : "white"} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDownload} style={styles.mainButton} disabled={downloading}>
                        {downloading && downloadProgress ? (
                            <Text style={styles.btnText}>{downloadProgress}</Text>
                        ) : (
                            <>
                                <Ionicons name="download-outline" size={20} color="#000" style={{ marginRight: 6 }} />
                                <Text style={styles.btnText}>Download</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowPreview(true)} style={[styles.mainButton, { backgroundColor: Colors.dark.secondary }]} disabled={downloading}>
                        <Ionicons name="color-wand-outline" size={20} color="#000" style={{ marginRight: 6 }} />
                        <Text style={styles.btnText}>Set Wall</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Preview Modal */}
            <Modal
                visible={showPreview}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowPreview(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Preview Wallpaper</Text>
                        <Text style={styles.modalSubtitle}>See how it will look on your device</Text>

                        {/* Device Preview */}
                        <View style={styles.previewContainer}>
                            <View style={styles.deviceFrame}>
                                <Image
                                    source={{ uri: wallpaper.url }}
                                    style={styles.previewImage}
                                    contentFit="cover"
                                />
                                {/* Simulated Status Bar */}
                                <View style={styles.statusBar}>
                                    <Text style={styles.statusTime}>12:30</Text>
                                </View>
                            </View>
                        </View>

                        <Text style={styles.optionTitle}>Set as:</Text>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSetWallpaper('home')}
                        >
                            <Ionicons name="home-outline" size={24} color={Colors.dark.primary} />
                            <Text style={styles.optionText}>Home Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSetWallpaper('lock')}
                        >
                            <Ionicons name="lock-closed-outline" size={24} color={Colors.dark.primary} />
                            <Text style={styles.optionText}>Lock Screen</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleSetWallpaper('both')}
                        >
                            <Ionicons name="layers-outline" size={24} color={Colors.dark.primary} />
                            <Text style={styles.optionText}>Both Screens</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowPreview(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        flexDirection: 'row',
    },
    btnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        backgroundColor: Colors.dark.surface,
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.dark.text,
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: Colors.dark.textSecondary,
        marginBottom: 20,
    },
    previewContainer: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    deviceFrame: {
        width: 180,
        height: 360,
        borderRadius: 25,
        overflow: 'hidden',
        borderWidth: 3,
        borderColor: '#333',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 30,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusTime: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 12,
        alignSelf: 'flex-start',
    },
    optionButton: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.dark.text,
        marginLeft: 12,
    },
    cancelButton: {
        marginTop: 10,
        padding: 12,
    },
    cancelText: {
        color: Colors.dark.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
});
