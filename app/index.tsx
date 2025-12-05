import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CategorySelector from '../src/components/CategorySelector';
import MasonryGrid from '../src/components/MasonryGrid';
import SearchBar from '../src/components/SearchBar';
import { useFirstLaunch } from '../src/hooks/useFirstLaunch';
import { useStore } from '../src/store/useStore';
import { Colors } from '../src/theme/colors';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { fetchWallpapers, filteredWallpapers, isLoading } = useStore();
    const wallpapers = filteredWallpapers();
    const { isFirstLaunch } = useFirstLaunch();
    const router = useRouter();

    useEffect(() => {
        fetchWallpapers();
    }, []);

    if (isFirstLaunch === null) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={Colors.dark.primary} />
            </View>
        );
    }

    if (isFirstLaunch === true) {
        return <Redirect href="/onboarding" />;
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.title}>PracandyWalls</Text>
                <TouchableOpacity onPress={() => router.push('/privacy')}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.dark.textSecondary} />
                </TouchableOpacity>
            </View>

            <SearchBar />
            <CategorySelector />

            {isLoading && wallpapers.length === 0 ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={Colors.dark.primary} />
                    <Text style={styles.loadingText}>Fetching Wallpapers...</Text>
                </View>
            ) : (
                <MasonryGrid
                    wallpapers={wallpapers}
                    onRefresh={fetchWallpapers}
                    refreshing={isLoading}
                />
            )}

            {/* Footer Gradient Fade */}
            <LinearGradient
                colors={['transparent', Colors.dark.background]}
                style={[styles.bottomFade, { height: insets.bottom + 20 }]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: Colors.dark.text,
        letterSpacing: -0.5,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        color: Colors.dark.textSecondary,
        marginTop: 12,
    },
    bottomFade: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        pointerEvents: 'none',
    }
});
