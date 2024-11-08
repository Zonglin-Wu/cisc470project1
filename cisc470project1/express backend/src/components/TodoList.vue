<template>
  <div class="todo-list">
    <h2>My To-Do List</h2>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <TodoItem :todo="todo" @delete="deleteTodo" @update="updateTodo" />
      </li>
    </ul>
    <form @submit.prevent="addNewTodo">
      <input v-model="newTodoText" placeholder="New to-do" required />
      <button type="submit" class="add-button">Add</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import TodoItem from './TodoItem.vue';

export default {
  components: {TodoItem},
  data() {
    return {newTodoText: ''};
  },
  computed: mapState(['todos']),
  methods: {
    ...mapActions(['fetchTodos', 'addTodo', 'deleteTodo', 'updateTodo']),
    async addNewTodo() {
      if (this.newTodoText.trim()) {
        await this.addTodo({text: this.newTodoText, done: false});
        this.newTodoText = '';
      }
    },
  },
  mounted() {
    this.fetchTodos();
  },
};
</script>

<style scoped>
.todo-list {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
  color: #4a5568;
}

/* To-do item list */
ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
}

/* Form input and add button */
form input {
  width: calc(100% - 90px);
  padding: 10px;
  margin-right: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  font-size: 16px;
  box-sizing: border-box;
}

.add-button {
  width: 80px;
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background-color: #4c51bf;
  cursor: pointer;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #434190;
}
</style>
