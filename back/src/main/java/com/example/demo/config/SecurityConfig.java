package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 全てのリクエストを許可（認証をスキップ）
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                // CSRFを無効化（API開発では必須に近い）
                .csrf(csrf -> csrf.disable())
                // CORSを有効化（WebConfigの設定を読み込む）
                .cors(cors -> {
                });

        return http.build();
    }
}