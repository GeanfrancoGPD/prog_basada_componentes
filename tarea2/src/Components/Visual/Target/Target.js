export default class Target extends HTMLElement {
  static props = {
    context: {
      type: "array",
      default: [],
      required: false,
    },

    variant: {
      type: "string",
      default: "stats",
      required: false,
    },
  };

  constructor(props) {
    super();

    slice.attachTemplate(this);

    this.$card = this.querySelector(".target");
    this.$content = this.querySelector(".target-content");

    slice.controller.setComponentProps(this, props);

    this.layouts = {
      stats: this._renderStats.bind(this),
      info: this._renderInfo.bind(this),
    };
  }

  async init() {
    await this.render();
  }

  async update() {
    await this.render();
  }

  async render() {
    if (!this.$content) return;

    this.$content.innerHTML = "";

    const layout = this.layouts[this.variant];

    if (layout) {
      await layout();
    } else {
      await this._renderStats();
    }
  }

  /* ========================= */
  /* STATS LAYOUT */
  /* ========================= */

  async _renderStats() {
    const layout = document.createElement("div");
    layout.classList.add("target-stats-layout");

    const top = document.createElement("div");
    top.classList.add("target-stats-top");

    const bottom = document.createElement("div");
    bottom.classList.add("target-stats-bottom");

    for (const item of this.context || []) {
      const row = await this._createRow(item);

      if (!row) continue;

      if (item.type === "icon" || item.type === "badge") {
        top.appendChild(row);
      } else {
        bottom.appendChild(row);
      }
    }

    layout.appendChild(top);
    layout.appendChild(bottom);

    this.$content.appendChild(layout);
  }

  /* ========================= */
  /* INFO LAYOUT */
  /* ========================= */

  async _renderInfo() {
    const layout = document.createElement("div");
    layout.classList.add("target-info-layout");

    const iconColumn = document.createElement("div");
    iconColumn.classList.add("target-info-icon");

    const contentColumn = document.createElement("div");
    contentColumn.classList.add("target-info-content");

    for (const item of this.context || []) {
      const row = await this._createRow(item);

      if (!row) continue;

      if (item.type === "icon") {
        iconColumn.appendChild(row);
      } else {
        contentColumn.appendChild(row);
      }
    }

    layout.appendChild(iconColumn);
    layout.appendChild(contentColumn);

    this.$content.appendChild(layout);
  }

  /* ========================= */
  /* ROW FACTORY */
  /* ========================= */

  async _createRow(item) {
    if (!item) return null;

    switch (item.type) {
      case "icon":
        return this._createIcon(item);

      case "title":
        return this._createTitle(item);

      case "value":
        return this._createValue(item);

      case "badge":
        return this._createBadge(item);

      case "text":
        return this._createText(item);

      default:
        return this._createText(item);
    }
  }

  /* ========================= */
  /* ELEMENTS */
  /* ========================= */

  async _createIcon(item) {
    const wrapper = document.createElement("div");

    wrapper.classList.add("target-icon-wrap");

    const icon = await slice.build("SvgIcon", {
      svg: item.svg || "",

      size: item.size || "52px",

      background: item.background || undefined,

      color: item.color || undefined,
    });

    wrapper.appendChild(icon);

    return wrapper;
  }

  _createTitle(item) {
    const element = document.createElement("h2");

    element.classList.add("target-title");

    element.textContent = item.text || "";

    return element;
  }

  _createValue(item) {
    const element = document.createElement("p");

    element.classList.add("target-value");

    element.textContent = item.text || "";

    return element;
  }

  _createBadge(item) {
    const element = document.createElement("span");

    element.classList.add("target-badge");

    element.textContent = item.text || "";

    return element;
  }

  _createText(item) {
    const element = document.createElement("p");

    element.classList.add("target-text");

    element.textContent = item.text || "";

    return element;
  }
}

customElements.define("slice-target", Target);
