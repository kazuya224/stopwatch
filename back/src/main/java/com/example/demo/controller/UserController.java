package com.example.demo.controller;

import com.example.demo.util.JwtUtil;
import java.util.Map;
import java.util.HashMap;
import com.example.demo.entity.User;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/task")
    public List<User> getTasks() {
        return userService.getActiveUsers();
    }

    @PostMapping("/task")
    public User postTask(@RequestBody User user) {
        System.out.println("テスト");
        return userService.saveTask(user);
    }

    @DeleteMapping("/task/{userId}")
    public ResponseEntity<?> stopTask(@PathVariable String userId) {
        userService.stopTask(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User newUser = userService.register(user);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // @PostMapping("/auth/login")
    // public ResponseEntity<?> login(@RequestBody User user) {
    //     try {
    //         User newUser = userService.login(user);
    //         return ResponseEntity.ok(newUser);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
    //     }
    // }

    @PostMapping("/auth/login")
    public Map<String, Object> login(@RequestBody User userRequest) {
        // 既存のログイン処理（パスワード検証）
        User user = userService.login(userRequest);
        
        // JWTの生成
        String token = jwtUtil.generateToken(user.getUserId(), user.getUserName());

        // レスポンスを構築
        Map<String, Object> response = new HashMap<>();
        response.put("userId", user.getUserId());
        response.put("userName", user.getUserName());
        response.put("token", token); // これをフロントに渡す
        
        return response;
    }
}