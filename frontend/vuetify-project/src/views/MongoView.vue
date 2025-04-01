<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="text-center">
        <h1>MongoDB Service Control</h1>
      </v-col>
    </v-row>

    <v-row justify="center" align="center">
      <v-col cols="12" md="6" class="text-center">
        <v-card>
          <v-card-text>
            <div class="text-h6 mb-4">
              Status: <span :class="statusColor">{{ status }}</span>
            </div>
            <v-btn
              :color="isRunning ? 'error' : 'success'"
              :loading="loading"
              class="mx-2"
              @click="toggleService"
            >
              {{ isRunning ? 'Stop MongoDB' : 'Start MongoDB' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: 'MongoView',
  data() {
    return {
      status: 'Checking...',
      loading: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: 'info',
      API_URL: 'http://localhost:3000/api/mongodb',
      statusInterval: null
    }
  },
  computed: {
    isRunning() {
      return this.status === 'Running'
    },
    statusColor() {
      if (this.status === 'Running') return 'text-success'
      if (this.status === 'Stopped') return 'text-error'
      return 'text-grey'
    }
  },
  methods: {
    async checkStatus() {
      try {
        const response = await fetch(`${this.API_URL}/status`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        this.status = data.status
      } catch (error) {
        console.error('Error checking status:', error)
        this.status = 'Error'
        this.showSnackbar('Error checking MongoDB status. Please check if the backend server is running.', 'error')
      }
    },
    async toggleService() {
        if (this.loading) return;

        this.loading = true;
        const action = this.isRunning ? 'stop' : 'start'; // Decide si es stop o start

        try {
          // Asegúrate de que la URL de la API sea correcta
          const response = await fetch(`${this.API_URL}/${action}`, {
            method: 'POST'
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          this.showSnackbar(data.message, 'success');

          // Actualiza el estado después de un pequeño retraso
          setTimeout(() => this.checkStatus(), 2000);
        } catch (error) {
          console.error(`Error ${action}ing service:`, error);
          this.showSnackbar(
            `Failed to ${action} MongoDB: ${error.message || 'Unknown error'}`,
            'error'
          );
          setTimeout(() => this.checkStatus(), 1000); // Reintentar
        } finally {
          this.loading = false;
        }
      }
      ,
    showSnackbar(text, color = 'success') {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    }
  },
  mounted() {
    this.checkStatus()
    // Check status periodically
    this.statusInterval = setInterval(() => {
      if (!this.loading) this.checkStatus()
    }, 5000)
  },
  beforeDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval)
    }
  }
}
</script>

<style scoped>
.v-card {
  margin: 20px;
  padding: 20px;
}
</style>
