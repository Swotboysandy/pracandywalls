import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { useStore } from '../store/useStore';
import { Colors } from '../theme/colors';

const SearchBar = () => {
    const { searchTerm, setSearchTerm } = useStore();

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Search wallpapers..."
                placeholderTextColor={Colors.dark.textSecondary}
                value={searchTerm}
                onChangeText={setSearchTerm}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        paddingHorizontal: 12,
        height: 48,
        margin: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
    },
});

export default SearchBar;
