package com.example.todoapp.repository;

import com.example.todoapp.model.SharedList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

public interface SharedListRepository extends JpaRepository<SharedList, Long> {
    List<SharedList> findByOwnerId(Long ownerId);
    List<SharedList> findBySharedWithId(Long sharedWithId);
    Optional<Object> findByOwnerIdAndSharedWithId(Long ownerId, Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM SharedList sl WHERE sl.ownerId = :ownerId AND sl.sharedWithId = :sharedWithId")
    void deleteByOwnerIdAndSharedWithId(@Param("ownerId") Long ownerId, @Param("sharedWithId") Long sharedWithId);
}
