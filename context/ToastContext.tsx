import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Toast, ToastType } from '../components/Toast';

const DISMISSED_IDS_KEY = '@netivot_dismissed_notification_ids';

interface ToastContextData {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
    hideToast: () => void;
    /** הצגת התראה מאדמין – תופיע פעם אחת עד לחיצה על X או עד פתיחה ממסך ההתראות */
    showAdminNotification: (message: string, notificationId: string) => void;
    /** לסמן שהמשתמש פתח את ההתראה ממסך ההתראות – ההתראה לא תקפוץ שוב */
    markNotificationSeen: (notificationId: string) => void;
}

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('info');
    const [duration, setDuration] = useState(3000);
    const [currentNotificationId, setCurrentNotificationId] = useState<string | null>(null);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        AsyncStorage.getItem(DISMISSED_IDS_KEY).then((raw) => {
            if (raw) {
                try {
                    const ids = JSON.parse(raw) as string[];
                    setDismissedIds(new Set(ids));
                } catch (_) {}
            }
        });
    }, []);

    const persistDismissed = useCallback((id: string) => {
        setDismissedIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            AsyncStorage.setItem(DISMISSED_IDS_KEY, JSON.stringify([...next]));
            return next;
        });
    }, []);

    const showToast = (msg: string, t: ToastType = 'info', d = 3000) => {
        setCurrentNotificationId(null);
        setMessage(msg);
        setType(t);
        setDuration(d);
        setVisible(true);
    };

    const showAdminNotification = useCallback(
        (msg: string, notificationId: string) => {
            if (dismissedIds.has(notificationId)) return;
            setCurrentNotificationId(notificationId);
            setMessage(msg);
            setType('info');
            setDuration(0);
            setVisible(true);
        },
        [dismissedIds]
    );

    const markNotificationSeen = useCallback(
        (notificationId: string) => {
            persistDismissed(notificationId);
            if (currentNotificationId === notificationId) {
                setVisible(false);
                setCurrentNotificationId(null);
            }
        },
        [currentNotificationId, persistDismissed]
    );

    const hideToast = useCallback(() => {
        if (currentNotificationId) {
            persistDismissed(currentNotificationId);
            setCurrentNotificationId(null);
        }
        setVisible(false);
    }, [currentNotificationId, persistDismissed]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, showAdminNotification, markNotificationSeen }}>
            {children}
            {visible && (
                <Toast
                    visible={visible}
                    message={message}
                    type={type}
                    duration={duration}
                    onHide={hideToast}
                />
            )}
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextData => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
