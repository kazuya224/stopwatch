package com.example.demo.event; // 1. パッケージ宣言を必ず先頭に

import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component // 2. Springに認識させる
public class WebSocketEventListener { // 3. 以前のチャットで抜けていたかもしれないクラス定義

    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        // セッション属性から userId を取り出す
        if (headerAccessor.getSessionAttributes() != null) {
            String userId = (String) headerAccessor.getSessionAttributes().get("userId");

            if (userId != null) {
                System.out.println("切断検知: " + userId);
                userService.stopTask(userId);
            }
        }
    }
}