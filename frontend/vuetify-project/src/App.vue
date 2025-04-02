<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" app v-if="authStore.isLoggedIn" class="peach-drawer">
      <v-list>
        <v-list-item to="/monsters" prepend-icon="mdi-ghost" title="Monstruos" class="nav-item"></v-list-item>
        <v-list-item to="/collectibles" prepend-icon="mdi-sword" title="Coleccionables" class="nav-item"></v-list-item>
        <v-list-item to="/skins" prepend-icon="mdi-tshirt-crew" title="Skins" class="nav-item"></v-list-item>
        <v-list-item to="/levels" prepend-icon="mdi-map" title="Niveles" class="nav-item"></v-list-item>
        <v-list-item to="/music" prepend-icon="mdi-music" title="Música" class="nav-item"></v-list-item>
        <v-list-item to="/config" prepend-icon="mdi-cog" title="Configuración" class="nav-item"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="peach-app-bar">
      <v-app-bar-nav-icon v-if="authStore.isLoggedIn" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="app-title">Game Manager</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="!authStore.isLoggedIn" to="/login" text class="auth-btn">Login</v-btn>
      <v-btn v-if="!authStore.isLoggedIn" to="/register" text class="auth-btn">Register</v-btn>
      <v-btn v-if="authStore.isLoggedIn" @click="logout" text class="auth-btn">Logout</v-btn>
    </v-app-bar>

    <v-main class="peach-main">
      <v-container fluid>
        <!-- Si está en rutas de login o registro, mostrar esas vistas -->
        <router-view v-if="$route.path === '/login' || $route.path === '/register' || $route.path === '/'" />
        
        <!-- Si está autenticado, mostrar vistas protegidas -->
        <router-view v-else-if="authStore.isLoggedIn" />
        
        <!-- Si no está autenticado y no está en login/register, mostrar mensaje de acceso denegado -->
        <v-container v-else class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6" lg="4" class="text-center">
              <v-alert type="warning" class="mb-4 auth-alert">
                Debes iniciar sesión para acceder a esta página
              </v-alert>
              <v-btn color="primary" to="/login" class="mr-2 auth-btn">
                Iniciar Sesión
              </v-btn>
              <v-btn color="secondary" to="/register" class="auth-btn">
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
        await fetch('http://gatovsdino.dam.inspedralbes.cat:3000/auth/logout', {
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
      // Evitamos redirigir a /monsters si explícitamente se está intentando ir a /config
      if (this.$route.path !== '/config') {
        this.$router.push('/monsters')
      }
    }
  }
}
</script>

<style>
.peach-drawer {
  background-color: #FFF7F2;
  border-right: 1px solid rgba(252, 208, 180, 0.3);
}

.peach-app-bar {
  background-color: #FCD0B4 !important;
  color: #333333;
}

.peach-main {
  background-color: #FFF7F2;
}

.app-title {
  font-weight: bold;
  color: #333333;
}

.nav-item {
  margin-bottom: 4px;
}

.nav-item:hover {
  background-color: #FEE9DC;
}

.nav-item.v-list-item--active {
  background-color: #FEE9DC !important;
  font-weight: bold;
}

.auth-btn {
  background-color: #FFF7F2 !important;
  color: #333333 !important;
  font-weight: bold;
  margin: 0 4px;
}

.auth-btn:hover {
  background-color: #FEE9DC !important;
}

.auth-alert {
  background-color: #FEE9DC !important;
  color: #333333 !important;
  border: 1px solid #FCD0B4;
}
</style>
