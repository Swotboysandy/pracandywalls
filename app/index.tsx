import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav } from '../src/components/BottomNav';
import MasonryGrid from '../src/components/MasonryGrid';
import { useStore } from '../src/store/useStore';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const { fetchWallpapers, wallpapers, isLoading, loadFavorites } = useStore();
    const router = useRouter();

    useEffect(() => {
        fetchWallpapers(1);
        loadFavorites();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Wallpaper Grid */}
            {isLoading && wallpapers.length === 0 ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#E57697" />
                </View>
            ) : (
                <MasonryGrid wallpapers={wallpapers} />
            )}

            {/* Bottom Navigation */}
            <View style={[styles.bottomNav, { paddingBottom: insets.bottom }]}>
                <BottomNav />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});
