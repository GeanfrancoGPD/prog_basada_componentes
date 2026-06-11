const SVG_CACHE = {};

export default class SvgIcon extends HTMLElement {
  static props = {
    nombre: { type: "string", default: "default" },
    size: { type: "string", default: "56px" },
    color: { type: "string", default: "var(--primary-color)" },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$slot = this.querySelector(".svg-icon-slot");

    slice.controller.setComponentProps(this, props);
  }

  async init() {
    await this.render();
  }
  async update() {
    await this.render();
  }

  async render() {
    if (!this.$slot) return;

    this.style.setProperty("--svg-icon-size", this.size);
    this.style.setProperty("--svg-icon-color", this.color);

    let svg = SVG_CACHE[this.nombre];

    if (!svg) {
      try {
        //  Ruta absoluta desde la raíz del servidor
        const response = await fetch(`/assets/svgs/${this.nombre}.svg`);

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        svg = await response.text();
        SVG_CACHE[this.nombre] = svg;
      } catch (error) {
        console.warn(`SVG "${this.nombre}" no encontrado`, error);
        return;
      }
    }

    this.$slot.innerHTML = svg;
  }
}

customElements.define("slice-svg-icon", SvgIcon);
