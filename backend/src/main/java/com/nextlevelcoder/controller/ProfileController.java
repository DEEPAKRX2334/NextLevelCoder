package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.ChangePasswordRequest;
import com.nextlevelcoder.dto.MessageResponse;
import com.nextlevelcoder.dto.ProfileResponse;
import com.nextlevelcoder.dto.UpdateProfileRequest;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse response = profileService.getProfileByUserId(userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody UpdateProfileRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ProfileResponse response = profileService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        profileService.changePassword(userDetails.getId(), request.getOldPassword(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password updated successfully!"));
    }

    @PostMapping("/add-xp")
    public ResponseEntity<ProfileResponse> addXp(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestBody java.util.Map<String, Integer> payload) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        int amount = payload.getOrDefault("amount", 0);
        if (amount <= 0 || amount > 1000) {
            return ResponseEntity.badRequest().build();
        }
        ProfileResponse response = profileService.addXp(userDetails.getId(), amount);
        return ResponseEntity.ok(response);
    }
}
