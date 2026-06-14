export default class Login extends HTMLElement {
  async init() {
    if (typeof slice !== "undefined" && slice.attachTemplate) {
      await slice.attachTemplate(this); // Si attachTemplate devuelve promesa, la esperamos
    }

    // Le damos un respiro mínimo al ciclo de vida para que el HTML se monte en el DOM
    setTimeout(() => {
      this.form = this.querySelector("form");

      // Validamos que el formulario realmente exista antes de asignarle el evento
      if (!this.form) {
        console.error(
          "No se encontró el elemento <form> dentro de slice-login. Verifica que login.html esté bien cargado.",
        );
        return;
      }

      this.form.onsubmit = async (e) => {
        e.preventDefault();

        try {
          const gmail = this.form.gmail.value;
          const password = this.form.password.value;

          // Consumimos el servicio que añadimos manualmente arriba
          const res = await slice.services.api.login(gmail, password);

          // Guardar usuario global
          slice.context.updateContext("auth", {
            user: res.user,
            isAuthenticated: true,
          });

          slice.events.emit("notification:show", {
            message: "¡Bienvenido de nuevo!",
            type: "success",
          });

          slice.router.navigate("/");
        } catch (err) {
          slice.events.emit("notification:show", {
            message: err.message || "Error al iniciar sesión",
            type: "error",
          });
        }
      };
    }, 50);
  }
}

customElements.define("slice-login", Login);
