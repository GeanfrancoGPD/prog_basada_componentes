export default class Statistics extends HTMLElement {
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
  }

  async init() {
    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildMetricsCard(),
      this._buildCharts(),
      this.suggestions(),
    ]);
  }

  update() {
    // Component update logic (can be async)
  }

  async _buildSidebar() {
    const sidebar = this.querySelector(".Sidebar-container");

    if (!sidebar) return;

    const menu = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: Statistics.menuItems,
    });

    sidebar.appendChild(menu);
  }

  async _buildHeader() {
    const searchBar = await slice.build("SearchBar", {});
    const addButton = await slice.build("Button", {
      value: "agregar transaction",
    });

    const header = await slice.build("Header", {
      title: "",
      items: [searchBar, addButton],
    });
    const container = this.querySelector(".Header-container");
    if (container) {
      container.appendChild(header);
    }
  }

  async _buildMetricsCard() {
    const metricsContainer = this.querySelector(".metrics");
    if (!metricsContainer) return;

    const one = document.createElement("div");
    one.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const two = document.createElement("div");
    two.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const three = document.createElement("div");
    three.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const four = document.createElement("div");
    four.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    if (!metricsContainer) return;
    const grid = await slice.build("Grid", {
      columns: "4",
      arrow: "1",
      items: [one, two, three, four],
    });
    metricsContainer.appendChild(grid);
  }

  async _buildCharts() {
    const mainChart = this.querySelector(".main-chart");
    const secondaryChart = this.querySelector(".secondary-chart");

    if (!mainChart || !secondaryChart) return;

    const areaChart = await slice.build("Graphics", {
      type: "area",
      height: 400,
      width: "100%",
      title: "Evolución financiera",
      categories: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      series: [
        {
          name: "Gastos",
          data: [1200, 1750, 1540, 1980, 2200, 2410],
        },
        {
          name: "Ingresos",
          data: [1600, 1900, 2050, 2300, 2500, 2750],
        },
      ],
    });

    const donutChart = await slice.build("Graphics", {
      type: "donut",
      height: 400,
      width: "100%",
      title: "Distribución de gastos",
      series: [
        { name: "Ocio", data: 35 },
        { name: "Transporte", data: 25 },
        { name: "Comida", data: 20 },
        { name: "Otros", data: 20 },
      ],
    });

    mainChart.appendChild(areaChart);
    secondaryChart.appendChild(donutChart);
  }

  async suggestions() {
    const metricsContainer = this.querySelector(".suggestions");
    if (!metricsContainer) return;

    const one = document.createElement("div");
    one.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const two = document.createElement("div");
    two.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const three = document.createElement("div");
    three.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const four = document.createElement("div");
    four.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          {
            type: "icon",
            nombre: "bar_grafic",
          },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: "$5,120.30" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    if (!metricsContainer) return;
    const grid = await slice.build("Grid", {
      columns: "4",
      arrow: "1",
      items: [one, two, three, four],
    });
    metricsContainer.appendChild(grid);
  }
}

customElements.define("slice-statistics", Statistics);
