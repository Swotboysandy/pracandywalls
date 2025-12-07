import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useStore } from '../store/useStore';
import { Category } from '../types';

const categories: Category[] = [
    'all',
    'trending',
    'abstract',
    'nature',
    'landscape',
    'art',
    '4k',
    'sports',
    'architecture',
    'marvel',
    'neon',
    'minimal',
    'space',
    'cars',
];

interface CategorySelectorProps {
    selectedCategory: Category;
    onSelectCategory: (category: Category) => void;
}

export function CategorySelector({ selectedCategory, onSelectCategory }: CategorySelectorProps) {
    const { currentTheme } = useStore();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {categories.map((category, index) => {
                const isSelected = selectedCategory === category;

                return (
                    <Animated.View
                        key={category}
                        entering={FadeInRight.delay(index * 30).springify()}
                    >
                        <TouchableOpacity
                            onPress={() => onSelectCategory(category)}
                            style={[
                                styles.chip,
                                {
                                    backgroundColor: isSelected
                                        ? currentTheme.colors.accent
                                        : currentTheme.colors.surface,
                                    borderColor: isSelected
                                        ? currentTheme.colors.accent
                                        : currentTheme.colors.border,
                                },
                            ]}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    {
                                        color: isSelected ? '#FFFFFF' : currentTheme.colors.text,
                                        fontWeight: isSelected ? '700' : '500',
                                    },
                                ]}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1.5,
    },
    text: {
        fontSize: 14,
    },
});
