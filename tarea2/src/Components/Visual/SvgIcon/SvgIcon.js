export default class SvgIcon extends HTMLElement {
  static props = {
    svg: {
      type: "string",
      default: "",
      required: false,
    },
    size: {
      type: "string",
      default: "56px",
      required: false,
    },
    background: {
      type: "string",
      default: "rgba(var(--primary-color-rgb), 0.1)",
      required: false,
    },
    color: {
      type: "string",
      default: "var(--primary-color)",
      required: false,
    },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$frame = this.querySelector(".svg-icon-frame");
    this.$slot = this.querySelector(".svg-icon-slot");
    slice.controller.setComponentProps(this, props);
  }

  init() {
    this.render();
  }

  update() {
    this.render();
  }

  render() {
    if (this.$frame) {
      this.$frame.style.setProperty("--svg-icon-size", this.size || "56px");
      this.$frame.style.setProperty(
        "--svg-icon-background",
        this.background || "rgba(var(--primary-color-rgb), 0.1)",
      );
      this.$frame.style.setProperty(
        "--svg-icon-color",
        this.color || "var(--primary-color)",
      );
    }

    if (this.$slot) {
      this.$slot.innerHTML = this.svg || "";
    }
  }
}

customElements.define("slice-svg-icon", SvgIcon);
