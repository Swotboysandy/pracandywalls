import { StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Notifications</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#888888',
        fontSize: 16,
        marginTop: 8,
    },
});
