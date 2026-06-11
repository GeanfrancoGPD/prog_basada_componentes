export default class HomePage extends HTMLElement {
  constructor(props) {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, props);
    this.debuggerProps = [];
  }

  async init() {
    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildDashboardPanels(),
      this._buildDashboardPanels2(),
      this._buildGraphics(),
      this._buildSuggestions(),
    ]);
  }

  async _buildSidebar() {
    const sidebar = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: [
        { text: "Dashboard", path: "/" },
        { text: "Transaction", path: "/Transaction" },
        { text: "Statistics", path: "/Statistics" },
        { text: "Goals", path: "/Goals" },
        { text: "Settings", path: "/Settings" },
      ],
    });

    const container = this.querySelector(".Sidebar-container");

    if (container) {
      container.appendChild(sidebar);
    }
  }

  async _buildTarget() {
    const target = await slice.build("Target", {
      context: [
        { item: "title", text: "This is a title" },
        { item: "label", text: "This is a label" },
      ],
    });
    const container = this.querySelector(".target-container");
    if (container) {
      container.appendChild(target);
    }
  }

  async _buildDashboardPanels() {
    const panelsContainer = this.querySelector(".dashboard-panels");

    if (!panelsContainer) return;

    const monthlyStatsSchema = [
      {
        type: "icon",
        nombre: "bar_grafic",
      },
      { type: "title", text: "Gastos mensuales" },
      { type: "value", text: "$5,120.30" },
      { type: "badge", text: "-4.2%" },
    ];

    const divDonut = document.createElement("div");

    divDonut.appendChild(
      await slice.build("Graphics", {
        type: "donut",
        height: 220,
        width: 80,
        title: "Distribución por categorías",
        series: [
          { name: "Ocio", data: 35 },
          { name: "Transporte", data: 25 },
          { name: "Comida", data: 20 },
          { name: "Otros", data: 20 },
        ],
      }),
    );

    const statsCard = await slice.build("Target", {
      variant: "stats",
      context: monthlyStatsSchema,
    });
    panelsContainer.appendChild(statsCard);
    panelsContainer.appendChild(divDonut);
  }

  async _buildDashboardPanels2() {
    const panelsContainer = this.querySelector(".dashboard-panels-2");
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
          { type: "title", text: "Ingresos mensuales" },
          { type: "value", text: "$8,450.60" },
          { type: "badge", text: "+2.8%" },
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
          { type: "title", text: "Ingresos mensuales" },
          { type: "value", text: "$8,450.60" },
          { type: "badge", text: "+2.8%" },
        ],
      }),
    );

    if (!panelsContainer) return;
    const grid = await slice.build("Grid", {
      columns: "3",
      arrow: "1",
      items: [one, two, three],
    });
    panelsContainer.appendChild(grid);
  }

  async _buildGraphics() {
    const container = this.querySelector(".graphics-container");

    if (!container) return;

    const graphics = await slice.build("Graphics", {
      type: "area",
      height: 440,
      width: "100%",
      title: "Evolución de gastos e ingresos",
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

    container.appendChild(graphics);
  }

  async _buildHeader() {
    const searchBar = await slice.build("SearchBar", {});
    const addButton = await slice.build("Button", {
      value: "agregar transaction",
      onClickCallback: await slice.setTheme("Dark"),
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

  async _buildSearchBar() {
    const searchBar = await slice.build("SearchBar", {});
    const container = this.querySelector(".SearchBar-container");
    if (container) {
      container.appendChild(searchBar);
    }
  }

  async _buildHeroCta() {
    const docsBtn = await slice.build("Button", {
      value: "Documentation",
      onClickCallback: () =>
        window.open("https://slice-js-docs.vercel.app/Documentation", "_blank"),
      customColor: {
        button: "var(--primary-color)",
        label: "var(--primary-color-contrast)",
      },
    });

    const componentsBtn = await slice.build("Button", {
      value: "Components Library",
      onClickCallback: () =>
        window.open(
          "https://slice-js-docs.vercel.app/Documentation/Visual",
          "_blank",
        ),
      customColor: {
        button: "var(--secondary-background-color)",
        label: "var(--primary-color)",
      },
    });

    const cta = this.querySelector(".hero-cta");
    cta.appendChild(docsBtn);
    cta.appendChild(componentsBtn);
  }

  async _buildSuggestions() {
    const container = this.querySelector(".suggestions-container");

    if (!container) return;

    const suggestions = [
      {
        title: "Recomendación 1",
        text: "Tus gastos en ocio subieron esta semana. Revisa categorías con más variación.",
      },
      {
        title: "Recomendación 2",
        text: "Hay un pico en transporte. Puedes comparar esta semana con el promedio mensual.",
      },
      {
        title: "Recomendación 3",
        text: "Tu saldo disponible es estable, pero conviene vigilar compras pequeñas repetidas.",
      },
    ];

    const cards = await Promise.all(
      suggestions.map((suggestion) =>
        slice.build("Target", {
          variant: "info",
          context: [
            {
              type: "icon",
              nombre: "bar_grafic",
            },
            { type: "title", text: suggestion.title },
            { type: "text", text: suggestion.text },
          ],
        }),
      ),
    );

    cards.forEach((card) => container.appendChild(card));
  }
}

customElements.define("slice-home-page", HomePage);
