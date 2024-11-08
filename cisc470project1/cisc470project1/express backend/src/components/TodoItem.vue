<template>
  <div class="todo-item">
    <input type="checkbox" :checked="todo.done" @change="toggleDone" />
    <span :class="{ done: todo.done }">{{ todo.text }}</span>
    <button @click="$emit('delete', todo.id)" class="delete-button">Delete</button>
  </div>
</template>

<script>
export default {
  props: ['todo'],
  methods: {
    toggleDone() {
      this.$emit('update', { ...this.todo, done: !this.todo.done });
    },
  },
};
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-item input[type="checkbox"] {
  margin-right: 10px;
}

.todo-item span {
  flex-grow: 1;
  font-size: 18px;
}

.todo-item span.done {
  text-decoration: line-through;
  color: #a0aec0;
}

.delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  color: white;
  background-color: #e53e3e;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #c53030;
}
</style>
