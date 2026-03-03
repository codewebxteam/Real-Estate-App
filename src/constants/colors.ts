// Premium color palette for UP Real Estate App
export const Colors = {
    // Primary gradient (Royal Blue → Electric Indigo)
    primary: '#4F46E5',
    primaryLight: '#818CF8',
    primaryDark: '#3730A3',
    primaryGradient: ['#4F46E5', '#7C3AED'] as const,

    // Secondary (Emerald)
    secondary: '#10B981',
    secondaryLight: '#34D399',
    secondaryDark: '#059669',

    // Accent (Amber Gold)
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    accentGradient: ['#F59E0B', '#FB923C'] as const,

    // Premium Mesh Gradients (Blue/Purple/Emerald)
    meshBlue: ['#4F46E5', '#3B82F6', '#60A5FA'] as const,
    meshEmerald: ['#10B981', '#34D399', '#6EE7B7'] as const,

    // Status
    success: '#22C55E',
    warning: '#EAB308',
    error: '#EF4444',
    info: '#3B82F6',

    // Neutrals
    white: '#FFFFFF',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#F1F5F9',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',

    // Text
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textOnPrimary: '#FFFFFF',
    textOnDark: '#F8FAFC',

    // Dark surfaces
    dark: '#0F172A',
    darkSurface: '#1E293B',
    darkElevated: '#334155',

    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.12)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    glassDark: 'rgba(15, 23, 42, 0.7)',
    glassHeavy: 'rgba(255, 255, 255, 0.25)',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Property type colors
    flat: '#8B5CF6',
    house: '#06B6D4',
    plot: '#F97316',

    // Status badge colors
    pending: '#F59E0B',
    verified: '#22C55E',
    rejected: '#EF4444',
    live: '#3B82F6',
};

export const Shadows = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    lg: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.18,
        shadowRadius: 20,
        elevation: 8,
    },
    glow: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 10,
    },
    premium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.12,
        shadowRadius: 30,
        elevation: 12,
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};
