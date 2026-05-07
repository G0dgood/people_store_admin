/**
 * Toast with Sound Effects
 * Wraps Sonner toast functions to automatically play sounds
 */

import { toast } from 'sonner';
import { playNotificationSound } from '@/app/utils/soundEffects'; 
import { SoundPreferences } from './soundPreferences';

/**
 * Show success toast with sound
 */
export const toastSuccess = (message: string, options?: any, component: keyof SoundPreferences['components'] = 'toasts') => {
	playNotificationSound('success', component);
	return toast.success(message, options);
};

/**
 * Show error toast with sound
 */
export const toastError = (message: string, options?: any, component: keyof SoundPreferences['components'] = 'toasts') => {
	playNotificationSound('error', component);
	return toast.error(message, options);
};

/**
 * Show warning toast with sound
 */
export const toastWarning = (message: string, options?: any, component: keyof SoundPreferences['components'] = 'toasts') => {
	playNotificationSound('warning', component);
	return toast.warning(message, options);
};

/**
 * Show info toast with sound
 */
export const toastInfo = (message: string, options?: any, component: keyof SoundPreferences['components'] = 'toasts') => {
	playNotificationSound('info', component);
	return toast.info(message, options);
};

/**
 * Show loading toast (no sound, as it's temporary)
 */
export const toastLoading = (message: string, options?: any) => {
	return toast.loading(message, options);
};

/**
 * Show promise toast with sound based on result
 */
export const toastPromise = <T,>(
    promise: Promise<T> | (() => Promise<T>),
    messages: {
        loading?: string;
        success?: string | ((data: T) => string);
        error?: string | ((error: any) => string);
    }
) => {
    const runner = typeof promise === 'function' ? promise : () => promise;
    const wrapped = () => runner()
        .then((data) => {
            playNotificationSound('success', 'toasts');
            return data;
        })
        .catch((error) => {
            playNotificationSound('error', 'toasts');
            throw error;
        });
    return toast.promise(wrapped, messages);
};

// Re-export other toast functions
export { toast };
