package com.example.todoapp.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
@Table(name = "shared_lists")  // Ensure this matches the table name in your database
public class SharedList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "owner_id", nullable = false)
    private Long ownerId;

    @Column(name = "shared_with_id", nullable = false)
    private Long sharedWithId;
}
