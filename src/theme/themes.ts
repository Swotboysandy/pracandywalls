import { Theme } from '../types';

// Light Themes
export const FrostWhite: Theme = {
    id: 'frost-white',
    name: 'Frost White',
    isDark: false,
    colors: {
        primary: '#FFFFFF',
        background: '#FAFAFA',
        surface: '#FFFFFF',
        accent: '#E57697',
        text: '#000000',
        textSecondary: '#666666',
        border: '#E0E0E0',
        card: '#F5F5F5',
    },
};

export const GoldenLuxury: Theme = {
    id: 'golden-luxury',
    name: 'Golden Luxury',
    isDark: false,
    colors: {
        primary: '#F7F1E3',
        background: '#F7F1E3',
        surface: '#FFF8E7',
        accent: '#C19439',
        text: '#000000',
        textSecondary: '#96732C',
        border: '#F1E6D0',
        card: '#FEFBF0',
    },
};

export const DustyRose: Theme = {
    id: 'dusty-rose',
    name: 'Dusty Rose',
    isDark: false,
    colors: {
        primary: '#C5A79F',
        background: '#F5F0EE',
        surface: '#FFFFFF',
        accent: '#A7796D',
        text: '#000000',
        textSecondary: '#7D564B',
        border: '#BE9C93',
        card: '#FAF6F5',
    },
};

export const SteelBlue: Theme = {
    id: 'steel-blue',
    name: 'Steel Blue',
    isDark: false,
    colors: {
        primary: '#8399BE',
        background: '#F0F4F8',
        surface: '#FFFFFF',
        accent: '#596F95',
        text: '#000000',
        textSecondary: '#36435A',
        border: '#788CAF',
        card: '#F8FAFC',
    },
};

// Dark Themes
export const MaterialDark: Theme = {
    id: 'material-dark',
    name: 'Material Dark',
    isDark: true,
    colors: {
        primary: '#181818',
        background: '#121212',
        surface: '#1E1E1E',
        accent: '#E57697',
        text: '#FFFFFF',
        textSecondary: '#B0B0B0',
        border: '#2C2C2C',
        card: '#242424',
    },
};

export const AmoledBlack: Theme = {
    id: 'amoled-black',
    name: 'AMOLED Black',
    isDark: true,
    colors: {
        primary: '#000000',
        background: '#000000',
        surface: '#0A0A0A',
        accent: '#FFFFFF',
        text: '#FFFFFF',
        textSecondary: '#D0D0D0',
        border: '#1A1A1A',
        card: '#0F0F0F',
    },
};

export const OliveNight: Theme = {
    id: 'olive-night',
    name: 'Olive Night',
    isDark: true,
    colors: {
        primary: '#202113',
        background: '#1A1C10',
        surface: '#252819',
        accent: '#767B45',
        text: '#E3E4D0',
        textSecondary: '#A8AA8E',
        border: '#35371F',
        card: '#2A2D1E',
    },
};

export const OceanDeep: Theme = {
    id: 'ocean-deep',
    name: 'Ocean Deep',
    isDark: true,
    colors: {
        primary: '#041B29',
        background: '#000A12',
        surface: '#0A1F2E',
        accent: '#427DA8',
        text: '#B0CCE0',
        textSecondary: '#7A9BB8',
        border: '#152836',
        card: '#0F2433',
    },
};

export const ForestGreen: Theme = {
    id: 'forest-green',
    name: 'Forest Green',
    isDark: true,
    colors: {
        primary: '#12210E',
        background: '#0A1307',
        surface: '#1A2915',
        accent: '#4C7044',
        text: '#D9E6D6',
        textSecondary: '#97B892',
        border: '#1D2B1A',
        card: '#1F311B',
    },
};

export const RustDark: Theme = {
    id: 'rust-dark',
    name: 'Rust',
    isDark: true,
    colors: {
        primary: '#290D02',
        background: '#1A0801',
        surface: '#341812',
        accent: '#703826',
        text: '#DFB0A0',
        textSecondary: '#B8897A',
        border: '#361B12',
        card: '#3F1F14',
    },
};

export const NordicBlue: Theme = {
    id: 'nordic-blue',
    name: 'Nordic Blue',
    isDark: true,
    colors: {
        primary: '#142431',
        background: '#0A1219',
        surface: '#1C2F3E',
        accent: '#2D6079',
        text: '#A9CDDF',
        textSecondary: '#7FA8BE',
        border: '#193543',
        card: '#21394A',
    },
};

// All Themes Collection
export const lightThemes: Theme[] = [
    FrostWhite,
    GoldenLuxury,
    DustyRose,
    SteelBlue,
];

export const darkThemes: Theme[] = [
    MaterialDark,
    AmoledBlack,
    OliveNight,
    OceanDeep,
    ForestGreen,
    RustDark,
    NordicBlue,
];

export const allThemes: Theme[] = [...lightThemes, ...darkThemes];

// Helper function to get theme by ID
export const getThemeById = (id: string): Theme | undefined => {
    return allThemes.find(theme => theme.id === id);
};

// Default themes
export const defaultLightTheme = FrostWhite;
export const defaultDarkTheme = MaterialDark;
