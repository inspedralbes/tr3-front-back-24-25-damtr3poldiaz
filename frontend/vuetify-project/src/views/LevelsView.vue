<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="auto">
        <h1 class="text-h4">Gestión de Niveles</h1>
      </v-col>
    </v-row>

    <!-- Formulario para añadir/editar nivel -->
    <v-card class="mb-6">
      <v-card-title class="text-h6 bg-primary text-white pa-4">
        {{ formTitle }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveItem" class="mt-4">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="editedItem.level_number"
                label="Número de Nivel"
                type="number"
                variant="outlined"
                required
                :rules="[v => !!v || 'El número de nivel es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="editedItem.wave"
                label="Oleada"
                type="number"
                variant="outlined"
                required
                :rules="[v => !!v || 'La oleada es requerida']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="editedItem.enemy_type"
                :items="monsters"
                item-title="name"
                item-value="id"
                label="Tipo de Enemigo"
                variant="outlined"
                required
                :rules="[v => !!v || 'El tipo de enemigo es requerido']"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="editedItem.enemy_count"
                label="Cantidad de Enemigos"
                type="number"
                variant="outlined"
                required
                :rules="[v => !!v || 'La cantidad de enemigos es requerida']"
              ></v-text-field>
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

    <!-- Tabla de niveles -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="levels"
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
      </v-data-table>
    </v-card>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogDelete" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar este nivel?
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
  name: 'LevelsView',

  data: () => ({
    loading: false,
    saving: false,
    deleting: false,
    dialogDelete: false,
    headers: [
      { title: 'Nivel', key: 'level_number', align: 'start' },
      { title: 'Oleada', key: 'wave', align: 'center' },
      { title: 'Tipo de Enemigo', key: 'enemy_type', align: 'center' },
      { title: 'Cantidad de Enemigos', key: 'enemy_count', align: 'center' },
      { title: 'Acciones', key: 'actions', align: 'center', sortable: false }
    ],
    levels: [],
    monsters: [], // Lista de monstruos para el selector
    editedIndex: -1,
    editedItem: {
      level_number: 1,
      wave: 1,
      enemy_type: null,
      enemy_count: 1
    },
    defaultItem: {
      level_number: 1,
      wave: 1,
      enemy_type: null,
      enemy_count: 1
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Nuevo Nivel' : 'Editar Nivel';
    }
  },

  created() {
    this.initialize();
    this.loadMonsters();
  },

  methods: {
    async initialize() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:3000/levels');
        this.levels = response.data;
      } catch (error) {
        console.error('Error loading levels:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadMonsters() {
      try {
        const response = await axios.get('http://localhost:3000/monsters');
        this.monsters = response.data;
      } catch (error) {
        console.error('Error loading monsters:', error);
      }
    },

    editItem(item) {
      this.editedIndex = this.levels.indexOf(item);
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
          await axios.put(`http://localhost:3000/levels/${this.editedItem.id}`, this.editedItem);
        } else {
          // Crear nuevo
          await axios.post('http://localhost:3000/levels', this.editedItem);
        }
        this.initialize();
        this.closeDialog();
      } catch (error) {
        console.error('Error saving level:', error);
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
        await axios.delete(`http://localhost:3000/levels/${this.editedItem.id}`);
        this.initialize();
        this.dialogDelete = false;
      } catch (error) {
        console.error('Error deleting level:', error);
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
