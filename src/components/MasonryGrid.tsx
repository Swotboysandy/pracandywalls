import { ScrollView, StyleSheet, View } from 'react-native';
import { useStore } from '../store/useStore';
import { Wallpaper } from '../types';
import { WallpaperCard } from './WallpaperCard';

interface Props {
    wallpapers: Wallpaper[];
}

const MasonryGrid = ({ wallpapers }: Props) => {
    const { currentTheme } = useStore();

    // Split into columns for masonry layout
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
        paddingBottom: 100,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    column: {
        flex: 1,
    },
});

export default MasonryGrid;

