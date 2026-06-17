export default class Transaction extends HTMLElement {
  static props = {};

  static menuItems = [
    { text: "Dashboard", path: "/" },
    { text: "Transaction", path: "/Transaction" },
    { text: "Statistics", path: "/Statistics" },
    { text: "Goals", path: "/Goals" },
    { text: "Settings", path: "/Settings" },
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

    this.state.transactionsData = await this.services.getTransactions();
    console.log("Datos reales de Transacciones:", this.state.transactionsData);

    const backendTransactions =
      this.state.transactionsData?.data?.transactions || [];

    this.originalData = backendTransactions.map((t) => [
      t.fecha ? t.fecha.slice(0, 10) : "", // "2026-05-23T04:00..." -> "2026-05-23"
      t.descripcion || "",
      t.tipo || "gasto",
      parseFloat(t.monto || 0),
      t.tipo === "ingreso" ? "Completado" : "Completado", // O el estado que manejes
      "", // Columna reservada para "Action"
    ]);

    this.data = [...this.originalData];

    // Eventos
    this.events = slice.events.bind(this);
    this.events.subscribe("transaction:save", (transaction) => {
      this.originalData.unshift([
        // .unshift añade al principio para que se vea arriba
        transaction.date,
        transaction.description,
        transaction.category,
        parseFloat(transaction.amount),
        transaction.status,
        "",
      ]);
      this.data = [...this.originalData];
      this._buildTransactionTable();
    });

    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildFilterTable(),
      this._buildTransactionTable(),
      this._buildTransactionBar(),
    ]);
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
    const searchBar = await slice.build("SearchBar", {});
    const addButton = await slice.build("Button", {
      value: "Agregar transaction",
      onClickCallback: () => {
        slice.events.emit("modal:open", {
          type: "transaction",
        });
      },
    });
    const header = await slice.build("Header", {
      title: "",
      items: [searchBar, addButton],
    });
    const container = this.querySelector(".Header-container");
    if (container) container.appendChild(header);
  }

  async _buildTransactionTable() {
    const table = this.querySelector(".transaction-table");
    if (!table) return;

    table.innerHTML = "";

    const transactionTable = await slice.build("Table", {
      headers: [
        "Fecha",
        "Descripción",
        "Tipo/Categoría",
        "Cantidad",
        "Estado",
        "Action",
      ],
      rows: this.data,
      pagination: { pageSize: 5 },
      defaultSort: { key: "name", direction: "asc" },
    });
    table.appendChild(transactionTable);
  }

  async _buildTransactionBar() {
    const bar = this.querySelector(".transaction-table-bar");
    if (!bar) return;

    const backendCategories =
      this.state.transactionsData?.data?.categories || [];

    const nombresCategorias = backendCategories.map((item) => item.categoria);
    const montosCategorias = backendCategories.map((item) =>
      parseFloat(item.total || 0),
    );

    const miGraficaDeBarras = await slice.build("Graphics", {
      type: "bar",
      title: "Distribución de Gastos Mensuales",
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

    bar.appendChild(miGraficaDeBarras);
  }

  async _buildFilterTable() {
    const filterContainer = this.querySelector(".filter-button");
    if (!filterContainer) return;

    filterContainer.innerHTML = "";

    // CORRECCIÓN: Filtros dinámicos basados en la propiedad 'categories'
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
        { label: "Abril 2026", value: "2026-04" },
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
        { label: "gasto", value: "gasto" },
        { label: "ingreso", value: "ingreso" },
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
      // Ajustamos los índices del filtro al nuevo arreglo:
      // transaction[2] es tipo/categoria y transaction[4] es estado/tipo de flujo
      const matchCategory = !category || transaction[2] === category;
      const matchStatus =
        !status || transaction[4].toLowerCase() === status.toLowerCase();

      return matchDate && matchCategory && matchStatus;
    });

    this._buildTransactionTable();
  }
}

customElements.define("slice-transaction", Transaction);
