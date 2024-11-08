<template>
  <div class="register-page">
    <header class="app-header">
      <h1>To-Do App</h1>
    </header>

    <div class="register-form">
      <h2>Register</h2>
      <p v-if="registerStatus" class="status">{{ registerStatus }}</p>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <form @submit.prevent="handleRegister">
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Password" required />
        <button type="submit" class="register-button">Register</button>
        <router-link to="/login" class="login-button">Login</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  computed: {
    ...mapState(['registerStatus', 'errorMessage'])
  },
  methods: {
    ...mapActions(['register']),
    async handleRegister() {
      await this.register({ email: this.email, password: this.password });
      if (this.registerStatus === 'Registration successful') {
        await this.$router.push('/login');
      }
      setTimeout(() => {
        this.$store.commit('clearStatusMessages');
      }, 3000); // Clear message after 3 seconds
    }
  }
};
</script>

<style scoped>
.status {
  color: green;
  margin-bottom: 15px;
}
.error {
  color: red;
  margin-bottom: 15px;
}
/* Page container */
.register-page {
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
  margin-bottom: 40px;
}

/* Form container */
.register-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Form title */
h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #4a5568;
}

/* Form inputs */
form input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border-radius: 6px;
  border: 1px solid #cbd5e0;
  font-size: 16px;
  box-sizing: border-box;
}

/* Buttons */
.register-button,
.login-button {
  display: inline-block;
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  color: white;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
  transition: background-color 0.3s;
}

.register-button {
  background-color: #38a169;
}

.register-button:hover {
  background-color: #2f855a;
}

.login-button {
  background-color: #4c51bf;
  text-decoration: none;
}

.login-button:hover {
  background-color: #434190;
}
</style>
