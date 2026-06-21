export default class Modal extends HTMLElement {
  constructor() {
    super();
    this.currentPayload = null;
  }

  async init() {
    if (typeof slice !== "undefined" && slice.attachTemplate) {
      slice.attachTemplate(this);
    }
    this.events = slice.events.bind(this);
    this.events.subscribe("modal:open", (payload) => this.open(payload));
    this.events.subscribe("modal:close", () => this.close());
  }

  open(payload) {
    this.currentPayload = payload;
    const container = this.shadowRoot || this;
    const contentTarget =
      container.querySelector("#modal-content") || container;
    contentTarget.innerHTML = "";

    if (payload.type === "goal") {
      contentTarget.appendChild(
        this._renderGoalModal(payload.data, payload.data?.id ?? null),
      );
    } else if (payload.type === "transaction") {
      contentTarget.appendChild(
        this._renderTransactionModal(payload.data, payload.categories),
      );
    }

    const backdrop = container.querySelector(".tg-modal-backdrop");
    if (backdrop) {
      setTimeout(() => {
        backdrop.classList.add("tg-modal-backdrop--open");
      }, 10);
    }
  }

  close() {
    const container = this.shadowRoot || this;
    const backdrop = container.querySelector(".tg-modal-backdrop");
    if (backdrop) {
      backdrop.classList.remove("tg-modal-backdrop--open");
      backdrop.addEventListener(
        "transitionend",
        () => {
          const contentTarget = container.querySelector("#modal-content");
          if (contentTarget) contentTarget.innerHTML = "";
          this.currentPayload = null;
        },
        { once: true },
      );
    }
  }

  _renderTransactionModal(transaction = null, categories = []) {
    const isEditing = Boolean(transaction?.id);

    const categoryOptions = categories
      .map(
        (c) => `
        <option value="${c.id}" ${transaction?.categoria_id === c.id || transaction?.categoria === c.categoria ? "selected" : ""}>
          ${c.categoria || c.nombre}
        </option>
      `,
      )
      .join("");

    const fechaValue = transaction?.fecha ? transaction.fecha.slice(0, 10) : "";

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
    <form class="tg-form">
      <div class="tg-modal-header">
        <h3 class="tg-modal-title">${isEditing ? "Editar Transacción" : "Nueva Transacción"}</h3>
        <button type="button" class="tg-modal-close">&times;</button>
      </div>

      <div class="tg-form-body">
        <div class="tg-row">
          <div class="tg-field">
            <label>Fecha</label>
            <input name="fecha" type="date" value="${fechaValue}" required />
          </div>
          <div class="tg-field">
            <label>Tipo</label>
            <select name="tipo" required>
              <option value="gasto" ${transaction?.tipo === "gasto" ? "selected" : ""}>Gasto</option>
              <option value="ingreso" ${transaction?.tipo === "ingreso" ? "selected" : ""}>Ingreso</option>
            </select>
          </div>
        </div>

        <div class="tg-field">
          <label>Descripción</label>
          <input
            name="descripcion"
            placeholder="Ej. Supermercado"
            required
            maxlength="40"
            value="${transaction?.descripcion ?? ""}"
          />
        </div>

        <div class="tg-row">
          <div class="tg-field">
            <label>Categoría</label>
            <select name="categoria_id" required>
              ${categoryOptions}
            </select>
          </div>
          <div class="tg-field">
            <label>Monto</label>
            <input
              name="monto"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              required
              value="${transaction?.monto ?? ""}"
            />
          </div>
        </div>
      </div>

      <div class="tg-modal-actions">
        <button type="button" class="tg-btn tg-btn--cancel">Cancelar</button>
        <button type="submit" class="tg-btn tg-btn--save">${isEditing ? "Actualizar" : "Guardar"}</button>
      </div>
    </form>
  `;

    const form = wrapper.querySelector("form");

    wrapper.querySelector(".tg-modal-close").onclick = () =>
      slice.events.emit("modal:close");
    wrapper.querySelector(".tg-btn--cancel").onclick = () =>
      slice.events.emit("modal:close");

    form.onsubmit = (e) => {
      e.preventDefault();

      const payload = {
        fecha: form.fecha.value,
        descripcion: form.descripcion.value,
        categoria_id: Number(form.categoria_id.value),
        monto: Number(form.monto.value),
        tipo: form.tipo.value,
      };

      if (isEditing) {
        payload.id = transaction.id; // ¡Clave para que el backend sepa cuál editar!
        slice.events.emit("transaction:update", payload);
      } else {
        slice.events.emit("transaction:create", payload);
      }

      slice.events.emit("modal:close");
    };

    return wrapper;
  }

  _renderGoalModal(goal = null, index = null) {
    const wrapper = document.createElement("div");
    console.log("Datos de modal", goal, "index:", index);

    wrapper.innerHTML = `
      <form class="tg-form">
        <div class="tg-modal-header">
          <h3 class="tg-modal-title">${goal ? "Editar Meta" : "Nueva Meta"}</h3>
          <button type="button" class="tg-modal-close">&times;</button>
        </div>

        <div class="tg-form-body">
          <div class="tg-field">
            <label>Título</label>
            <input name="title" placeholder=${goal?.titulo || "Ej. Fondo de emergencia"} required />
          </div>

          <div class="tg-row">
            <div class="tg-field">
              <label>Monto Actual</label>
              <input name="current" type="number" min="0" placeholder=${goal?.monto_actual || "0"} required />
            </div>
            <div class="tg-field">
              <label>Meta Total</label>
              <input name="total" type="number" min="0" placeholder=${goal?.monto_objetivo || "0"} required />
            </div>
          </div>

          <div class="tg-field">
            <label>Fecha Límite</label>
            <input name="targetDate" type="date" ${goal?.fecha_limite ? `value="${goal.fecha_limite}"` : ""} required />
              </div>
        </div>

        <div class="tg-modal-actions">
          <button type="button" class="tg-btn tg-btn--cancel">Cancelar</button>
          <button type="submit" class="tg-btn tg-btn--save">Guardar</button>
        </div>
      </form>
    `;

    const form = wrapper.querySelector("form");

    if (goal) {
      // Usar form.elements evita el conflicto con la propiedad nativa 'title'
      form.elements["title"].value = goal.titulo || "";
      form.elements["current"].value = goal.monto_actual || 0;
      form.elements["total"].value = goal.monto_objetivo || 0;
      form.elements["targetDate"].value = goal.fecha_limite || "";
    }

    wrapper.querySelector(".tg-modal-close").onclick = () =>
      slice.events.emit("modal:close");
    wrapper.querySelector(".tg-btn--cancel").onclick = () =>
      slice.events.emit("modal:close");

    form.onsubmit = (e) => {
      e.preventDefault();
      slice.events.emit("goal:save", {
        data: {
          title: form.elements["title"].value,
          current: Number(form.elements["current"].value),
          total: Number(form.elements["total"].value),
          targetDate: form.elements["targetDate"].value,
        },
        index,
      });
      slice.events.emit("modal:close");
    };

    return wrapper;
  }
}

customElements.define("slice-modal", Modal);
