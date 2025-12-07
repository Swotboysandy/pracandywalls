import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useStore } from '../store/useStore';

const tabs = [
    { name: 'index', icon: 'home', label: 'Home' },
    { name: 'collections', icon: 'albums', label: 'Collections' },
    { name: 'setups', icon: 'grid', label: 'Setups' },
    { name: 'profile', icon: 'person', label: 'Profile' },
    { name: 'notifications', icon: 'notifications', label: 'Alerts' },
];

export function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const { currentTheme, unreadCount } = useStore();

    const navigateTo = (route: string) => {
        router.push(`/${route === 'index' ? '' : route}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.colors.surface }]}>
            {tabs.map((tab) => {
                const isActive = pathname === `/${tab.name}` || (pathname === '/' && tab.name === 'index');

                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => navigateTo(tab.name)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name={isActive ? tab.icon : `${tab.icon}-outline` as any}
                                size={24}
                                color={isActive ? currentTheme.colors.accent : currentTheme.colors.textSecondary}
                            />

                            {/* Unread badge for notifications */}
                            {tab.name === 'notifications' && unreadCount > 0 && (
                                <View style={[styles.badge, { backgroundColor: currentTheme.colors.accent }]}>
                                    <Animated.Text style={styles.badgeText}>
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </Animated.Text>
                                </View>
                            )}

                            {/* Active indicator */}
                            {isActive && (
                                <Animated.View
                                    style={[
                                        styles.activeIndicator,
                                        { backgroundColor: currentTheme.colors.accent },
                                    ]}
                                />
                            )}
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 60,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingBottom: 5,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: -8,
        right: -10,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -8,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
});
