// RegisterView.vue
<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-6">
          <v-card-title class="text-h5 text-center mb-4">
            Registro
          </v-card-title>
          <v-form @submit.prevent="register">
            <v-text-field
              v-model="username"
              label="Usuario"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              required
              :rules="[v => !!v || 'Usuario es requerido']"
            ></v-text-field>

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
              Registrarse
            </v-btn>

            <v-row class="mt-4">
              <v-col class="text-center">
                ¿Ya tienes una cuenta?
                <router-link to="/login" class="text-decoration-none">
                  Iniciar sesión
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
      username: '',
      email: '',
      password: '',
      error: '',
      loading: false
    };
  },
  methods: {
    async register() {
      this.loading = true;
      this.error = '';
      try {
        await axios.post('http://localhost:3000/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password
        });
        this.$router.push('/login');
      } catch (err) {
        this.error = err.response?.data?.error || 'Error en el registro';
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