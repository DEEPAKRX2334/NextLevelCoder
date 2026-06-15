package com.nextlevelcoder.service;

import com.nextlevelcoder.model.Notification;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.NotificationRepository;
import com.nextlevelcoder.repository.QuizSubmissionRepository;
import com.nextlevelcoder.repository.SubmissionRepository;
import com.nextlevelcoder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private QuizSubmissionRepository quizSubmissionRepository;

    @Override
    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    @Override
    public long getUnreadCountForUser(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    @Override
    @Transactional
    public Notification markAsRead(Long notificationId, User user) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found!"));
        
        if (!notification.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Unauthorized access to notification.");
        }

        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(User user) {
        List<Notification> notifications = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        for (Notification notification : notifications) {
            if (!notification.isRead()) {
                notification.setRead(true);
            }
        }
        notificationRepository.saveAll(notifications);
    }

    @Override
    @Transactional
    public Notification createNotification(User user, String title, String message, String type) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Scheduled(cron = "0 0 9 * * ?") // Runs every day at 9:00 AM
    @Override
    @Transactional
    public void checkDailyActivity() {
        LocalDateTime twentyFourHoursAgo = LocalDateTime.now().minusHours(24);
        List<User> users = userRepository.findAll();
        
        for (User user : users) {
            // Check if reminder was already sent in the last 18 hours to prevent duplicate spamming
            boolean alreadyReminded = notificationRepository.findByUserOrderByCreatedAtDesc(user).stream()
                    .anyMatch(n -> "Daily Goal Reminder".equals(n.getTitle()) 
                            && n.getCreatedAt() != null 
                            && n.getCreatedAt().isAfter(LocalDateTime.now().minusHours(18)));

            if (alreadyReminded) {
                continue;
            }

            boolean completedProblem = submissionRepository.existsByUserAndStatusAndCreatedAtAfter(user, "Accepted", twentyFourHoursAgo);
            boolean completedQuiz = quizSubmissionRepository.existsByUserAndCreatedAtAfter(user, twentyFourHoursAgo);

            if (!completedProblem || !completedQuiz) {
                StringBuilder messageBuilder = new StringBuilder("Keep the momentum going! ");
                if (!completedProblem && !completedQuiz) {
                    messageBuilder.append("You have not completed any coding problems or quiz lessons in the past 24 hours.");
                } else if (!completedProblem) {
                    messageBuilder.append("You have not completed any coding problems in the past 24 hours.");
                } else {
                    messageBuilder.append("You have not taken any learning quizzes in the past 24 hours.");
                }
                messageBuilder.append(" Take some time to learn and solve a problem today to grow your streak!");

                createNotification(user, "Daily Goal Reminder", messageBuilder.toString(), "Reminder");
            }
        }
    }
}
