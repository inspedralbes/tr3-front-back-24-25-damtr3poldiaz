<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="auto">
        <h1 class="text-h4">Gestión de Música</h1>
      </v-col>
    </v-row>

    <!-- Formulario para añadir/editar configuración de música -->
    <v-card class="mb-6">
      <v-card-title class="text-h6 bg-primary text-white pa-4">
        {{ formTitle }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveItem" class="mt-4">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedItem.scene"
                label="Escena"
                variant="outlined"
                required
                :rules="[v => !!v || 'La escena es requerida']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedItem.track_path"
                label="Ruta de la Pista"
                variant="outlined"
                required
                :rules="[v => !!v || 'La ruta de la pista es requerida']"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-switch
                v-model="editedItem.is_looping"
                label="¿Reproducir en bucle?"
                color="primary"
              ></v-switch>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="12" class="text-right">
              <v-btn
                v-if="editedIndex > -1"
                color="warning"
                class="mr-2"
                @click="closeDialog"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="saving"
              >
                {{ editedIndex === -1 ? "Agregar" : "Actualizar" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Tabla de configuraciones de música -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="musicSettings"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.is_looping="{ item }">
          <v-icon v-if="item.is_looping" color="success">mdi-check</v-icon>
          <v-icon v-else color="error">mdi-close</v-icon>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            color="primary"
            size="small"
            class="mr-2"
            @click="editItem(item)"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn
            icon
            color="error"
            size="small"
            @click="confirmDelete(item)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar esta configuración de música?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialogDelete = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteItemConfirm">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MusicView',

  data: () => ({
    loading: false,
    saving: false,
    deleting: false,
    dialogDelete: false,
    headers: [
      { title: 'Escena', key: 'scene', align: 'start' },
      { title: 'Ruta de la Pista', key: 'track_path', align: 'center' },
      { title: 'En Bucle', key: 'is_looping', align: 'center' },
      { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
    ],
    musicSettings: [],
    editedIndex: -1,
    editedItem: {
      scene: '',
      track_path: '',
      is_looping: true
    },
    defaultItem: {
      scene: '',
      track_path: '',
      is_looping: true
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Configuración de Música' : 'Editar Configuración de Música';
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/music');
        this.musicSettings = response.data;
      } catch (error) {
        console.error('Error loading music settings:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.editedIndex = this.musicSettings.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    closeDialog() {
      this.editedIndex = -1;
      this.editedItem = Object.assign({}, this.defaultItem);
    },

    async saveItem() {
      this.saving = true;
      try {
        if (this.editedIndex > -1) {
          // Actualizar
          await axios.put(`http://localhost:3000/music/${this.editedItem.id}`, this.editedItem);
        } else {
          // Crear nuevo
          await axios.post('http://localhost:3000/music', this.editedItem);
        }
        this.initialize();
        this.closeDialog();
      } catch (error) {
        console.error('Error saving music setting:', error);
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      this.deleting = true;
      try {
        await axios.delete(`http://localhost:3000/music/${this.editedItem.id}`);
        this.initialize();
        this.dialogDelete = false;
      } catch (error) {
        console.error('Error deleting music setting:', error);
      } finally {
        this.deleting = false;
      }
    },
    async logout() {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      this.$router.push("/");
    }
  }
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
