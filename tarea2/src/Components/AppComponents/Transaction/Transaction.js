export default class Transaction extends HTMLElement {
  static props = {};

  static menuItems = [
    { text: "Dashboard", path: "/Home" },
    { text: "Transaction", path: "/Transaction" },
    { text: "Goals", path: "/Goals" },
  ];

  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);

    this.services = slice.getComponent("Api-Services");
    this.auth = slice.context.getState("auth");

    this.state = {
      transactionsData: null,
    };

    this.originalData = [];
    this.data = [];
  }

  async init() {
    const loggedIn = await this._IsLogin();
    if (!loggedIn) return;

    await this._loadTransactions();
    this.events = slice.events.bind(this);

    // Suscripciones a los eventos CRUD
    this.events.subscribe(
      "transaction:create",
      this._createTransaction.bind(this),
    );
    this.events.subscribe(
      "transaction:update",
      this._updateTransaction.bind(this),
    );
    this.events.subscribe(
      "transaction:delete",
      this._deleteTransaction.bind(this),
    );
    this.events.subscribe(
      "transactions:updated",
      this._refreshTransactions.bind(this),
    );

    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildFilterTable(),
      this._buildTransactionTable(),
      this._buildTransactionBar(),
    ]);
  }

  async _refreshTransactions() {
    console.log("Refrescando transacciones...");
    await this._loadTransactions();

    await Promise.all([
      this._buildTransactionTable(),
      this._buildTransactionBar(),
      this._buildFilterTable(),
    ]);
  }

  async update() {}

  async _loadTransactions() {
    this.state.transactionsData = await this.services.getTransactions();
    console.log("Datos reales de Transacciones:", this.state.transactionsData);

    const backendTransactions =
      this.state.transactionsData?.data?.transactions || [];

    this.originalData = backendTransactions.map((t) => [
      t.fecha ? t.fecha.slice(0, 10) : "",
      t.descripcion || "",
      t.categoria || "",
      parseFloat(t.monto || 0),
      t.tipo || t.estado || "",
      `
        <select class="action-select tg-select-action" data-id="${t.id}">
          <option value="" disabled selected>Acciones</option>
          <option value="edit">Editar</option>
          <option value="delete">Eliminar</option>
        </select>
      `,
    ]);

    this.data = [...this.originalData];
  }

  async _createTransaction(transaction) {
    console.log("Creando transacción:", transaction);
    try {
      await this.services.createTransaction(transaction);
      slice.events.emit("transactions:updated");
    } catch (error) {
      console.error("Error al crear:", error);
    }
  }

  async _updateTransaction(transaction) {
    console.log("Actualizando transacción:", transaction);
    try {
      await this.services.updateTransaction(transaction.id, transaction);
      slice.events.emit("transactions:updated");
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  }

  async _deleteTransaction(id) {
    try {
      await this.services.deleteTransaction(id);
      slice.events.emit("transactions:updated");
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  }

  async _IsLogin() {
    if (!this.auth?.isAuthenticated) {
      slice.router.navigate("/login");
      return false;
    }
    return true;
  }

  async _buildSidebar() {
    const sidebar = this.querySelector(".Sidebar-container");
    if (!sidebar) return;

    const menu = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: Transaction.menuItems,
    });
    sidebar.appendChild(menu);
  }

  async _buildHeader() {
    const container = this.querySelector(".Header-container");
    if (!container) return;

    container.innerHTML = "";

    const header = await slice.build("Header", { title: "Transaction" });
    container.appendChild(header);
  }

  async _buildTransactionTable() {
    const table = this.querySelector(".transaction-table");
    if (!table) return;

    table.innerHTML = "";

    const transactionTable = await slice.build("Table", {
      headers: [
        "Fecha",
        "Descripción",
        "Categoría",
        "Cantidad",
        "Estado",
        "Acción",
      ],
      rows: this.data,
      pagination: { pageSize: 5 },
      defaultSort: { key: "name", direction: "asc" },
    });

    table.appendChild(transactionTable);

    // ¡Importante! Vinculamos los eventos DESPUÉS de renderizar la tabla
    this._bindTableActions();
  }

  _bindTableActions() {
    const selects = this.querySelectorAll(".action-select");

    selects.forEach((select) => {
      select.addEventListener("change", (e) => {
        const action = e.target.value;
        const id = parseInt(e.target.getAttribute("data-id"));

        // Buscamos la transacción completa en nuestra memoria
        const transaction =
          this.state.transactionsData?.data?.transactions.find(
            (t) => t.id === id,
          );

        if (action === "edit" && transaction) {
          slice.events.emit("modal:open", {
            type: "transaction",
            data: transaction,
            categories: this.state.transactionsData?.data?.categories || [],
          });
        } else if (action === "delete") {
          const confirmar = confirm(
            `¿Estás seguro de eliminar "${transaction.descripcion}"?`,
          );
          if (confirmar) {
            slice.events.emit("transaction:delete", id);
          }
        }

        // Reseteamos el select para que vuelva a decir "Acciones"
        e.target.value = "";
      });
    });
  }

  async _buildTransactionBar() {
    const bar = this.querySelector(".transaction-table-bar");
    if (!bar) return;

    const backendTransactions =
      this.state.transactionsData?.data?.transactions || [];

    // Sumamos los montos basándonos en las transacciones reales
    const totalesPorCategoria = backendTransactions.reduce((acc, t) => {
      if (t.tipo === "gasto" || t.estado === "gasto") {
        const nombreCat = t.categoria || "Sin categoría";
        acc[nombreCat] = (acc[nombreCat] || 0) + parseFloat(t.monto || 0);
      }
      return acc;
    }, {});

    const nombresCategorias = Object.keys(totalesPorCategoria);
    const montosCategorias = Object.values(totalesPorCategoria);

    const miGraficaDeBarras = await slice.build("Graphics", {
      type: "bar",
      title: "Distribución de Gastos",
      categories:
        nombresCategorias.length > 0 ? nombresCategorias : ["Sin Datos"],
      series: [
        {
          name: "Monto",
          data: montosCategorias.length > 0 ? montosCategorias : [0],
        },
      ],
      accentColor: "var(--primary-color)",
    });

    bar.innerHTML = "";
    bar.appendChild(miGraficaDeBarras);
  }

  async _buildFilterTable() {
    const filterContainer = this.querySelector(".filter-button");
    if (!filterContainer) return;

    filterContainer.innerHTML = "";
    const backendCategories =
      this.state.transactionsData?.data?.categories || [];
    const categoryOptions = [
      { label: "Sin filtro", value: "" },
      ...backendCategories.map((item) => ({
        label: item.categoria,
        value: item.categoria,
      })),
    ];

    const dateFilter = await slice.build("Select", {
      label: "Fecha",
      visibleProp: "label",
      options: [
        { label: "Sin filtro", value: "" },
        { label: "Mayo 2026", value: "2026-05" },
        { label: "Junio 2026", value: "2026-06" },
      ],
      onOptionSelect: () => this._applyFilters(),
    });

    const categoryFilter = await slice.build("Select", {
      label: "Categoría",
      visibleProp: "label",
      options: categoryOptions,
      onOptionSelect: () => this._applyFilters(),
    });

    const statusFilter = await slice.build("Select", {
      label: "Estado",
      visibleProp: "label",
      options: [
        { label: "Sin filtro", value: "" },
        { label: "Gasto", value: "gasto" },
        { label: "Ingreso", value: "ingreso" },
      ],
      onOptionSelect: () => this._applyFilters(),
    });

    this.dateFilter = dateFilter;
    this.categoryFilter = categoryFilter;
    this.statusFilter = statusFilter;

    filterContainer.appendChild(dateFilter);
    filterContainer.appendChild(categoryFilter);
    filterContainer.appendChild(statusFilter);
  }

  _applyFilters() {
    if (!this.originalData) return;

    const date = this.dateFilter?.value?.value || "";
    const category = this.categoryFilter?.value?.value || "";
    const status = this.statusFilter?.value?.value || "";

    this.data = this.originalData.filter((transaction) => {
      const matchDate = !date || transaction[0].startsWith(date);
      const matchCategory = !category || transaction[2] === category; // index 2 = Categoría
      const matchStatus =
        !status || transaction[4].toLowerCase() === status.toLowerCase(); // index 4 = Estado/Tipo

      return matchDate && matchCategory && matchStatus;
    });

    this._buildTransactionTable();
  }
}

customElements.define("slice-transaction", Transaction);
