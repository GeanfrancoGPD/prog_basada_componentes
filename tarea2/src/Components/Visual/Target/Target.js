export default class Target extends HTMLElement {
  static props = {
    context: {
      type: "array",
      default: [],
      required: false,
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
  render() {
    const $contentContainer = this.querySelector(".target-content");

    if (!$contentContainer) return;

    $contentContainer.innerHTML = "";
    for (const item of this.context || []) {
      const resolvedItem = slice.controller.resolveValue(item);
      if (resolvedItem instanceof HTMLElement) {
        $contentContainer.appendChild(resolvedItem);
      } else {
        const itemElement = document.createElement("div");
        itemElement.textContent = resolvedItem?.text || "";
        $contentContainer.appendChild(itemElement);
      }
    }
  }
}

customElements.define("slice-target", Target);
