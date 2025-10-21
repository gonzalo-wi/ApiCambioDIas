
import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '../views/LayoutView.vue'
import Dashboard from '../views/Dashboard.vue'
import VentanaView from '../views/VentanaView.vue'
import AdjuntosView from '../views/AdjuntosView.vue'
import SiisaView from '../views/SiisaView.vue'

const routes = [
  {
    path: '/',
    component: LayoutView,
    children: [
      { path: '', component: Dashboard },
      { path: 'adjuntos', component: AdjuntosView },
      { path: 'siisa', component: SiisaView }
    ]
  },
  { path: '/ventanaView', component: VentanaView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router