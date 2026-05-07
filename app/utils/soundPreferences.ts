/**
 * Sound Preferences Utility
 * Manages user sound preferences (on/off and per-component sounds)
 */

export type SoundType = 
	| 'notification'
	| 'success'
	| 'error'
	| 'warning'
	| 'info'
	| 'follow'
	| 'like'
	| 'join_request'
	| 'group_activity'
	| 'comment'
	| 'welcome'
	| 'panel_open'
	| 'new_notification';

export interface ComponentSoundSettings {
	enabled: boolean;
	soundType: SoundType;
}

export interface SoundPreferences {
	globalSoundEnabled: boolean;
	components: {
		notifications: ComponentSoundSettings;
		toasts: ComponentSoundSettings; 
		orders: ComponentSoundSettings; 
		offlineBanner: ComponentSoundSettings; 
	};
}

const STORAGE_KEY = 'soundPreferences';

const defaultPreferences: SoundPreferences = {
	globalSoundEnabled: true,
	components: {
		notifications: {
			enabled: true,
			soundType: 'notification',
		},
		toasts: {
			enabled: true,
			soundType: 'success',
		}, 
		orders: {
			enabled: true,
			soundType: 'success',
		}, 
		offlineBanner: {
			enabled: true,
			soundType: 'warning',
		}
	},
};

/**
 * Load sound preferences from localStorage
 */
export const loadSoundPreferences = (): SoundPreferences => {
	if (typeof window === 'undefined') {
		return defaultPreferences;
	}

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Merge with defaults to handle new components
			return {
				...defaultPreferences,
				...parsed,
				components: {
					...defaultPreferences.components,
					...(parsed.components || {}),
				},
			};
		}
	} catch (error) {
		console.error('Error loading sound preferences:', error);
	}

	return defaultPreferences;
};

/**
 * Save sound preferences to localStorage
 */
export const saveSoundPreferences = (preferences: SoundPreferences): void => {
	if (typeof window === 'undefined') return;

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
	} catch (error) {
		console.error('Error saving sound preferences:', error);
	}
};

/**
 * Get current sound preferences
 */
export const getSoundPreferences = (): SoundPreferences => {
	return loadSoundPreferences();
};

/**
 * Update global sound enabled state
 */
export const setGlobalSoundEnabled = (enabled: boolean): void => {
	const preferences = loadSoundPreferences();
	preferences.globalSoundEnabled = enabled;
	saveSoundPreferences(preferences);
};

/**
 * Update component sound settings
 */
export const setComponentSoundSettings = (
	component: keyof SoundPreferences['components'],
	settings: ComponentSoundSettings
): void => {
	const preferences = loadSoundPreferences();
	preferences.components[component] = settings;
	saveSoundPreferences(preferences);
};

/**
 * Check if sound should play for a component
 */
export const shouldPlaySound = (component: keyof SoundPreferences['components']): boolean => {
	const preferences = loadSoundPreferences();
	if (!preferences.globalSoundEnabled) {
		return false;
	}
	return preferences.components[component]?.enabled ?? true;
};

/**
 * Get sound type for a component
 */
export const getComponentSoundType = (component: keyof SoundPreferences['components']): SoundType => {
	const preferences = loadSoundPreferences();
	return preferences.components[component]?.soundType ?? 'notification';
};
