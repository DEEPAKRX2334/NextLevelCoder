package com.nextlevelcoder.controller;

import com.nextlevelcoder.model.Profile;
import com.nextlevelcoder.repository.ProfileRepository;
import lombok.Builder;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private ProfileRepository profileRepository;

    @GetMapping
    public ResponseEntity<List<LeaderboardRow>> getLeaderboard() {
        // Query profiles sorted by XP descending
        List<Profile> profiles = profileRepository.findAll(Sort.by(Sort.Direction.DESC, "xp"));
        List<LeaderboardRow> leaderboard = new ArrayList<>();

        for (int i = 0; i < profiles.size(); i++) {
            Profile profile = profiles.get(i);
            leaderboard.add(LeaderboardRow.builder()
                    .rank(i + 1)
                    .username(profile.getUser().getUsername())
                    .level(profile.getLevel())
                    .xp(profile.getXp())
                    .problemsSolved(profile.getProblemsSolved())
                    .accuracy(profile.getAccuracy())
                    .avatarUrl(profile.getAvatarUrl())
                    .build());
        }

        return ResponseEntity.ok(leaderboard);
    }

    @Data
    @Builder
    public static class LeaderboardRow {
        private int rank;
        private String username;
        private String level;
        private int xp;
        private int problemsSolved;
        private double accuracy;
        private String avatarUrl;
    }
}
