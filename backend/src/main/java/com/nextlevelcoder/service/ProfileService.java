package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.ProfileResponse;
import com.nextlevelcoder.dto.UpdateProfileRequest;

public interface ProfileService {
    ProfileResponse getProfileByUsername(String username);
    ProfileResponse getProfileByUserId(Long userId);
    ProfileResponse updateProfile(Long userId, UpdateProfileRequest request);
    void changePassword(Long userId, String oldPassword, String newPassword);
    ProfileResponse addXp(Long userId, int xpAmount);
}
