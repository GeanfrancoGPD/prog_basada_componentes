export default class Header extends HTMLElement {
  static props = {
    // Define your component props here
    // Example:
    /*
    "value": { 
         type: 'string', 
         default: 'Button', 
         required: false 
      },
    */
    title: {
      type: "string",
      default: "Header",
      required: false,
    },
    items: {
      type: "array",
      default: [],
      required: false,
    },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.$title = this.querySelector(".header-title");
    this.$items = this.querySelector(".header-items");
  }

  async init() {
    await this.render();
  }

  async update() {
    await this.render();
  }

  async render() {
    if (this.$title) {
      this.$title.textContent = this.title || "";
    }

    if (!this.$items) return;

    this.$items.innerHTML = "";

    for (const item of this.items || []) {
      const resolvedItem = await item;

      if (resolvedItem instanceof HTMLElement) {
        this.$items.appendChild(resolvedItem);
        continue;
      }

      const itemElement = document.createElement("div");
      itemElement.textContent = resolvedItem?.text || "";
      this.$items.appendChild(itemElement);
    }

    this._renderButton();
  }

  async _renderButton() {
    const buttonTheme = this.querySelector(".button-theme");

    const currentTheme = slice.theme;

    const themeToggleButton = await slice.build("ThemeSwitcher", {
      label: "Theme",
      themes: ["Light", "Dark", "Blue"],
    });

    if (buttonTheme) {
      buttonTheme.appendChild(themeToggleButton);
    }
  }
}

customElements.define("slice-header", Header);
