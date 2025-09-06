
const vibrate = (pattern: VibratePattern) => {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        try {
            navigator.vibrate(pattern);
        } catch (e) {
            console.warn("Haptic feedback failed.", e);
        }
    }
};

// Short, sharp pulse for notifications or quick alerts
const NOTIFICATION_SUCCESS: VibratePattern = [120];
const NOTIFICATION_INFO: VibratePattern = [80];
const NOTIFICATION_WARNING: VibratePattern = [60, 70, 60];

// Longer, more distinct patterns for key events
const TAXI_ARRIVED: VibratePattern = [400, 150, 150];
const APPROACHING_STOP: VibratePattern = [100, 100, 100];
const FINAL_ARRIVAL: VibratePattern = [600];

// Proximity pulse management
let lastPulseTime = 0;
const vibratePulse = (duration: number, interval: number) => {
    const now = Date.now();
    if (now - lastPulseTime > interval) {
        vibrate(duration);
        lastPulseTime = now;
    }
};

const vibrateNotification = (type: 'success' | 'info' | 'warning') => {
    switch(type) {
        case 'success':
            vibrate(NOTIFICATION_SUCCESS);
            break;
        case 'warning':
            vibrate(NOTIFICATION_WARNING);
            break;
        case 'info':
        default:
            vibrate(NOTIFICATION_INFO);
            break;
    }
}

export const hapticService = {
    vibrateTaxiArrived: () => vibrate(TAXI_ARRIVED),
    vibrateApproaching: () => vibrate(APPROACHING_STOP),
    vibrateArrival: () => vibrate(FINAL_ARRIVAL),
    vibrateNotification,
    vibratePulse,
};
