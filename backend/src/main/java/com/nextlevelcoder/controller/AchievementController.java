package com.nextlevelcoder.controller;

import com.nextlevelcoder.dto.AchievementDto;
import com.nextlevelcoder.model.User;
import com.nextlevelcoder.repository.UserRepository;
import com.nextlevelcoder.security.UserDetailsImpl;
import com.nextlevelcoder.service.AchievementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/achievements")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<AchievementDto>> getAchievements(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userDetails.getId()));

        // Run dynamic unlock check before returning list to ensure data is updated
        achievementService.checkAndAwardAchievements(user);

        List<AchievementDto> dtos = achievementService.getAchievementsForUser(user);
        return ResponseEntity.ok(dtos);
    }
}
