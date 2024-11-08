package com.example.todoapp.model;

import lombok.Data;
import javax.persistence.*;

@Data
@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String text;

    @Column(nullable = false)
    private Boolean done = false;
}
