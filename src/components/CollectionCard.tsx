import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import { Collection } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

interface CollectionCardProps {
    collection: Collection;
    index: number;
    onPress: () => void;
}

export function CollectionCard({ collection, index, onPress }: CollectionCardProps) {
    const { currentTheme } = useStore();

    return (
        <Animated.View
            entering={FadeInUp.delay(index * 100).springify()}
            style={styles.container}
        >
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <Image
                    source={{ uri: collection.coverImage }}
                    style={styles.image}
                    contentFit="cover"
                    transition={300}
                />

                {/* Gradient Overlay */}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                />

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{collection.name}</Text>
                        {collection.isPremium && (
                            <View style={styles.premiumBadge}>
                                <Ionicons name="diamond" size={16} color="#FFD700" />
                                <Text style={styles.premiumText}>PRO</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.description} numberOfLines={2}>
                        {collection.description}
                    </Text>

                    <View style={styles.footer}>
                        <View style={styles.countBadge}>
                            <Ionicons name="images-outline" size={14} color="#FFF" />
                            <Text style={styles.countText}>
                                {collection.wallpapers.length} wallpapers
                            </Text>
                        </View>

                        <Text style={styles.updated}>
                            Updated {formatDate(collection.updatedAt)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}

const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return 'recently';
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: 200,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        backgroundColor: '#1A1A1A',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '70%',
    },
    content: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#FFF',
        flex: 1,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    premiumText: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '700',
    },
    description: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12,
        lineHeight: 20,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    countBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    countText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    updated: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 12,
    },
});
