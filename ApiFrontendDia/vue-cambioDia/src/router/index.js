
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import VentanaView from '../views/VentanaView.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/ventanaView', component: VentanaView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router