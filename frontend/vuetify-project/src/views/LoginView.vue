<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6">
          <v-card-title class="text-h5 text-center mb-4">
            Iniciar Sesión
          </v-card-title>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              required
              :rules="[
                v => !!v || 'Email es requerido',
                v => /.+@.+\..+/.test(v) || 'Email debe ser válido'
              ]"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Contraseña"
              type="password"
              prepend-inner-icon="mdi-lock"
              variant="outlined"
              required
              :rules="[v => !!v || 'Contraseña es requerida']"
            ></v-text-field>

            <v-alert
              v-if="error"
              type="error"
              class="mb-4"
              density="compact"
            >
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              :loading="loading"
            >
              Iniciar Sesión
            </v-btn>

            <v-row class="mt-4">
              <v-col class="text-center">
                ¿No tienes una cuenta?
                <router-link to="/register" class="text-decoration-none">
                  Registrarse
                </router-link>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.error = '';
      try {
        const res = await axios.post('http://192.168.17.1:3000/auth/login', {
          email: this.email,
          password: this.password
        });
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.$router.push('/dashboard');
      } catch (err) {
        this.error = err.response?.data?.error || 'Error en el login';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: translateY(-2px);
}
</style>
