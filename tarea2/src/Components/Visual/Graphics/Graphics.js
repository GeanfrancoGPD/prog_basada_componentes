export default class Graphics extends HTMLElement {
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
    type: {
      type: "string",
      default: "bar",
      requiere: false,
    },
    sizeX: {
      type: "float",
      default: "100.0",
      requiere: false,
    },
    sizeY: {
      type: "float",
      default: "100.0",
      requiere: false,
    },
    color: {
      type: "string",
      default: "--primari-color",
      requiere: false,
    },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
  }

  init() {
    this.render();
  }

  update() {
    this.render();
  }

  render() {}
}

customElements.define("slice-graphics", Graphics);
