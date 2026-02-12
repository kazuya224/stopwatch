package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    // 他の人と共有するために「計測中（status=1）」のユーザーだけを取得するメソッド
    List<User> findByStatus(Integer status);

    Optional<User> findByUserName(String userName);

    boolean existsByUserName(String userName);
}