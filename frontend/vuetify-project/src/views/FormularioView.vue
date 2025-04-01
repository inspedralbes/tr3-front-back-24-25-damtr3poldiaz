<template>
  <v-container>
    <v-card class="mx-auto pa-4" max-width="800">
      <v-card-title class="text-h4 mb-4">
        Game Configuration
      </v-card-title>

      <v-form @submit.prevent="saveConfiguration">
        <!-- Monsters Selection -->
        <v-select
          v-model="selectedMonster"
          :items="monsters"
          item-title="name"
          item-value="id"
          label="Select Monster"
          :loading="loading"
          required
          :error-messages="monsters.length === 0 ? ['No monsters available'] : []"
        ></v-select>

        <!-- Skins Selection -->
        <v-select
          v-model="selectedSkin"
          :items="skins"
          item-title="name"
          item-value="id"
          label="Select Skin"
          :loading="loading"
          required
          class="mt-4"
          :error-messages="skins.length === 0 ? ['No skins available'] : []"
        ></v-select>

        <!-- Music Selection -->
        <v-select
          v-model="selectedMusic"
          :items="music"
          item-title="name"
          item-value="id"
          label="Select Music"
          :loading="loading"
          required
          class="mt-4"
          :error-messages="music.length === 0 ? ['No music available'] : []"
        ></v-select>

        <v-btn
          type="submit"
          color="primary"
          block
          class="mt-6"
          :loading="saving"
          :disabled="!isFormValid"
        >
          Save Configuration
        </v-btn>
      </v-form>

      <!-- Success/Error Alert -->
      <v-alert
        v-if="alert.show"
        :type="alert.type"
        :text="alert.message"
        class="mt-4"
      ></v-alert>
    </v-card>

    <!-- Debug Info -->
    <v-card class="mt-4 pa-4" v-if="debugInfo">
      <v-card-title class="d-flex align-center">
        Debug Info
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-refresh"
          size="small"
          :loading="loadingDebug"
          @click="loadDebugInfo"
        >
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="debugInfo.error"
          type="error"
          :text="debugInfo.error"
          class="mb-4"
        ></v-alert>
        <pre>{{ debugInfo }}</pre>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/api.js';

export default {
  name: 'FormularioView',
  data() {
    return {
      monsters: [],
      skins: [],
      music: [],
      selectedMonster: null,
      selectedSkin: null,
      selectedMusic: null,
      loading: false,
      loadingDebug: false,
      saving: false,
      alert: {
        show: false,
        type: 'success',
        message: ''
      },
      debugInfo: null
    };
  },
  computed: {
    isFormValid() {
      return this.selectedMonster && this.selectedSkin && this.selectedMusic;
    }
  },
  async created() {
    await this.loadGameAssets();
    await this.loadDebugInfo();
  },
  methods: {
    async loadGameAssets() {
      this.loading = true;
      try {
        // Get data from individual endpoints
        const [monstersRes, skinsRes, musicRes] = await Promise.all([
          api.get('/monsters'),
          api.get('/skins'),
          api.get('/music')
        ]);

        this.monsters = monstersRes.data;
        this.skins = skinsRes.data;
        this.music = musicRes.data;

        if (this.monsters.length === 0 || this.skins.length === 0 || this.music.length === 0) {
          this.showAlert('warning', 'Some game assets are not available');
        }
      } catch (error) {
        this.showAlert('error', 'Error loading game assets');
        console.error('Error loading game assets:', error);
      } finally {
        this.loading = false;
      }
    },
    async loadDebugInfo() {
      this.loadingDebug = true;
      try {
        const response = await api.get('/game-config/debug');
        this.debugInfo = response.data;
      } catch (error) {
        this.debugInfo = {
          error: 'Error loading debug info',
          details: error.message,
          timestamp: new Date().toISOString()
        };
      } finally {
        this.loadingDebug = false;
      }
    },
    async saveConfiguration() {
    if (!this.isFormValid) {
        this.showAlert('error', 'Please select all options');
        return;
    }

    this.saving = true;
    try {
        const response = await api.post('/game-config/config', {
        userId: 1,  // ⚠️ REEMPLAZA ESTO POR EL USER ID CORRECTO
        monsterId: this.selectedMonster,
        skinId: this.selectedSkin,
        musicId: this.selectedMusic
        });

        if (response.data.success) {
        this.showAlert('success', 'Configuration saved successfully!');
        this.debugInfo = response.data.config;  // Mostramos la nueva config guardada
        } else {
        this.showAlert('error', 'Failed to save configuration');
        }
    } catch (error) {
        this.showAlert('error', 'Error saving configuration');
        console.error('Error saving configuration:', error);
    } finally {
        this.saving = false;
    }
    },

    showAlert(type, message) {
      this.alert = {
        show: true,
        type,
        message
      };
      setTimeout(() => {
        this.alert.show = false;
      }, 3000);
    }
  }
};
</script>