import { createStore } from 'vuex';
import axios from './axios';

const store = createStore({
    state: {
        currentLoginUserEmail: null,
        todos: [],
        token: localStorage.getItem('token') || '',
        loginStatus: '',
        registerStatus: '',
        errorMessage: '',  // New state for error messages
        sharedWith: [],
        accessibleLists: [],
        selectedUserTodos: []
    },
    mutations: {
        setUser(state, user) {
            state.currentLoginUserEmail = user;
        },
        setToken(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        setTodos(state, todos) {
            state.todos = todos;
        },
        setLoginStatus(state, message) {
            state.loginStatus = message;
        },
        setRegisterStatus(state, message) {
            state.registerStatus = message;
        },
        setErrorMessage(state, message) {  // Mutation to set error messages
            state.errorMessage = message;
        },
        clearStatusMessages(state) {
            state.loginStatus = '';
            state.registerStatus = '';
            state.errorMessage = '';
        },
        setSharedWith(state, sharedWith) {
            state.sharedWith = sharedWith;
        },
        setAccessibleLists(state, accessibleLists) {
            state.accessibleLists = accessibleLists;
        },
        setSelectedUserTodos(state, todos) {
            state.selectedUserTodos = todos;
        },
        addTodo(state, todo) {
            state.todos.push(todo);
        },
        updateTodo(state, updatedTodo) {
            const index = state.todos.findIndex(todo => todo.id === updatedTodo.id);
            if (index !== -1) state.todos.splice(index, 1, updatedTodo);
        },
        removeTodo(state, id) {
            state.todos = state.todos.filter(todo => todo.id !== id);
        },
        clearUserData(state) { // New mutation for clearing user data
            state.token = '';
            state.user = null;
            state.todos = [];
            state.sharedWith = [];
            state.accessibleLists = [];
            state.selectedUserTodos = [];
            localStorage.removeItem('token');
        }
    },
    actions: {
        async login({ commit }, { email, password }) {
            try {
                const response = await axios.post('/auth/login', { email, password });
                commit("setUser", email);
                commit('setToken', response.data.token);
                commit('setLoginStatus', 'Login successful');
                commit('setErrorMessage', '');  // Clear error if login is successful
            } catch (error) {
                commit('setLoginStatus', '');
                commit('setErrorMessage', 'Login failed: Invalid credentials');  // Set error message
            }
        },
        async register({ commit }, { email, password }) {
            try {
                await axios.post('/auth/register', { email, password });
                commit('setRegisterStatus', 'Registration successful');
                commit('setErrorMessage', '');  // Clear error if registration is successful
            } catch (error) {
                commit('setRegisterStatus', '');
                commit('setErrorMessage', 'Registration failed: User already exists');  // Set error message
            }
        },
        async fetchTodos({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/todos', {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                commit('setTodos', response.data);
                commit('setErrorMessage', '');  // Clear error if fetching todos is successful
            } catch (error) {
                commit('setErrorMessage', 'Failed to fetch todos');
            }
        },
        async addTodo({ dispatch, commit, state }, todo) {
            if (!state.token) return;
            try {
                await axios.post('/todos', todo, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                dispatch('fetchTodos'); // Refresh the to-do list
                commit('setErrorMessage', '');  // Clear error if adding todo is successful
            } catch (error) {
                commit('setErrorMessage', 'Failed to add todo');
            }
        },
        async updateTodo({ dispatch, commit, state }, todo) {
            if (!state.token) return;
            try {
                await axios.put(`/todos/${todo.id}`, todo, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                dispatch('fetchTodos'); // Refresh the to-do list
                commit('setErrorMessage', '');  // Clear error if updating todo is successful
            } catch (error) {
                commit('setErrorMessage', 'Failed to update todo');
            }
        },
        async deleteTodo({ dispatch, commit, state }, id) {
            if (!state.token) return;
            try {
                await axios.delete(`/todos/${id}`, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                dispatch('fetchTodos'); // Refresh the to-do list
                commit('setErrorMessage', '');  // Clear error if deleting todo is successful
            } catch (error) {
                commit('setErrorMessage', 'Failed to delete todo');
            }
        },
        async fetchSharedWith({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/todos/shared-with', {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                commit('setSharedWith', response.data);
            } catch (error) {
                commit('setErrorMessage', 'Failed to fetch shared with list');
            }
        },
        async fetchAccessibleLists({ commit, state }) {
            if (!state.token) return;
            try {
                const response = await axios.get('/todos/accessible-lists', {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                commit('setAccessibleLists', response.data);
            } catch (error) {
                commit('setErrorMessage', 'Failed to fetch accessible lists');
            }
        },
        async shareTodoList({ dispatch, state, commit}, email) {
            if (!state.token) return;
            try {
                await axios.post('/todos/share', { email }, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                dispatch('fetchSharedWith'); // Refresh the shared with list after sharing
            } catch (error) {
                commit('setErrorMessage', 'Failed to share todo list');
            }
        },
        async fetchTodoListOfSharedUser({ commit, state }, email) {
            if (!state.token) return;
            try {
                // Make a GET request to fetch the to-do list of the specified user
                const response = await axios.get(`/todos/shared/${email}`, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                // Commit the fetched to-do list to a Vuex state (assuming you have a mutation for it)
                commit('setSelectedUserTodos', response.data); // Store the to-do list in Vuex
            } catch (error) {
                commit('setErrorMessage', 'Failed to fetch to-do list for the user');
            }
        },
        async unshareTodoList({ dispatch, state, commit }, email) {
            if (!state.token) return;
            try {
                await axios.post('/todos/unshare', { email }, {
                    headers: { Authorization: `Bearer ${state.token}` }
                });
                dispatch('fetchSharedWith'); // Refresh the shared with list after unsharing
                commit('setErrorMessage', ''); // Clear any previous error
            } catch (error) {
                commit('setErrorMessage', 'Failed to remove shared access');
            }
        },
        async logout({ commit }) {
            commit('clearUserData'); // Clear user data on logout
        }
    }
});

export default store;
