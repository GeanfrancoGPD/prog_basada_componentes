export default class Modal extends HTMLElement {
  constructor() {
    super();
    this.currentPayload = null;
  }

  async init() {
    // 1. Vinculamos la plantilla base de Slice (si tu setup ya maneja la carga automática)
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

    // Asegurar que el contenido renderizado esté limpio
    const contentTarget =
      container.querySelector("#modal-content") || container;
    contentTarget.innerHTML = "";

    // Renderizar el formulario correspondiente
    console.log("Abriendo modal con payload:", payload?.data?.id);
    if (payload.type === "goal") {
      contentTarget.appendChild(
        this._renderGoalModal(payload.data, payload.data?.id ?? null),
      );
    } else if (payload.type === "transaction") {
      contentTarget.appendChild(
        this._renderTransactionModal(payload.data, payload.index),
      );
    }

    // Activar la clase de animación para abrir
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

      // Espera a que termine la animación de CSS antes de limpiar el contenido interno
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

  _renderTransactionModal(transaction = null, index = null) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <form class="tg-form">
        <div class="tg-modal-header">
          <h3 class="tg-modal-title">Nueva Transacción</h3>
          <button type="button" class="tg-modal-close">&times;</button>
        </div>

        <div class="tg-form-body">
          <div class="tg-row">
            <div class="tg-field">
              <label>Fecha</label>
              <input name="date" type="date" required />
            </div>
            <div class="tg-field">
              <label>Estado</label>
              <select name="status">
                <option value="Ahorro">Ahorro</option>
                <option value="Gasto">Gasto</option>
              </select>
            </div>
          </div>

          <div class="tg-field">
            <label>Nombre</label>
            <input name="description" placeholder="Ej. Supermercado" required max-length="20" />
          </div>

          <div class="tg-row">
            <div class="tg-field">
              <label>Categoría</label>
              <input name="category" placeholder="Ej. Comida" required />
            </div>
            <div class="tg-field">
              <label>Monto</label>
              <input name="amount" type="number" min="0" placeholder="0" required />
            </div>
          </div>
        </div>

        <div class="tg-modal-actions">
          <button type="button" class="tg-btn tg-btn--cancel">Cancelar</button>
          <button type="submit" class="tg-btn tg-btn--save">Guardar</button>
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
      slice.events.emit("transaction:save", {
        date: form.date.value,
        description: form.description.value,
        category: form.category.value,
        amount: Number(form.amount.value),
        status: form.status.value,
      });
      slice.events.emit("modal:close");
    };

    return wrapper;
  }
}

customElements.define("slice-modal", Modal);
