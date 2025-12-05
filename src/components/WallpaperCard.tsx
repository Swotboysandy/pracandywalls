import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors } from '../theme/colors';
import { Wallpaper } from '../types';

interface Props {
    wallpaper: Wallpaper;
    index: number;
}

const WallpaperCard = ({ wallpaper, index }: Props) => {
    // Random height aspect ratio for masonry feel (between 1.2 and 1.6)
    // In a real app, we should get dimensions from the server/metadata.
    // For now, we simulate aspect ratio based on ID hash or just random if unknown.
    // Since we don't have dimensions, we'll use a fixed height or standard aspect.
    // Actually, 'instimage' likely has variable sized images.
    // We'll set a min height.

    const aspectRatio = 0.75 + (index % 3) * 0.1; // purely for masonry variance if needed, 
    // but better to let the image determine size if possible, or fixed grid.
    // Masonry usually implies variable height.
    // Let's use a dynamic height based on index to fake it nicely.
    const height = 200 + (index % 5) * 40;

    return (
        <Link href={`/image/${wallpaper.id}`} asChild>
            <Pressable style={styles.container}>
                <Animated.View entering={FadeIn.delay(index * 50)} style={[styles.card, { height }]}>
                    <Image
                        source={{ uri: wallpaper.url }}
                        style={styles.image}
                        contentFit="cover"
                        transition={500}
                        cachePolicy="memory-disk"
                    />
                    <View style={styles.overlay}>
                        <Text style={styles.title} numberOfLines={1}>{wallpaper.name}</Text>
                    </View>
                </Animated.View>
            </Pressable>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        marginHorizontal: 4,
        flex: 1,
    },
    card: {
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: Colors.dark.surface,
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    title: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        fontFamily: 'System',
    }
});

export default memo(WallpaperCard);
