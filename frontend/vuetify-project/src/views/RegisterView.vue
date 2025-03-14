// Registro.vue
<template>
    <div>
      <h2>Registro</h2>
      <form @submit.prevent="register">
        <input v-model="username" placeholder="Usuario" required />
        <input v-model="email" type="email" placeholder="Email" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button type="submit">Registrarse</button>
      </form>
      <p v-if="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return { username: '', email: '', password: '', error: '' };
    },
    methods: {
      async register() {
        try {
          await axios.post('http://192.168.16.43:3000/auth/register', { 
            username: this.username, 
            email: this.email, 
            password: this.password 
          });
          this.$router.push('/login');
        } catch (err) {
          this.error = err.response?.data?.error || 'Error en el registro';
        }
      },
    },
  };
  </script>