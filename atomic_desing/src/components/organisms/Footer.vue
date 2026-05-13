<script></script>
<template>
  <footer class="main-footer">
    <div class="footer-content">
      <div>
        <h4>Legacy</h4>
        <p>Tu tienda de confianza</p>
      </div>
      <div>
        <h4>Contacto</h4>
        <p>Email: info@legacy.com</p>
      </div>
      <div>
        <h4>Redes Sociales</h4>
        <ul>
          <li>
            <a href="https://www.facebook.com/legacy" target="_blank"
              >Facebook</a
            >
          </li>
          <li>
            <a href="https://www.twitter.com/legacy" target="_blank">Twitter</a>
          </li>
          <li>
            <a href="https://www.instagram.com/legacy" target="_blank"
              >Instagram</a
            >
          </li>
        </ul>
      </div>
      <div>
        <h4>Servicios</h4>
        <ul>
          <li><a href="/servicios/entrega">Politicas y privacidad</a></li>
          <li><a href="/servicios/devoluciones">Terminos y condiciones</a></li>
          <li><a href="/servicios/atencion">Atención al Cliente</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2024 Legacy. Todos los derechos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  width: 100%;
  padding: 20px;
  background: #d2cccc71;
  overflow: hidden;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ccc;
}

div {
  gap: 5px;
}
ul {
  list-style: none;
  padding: 0;
  margin: 10px;
}

li {
  color: #333;
  margin-bottom: 15px;
}

h4 {
  margin-bottom: 20px;
}

.main-footer a {
  color: inherit; /* Hereda el color del padre (#333 en tu caso) */
  text-decoration: none; /* Quita el subrayado si quieres */
}

.main-footer * {
  background-color: transparent !important;
}
</style>
