<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1 class="text-h3 mb-4">Panel de Control</h1>
        <p v-if="user" class="text-h5 mb-6">Bienvenido, {{ user.username }}</p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card to="/monsters" class="mb-4" elevation="2" hover>
          <v-card-title class="text-center pa-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-ghost</v-icon>
            <div>Monstruos</div>
          </v-card-title>
          <v-card-text class="text-center">
            Gestiona los monstruos del juego
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card to="/collectibles" class="mb-4" elevation="2" hover>
          <v-card-title class="text-center pa-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-sword</v-icon>
            <div>Coleccionables</div>
          </v-card-title>
          <v-card-text class="text-center">
            Administra armas y power-ups
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card to="/skins" class="mb-4" elevation="2" hover>
          <v-card-title class="text-center pa-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-tshirt-crew</v-icon>
            <div>Skins</div>
          </v-card-title>
          <v-card-text class="text-center">
            Gestiona las skins de personajes
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card to="/levels" class="mb-4" elevation="2" hover>
          <v-card-title class="text-center pa-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-map</v-icon>
            <div>Niveles</div>
          </v-card-title>
          <v-card-text class="text-center">
            Configura los niveles y oleadas
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="4">
        <v-card to="/music" class="mb-4" elevation="2" hover>
          <v-card-title class="text-center pa-4">
            <v-icon size="48" color="primary" class="mb-2">mdi-music</v-icon>
            <div>Música</div>
          </v-card-title>
          <v-card-text class="text-center">
            Gestiona la música del juego
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'DashboardView',
  data() {
    return {
      user: null
    }
  },
  created() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      this.user = JSON.parse(userStr)
    } else {
      this.$router.push('/login')
    }
  }
}
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
