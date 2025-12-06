import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { Colors } from '../theme/colors';

const CategorySelector = () => {
    const { wallpapers, selectedCategory, setSelectedCategory } = useStore();

    // Extract unique categories
    const categories = React.useMemo(() => {
        const raw = wallpapers.map(w => w.folder);
        // Add hardcoded categories
        return ['All', 'Trending', 'Favorites', ...new Set(raw)];
    }, [wallpapers]);

    const handlePress = (category: string) => {
        setSelectedCategory(category);
    };

    const isSelected = (cat: string) => {
        return selectedCategory === cat;
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((cat) => (
                <TouchableOpacity
                    key={cat}
                    style={[styles.chip, isSelected(cat) && styles.chipSelected]}
                    onPress={() => handlePress(cat)}
                >
                    <Text style={[styles.text, isSelected(cat) && styles.textSelected]}>
                        {cat}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingBottom: 8,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipSelected: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    text: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    textSelected: {
        color: '#000', // Dark text on light primary
        fontWeight: '700',
    },
});

export default CategorySelector;
