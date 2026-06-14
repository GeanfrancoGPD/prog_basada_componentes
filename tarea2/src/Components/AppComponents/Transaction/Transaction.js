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
    this.originalData = [
      [
        "2024-06-01",
        "Compra en supermercado",
        "Alimentación",
        50.0,
        "Completada",
      ],
      [
        "2024-06-03",
        "Pago de transporte público",
        "Transporte",
        2.5,
        "Completada",
      ],
    ];
    this.data = [...this.originalData];
  }

  async init() {
    this.events = slice.events.bind(this);

    this.events.subscribe("transaction:save", (transaction) => {
      this.originalData.push([
        transaction.date,
        transaction.description,
        transaction.category,
        transaction.amount,
        transaction.status,
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
        "Descricion",
        "Categoria",
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

    const miGraficaDeBarras = await slice.build("Graphics", {
      type: "bar",
      title: "Distribución de Gastos Mensuales",
      categories: ["Alimentación", "Transporte", "Vivienda", "Ocio", "Salud"],
      series: [
        {
          name: "Monto",
          data: [450, 120, 800, 300, 150],
        },
      ],
      accentColor: "var(--primary-color)",
    });

    console.log("Gráfica de barras añadida al DOM");
    bar.appendChild(miGraficaDeBarras);
  }

  async _buildFilterTable() {
    const filterContainer = this.querySelector(".filter-button");

    if (!filterContainer) return;

    filterContainer.innerHTML = "";

    const dateFilter = await slice.build("Select", {
      label: "Fecha",
      visibleProp: "label",
      options: [
        { label: "Sin filtro", value: "" },
        { label: "Junio 2024", value: "2024-06" },
        { label: "Mayo 2024", value: "2024-05" },
        { label: "Abril 2024", value: "2024-04" },
      ],
      onOptionSelect: () => this._applyFilters(),
    });

    const categoryFilter = await slice.build("Select", {
      label: "Categoría",
      visibleProp: "label",
      options: [
        { label: "Sin filtro", value: "" },
        { label: "Alimentación", value: "Alimentación" },
        { label: "Transporte", value: "Transporte" },
        { label: "Vivienda", value: "Vivienda" },
        { label: "Ocio", value: "Ocio" },
        { label: "Salud", value: "Salud" },
      ],
      onOptionSelect: () => this._applyFilters(),
    });

    const statusFilter = await slice.build("Select", {
      label: "Estado",
      visibleProp: "label",
      options: [
        { label: "Sin filtro", value: "" },
        { label: "Completada", value: "Completada" },
        { label: "Pendiente", value: "Pendiente" },
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
    if (!this.originalData) {
      console.warn("originalData aún no está listo");
      return;
    }
    const date = this.dateFilter?.value?.value || "";
    const category = this.categoryFilter?.value?.value || "";
    const status = this.statusFilter?.value?.value || "";

    this.data = this.originalData.filter((transaction) => {
      const matchDate = !date || transaction[0].startsWith(date);

      const matchCategory = !category || transaction[2] === category;

      const matchStatus = !status || transaction[4] === status;

      return matchDate && matchCategory && matchStatus;
    });

    this._buildTransactionTable();
  }
}

customElements.define("slice-transaction", Transaction);
