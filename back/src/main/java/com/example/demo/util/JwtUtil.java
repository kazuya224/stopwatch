package com.example.demo.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    // 本番では環境変数から読み込むべき秘密鍵（最低32文字以上）
    private final String SECRET_KEY = "your-very-secure-and-long-secret-key-for-jwt";
    private final SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    private final long EXPIRATION_TIME = 86400000; // 24時間（ミリ秒）

    // トークン生成
    public String generateToken(String userId, String userName) {
        return Jwts.builder()
                .subject(userId)
                .claim("userName", userName)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key)
                .compact();
    }

    // トークンからuserIdを取り出す（検証）
    public String extractUserId(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}