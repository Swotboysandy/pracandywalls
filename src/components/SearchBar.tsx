import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useStore } from '../store/useStore';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onFilterPress?: () => void;
}

export function SearchBar({ onSearch, onFilterPress }: SearchBarProps) {
    const { currentTheme } = useStore();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSearch = (text: string) => {
        setQuery(text);
        onSearch(text);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch('');
    };

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            style={[styles.container, { backgroundColor: currentTheme.colors.surface }]}
        >
            <View style={styles.searchContainer}>
                <Ionicons
                    name="search"
                    size={20}
                    color={currentTheme.colors.textSecondary}
                    style={styles.searchIcon}
                />

                <TextInput
                    style={[
                        styles.input,
                        {
                            color: currentTheme.colors.text,
                            borderColor: isFocused ? currentTheme.colors.accent : currentTheme.colors.border,
                        },
                    ]}
                    placeholder="Search wallpapers..."
                    placeholderTextColor={currentTheme.colors.textSecondary}
                    value={query}
                    onChangeText={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    returnKeyType="search"
                />

                {query.length > 0 && (
                    <Animated.View entering={SlideInRight.springify()}>
                        <TouchableOpacity
                            onPress={clearSearch}
                            style={styles.clearButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="close-circle"
                                size={20}
                                color={currentTheme.colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {onFilterPress && (
                <TouchableOpacity
                    onPress={onFilterPress}
                    style={[styles.filterButton, { backgroundColor: currentTheme.colors.accent }]}
                    activeOpacity={0.8}
                >
                    <Ionicons name="options" size={20} color="#FFF" />
                </TouchableOpacity>
            )}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        position: 'relative',
    },
    searchIcon: {
        position: 'absolute',
        left: 12,
        top: 12,
        zIndex: 1,
    },
    input: {
        height: 44,
        borderRadius: 22,
        paddingLeft: 44,
        paddingRight: 44,
        fontSize: 15,
        borderWidth: 1.5,
    },
    clearButton: {
        position: 'absolute',
        right: 12,
        top: 12,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
