
import { createRouter, createWebHistory } from 'vue-router'
import LayoutView from '../views/LayoutView.vue'
import Dashboard from '../views/Dashboard.vue'
import VentanaView from '../views/VentanaView.vue'
import AdjuntosView from '../views/AdjuntosView.vue'
import SiisaView from '../views/SiisaView.vue'
import GenerarTokenView from '../views/GenerarTokenView.vue'
import WelcomeView from '../views/WelcomeView.vue'
import WhatsAppView from '../views/WhatsAppView.vue'
import JaulaView from '../views/JaulaView.vue'

const routes = [
  { 
    path: '/', 
    component: WelcomeView 
  },
  {
    path: '/panel',
    component: LayoutView,
    children: [
      { path: '', redirect: '/panel/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'adjuntos', component: AdjuntosView },
      { path: 'siisa', component: SiisaView },
      { path: 'token', component: GenerarTokenView },
      { path: 'whatsapp', component: WhatsAppView },
      { path: 'jaula', component: JaulaView }
    ]
  },
  { path: '/ventanaView', component: VentanaView }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router