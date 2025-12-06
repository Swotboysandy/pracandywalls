import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Wallpaper } from '../types';
import WallpaperCard from './WallpaperCard';

interface Props {
    wallpapers: Wallpaper[];
    onRefresh?: () => void;
    refreshing?: boolean;
    onLoadMore?: () => void;
}

const MasonryGrid = ({ wallpapers, onRefresh, refreshing, onLoadMore }: Props) => {
    // Split into columns
    const leftColumn: Wallpaper[] = [];
    const rightColumn: Wallpaper[] = [];

    wallpapers.forEach((w, i) => {
        if (i % 2 === 0) leftColumn.push(w);
        else rightColumn.push(w);
    });

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - 200;

        if (isNearEnd && onLoadMore) {
            onLoadMore();
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            refreshControl={
                <RefreshControl
                    refreshing={!!refreshing}
                    onRefresh={onRefresh}
                    tintColor={Colors.dark.primary}
                />
            }
        >
            <View style={styles.row}>
                <View style={styles.column}>
                    {leftColumn.map((item, index) => (
                        <WallpaperCard key={item.id} wallpaper={item} index={index * 2} />
                    ))}
                </View>
                <View style={styles.column}>
                    {rightColumn.map((item, index) => (
                        <WallpaperCard key={item.id} wallpaper={item} index={index * 2 + 1} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        paddingTop: 100, // Space for header
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flex: 1,
    },
});

export default MasonryGrid;
