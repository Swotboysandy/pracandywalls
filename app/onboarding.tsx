import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFirstLaunch } from '../src/hooks/useFirstLaunch';
import { Colors } from '../src/theme/colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const router = useRouter();
    const { setLaunched } = useFirstLaunch();

    const handleStart = async () => {
        await setLaunched();
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop' }} // Placeholder visuals
                style={StyleSheet.absoluteFillObject}
                contentFit="cover"
            />
            <View style={styles.overlay} />

            <View style={styles.content}>
                <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>
                    PracandyWalls
                </Animated.Text>
                <Animated.Text entering={FadeInDown.delay(400)} style={styles.subtitle}>
                    Discover the most premium wallpapers for your device.
                </Animated.Text>

                <Animated.View entering={FadeInDown.delay(600)} style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={handleStart}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'flex-end',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        padding: 24,
        paddingBottom: 60,
    },
    title: {
        fontSize: 42,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 40,
        lineHeight: 26,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    }
});
