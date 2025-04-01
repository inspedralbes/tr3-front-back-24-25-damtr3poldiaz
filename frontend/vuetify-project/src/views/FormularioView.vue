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

          <!-- Selección de Monstruos -->
          <v-row>
            <v-col cols="12">
              <v-card-subtitle class="pb-0 pl-0 text-h6">Selecciona tu Monstruo</v-card-subtitle>
              <v-row>
                <v-col cols="12" sm="6" md="4" v-for="monster in monsters" :key="monster.id">
                  <v-card 
                    :class="{ 'selected-card': selectedMonster === monster.id }"
                    class="monster-card"
                    @click="selectedMonster = monster.id"
                  >
                    <v-card-title class="text-center">{{ monster.name }}</v-card-title>
                    
                    <v-card-text>
                      <div class="d-flex justify-center mb-4">
                        <v-avatar size="120" class="monster-avatar">
                          <v-img
                            :src="monster.sprite || 'default-monster.png'"
                            :alt="monster.name"
                            cover
                          ></v-img>
                        </v-avatar>
                      </div>

                      <v-list>
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon color="red">mdi-heart</v-icon>
                            Salud: {{ monster.health }}
                          </v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon color="orange">mdi-sword</v-icon>
                            Fuerza: {{ monster.strength }}
                          </v-list-item-title>
                        </v-list-item>
                        
                        <v-list-item>
                          <v-list-item-title>
                            <v-icon color="blue">mdi-run-fast</v-icon>
                            Velocidad: {{ monster.speed }}
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>

                      <p class="text-caption text-center mt-2">{{ monster.description || 'Sin descripción disponible' }}</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
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
              <v-card-title class="text-h6">Monstruo</v-card-title>
              <div class="text-center my-3" v-if="selectedMonsterObj">
                <v-icon size="large" color="primary">mdi-monster</v-icon>
              </div>
              <v-card-subtitle class="text-center">{{ selectedMonsterObj ? selectedMonsterObj.name : 'No seleccionado' }}</v-card-subtitle>
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

  data() {
    return {
      loading: true,
      saving: false,
      configurationSaved: false,
      userId: null,
      skins: [],
      musicTracks: [],
      monsters: [],
      selectedSkin: null,
      selectedMusic: null,
      selectedMonster: null,
      error: null
    };
  },

  computed: {
    selectedSkinObj() {
      return this.skins.find(skin => skin.id === this.selectedSkin) || null;
    },
    selectedMusicObj() {
      return this.musicTracks.find(music => music.id === this.selectedMusic) || null;
    },
    selectedMonsterObj() {
      return this.monsters.find(monster => monster.id === this.selectedMonster) || null;
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          this.userId = user.id;
          console.log('Usuario inicializado con ID:', this.userId);
        } else {
          console.error('No hay usuario en localStorage');
        }

        await Promise.all([
          this.loadSkins(),
          this.loadMusic(),
          this.loadMonsters(),
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

    async loadMonsters() {
      try {
        const response = await axios.get('http://localhost:3000/monsters');
        console.log('Monstruos cargados:', response.data);
        this.monsters = response.data.map(monster => ({
          ...monster,
          sprite: monster.sprite || '/default-monster.png' // Asegura que siempre haya una imagen
        }));
      } catch (error) {
        console.error('Error loading monsters:', error);
        this.monsters = []; // Inicializa como array vacío en caso de error
      }
    },

    async loadUserConfiguration() {
      if (!this.userId) return;
      
      try {
        const response = await axios.get('http://localhost:3000/game-config', {
          withCredentials: true
        });
        
        if (response.data) {
          this.selectedSkin = response.data.skinId;
          this.selectedMusic = response.data.musicId;
          this.selectedMonster = response.data.monsterId;
          
          if (this.selectedSkin || this.selectedMusic || this.selectedMonster) {
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
        monsterId: this.selectedMonster
      });
      
      this.saving = true;
      try {
        const config = {
          skinId: this.selectedSkin,
          musicId: this.selectedMusic,
          monsterId: this.selectedMonster
        };
        
        const response = await axios.post('http://localhost:3000/game-config', config, {
          withCredentials: true
        });
        
        console.log('Respuesta del servidor:', response.data);
        this.configurationSaved = true;
      } catch (error) {
        console.error('Error saving configuration:', error);
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

.monster-card {
  cursor: pointer;
}

.monster-avatar {
  border-radius: 50%;
}
</style>
