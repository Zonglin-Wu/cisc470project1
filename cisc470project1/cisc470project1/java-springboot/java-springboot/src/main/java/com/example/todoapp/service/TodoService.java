package com.example.todoapp.service;

import com.example.todoapp.model.Todo;
import com.example.todoapp.model.SharedList;
import com.example.todoapp.model.User;
import com.example.todoapp.repository.TodoRepository;
import com.example.todoapp.repository.SharedListRepository;
import com.example.todoapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private SharedListRepository sharedListRepository;

    @Autowired
    private UserRepository userRepository;


    public List<Todo> getTodosForUser(Long userId) {
        return todoRepository.findByUserId(userId);
    }

    public Todo addTodoForUser(Long userId, String text) {
        Todo todo = new Todo();
        todo.setUserId(userId);
        todo.setText(text);
        todo.setDone(false);
        return todoRepository.save(todo);
    }

    public boolean updateTodoForUser(Long userId, Long todoId, String text, Boolean done) {
        Optional<Todo> todoOptional = todoRepository.findById(todoId);
        if (todoOptional.isPresent() && todoOptional.get().getUserId().equals(userId)) {
            Todo todo = todoOptional.get();
            todo.setText(text);
            todo.setDone(done);
            todoRepository.save(todo);
            return true;
        }
        return false;
    }

    public boolean deleteTodoForUser(Long userId, Long todoId) {
        Optional<Todo> todoOptional = todoRepository.findById(todoId);
        if (todoOptional.isPresent() && todoOptional.get().getUserId().equals(userId)) {
            todoRepository.delete(todoOptional.get());
            return true;
        }
        return false;
    }

    public String shareTodoList(Long ownerId, String sharedWithEmail) {
        Optional<User> sharedWithUser = userRepository.findByEmail(sharedWithEmail);
        if (sharedWithUser.isPresent()) {
            if (sharedListRepository.findByOwnerIdAndSharedWithId(ownerId, sharedWithUser.get().getId()).isPresent()) {
                return "Already shared!";
            }
            SharedList sharedList = new SharedList();
            sharedList.setOwnerId(ownerId);
            sharedList.setSharedWithId(sharedWithUser.get().getId());
            sharedListRepository.save(sharedList);
            return "Todo list shared successfully";
        }
        return "User not found";
    }

    public List<String> getSharedWithEmails(Long ownerId) {
        return sharedListRepository.findByOwnerId(ownerId).stream()
                .map(sharedList -> userRepository.findById(sharedList.getSharedWithId()).get().getEmail())
                .toList();
    }

    public List<String> getAccessibleEmails(Long userId) {
        return sharedListRepository.findBySharedWithId(userId).stream()
                .map(sharedList -> userRepository.findById(sharedList.getOwnerId()).get().getEmail())
                .toList();
    }

    public List<Todo> getTodoListForSharedUser(Long userId, Long ownerId) {
        if (sharedListRepository.findByOwnerIdAndSharedWithId(ownerId, userId).isPresent()) {
            return todoRepository.findByUserId(ownerId);
        }
        return List.of();
    }

    public void unshare(long user, long other) {
        sharedListRepository.deleteByOwnerIdAndSharedWithId(user, other);
    }
}
