import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Colors } from '../theme/colors';
import { Wallpaper } from '../types';
import WallpaperCard from './WallpaperCard';

interface Props {
    wallpapers: Wallpaper[];
    onRefresh?: () => void;
    refreshing?: boolean;
}

const MasonryGrid = ({ wallpapers, onRefresh, refreshing }: Props) => {
    // Split into columns
    const leftColumn: Wallpaper[] = [];
    const rightColumn: Wallpaper[] = [];

    wallpapers.forEach((w, i) => {
        if (i % 2 === 0) leftColumn.push(w);
        else rightColumn.push(w);
    });

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
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
