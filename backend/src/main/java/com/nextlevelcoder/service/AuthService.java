package com.nextlevelcoder.service;

import com.nextlevelcoder.dto.JwtResponse;
import com.nextlevelcoder.dto.LoginRequest;
import com.nextlevelcoder.dto.SignupRequest;
import com.nextlevelcoder.model.User;

public interface AuthService {
    User registerUser(SignupRequest signupRequest);
    JwtResponse authenticateUser(LoginRequest loginRequest);
}
