<template>
  <v-container>
    <v-row justify="space-between" align="center" class="mb-6">
      <v-col cols="auto">
        <h1 class="text-h4">Gestión de Monstruos</h1>
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

    <!-- Formulario para añadir/editar monstruos -->
    <v-card class="mb-6">
      <v-card-title class="text-h6 bg-primary text-white pa-4">
        {{ editing ? "Editar Monstruo" : "Nuevo Monstruo" }}
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="saveMonster" class="mt-4">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="monster.name"
                label="Nombre"
                variant="outlined"
                required
                :rules="[v => !!v || 'El nombre es requerido']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="monster.sprite"
                label="URL del Sprite"
                variant="outlined"
                placeholder="https://ejemplo.com/sprite.png"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="monster.strength"
                type="number"
                label="Fuerza"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'La fuerza es requerida',
                  v => v >= 0 || 'La fuerza debe ser positiva'
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="monster.speed"
                type="number"
                label="Velocidad"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'La velocidad es requerida',
                  v => v >= 0 || 'La velocidad debe ser positiva'
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model.number="monster.health"
                type="number"
                label="Salud"
                variant="outlined"
                required
                :rules="[
                  v => !!v || 'La salud es requerida',
                  v => v >= 0 || 'La salud debe ser positiva'
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="12" class="text-right">
              <v-btn
                v-if="editing"
                color="warning"
                class="mr-2"
                @click="cancelEdit"
              >
                Cancelar
              </v-btn>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
              >
                {{ editing ? "Actualizar" : "Agregar" }}
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Tabla de monstruos -->
    <v-card>
      <v-data-table
        :headers="headers"
        :items="monsters"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.sprite="{ item }">
          <v-avatar v-if="item.sprite" size="40">
            <v-img :src="item.sprite" :alt="item.name"></v-img>
          </v-avatar>
          <span v-else>No imagen</span>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-btn
            icon
            color="primary"
            size="small"
            class="mr-2"
            @click="editMonster(item)"
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
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar este monstruo?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="text" @click="deleteMonster">
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import api from "@/api.js";

export default {
  data() {
    return {
      user: null,
      monsters: [],
      monster: { name: "", strength: "", speed: "", health: "", sprite: "" },
      editing: false,
      editingId: null,
      loading: false,
      deleteDialog: false,
      monsterToDelete: null,
      headers: [
        { title: 'Nombre', key: 'name', align: 'start' },
        { title: 'Fuerza', key: 'strength', align: 'center' },
        { title: 'Velocidad', key: 'speed', align: 'center' },
        { title: 'Salud', key: 'health', align: 'center' },
        { title: 'Sprite', key: 'sprite', align: 'center' },
        { title: 'Acciones', key: 'actions', align: 'center', sortable: false },
      ],
    };
  },
  async created() {
    this.user = JSON.parse(localStorage.getItem("user"));
    this.fetchMonsters();
  },
  methods: {
    async fetchMonsters() {
      this.loading = true;
      try {
        const response = await api.get("/monsters");
        this.monsters = response.data;
      } catch (error) {
        console.error("Error obteniendo monstruos:", error);
      } finally {
        this.loading = false;
      }
    },
    async saveMonster() {
      this.loading = true;
      try {
        if (this.editing) {
          await api.put(`/monsters/${this.editingId}`, this.monster);
        } else {
          await api.post("/monsters", this.monster);
        }
        this.fetchMonsters();
        this.resetForm();
      } catch (error) {
        console.error("Error guardando monstruo:", error);
      } finally {
        this.loading = false;
      }
    },
    editMonster(monster) {
      this.monster = { ...monster };
      this.editing = true;
      this.editingId = monster.id;
    },
    cancelEdit() {
      this.resetForm();
    },
    confirmDelete(monster) {
      this.monsterToDelete = monster;
      this.deleteDialog = true;
    },
    async deleteMonster() {
      if (!this.monsterToDelete) return;
      
      this.loading = true;
      try {
        await api.delete(`/monsters/${this.monsterToDelete.id}`);
        this.fetchMonsters();
        this.deleteDialog = false;
        this.monsterToDelete = null;
      } catch (error) {
        console.error("Error eliminando monstruo:", error);
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.monster = { name: "", strength: "", speed: "", health: "", sprite: "" };
      this.editing = false;
      this.editingId = null;
    },
    async logout() {
      await api.post("/auth/logout");
      localStorage.removeItem("user");
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.v-container {
  max-width: 1200px;
}
</style>