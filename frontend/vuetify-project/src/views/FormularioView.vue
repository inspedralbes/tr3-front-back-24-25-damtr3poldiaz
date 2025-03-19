<template>
  <v-container class="peach-container">
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="auto">
        <h1 class="text-h4 custom-title">Configuración de Juego</h1>
      </v-col>
    </v-row>

    <v-card class="mb-6">
      <v-card-title class="text-h6 peach-header pa-4">
        Personaliza tu Experiencia de Juego
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveConfiguration" class="my-4">
          <!-- Selección de Skin -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-card-subtitle class="pb-0 pl-0">Selecciona tu Skin</v-card-subtitle>
              <v-radio-group v-model="selectedSkin" :disabled="loading" class="mt-4">
                <v-row>
                  <v-col cols="12" sm="6" v-for="(skin, index) in skins" :key="`skin-${index}`">
                    <v-card class="pa-2" :class="{ 'selected-card': selectedSkin === skin.id }">
                      <v-radio :value="skin.id" :label="skin.name"></v-radio>
                      <div class="d-flex justify-center mt-2">
                        <v-avatar size="80" class="mb-2">
                          <v-img :src="skin.sprite" :alt="skin.name"></v-img>
                        </v-avatar>
                      </div>
                      <div class="text-caption text-center">{{ skin.description }}</div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>

            <!-- Selección de Música -->
            <v-col cols="12" sm="6">
              <v-card-subtitle class="pb-0 pl-0">Selecciona tu Música</v-card-subtitle>
              <v-radio-group v-model="selectedMusic" :disabled="loading" class="mt-4">
                <v-row>
                  <v-col cols="12" sm="6" v-for="(music, index) in musicTracks" :key="`music-${index}`">
                    <v-card class="pa-2" :class="{ 'selected-card': selectedMusic === music.id }">
                      <v-radio :value="music.id" :label="music.name"></v-radio>
                      <div class="text-caption text-center">{{ music.description }}</div>
                      <div class="text-center mt-2">
                        <audio controls style="width: 100%">
                          <source :src="music.url" type="audio/mpeg">
                          Tu navegador no soporta el elemento de audio.
                        </audio>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-radio-group>
            </v-col>
          </v-row>

          <!-- Selección de Nivel -->
          <v-card-subtitle class="mt-4 pb-0 pl-0">Selecciona tu Nivel de Inicio</v-card-subtitle>
          <v-row>
            <v-col cols="12" sm="4" v-for="(level, index) in levels" :key="`level-${index}`">
              <v-card class="pa-2" :class="{ 'selected-card': selectedLevel === level.id }">
                <v-radio-group v-model="selectedLevel" :disabled="loading" hide-details>
                  <v-radio :value="level.id" :label="level.name"></v-radio>
                </v-radio-group>
                <div class="text-subtitle-2 mt-2">Dificultad: {{ level.difficulty }}</div>
                <div class="text-caption mt-1">{{ level.description }}</div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Botón de guardar -->
          <v-row class="mt-4">
            <v-col cols="12" class="text-right">
              <v-btn
                color="peach"
                type="submit"
                :loading="saving"
                class="custom-btn"
              >
                Guardar Configuración
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Previsualización de la configuración -->
    <v-card v-if="configurationSaved">
      <v-card-title class="text-h6 peach-header pa-4">
        Configuración Guardada
      </v-card-title>
      <v-card-text class="mt-4">
        <v-alert type="success" class="mb-4">
          La configuración ha sido guardada exitosamente. El juego utilizará esta configuración la próxima vez que lo inicies.
        </v-alert>
        
        <v-row>
          <v-col cols="12" sm="4">
            <v-card class="pa-4">
              <v-card-title class="text-h6">Skin</v-card-title>
              <div class="d-flex justify-center my-3" v-if="selectedSkinObj">
                <v-avatar size="100">
                  <v-img :src="selectedSkinObj.sprite" :alt="selectedSkinObj.name"></v-img>
                </v-avatar>
              </div>
              <v-card-subtitle class="text-center">{{ selectedSkinObj ? selectedSkinObj.name : 'No seleccionada' }}</v-card-subtitle>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="4">
            <v-card class="pa-4">
              <v-card-title class="text-h6">Música</v-card-title>
              <div class="text-center my-3" v-if="selectedMusicObj">
                <v-icon size="large" color="primary">mdi-music</v-icon>
              </div>
              <v-card-subtitle class="text-center">{{ selectedMusicObj ? selectedMusicObj.name : 'No seleccionada' }}</v-card-subtitle>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="4">
            <v-card class="pa-4">
              <v-card-title class="text-h6">Nivel</v-card-title>
              <div class="text-center my-3" v-if="selectedLevelObj">
                <v-icon size="large" color="primary">mdi-map</v-icon>
              </div>
              <v-card-subtitle class="text-center">{{ selectedLevelObj ? selectedLevelObj.name : 'No seleccionado' }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FormularioView',

  data: () => ({
    // Estado de carga y guardado
    loading: false,
    saving: false,
    configurationSaved: false,
    
    // Datos del usuario
    userId: null,
    
    // Datos de selección
    selectedSkin: null,
    selectedMusic: null,
    selectedLevel: null,
    
    // Datos disponibles
    skins: [],
    musicTracks: [],
    levels: []
  }),

  computed: {
    selectedSkinObj() {
      return this.skins.find(skin => skin.id === this.selectedSkin) || null;
    },
    selectedMusicObj() {
      return this.musicTracks.find(music => music.id === this.selectedMusic) || null;
    },
    selectedLevelObj() {
      return this.levels.find(level => level.id === this.selectedLevel) || null;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        // Obtener el ID del usuario del localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          this.userId = user.id;
          console.log('Usuario inicializado con ID:', this.userId);
        } else {
          console.error('No hay usuario en localStorage');
        }

        // Cargar datos paralelos
        await Promise.all([
          this.loadSkins(),
          this.loadMusic(),
          this.loadLevels(),
          this.loadUserConfiguration()
        ]);
      } catch (error) {
        console.error('Error initializing form:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadSkins() {
      try {
        const response = await axios.get('http://localhost:3000/skins');
        this.skins = response.data;
      } catch (error) {
        console.error('Error loading skins:', error);
      }
    },

    async loadMusic() {
      try {
        const response = await axios.get('http://localhost:3000/music');
        this.musicTracks = response.data;
      } catch (error) {
        console.error('Error loading music:', error);
      }
    },

    async loadLevels() {
      try {
        const response = await axios.get('http://localhost:3000/levels');
        this.levels = response.data;
      } catch (error) {
        console.error('Error loading levels:', error);
      }
    },

    async loadUserConfiguration() {
      if (!this.userId) return;
      
      try {
        // Usar credentials: 'include' para enviar cookies
        const response = await axios.get('http://localhost:3000/game-config', {
          withCredentials: true
        });
        
        // Si el usuario ya tiene una configuración, cargarla
        if (response.data) {
          this.selectedSkin = response.data.skinId;
          this.selectedMusic = response.data.musicId;
          this.selectedLevel = response.data.levelId;
          
          // Si el usuario ya tenía una configuración guardada, mostrar la previsualización
          if (this.selectedSkin || this.selectedMusic || this.selectedLevel) {
            this.configurationSaved = true;
          }
        }
      } catch (error) {
        console.error('Error loading user configuration:', error);
      }
    },

    async saveConfiguration() {
      if (!this.userId) {
        console.error('Usuario no autenticado');
        
        // Intentar obtener el ID del usuario de localStorage
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            if (user && user.id) {
              this.userId = user.id;
              console.log('Recuperado userId de localStorage:', this.userId);
            } else {
              console.error('Objeto user en localStorage no contiene un ID válido');
              return;
            }
          } catch (error) {
            console.error('Error parseando user de localStorage:', error);
            return;
          }
        } else {
          console.error('No hay datos de usuario en localStorage');
          return;
        }
      }
      
      console.log('Guardando configuración para el usuario:', this.userId);
      console.log('Datos a enviar:', {
        skinId: this.selectedSkin,
        musicId: this.selectedMusic,
        levelId: this.selectedLevel
      });
      
      this.saving = true;
      try {
        const config = {
          skinId: this.selectedSkin,
          musicId: this.selectedMusic,
          levelId: this.selectedLevel
        };
        
        // Usar credentials: 'include' para enviar cookies
        const response = await axios.post('http://localhost:3000/game-config', config, {
          withCredentials: true
        });
        
        console.log('Respuesta del servidor:', response.data);
        this.configurationSaved = true;
      } catch (error) {
        console.error('Error saving configuration:', error);
        // Mostrar más detalles del error si están disponibles
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
      } finally {
        this.saving = false;
      }
    }
  }
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
  border: 1px solid rgba(252, 208, 180, 0.3);
}
.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(252, 208, 180, 0.5);
}

audio {
  max-width: 100%;
}

/* Aplicar el color personalizado */
:deep(.bg-primary) {
  background-color: #FCD0B4 !important;
  color: #333333 !important;
}

:deep(.selected-card) {
  background-color: #FEE9DC !important;
  border: 2px solid #FCD0B4 !important;
}

:deep(.bg-success) {
  background-color: #FCD0B4 !important;
  color: #333333 !important;
}

:deep(.text-white) {
  color: #333333 !important;
}

:deep(.v-btn.v-btn--elevated.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.bg-primary),
:deep(.v-btn.v-btn--elevated.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.bg-success),
:deep(.v-btn.v-btn--elevated.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-elevated.text-white) {
  background-color: #FCD0B4 !important;
  color: #333333 !important;
}

:deep(.v-card .v-card-title.bg-primary),
:deep(.v-card .v-card-title.bg-success) {
  background-color: #FCD0B4 !important;
  color: #333333 !important;
}

:deep(.v-btn.text-primary),
:deep(.v-icon.text-primary) {
  color: #FCD0B4 !important;
}

:deep(.v-alert.bg-success) {
  background-color: #FEE9DC !important;
  color: #333333 !important;
  border-color: #FCD0B4 !important;
}

:deep(.v-btn.custom-btn) {
  background-color: #FCD0B4 !important;
  color: #333333 !important;
  font-weight: bold;
  border: none;
  transition: all 0.3s ease;
}

:deep(.v-btn.custom-btn:hover) {
  background-color: #FFE7D5 !important;
  box-shadow: 0 4px 8px rgba(252, 208, 180, 0.5);
}

:deep(.v-radio-group .v-radio:has(input:checked) label) {
  color: #333333;
  font-weight: bold;
}

:deep(.v-container) {
  background-color: #FFF7F2;
}

.peach-container {
  background-color: #FFF7F2;
}

.custom-title {
  color: #333333;
  font-weight: bold;
}

.peach-header {
  background-color: #FCD0B4;
  color: #333333;
}
</style>
