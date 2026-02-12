package com.example.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 全てのパスを対象にする
                .allowedOrigins("http://localhost:5173") // フロントエンドのURLを許可
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 許可するメソッド
                .allowedHeaders("*") // 全てのヘッダーを許可
                .allowCredentials(true); // クッキーなどの送受信を許可する場合
    }
}