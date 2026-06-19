export default class Table extends HTMLElement {
  static props = {
    headers: { type: "array", default: [], required: false },
    rows: { type: "array", default: [], required: false },
    // Nuevas propiedades registradas para el framework
    pagination: { type: "object", default: { pageSize: 5 }, required: false },
    defaultSort: {
      type: "object",
      default: { key: "name", direction: "asc" },
      required: false,
    },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.$head = this.querySelector(".table_head");
    this.$body = this.querySelector(".table_body");

    slice.controller.setComponentProps(this, props);
  }

  init() {
    this.renderTable();
  }

  // --- Getters y Setters existentes ---
  set headers(value) {
    this._headers = Array.isArray(value) ? value : [];
    this.renderTable();
  }

  get headers() {
    return this._headers;
  }

  set rows(value) {
    this._rows = Array.isArray(value) ? value : [];
    this.renderTable();
  }

  get rows() {
    return this._rows;
  }

  // --- Nuevos Getters y Setters ---
  set pagination(value) {
    // Nos aseguramos de mantener la estructura si viene vacío
    this._pagination =
      value && typeof value === "object" ? value : { pageSize: 5 };
    this.renderTable(); // Re-renderiza si cambia la paginación
  }

  get pagination() {
    return this._pagination;
  }

  set defaultSort(value) {
    this._defaultSort =
      value && typeof value === "object"
        ? value
        : { key: "name", direction: "asc" };
    this.renderTable(); // Re-renderiza si cambia el orden por defecto
  }

  get defaultSort() {
    return this._defaultSort;
  }

  // Agrega esto en tu constructor o inicialízalo en una propiedad:
  // this.currentPage = 1;

  renderTable() {
    if (!this.$head || !this.$body) return;

    this.$head.innerHTML = "";
    this.$body.innerHTML = "";

    const headers = Array.isArray(this.headers) ? this.headers : [];
    let rows = Array.isArray(this.rows) ? this.rows : [];

    // 1. Obtener el tamaño de página (por defecto 5 si no se define)
    const pageSize =
      this.pagination && this.pagination.pageSize
        ? this.pagination.pageSize
        : 5;

    // Si no tienes una variable de página actual en tu clase, asumimos la página 1 por ahora
    const currentPage = this.currentPage || 1;

    // 2. Calcular los índices para segmentar el array
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    // 3. Cortar el array original para quedarnos solo con las 5 filas correspondientes
    const paginatedRows = rows.slice(startIndex, endIndex);

    // Renderizar Headers (igual que antes)
    if (headers.length > 0) {
      const headRow = document.createElement("tr");
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        headRow.appendChild(th);
      });
      this.$head.appendChild(headRow);
    }

    // Renderizar Filas (ahora usamos 'paginatedRows' en lugar de 'rows')
    paginatedRows.forEach((row) => {
      const tr = document.createElement("tr");
      (Array.isArray(row) ? row : []).forEach((cell, index) => {
        const td = document.createElement("td");
        td.innerHTML = cell;
        if (headers[index]) {
          td.dataset.label = headers[index];
        }
        tr.appendChild(td);
      });
      this.$body.appendChild(tr);
    });
  }
}

customElements.define("slice-table", Table);
