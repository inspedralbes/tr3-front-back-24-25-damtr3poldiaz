// auth.js - Manejo simple de autenticación
import { reactive } from 'vue'

// Estado reactivo para la autenticación
export const authStore = reactive({
  // Verificar si hay un usuario en localStorage al inicializar
  user: JSON.parse(localStorage.getItem('user')),
  isLoggedIn: !!localStorage.getItem('user'),
  
  // Método para establecer los datos del usuario
  setUser(userData) {
    this.user = userData
    this.isLoggedIn = !!userData
    
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    } else {
      localStorage.removeItem('user')
    }
  },
  
  // Método para cerrar sesión
  logout() {
    this.user = null
    this.isLoggedIn = false
    localStorage.removeItem('user')
  }
})
