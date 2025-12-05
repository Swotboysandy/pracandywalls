import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const KEY = 'hasLaunched';

export const useFirstLaunch = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        const check = async () => {
            try {
                const hasLaunched = await AsyncStorage.getItem(KEY);
                if (hasLaunched === null) {
                    setIsFirstLaunch(true);
                    //    await AsyncStorage.setItem(KEY, 'true'); // Don't set here, set after completion
                } else {
                    setIsFirstLaunch(false);
                }
            } catch (e) {
                setIsFirstLaunch(false);
            }
        };
        check();
    }, []);

    const setLaunched = async () => {
        await AsyncStorage.setItem(KEY, 'true');
        setIsFirstLaunch(false);
    };

    return { isFirstLaunch, setLaunched };
};
