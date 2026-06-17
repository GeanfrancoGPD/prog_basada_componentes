export default class Login extends HTMLElement {
  static props = {};

  constructor() {
    super();

    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, Login.props);

    this.state = {
      gmail: "",
      password: "",
      loading: false,
      error: null,
    };

    this.api = slice.getComponent("Api-Services");
  }

  async init() {
    this.events = slice.events.bind(this);

    console.log("API URL:", this.api);
    await Promise.all([this._buildForm(), this._bindEvents()]);
  }

  async _buildForm() {
    // Si luego necesitas construir componentes hijos
    // aquí va la lógica.
  }

  _bindEvents() {
    const form = this.querySelector(".auth-form");

    if (!form) {
      console.error("Formulario no encontrado");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.login();
    });
  }

  async login() {
    try {
      this.state.loading = true;

      const gmailInput = this.querySelector("#gmail");
      const passwordInput = this.querySelector("#password");

      if (!gmailInput || !passwordInput) {
        console.error("Inputs no encontrados");
        return;
      }

      const gmail = gmailInput.value;
      const password = passwordInput.value;
      console.log("Intentando login con:", { gmail, password });
      const response = await this.api.login(gmail, password);

      console.log("Respuesta del login:", response);
      if (!response.success) {
        this.state.error = response.message;
        return;
      }

      slice.context.setState("auth", {
        user: response.user,
        isAuthenticated: true,
      });

      this.events.emit("auth:login", response.user);

      slice.router.navigate("/Home");
    } catch (error) {
      console.error(error);
      this.state.error = "Error en login";
    } finally {
      this.state.loading = false;
    }
  }
}

customElements.define("slice-login", Login);
