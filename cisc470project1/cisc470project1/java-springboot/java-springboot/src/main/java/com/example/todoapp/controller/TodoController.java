package com.example.todoapp.controller;

import com.example.todoapp.model.Todo;
import com.example.todoapp.service.TodoService;
import com.example.todoapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Todo> getTodos(HttpServletRequest request) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return List.of();
        }
        return todoService.getTodosForUser(userId);
    }

    @PostMapping
    public Map<String, String> addTodo(HttpServletRequest request, @RequestBody String text) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return null;
        }
        todoService.addTodoForUser(userId, text);
        return Map.of("message", "Todo created successfully");
    }

    @PutMapping("/{todoId}")
    public Map<String, String> updateTodo(HttpServletRequest request, @PathVariable Long todoId, @RequestBody Todo todo) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return Map.of("error", "User not found");
        }
        boolean updated = todoService.updateTodoForUser(userId, todoId, todo.getText(), todo.getDone());
        if (!updated) {
            return Map.of("error", "Todo update failed");
        }

        return Map.of("message", "Todo update successfully");
    }

    @DeleteMapping("/{todoId}")
    public Map<String, String> deleteTodo(HttpServletRequest request, @PathVariable Long todoId) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return Map.of("error", "User does not exist");
        }
        boolean deleted = todoService.deleteTodoForUser(userId, todoId);
        if (!deleted) {
            return Map.of("error", "Todo deletion failed");
        }

        return Map.of("message", "Todo deleted successfully");
    }

    @PostMapping("/share")
    public Map<String, String> shareTodoList(HttpServletRequest request, @RequestBody String sharedWithEmail) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        Map<String, Object> sharedWith = JsonParserFactory.getJsonParser().parseMap(String.valueOf(sharedWithEmail));
        if (!sharedWith.containsKey("email")) {
            return Map.of("error", "User not found");
        }
        todoService.shareTodoList(userId, (String) sharedWith.get("email"));
        return Map.of("message", "Todo list shared successfully");
    }

    @GetMapping("/shared-with")
    public List<Map<String, String>> getSharedWith(HttpServletRequest request) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return List.of();
        }
        List<String> ret = todoService.getSharedWithEmails(userId);
        return ret.stream().map(o -> Map.of("email", o)).toList();
    }

    @GetMapping("/accessible-lists")
    public List<Map<String, String>> getAccessibleLists(HttpServletRequest request) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return List.of();
        }
        List<String> ret = todoService.getAccessibleEmails(userId);
        return ret.stream().map(o -> Map.of("email", o)).toList();
    }

    @GetMapping("/shared/{ownerEmail}")
    public List<Todo> getTodoListForSharedUser(HttpServletRequest request, @PathVariable String ownerEmail) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return List.of();
        }
        long ownerId =  userService.findUserByEmail(ownerEmail);
        if (ownerId == -1) {
            return List.of();
        }
        return todoService.getTodoListForSharedUser(userId, ownerId);
    }

    @PostMapping("/unshare")
    public String unshareUser(HttpServletRequest request, @RequestBody String sharedWithEmail) {
        long userId = userService.findUserByEmail(request.getAttribute("user").toString());
        if (userId == -1) {
            return "Login user error";
        }
        Map<String, Object> sharedWith = JsonParserFactory.getJsonParser().parseMap(String.valueOf(sharedWithEmail));
        if (!sharedWith.containsKey("email")) {
            return "User not exist";
        }
        long otherUserId = userService.findUserByEmail(sharedWith.toString());
        if (otherUserId == -1) {
            return "Target user not exist";
        }
        todoService.unshare(userId, otherUserId);
        return "Success";
    }
}
