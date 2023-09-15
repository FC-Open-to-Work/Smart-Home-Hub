package com.FCopentowork.server.service;

import com.FCopentowork.server.controller.AuthController;
import com.FCopentowork.server.model.User;
import com.FCopentowork.server.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {
    private static final Logger LOG = LoggerFactory.getLogger(AuthController.class);

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder encoder;

    public AuthenticationService(TokenService tokenService,
                                 UserRepository userRepository,
                                 AuthenticationManager authenticationManager,
                                 PasswordEncoder encoder) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.encoder = encoder;
    }

    public Map<String, Object> loginService(String username,
                                            String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password));
        LOG.debug("Login token requested for user: {}", username);
        String token = tokenService.generateToken(authentication);
        LOG.debug("Login token granted: {}", token);

        Map<String, Object> tokenMap = new HashMap<>();
        tokenMap.put("token", token);
        return tokenMap;
    }

    public Map<String, Object> signupService(String username,
                                             String email,
                                             String password) {
        LOG.debug("Signup requested for user: {}", username);

        Map<String, Object> response = new HashMap<>();
        // Check for duplicate users
        if (userRepository.findByUsername(username).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "duplicate");
        } else {
            User n = new User();
            n.setUsername(username);
            n.setEmail(email);
            n.setPassword("{bcrypt}" + encoder.encode(password));
            n.setRoles("ROLE_USER");

            userRepository.save(n);
            LOG.debug("Signup successful for user: {} with role: {}", username, n.getRoles());

            response.put("success", "success");
        }

        return response;
    }
}
