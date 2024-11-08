package com.example.todoapp.controller;

import com.example.todoapp.model.User;
import com.example.todoapp.service.AuthService;
import com.example.todoapp.service.UserService;
import com.example.todoapp.util.JwtUtil;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        return authService.register(user);
    }

    private static class LoginBody {
        @Setter
        @Getter
        private String email;
        @Setter
        @Getter
        private String password;
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody LoginBody loginBody) {
        final UserDetails userDetails = userService.loadUserByUsername(loginBody.email);
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        return response;
    }

}
