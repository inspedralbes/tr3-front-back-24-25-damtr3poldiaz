import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import MonstersView from '../views/MonstersView.vue'
import CollectiblesView from '../views/CollectiblesView.vue'
import SkinsView from '../views/SkinsView.vue'
import LevelsView from '../views/LevelsView.vue'
import MusicView from '../views/MusicView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView,
      meta: { allowIfLoggedIn: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { allowIfLoggedIn: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { allowIfLoggedIn: true }
    },
    {
      path: '/monsters',
      name: 'monsters',
      component: MonstersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/collectibles',
      name: 'collectibles',
      component: CollectiblesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/skins',
      name: 'skins',
      component: SkinsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/levels',
      name: 'levels',
      component: LevelsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/music',
      name: 'music',
      component: MusicView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado, redirigir a login
    next('/login')
  } else if (to.matched.some(record => record.meta.allowIfLoggedIn) && isAuthenticated) {
    // Si la ruta es login/register y el usuario ya está autenticado, redirigir a monsters
    next('/monsters')
  } else {
    next()
  }
})

export default router
