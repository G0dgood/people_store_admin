/**
 * Toast with Sound Effects
 * Wraps Sonner toast functions to automatically play sounds
 */

import { toast } from 'sonner';
import { playNotificationSound } from '@/app/utils/soundEffects'; 

/**
 * Show success toast with sound
 */
export const toastSuccess = (message: string, options?: any) => {
	playNotificationSound('success', 'toasts');
	return toast.success(message, options);
};

/**
 * Show error toast with sound
 */
export const toastError = (message: string, options?: any) => {
	playNotificationSound('error', 'toasts');
	return toast.error(message, options);
};

/**
 * Show warning toast with sound
 */
export const toastWarning = (message: string, options?: any) => {
	playNotificationSound('warning', 'toasts');
	return toast.warning(message, options);
};

/**
 * Show info toast with sound
 */
export const toastInfo = (message: string, options?: any) => {
	playNotificationSound('info', 'toasts');
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
