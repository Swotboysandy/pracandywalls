import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import { Wallpaper } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface WallpaperCardProps {
    wallpaper: Wallpaper;
    index: number;
}

export function WallpaperCard({ wallpaper, index }: WallpaperCardProps) {
    const { currentTheme, toggleFavorite, isFavorite } = useStore();
    const [imageHeight, setImageHeight] = useState(250);
    const favorite = isFavorite(wallpaper.id);

    const handleImageLoad = (event: any) => {
        if (event.source?.width && event.source?.height) {
            const aspectRatio = event.source.height / event.source.width;
            setImageHeight(CARD_WIDTH * aspectRatio);
        }
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(index * 50).springify()}
            style={[styles.container, { height: imageHeight }]}
        >
            <Link href={`/image/${wallpaper.id}`} asChild>
                <TouchableOpacity activeOpacity={0.9}>
                    <Image
                        source={{ uri: wallpaper.url }}
                        style={[styles.image, { height: imageHeight }]}
                        contentFit="cover"
                        transition={300}
                        onLoad={handleImageLoad}
                    />

                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.gradient}
                    />

                    {/* Category Badge */}
                    {wallpaper.category && (
                        <View style={[styles.categoryBadge, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                            <Animated.Text
                                entering={FadeIn.delay(index * 50 + 200)}
                                style={styles.categoryText}
                            >
                                {wallpaper.category}
                            </Animated.Text>
                        </View>
                    )}

                    {/* Premium Badge */}
                    {wallpaper.isPremium && (
                        <View style={styles.premiumBadge}>
                            <Ionicons name="diamond" size={14} color="#FFD700" />
                        </View>
                    )}

                    {/* Stats */}
                    <View style={styles.stats}>
                        {wallpaper.views !== undefined && (
                            <View style={styles.statItem}>
                                <Ionicons name="eye-outline" size={14} color="#FFF" />
                                <Animated.Text style={styles.statText}>
                                    {formatNumber(wallpaper.views)}
                                </Animated.Text>
                            </View>
                        )}
                        {wallpaper.downloads !== undefined && (
                            <View style={styles.statItem}>
                                <Ionicons name="download-outline" size={14} color="#FFF" />
                                <Animated.Text style={styles.statText}>
                                    {formatNumber(wallpaper.downloads)}
                                </Animated.Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </Link>

            {/* Favorite Button */}
            <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(wallpaper)}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={favorite ? 'heart' : 'heart-outline'}
                    size={22}
                    color={favorite ? '#FF375F' : '#FFF'}
                />
            </TouchableOpacity>
        </Animated.View>
    );
}

const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
    },
    image: {
        width: '100%',
        borderRadius: 16,
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    categoryBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    categoryText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    premiumBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    stats: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        flexDirection: 'row',
        gap: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
