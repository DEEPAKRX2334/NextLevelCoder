package com.nextlevelcoder.service;

import com.nextlevelcoder.model.Notification;
import com.nextlevelcoder.model.User;

import java.util.List;

public interface NotificationService {
    List<Notification> getNotificationsForUser(User user);
    long getUnreadCountForUser(User user);
    Notification markAsRead(Long notificationId, User user);
    void markAllAsRead(User user);
    Notification createNotification(User user, String title, String message, String type);
    void checkDailyActivity();
}
