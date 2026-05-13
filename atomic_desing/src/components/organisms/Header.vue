<script setup>
import Searhbar from "../molecules/Searhbar.vue";
import { ref } from "vue";
import avatar from "../../assets/svgs/avatar.svg";
import carrito from "../../assets/svgs/carrito.svg";
</script>
<template>
  <header class="main-header">
    <div class="header-logo">
      <h3>Legacy</h3>
    </div>

    <nav class="header-nav">
      <ul>
        <li><a href="/">productos</a></li>
        <li><a href="/categorias">categorias</a></li>
      </ul>
    </nav>

    <div class="header-actions">
      <Searhbar />
      <div class="user-icons">
        <img :src="avatar" alt="User Icon" width="20" height="20" />
        <img :src="carrito" alt="Carrito" width="24" height="24" />
      </div>
    </div>
  </header>
</template>
<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #ffffff;

  /* Sombra mejorada */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  /* Asegura que la sombra esté por encima de otros elementos */
  position: relative;
  z-index: 100;
}

/* Alineación horizontal para la lista de navegación */
.header-nav ul {
  display: flex;
  list-style: none;
  gap: 20px; /* Espacio entre enlaces */
  margin: 0;
  padding: 0;
}

/* Alineación para la zona de búsqueda e iconos */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px; /* Espacio entre buscador e iconos */
}

.user-icons {
  display: flex;
  gap: 30px; /* Espacio entre los iconos */
}
</style>
