<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p v-if="user">Bienvenido, {{ user.username }}</p>

    <div class="menu">
      <router-link to="/monsters" class="btn btn-primary">Gestión de Monstruos</router-link>
      <router-link to="/items" class="btn btn-secondary">Gestión de Ítems</router-link>
      <router-link to="/levels" class="btn btn-success">Gestión de Niveles</router-link>
      <router-link to="/skins" class="btn btn-warning">Gestión de Skins</router-link>
      <router-link to="/settings" class="btn btn-info">Configuración</router-link>
    </div>

    <button @click="logout" class="btn btn-danger">Cerrar sesión</button>
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

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: 20px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 10px;
  font-size: 16px;
}
</style>
