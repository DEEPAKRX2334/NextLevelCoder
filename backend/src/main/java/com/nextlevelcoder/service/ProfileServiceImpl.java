package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.ProfileResponse;
import com.nextlevelcoder.dto.UpdateProfileRequest;
import com.nextlevelcoder.model.Profile;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.ProfileRepository;
import com.nextlevelcoder.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.nextlevelcoder.service.GoalService;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private GoalService goalService;

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found with username: " + username));
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user: " + username));
        return mapToResponse(user, profile);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse getProfileByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));
        return mapToResponse(user, profile);
    }

    @Override
    @Transactional
    public ProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        if (request.getFirstName() != null) {
            profile.setFirstName(request.getFirstName());
        }
        if (request.getLastName() != null) {
            profile.setLastName(request.getLastName());
        }
        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getAvatarUrl() != null) {
            profile.setAvatarUrl(request.getAvatarUrl());
        }

        Profile updatedProfile = profileRepository.save(profile);
        return mapToResponse(user, updatedProfile);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Incorrect old password!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public ProfileResponse addXp(Long userId, int xpAmount) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user ID: " + userId));

        profile.setXp(profile.getXp() + xpAmount);

        // Update Level based on XP thresholds
        int currentXp = profile.getXp();
        if (currentXp >= 10000) {
            profile.setLevel("Master");
        } else if (currentXp >= 5000) {
            profile.setLevel("Expert");
        } else if (currentXp >= 2000) {
            profile.setLevel("Advanced");
        } else if (currentXp >= 500) {
            profile.setLevel("Intermediate");
        } else {
            profile.setLevel("Beginner");
        }

        Profile updatedProfile = profileRepository.save(profile);

        try {
            achievementService.checkAndAwardAchievements(user);
            goalService.updateDynamicGoals(user);
        } catch (Exception e) {
            System.err.println("Failed to dynamically check achievements/goals in ProfileServiceImpl.addXp: " + e.getMessage());
        }

        return mapToResponse(user, updatedProfile);
    }

    private ProfileResponse mapToResponse(User user, Profile profile) {
        return ProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .bio(profile.getBio())
                .avatarUrl(profile.getAvatarUrl())
                .xp(profile.getXp())
                .level(profile.getLevel())
                .problemsSolved(profile.getProblemsSolved())
                .accuracy(profile.getAccuracy())
                .build();
    }
}
