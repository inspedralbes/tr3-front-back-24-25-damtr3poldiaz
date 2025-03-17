<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Iniciar Sesión</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return { email: '', password: '', error: '' };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post('http://192.168.17.1:3000/auth/login', { 
          email: this.email, 
          password: this.password 
        });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.error || 'Error en el login';
      }
    },
  },
};
</script>

