<template>
  <div class="dashboard-page">
    <header class="app-header">
      <h1>To-Do App</h1>
      <div class="header-right">
        <span class="user-email">{{ currentLoginUserEmail }}</span>
        <button @click="performLogout" class="logout-button">Logout</button>
      </div>
    </header>

    <div class="dashboard-content">
      <h2>Welcome to your Dashboard</h2>
      <TodoList/>

      <!-- Shared With Section -->
      <div class="shared-with">
        <h3>Shared With</h3>
        <ul>
          <li v-for="user in sharedWith" :key="user.email">
            {{ user.email }}
            <button @click="removeSharedUser(user.email)" class="remove-button">X</button>
          </li>
        </ul>
        <form @submit.prevent="shareWithUser">
          <input v-model="shareEmail" type="email" placeholder="Enter email to share" required />
          <button type="submit" class="share-button">Share</button>
        </form>
      </div>

      <!-- Accessible Lists Section -->
      <div class="accessible-lists">
        <h3>Accessible To-Do Lists</h3>
        <ul>
          <li v-for="user in accessibleLists" :key="user.email">
            <button @click="viewAccessibleTodoList(user.email)" class="email-button">{{ user.email }}</button>
          </li>
        </ul>
      </div>

      <!-- Accessible User's To-Do List Display -->
      <div v-if="selectedUserTodos && selectedUserTodos.length > 0" class="user-todo-list">
        <h3>{{ selectedUserEmail }}'s To-Do List</h3>
        <ul>
          <li v-for="todo in selectedUserTodos" :key="todo._id">{{ todo.text }}</li>
        </ul>
      </div>
      <div v-else-if="selectedUserEmail" class="user-todo-list">
        <p>No to-do items available for {{ selectedUserEmail }}.</p>
      </div>
    </div>
  </div>
</template>

<script>
import TodoList from '../components/TodoList.vue';
import {mapState, mapActions} from 'vuex';

export default {
  components: {TodoList},
  data() {
    return {
      shareEmail: '',
      selectedUserEmail: '', // Email of the selected user for viewing their todos
    };
  },
  computed: {
    ...mapState(['currentLoginUserEmail', 'sharedWith', 'accessibleLists', 'selectedUserTodos'])
  },
  methods: {
    ...mapActions([
      'fetchTodos',         // To fetch the user's own todos
      'fetchSharedWith',    // To fetch the list of users with whom the todos are shared
      'fetchAccessibleLists', // To fetch the list of users who have shared their todos with this user
      'shareTodoList',       // To share the todo list with another user
      'fetchTodoListOfSharedUser',
      'unshareTodoList',
      'logout'
    ]),
    async shareWithUser() {
      if (this.shareEmail) {
        await this.shareTodoList(this.shareEmail); // Calls the shareTodoList action
        this.shareEmail = ''; // Clear the input after sharing
        await this.fetchSharedWith(); // Refresh the shared with list
      }
    },
    async viewAccessibleTodoList(email) {
      this.selectedUserEmail = email;
      await this.fetchTodoListOfSharedUser(email); // Fetch the to-do list of the selected user (ensure this action exists in Vuex)
    },
    async removeSharedUser(email) {
      await this.unshareTodoList(email); // Call the action to remove shared access
    },
    async performLogout() {
      await this.logout();
      await this.$router.push('/login');
    }
  },
  mounted() {
    this.fetchTodos();          // Fetch the user's own todos
    this.fetchSharedWith();      // Fetch the list of users the todos are shared with
    this.fetchAccessibleLists(); // Fetch the list of users who have shared their todos with this user
  }
};
</script>

<style scoped>
/* Page container */
.dashboard-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* Header */
.app-header {
  width: 100%;
  padding: 20px 0;
  background-color: #2d3748;
  color: white;
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}


/* Content container */
.dashboard-content {
  width: 100%;
  max-width: 800px;
  text-align: center;
  color: #4a5568;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
}

/* Shared and Accessible Lists */
.shared-with, .accessible-lists, .user-todo-list {
  margin-top: 30px;
  text-align: left;
}

.shared-with h3, .accessible-lists h3, .user-todo-list h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2d3748;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0 0 15px;
}

ul li {
  font-size: 16px;
  padding: 5px;
  border-bottom: 1px solid #e2e8f0;
}

.email-button {
  background: none;
  border: none;
  color: #3182ce;
  text-decoration: underline;
  cursor: pointer;
}

.email-button:hover {
  color: #2b6cb0;
}

/* Share form */
form {
  display: flex;
  align-items: center;
}

form input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  font-size: 16px;
}

.share-button {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background-color: #4c51bf;
  cursor: pointer;
  transition: background-color 0.3s;
}

.share-button:hover {
  background-color: #434190;
}

.logout-button {
  position: static;
  bottom: auto;
  right: 20px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  background-color: #e53e3e;
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-email {
  color: white;
  font-size: 16px;
  font-weight: normal;
}

.logout-button:hover {
  background-color: #c53030;
}
</style>
