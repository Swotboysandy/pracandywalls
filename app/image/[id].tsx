import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import * as IntentLauncher from 'expo-intent-launcher';
import * as MediaLibrary from 'expo-media-library';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

        // Cast FileSystem to any to avoid TS error if types are missing
        const fs = FileSystem as any;
        if (!fs.documentDirectory) {
            Alert.alert('Error', 'Device storage not available.');
            return;
        }

        setDownloading(true);
        try {
            const fileUri = fs.documentDirectory + wallpaper.name + '.jpg';
            const { uri } = await FileSystem.downloadAsync(wallpaper.url, fileUri);
            await MediaLibrary.createAssetAsync(uri);

            // Track download
            const { markDownloaded } = useStore.getState();
            markDownloaded(wallpaper.id);

            Alert.alert('Saved!', 'Wallpaper saved to your gallery.');
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to download image.');
        } finally {
            setDownloading(false);
        }
    };

    const handleSetWallpaper = async () => {
        const fs = FileSystem as any;
        if (!wallpaper || !fs.documentDirectory) return;

        setDownloading(true);
        try {
            const fileUri = fs.documentDirectory + wallpaper.name + '.jpg';
            const { uri } = await FileSystem.downloadAsync(wallpaper.url, fileUri);

            if (Platform.OS === 'android') {
                const contentUri = await FileSystem.getContentUriAsync(uri);
                await IntentLauncher.startActivityAsync('android.intent.action.ATTACH_DATA', {
                    data: contentUri,
                    type: 'image/*',
                    flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                });
            } else {
                await Sharing.shareAsync(uri);
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Could not set wallpaper. Please download and set manually.');
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
                        {downloading ? <ActivityIndicator color="black" /> : <Text style={styles.btnText}>Download</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSetWallpaper} style={[styles.mainButton, { backgroundColor: Colors.dark.secondary }]}>
                        <Text style={styles.btnText}>Set Wall</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    },
    btnText: {
        color: '#000',
        fontWeight: '700',
        fontSize: 16,
    }
});
