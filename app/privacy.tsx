import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../src/theme/colors';

export default function PrivacyScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.text}>
                Last updated: December 6, 2025{'\n'}{'\n'}
                PracandyWalls respects your privacy. This app does not collect any personal data.
                {'\n'}{'\n'}
                <Text style={styles.header}>1. Data Collection{'\n'}</Text>
                We do not collect, store, or share any personally identifiable information.
                {'\n'}{'\n'}
                <Text style={styles.header}>2. Storage Permissions{'\n'}</Text>
                We request access to your device storage solely for the purpose of downloading and saving wallpapers as requested by you.
                {'\n'}{'\n'}
                <Text style={styles.header}>3. Images{'\n'}</Text>
                Images are fetched from public GitHub repositories.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 24,
        marginTop: 40,
    },
    header: {
        fontWeight: '700',
        color: colors.text,
    },
    text: {
        fontSize: 16,
        color: colors.textSecondary,
        lineHeight: 24,
    }
});

