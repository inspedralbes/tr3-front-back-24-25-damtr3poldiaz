<template>
    <div>
      <h1>Dashboard</h1>
      <p v-if="user">Bienvenido, {{ user.username }}</p>
      <button @click="logout">Cerrar sesión</button>
    </div>
  </template>
  
  <script>
  import api from '@/api.js';
  
  export default {
    data() {
      return { user: null };
    },
    created() {
      this.user = JSON.parse(localStorage.getItem('user'));
    },
    methods: {
      async logout() {
        await api.post('/auth/logout');
        localStorage.removeItem('user');
        this.$router.push('/');
      },
    },
  };
  </script>
  