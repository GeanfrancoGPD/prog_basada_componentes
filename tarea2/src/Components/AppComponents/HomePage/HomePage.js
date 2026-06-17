export default class HomePage extends HTMLElement {
  static props = {};

  constructor() {
    super();
    slice.attachTemplate(this);
    slice.controller.setComponentProps(this, HomePage.props);
    this.debuggerProps = [];
    this.services = slice.getComponent("Api-Services");
    this.state = {
      dashboardData: null,
    };
    this.auth = slice.context.getState("auth");
  }

  async init() {
    const loggedIn = await this._IsLogin();
    console.log("Estado de autenticación:", loggedIn, this.auth);
    if (!loggedIn) {
      return;
    }

    this.state.dashboardData = await this.services.getDashboard();

    console.log("Dashboard:", this.state.dashboardData);

    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildDashboardPanels(),
      this._buildDashboardPanels2(),
      this._buildGraphics(),
      this._buildSuggestions(),
    ]);
  }

  async _IsLogin() {
    if (!this.auth.isAuthenticated) {
      slice.router.navigate("/login");
      return false;
    }

    console.log("obteniendo contexto auth:", this.auth);

    return true;
  }

  async _buildSidebar() {
    const sidebar = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: [
        { text: "Dashboard", path: "/Home" },
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
    const balance = this.state.dashboardData?.data?.summary?.[0]?.balance;
    const expensesByCategory =
      this.state.dashboardData?.data?.expensesByCategory || [];

    const monthlyStatsSchema = [
      {
        type: "icon",
        nombre: "bar_grafic",
      },
      { type: "title", text: "Balance mensual" },
      { type: "value", text: `$${balance || 0}` },
    ];

    const divDonut = document.createElement("div");

    const chartSeries = expensesByCategory.map((item) => ({
      name: item.categoria,
      data: parseFloat(item.total),
    }));

    divDonut.appendChild(
      await slice.build("Graphics", {
        type: "donut",
        height: 220,
        width: 80,
        title: "Distribución por categorías",
        series: chartSeries,
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
    if (!panelsContainer) return;
    const incomeVsExpenses =
      this.state.dashboardData?.data?.incomeVsExpenses || [];

    const datosMesActual = incomeVsExpenses[0] || {};
    const ingresos = Number(datosMesActual.ingresos || 0);
    const gastos = Number(datosMesActual.gastos || 0);

    const datosMesPasado = incomeVsExpenses[1] || {};
    const ingresosMesPasado = Number(datosMesPasado.ingresos || 0);

    // --- PANEL 1: Gastos Mensuales ---
    const one = document.createElement("div");
    one.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Gastos mensuales" },
          { type: "value", text: `$${gastos.toFixed(2)}` },
        ],
      }),
    );

    // --- PANEL 2: Ingresos Mensuales ---
    const two = document.createElement("div");
    two.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Ingresos mensuales" },
          { type: "value", text: `$${ingresos.toFixed(2)}` },
        ],
      }),
    );

    // --- PANEL 3: Ingresos Mes Pasado ---
    const three = document.createElement("div");
    three.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Ingresos del mes pasado" },
          { type: "value", text: `$${ingresosMesPasado.toFixed(2)}` },
        ],
      }),
    );

    // --- CONSTRUCCIÓN DEL GRID ---
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

    const incomeVsExpenses =
      this.state.dashboardData?.data?.incomeVsExpenses || [];
    const cronologicalData = [...incomeVsExpenses].reverse();

    const formatter = new Intl.DateTimeFormat("es", { month: "long" });

    // Mapeamos los nombres de los meses de forma dinámica
    const meses = cronologicalData.map((item) => {
      if (!item.mes) return "";

      // Separamos el año y el mes de la cadena "YYYY-MM" (Ej: "2026-05" -> ["2026", "05"])
      const [year, month] = item.mes.split("-");

      // Creamos una fecha en JavaScript.
      // Nota: Restamos 1 al mes porque en JavaScript los meses van de 0 (enero) a 11 (diciembre).
      const date = new Date(Number(year), Number(month) - 1, 1);

      // Formateamos la fecha para obtener el nombre del mes
      const nombreMes = formatter.format(date);

      // Opcional: Ponemos la primera letra en mayúscula (Ej: "mayo" -> "Mayo")
      return nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1);
    });

    const gastosData = cronologicalData.map((item) => Number(item.gastos || 0));
    const ingresosData = cronologicalData.map((item) =>
      Number(item.ingresos || 0),
    );

    const graphics = await slice.build("Graphics", {
      type: "area",
      height: 440,
      width: "100%",
      title: "Evolución de gastos e ingresos",
      categories: meses,
      series: [
        {
          name: "Gastos",
          data: gastosData,
        },
        {
          name: "Ingresos",
          data: ingresosData,
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

    const recommendations =
      this.state.dashboardData?.data?.recommendations || [];

    // Si no hay recomendaciones del servidor, creamos un estado por defecto para que no quede vacío
    const suggestionsToRender =
      recommendations.length > 0
        ? recommendations
        : [
            {
              type: "info",
              title: "Todo al día",
              message:
                "No tienes alertas de gastos pendientes para este periodo.",
            },
          ];

    //  Construimos los componentes usando la información mapeada
    const cards = await Promise.all(
      suggestionsToRender.map((suggestion) =>
        slice.build("Target", {
          variant: suggestion.type || "info", // Usa "warning", "info", etc., dinámicamente según tu JSON
          context: [
            {
              type: "icon",
              nombre: "bar_grafic",
            },
            { type: "title", text: suggestion.title },
            { type: "text", text: suggestion.message }, // En tu JSON se llama 'message' en lugar de 'text'
          ],
        }),
      ),
    );

    cards.forEach((card) => container.appendChild(card));
  }
}

customElements.define("slice-home-page", HomePage);
