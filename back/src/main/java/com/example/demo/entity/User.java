package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    private String userId;
    private String userName;
    private String password;
    private String task;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
