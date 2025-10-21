<template>
  <div class="main-layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <Sidebar />
    </aside>
    
    <!-- Main content area -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue'
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%);
}

.sidebar {
  width: 280px;
  min-width: 280px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(30, 64, 175, 0.1);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.main-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 250px;
    min-width: 250px;
  }
}

@media (max-width: 640px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    min-width: auto;
    border-right: none;
    border-bottom: 1px solid rgba(30, 64, 175, 0.1);
  }
}
</style>