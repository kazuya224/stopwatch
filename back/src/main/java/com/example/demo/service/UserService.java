package com.example.demo.service;

import com.example.demo.util.JwtUtil;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder; // これが必要
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.example.demo.Dto.TaskResponseDTO; 

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // 他の人が行っているタスクを取得するロジック
    public List<User> getActiveUsers() {
        return userRepository.findByStatus(1);
    }

    // タスクを登録・更新するロジック
    public User saveTask(User userRequest) {
        // 1. まず既存のユーザーを取得（いなければ作成）
        User user = userRepository.findById(userRequest.getUserId())
                .orElse(new User());

        // 2. 値をセットする
        user.setUserId(userRequest.getUserId());
        user.setUserName(userRequest.getUserName());
        user.setTask(userRequest.getTask());
        user.setStatus(1);
        
        // 3. 保存する
        User savedUser = userRepository.save(user);

        // 4. 全員に通知
        broadcastActiveUsers();

        return savedUser;
    }

    // タスクを停止するロジック
    public User stopTask(String userId) {
        // 1. IDでユーザーを特定
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));
        
        // 2. ステータスを0にする
        user.setStatus(0);
        
        // 3. 保存して配信
        User savedUser = userRepository.save(user);
        broadcastActiveUsers();
        
        return savedUser;
    }

    public User register(User userRequest) {
        if(userRepository.existsByUserName(userRequest.getUserName())) {
            throw new RuntimeException("このユーザー名は既に使われています");
        }

        User newUser = new User();
        newUser.setUserId(java.util.UUID.randomUUID().toString());
        newUser.setUserName(userRequest.getUserName());

        String hashedPassword = passwordEncoder.encode(userRequest.getPassword());
        newUser.setPassword(hashedPassword);
        newUser.setStatus(0);

        return userRepository.save(newUser);
    }

    public User login(User userRequest) {
        User user = userRepository.findByUserName(userRequest.getUserName()).orElseThrow(() -> new RuntimeException("ユーザー名またはパスワードが正しくありません"));
        if (!passwordEncoder.matches(userRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("ユーザー名またはパスワードが正しくありません");
        }
        return user;
    }

    public String loginAndGetToken(User userRequest) {
        User user = login(userRequest); // 既存のログインロジック
        // ログイン成功後、トークンを発行
        return jwtUtil.generateToken(user.getUserId(), user.getUserName());
    }

    private void broadcastActiveUsers() {
        List<TaskResponseDTO> activeTasks = userRepository.findByStatus(1).stream()
            .map(user -> new TaskResponseDTO(
                user.getUserId(),
                user.getUserName(),
                user.getTask(),
                user.getStatus()
            ))
            .toList();
        
        // 全員が購読しているトピックに配信
        messagingTemplate.convertAndSend("/topic/tasks", activeTasks);
    }
    
}