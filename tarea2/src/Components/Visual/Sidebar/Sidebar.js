export default class Sidebar extends HTMLElement {
  static props = {
    title: {
      type: 'string',
      default: 'Sidebar',
      required: false,
    },
    items: {
      type: "array",
      default: [],
      required: false,
    },
    buttons: {
      type: "array",
      default: [],
      required: false,
    },
    position: {
      type: "string",
      default: "static",
      required: false,
    },
    direction: {
      type: "string",
      default: "normal",
      required: false,
    },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$title = this.querySelector('.sidebar-title');
    this.$menu = this.querySelector('.sidebar-menu');
    slice.controller.setComponentProps(this, props);
  }

  async init() {
    await this.render();
  }

  async update() {
    await this.render();
  }

  async render() {
    if (this.$title) {
      this.$title.textContent = this.title || 'Sidebar';
    }

    if (!this.$menu) return;

    this.$menu.innerHTML = '';

    for (const item of this.items || []) {
      const link = await slice.build('Link', {
        text: item.text || '',
        path: item.path || '#',
        classes: 'sidebar-link',
      });

      this.$menu.appendChild(link);
    }
  }
}

customElements.define("slice-sidebar", Sidebar);
