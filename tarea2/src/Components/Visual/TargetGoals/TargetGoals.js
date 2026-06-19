export default class TargetGoals extends HTMLElement {
  static props = {
    id: { type: "number", default: 0 },
    icon: { type: "string", default: "car" },
    title: { type: "string", default: "Nueva meta" },
    category: { type: "string", default: "" },
    current: { type: "number", default: 0 },
    total: { type: "number", default: 1 },
    targetDate: { type: "string", default: "" },
    completed: { type: "boolean", default: false },

    onEdit: { type: "function", default: null },
    onDelete: { type: "function", default: null },
    onComplete: { type: "function", default: null },
  };

  constructor(props = {}) {
    super();

    const normalized = {
      icon: "car",
      title: props.titulo ?? "Nueva meta",
      category: props.estado ?? "",
      current: Number(props.monto_actual ?? 0),
      total: Number(props.monto_objetivo ?? 1),
      targetDate: props.fecha_limite ?? "",
      completed: props.estado === "completada" || props.estado === "completado",
      ...props,
    };

    this.props = normalized;

    this.renderRoot = document.createElement("div");
    this.renderRoot.className = "tg-root";
    this.appendChild(this.renderRoot);
  }

  connectedCallback() {
    document.addEventListener("click", this._outsideClick);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this._outsideClick);
  }

  _handleOutsideClick(e) {
    if (!this.contains(e.target)) {
      this._closeAllMenus();
    }
  }

  _closeAllMenus() {
    this.querySelectorAll(".tg-dropdown--open").forEach((d) => {
      d.classList.remove("tg-dropdown--open");
    });
  }

  _get(key, fallback) {
    return this.props[key] ?? fallback;
  }

  async init() {
    await this.render();
  }

  async update() {
    await this.render();
  }

  async render() {
    if (!this.renderRoot) return;

    this.renderRoot.innerHTML = "";

    const card = document.createElement("div");
    card.className = "tg-card";

    if (this._get("completed", false)) {
      card.classList.add("tg-card--completed");
    }

    const content = document.createElement("div");
    content.className = "tg-content";

    content.appendChild(this._buildHeader());
    content.appendChild(this._buildBody());
    content.appendChild(this._buildProgress());

    const footer = this._buildFooter();
    if (footer) content.appendChild(footer);

    card.appendChild(content);
    this.renderRoot.appendChild(card);
  }

  _buildHeader() {
    const header = document.createElement("div");
    header.className = "tg-header";

    const iconWrap = document.createElement("div");
    iconWrap.className = "tg-icon-wrap";

    slice
      .build?.("SvgIcon", {
        nombre: this._get("icon", "car"),
        size: "28px",
        color: "var(--primary-color)",
      })
      .then((icon) => {
        if (icon) iconWrap.appendChild(icon);
      });

    const menuWrap = document.createElement("div");
    menuWrap.className = "tg-menu-wrap";

    const btn = document.createElement("button");
    btn.className = "tg-menu-btn";

    btn.setAttribute("aria-label", "Goal options");
    btn.setAttribute("aria-haspopup", "menu");

    btn.innerHTML = `<span></span><span></span><span></span>`;

    const dropdown = this._buildDropdown(menuWrap);

    btn.onclick = (e) => {
      e.stopPropagation();
      this._toggleMenu(menuWrap);
    };

    menuWrap.appendChild(btn);
    menuWrap.appendChild(dropdown);

    header.appendChild(iconWrap);
    header.appendChild(menuWrap);

    return header;
  }

  _buildDropdown(menuWrap) {
    const dropdown = document.createElement("div");
    dropdown.className = "tg-dropdown";

    const options = [
      { key: "complete", label: "Marcar como completada", icon: "✓" },
      { key: "edit", label: "Editar meta", icon: "✎" },
      { key: "delete", label: "Eliminar", icon: "✕" },
    ];

    options.forEach((opt) => {
      const item = document.createElement("button");
      item.className = "tg-dropdown-item";
      item.setAttribute("role", "menuitem");

      item.innerHTML = `
        <span class="tg-dropdown-icon">${opt.icon}</span>
        ${opt.label}
      `;

      item.onclick = (e) => {
        e.stopPropagation();
        this._handleMenuAction(opt.key);
        dropdown.classList.remove("tg-dropdown--open");
      };

      dropdown.appendChild(item);
    });

    return dropdown;
  }

  _toggleMenu(menuWrap) {
    const dropdown = menuWrap.querySelector(".tg-dropdown");

    this._closeAllMenus();
    dropdown?.classList.toggle("tg-dropdown--open");
  }

  _buildBody() {
    const body = document.createElement("div");
    body.className = "tg-body";

    const title = document.createElement("h2");
    title.className = "tg-title";
    title.textContent = this._get("title", "Meta sin nombre");

    body.appendChild(title);

    const category = this._get("category", "");
    if (category) {
      const cat = document.createElement("p");
      cat.className = "tg-category";
      cat.textContent = category;
      body.appendChild(cat);
    }

    return body;
  }

  _buildProgress() {
    const wrap = document.createElement("div");
    wrap.className = "tg-progress-wrap";

    const current = Number(this._get("current", 0));
    const total = Math.max(Number(this._get("total", 1)), 1);

    const pct = Math.min((current / total) * 100, 100);

    const amounts = document.createElement("div");
    amounts.className = "tg-amounts";

    const currentEl = document.createElement("span");
    currentEl.className = "tg-amount-current";
    currentEl.textContent = this._formatCurrency(current);

    const totalEl = document.createElement("span");
    totalEl.className = "tg-amount-total";
    totalEl.textContent = `de ${this._formatCurrency(total)}`;

    const track = document.createElement("div");
    track.className = "tg-track";

    const fill = document.createElement("div");
    fill.className = "tg-track-fill";
    fill.style.width = `${pct}%`;

    if (this._get("completed", false)) {
      fill.classList.add("tg-track-fill--completed");
      fill.style.width = "100%";
    }

    track.appendChild(fill);
    amounts.appendChild(currentEl);
    amounts.appendChild(totalEl);

    wrap.appendChild(amounts);
    wrap.appendChild(track);

    return wrap;
  }

  _buildFooter() {
    const date = this._get("targetDate", "");
    if (!date) return null;

    const footer = document.createElement("div");
    footer.className = "tg-footer";

    const icon = document.createElement("svg");
    icon.className = "tg-footer-icon";
    icon.setAttribute("viewBox", "0 0 16 16");
    icon.innerHTML = `
      <rect x="1" y="3" width="14" height="12" rx="2"
        stroke="currentColor" stroke-width="1.4"/>
      <path d="M5 1v4M11 1v4M1 7h14"
        stroke="currentColor" stroke-width="1.4"/>
    `;

    const text = document.createElement("span");
    text.textContent = `Target: ${this._formatDate(date)}`;

    footer.appendChild(icon);
    footer.appendChild(text);

    return footer;
  }

  _handleMenuAction(key) {
    // @ts-ignore
    const { onEdit, onDelete, onComplete } = this.props || {};

    if (key === "complete") {
      this.props.completed = true;
      this.render();
      onComplete?.(this);
    }

    if (key === "edit") {
      console.log("Editando meta:", this._getData());
      onEdit?.({
        ...this._getData(),
      });
    }

    if (key === "delete") {
      onDelete?.({
        ...this._getData(),
      });
    }
  }

  _getData() {
    return {
      id: this._get("id") ?? null,

      title: this._get("title"),
      category: this._get("category"),

      current: Number(this._get("current") ?? 0),
      total: Number(this._get("total") ?? 1),

      targetDate: this._get("targetDate"),

      completed: this._get("completed"),
    };
  }

  _formatCurrency(v) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(v);
  }

  _formatDate(str) {
    return new Date(str).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}

customElements.define("slice-targetgoals", TargetGoals);
