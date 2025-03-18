<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="auto">
        <h1 class="text-h4">Gestión de Skins</h1>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Cerrar sesión
        </v-btn>
      </v-col>
    </v-row>

    <!-- Formulario para añadir/editar skin -->
    <v-card class="mb-6">
      <v-card-title class="text-h6 bg-primary text-white pa-4">
        {{ formTitle }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveItem" class="mt-4">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedItem.name"
                label="Nombre"
                variant="outlined"
                required
                :rules="[v => !!v || 'El nombre es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="editedItem.sprite"
                label="URL del Sprite"
                variant="outlined"
                placeholder="https://ejemplo.com/sprite.png"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editedItem.description"
                label="Descripción"
                variant="outlined"
                rows="3"
              ></v-textarea>
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

    <!-- Tabla de skins -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="skins"
        :loading="loading"
        class="elevation-1"
      >
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
        <template v-slot:item.sprite="{ item }">
          <v-avatar v-if="item.sprite" size="40">
            <v-img :src="item.sprite" :alt="item.name"></v-img>
          </v-avatar>
          <span v-else>No imagen</span>
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
          ¿Estás seguro de que quieres eliminar esta skin?
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
  name: 'SkinsView',

  data: () => ({
    loading: false,
    saving: false,
    deleting: false,
    dialogDelete: false,
    headers: [
      { title: 'Nombre', key: 'name', align: 'start' },
      { title: 'Descripción', key: 'description', align: 'center' },
      { title: 'Sprite', key: 'sprite', align: 'center' },
      { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
    ],
    skins: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      description: '',
      sprite: ''
    },
    defaultItem: {
      name: '',
      description: '',
      sprite: ''
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nueva Skin' : 'Editar Skin';
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/skins');
        this.skins = response.data;
      } catch (error) {
        console.error('Error loading skins:', error);
      } finally {
        this.loading = false;
      }
    },

    editItem(item) {
      this.editedIndex = this.skins.indexOf(item);
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
          await axios.put(`http://localhost:3000/skins/${this.editedItem.id}`, this.editedItem);
        } else {
          // Crear nuevo
          await axios.post('http://localhost:3000/skins', this.editedItem);
        }
        this.initialize();
        this.closeDialog();
      } catch (error) {
        console.error('Error saving skin:', error);
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
        await axios.delete(`http://localhost:3000/skins/${this.editedItem.id}`);
        this.initialize();
        this.dialogDelete = false;
      } catch (error) {
        console.error('Error deleting skin:', error);
      } finally {
        this.deleting = false;
      }
    },

    logout() {
      this.$router.push('/login');
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
