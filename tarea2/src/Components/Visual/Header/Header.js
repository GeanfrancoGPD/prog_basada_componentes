export default class Header extends HTMLElement {
  static props = {
    title: { type: "string", default: "Fintraack", required: false },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);

    // Nodos principales de la plantilla
    this.$title = this.querySelector(".header-title");
    this.$items = this.querySelector(".header-items");

    // Instanciamos servicios y contextos globales
    this.services = slice.getComponent("Api-Services");
    this.auth = slice.context.getState("auth");
  }

  async init() {
    await this.render();
    this._initDropdownListener();
  }

  async update() {
    await this.render();
  }

  async render() {
    if (this.$title) {
      this.$title.textContent = this.title || "";
    }

    if (!this.$items) return;
    this.$items.innerHTML = ""; // Limpieza de seguridad

    const addButton = await slice.build("Button", {
      value: "Agregar transacción",
      onClickCallback: async () => {
        let categories = [];
        try {
          const response = await this.services.getTransactions();
          categories = response?.data?.categories || [];
        } catch (error) {
          console.error("Error al obtener categorías en el Header:", error);
        }

        slice.events.emit("modal:open", {
          type: "transaction",
          mode: "create",
          categories: categories,
        });
      },
    });

    const themeToggleButton = await slice.build("ThemeSwitcher", {
      label: "Theme",
      themes: ["Light", "Dark", "Blue", "Slice"],
    });

    const userMenu = await this._buildUserMenu();

    // Inyectamos todo en la barra de controles del header
    this.$items.appendChild(addButton);
    this.$items.appendChild(themeToggleButton);
    this.$items.appendChild(userMenu);
  }

  async _buildUserMenu() {
    const userName =
      this.auth?.user?.nombre || this.auth?.user?.username || "Usuario";

    // Contenedor principal del componente de usuario
    const wrapper = document.createElement("div");
    wrapper.className = "tg-user-dropdown-wrapper";

    const trigger = document.createElement("div");
    trigger.className = "tg-user-avatar-trigger";

    // Inyección correcta usando slice.build
    const triggerIcon = await slice.build("SvgIcon", {
      nombre: "user",
      size: "22px",
      color: "var(--primary-background-color)",
    });
    trigger.appendChild(triggerIcon);

    // EL MENÚ DESPLEGABLE
    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "tg-dropdown-menu";

    // Encabezado del dropdown
    const dropdownHeader = document.createElement("div");
    dropdownHeader.className = "tg-dropdown-header";

    // Contenedor del mini avatar interno
    const avatarDisplay = document.createElement("div");
    avatarDisplay.className = "tg-dropdown-avatar-display";

    // Inyección correcta usando slice.build
    const headerIcon = await slice.build("SvgIcon", {
      nombre: "user",
      size: "24px",
      color: "var(--primary-background-color)",
    });
    avatarDisplay.appendChild(headerIcon);

    // Nombre de usuario
    const usernameSpan = document.createElement("span");
    usernameSpan.className = "tg-dropdown-username";
    usernameSpan.textContent = userName;

    // Armamos el encabezado
    dropdownHeader.appendChild(avatarDisplay);
    dropdownHeader.appendChild(usernameSpan);

    // Separador visual
    const divider = document.createElement("hr");
    divider.className = "tg-dropdown-divider";

    // Botón de salir
    const logoutBtn = document.createElement("button");
    logoutBtn.type = "button";
    logoutBtn.className = "tg-dropdown-logout-btn";
    logoutBtn.innerHTML = `<span>Salir de sesión</span>`;

    logoutBtn.onclick = () => {
      console.log("Cerrando sesión...");
      if (slice.context && slice.context.setState) {
        slice.context.setState("auth", { isAuthenticated: false, user: null });
      }
      slice.router.navigate("/login");
    };

    dropdownMenu.appendChild(dropdownHeader);
    dropdownMenu.appendChild(divider);
    dropdownMenu.appendChild(logoutBtn);

    wrapper.appendChild(trigger);
    wrapper.appendChild(dropdownMenu);

    return wrapper;
  }

  // Manejador de clicks para abrir y cerrar el menú desplegable
  _initDropdownListener() {
    this.addEventListener("click", (e) => {
      const trigger = e.target.closest(".tg-user-avatar-trigger");
      const activeDropdown = this.querySelector(".tg-dropdown-menu--open");

      // Si clickea el avatar, hace toggle
      if (trigger) {
        const dropdown = trigger.nextElementSibling;
        dropdown.classList.toggle("tg-dropdown-menu--open");
        return;
      }

      // Si clickea afuera del menú, lo cierra
      if (activeDropdown && !e.target.closest(".tg-user-dropdown-wrapper")) {
        activeDropdown.classList.remove("tg-dropdown-menu--open");
      }
    });
  }
}

customElements.define("slice-header", Header);
