export default class Register extends HTMLElement {
  async init() {
    if (typeof slice !== "undefined" && slice.attachTemplate) {
      slice.attachTemplate(this);
    }

    this.form = this.querySelector("form");

    this.form.onsubmit = async (e) => {
      e.preventDefault();

      const username = this.form.username.value;
      const gmail = this.form.gmail.value;
      const password = this.form.password.value;
      const confirmPassword = this.form.confirmPassword.value;

      // Validación básica de contraseñas idénticas antes de pegar a la API
      if (password !== confirmPassword) {
        slice.events.emit("notification:show", {
          message: "Las contraseñas no coinciden",
          type: "error",
        });
        return;
      }

      try {
        // Llamada a tu servicio global (Asumiendo que tienes 'register' en tu ApiServices)
        const res = await slice.services.api.register({
          username,
          gmail,
          password,
        });

        slice.events.emit("notification:show", {
          message: "Cuenta creada exitosamente. Por favor inicia sesión.",
          type: "success",
        });

        // Redirigir al login
        slice.router.navigate("/login");
      } catch (err) {
        slice.events.emit("notification:show", {
          message: err.message || "Error al registrar la cuenta",
          type: "error",
        });
      }
    };
  }
}

customElements.define("slice-register", Register);
