<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="authStore.isLoggedIn">
      <v-list>
        <v-list-item to="/monsters" prepend-icon="mdi-ghost" title="Monstruos"></v-list-item>
        <v-list-item to="/collectibles" prepend-icon="mdi-sword" title="Coleccionables"></v-list-item>
        <v-list-item to="/skins" prepend-icon="mdi-tshirt-crew" title="Skins"></v-list-item>
        <v-list-item to="/levels" prepend-icon="mdi-map" title="Niveles"></v-list-item>
        <v-list-item to="/music" prepend-icon="mdi-music" title="Música"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon v-if="authStore.isLoggedIn" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Game Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authStore.isLoggedIn" to="/login" text>Login</v-btn>
      <v-btn v-if="!authStore.isLoggedIn" to="/register" text>Register</v-btn>
      <v-btn v-if="authStore.isLoggedIn" @click="logout" text>Logout</v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <!-- Si está en rutas de login o registro, mostrar esas vistas -->
        <router-view v-if="$route.path === '/login' || $route.path === '/register' || $route.path === '/'" />
        
        <!-- Si está autenticado, mostrar vistas protegidas -->
        <router-view v-else-if="authStore.isLoggedIn" />
        
        <!-- Si no está autenticado y no está en login/register, mostrar mensaje de acceso denegado -->
        <v-container v-else class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
              <v-alert type="warning" class="mb-4">
                Debes iniciar sesión para acceder a esta página
              </v-alert>
              <v-btn color="primary" to="/login" class="mr-2">
                Iniciar Sesión
              </v-btn>
              <v-btn color="secondary" to="/register">
                Registrarse
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { authStore } from './store/auth.js'

export default {
  name: 'App',
  data() {
    return {
      drawer: null,
      authStore
    }
  },
  methods: {
    async logout() {
      try {
        await fetch('http://localhost:3000/auth/logout', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
      // Usar el store para cerrar sesión
      this.authStore.logout()
      this.$router.push('/login')
    }
  },
  created() {
    // Redirigir a Monstruos si está autenticado y está en login/register
    if (this.authStore.isLoggedIn && 
        (this.$route.path === '/login' || 
         this.$route.path === '/register' || 
         this.$route.path === '/')) {
      this.$router.push('/monsters')
    }
  }
}
</script>
