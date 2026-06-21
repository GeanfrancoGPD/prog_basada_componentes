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
    if (!loggedIn) return;

    this.events = slice.events.bind(this);

    this.events.subscribe(
      "transactions:updated",
      this._refreshDashboard.bind(this),
    );

    await this._loadDashboardData();

    await Promise.all([
      this._buildSidebar(),
      this._buildHeader(),
      this._buildDashboardPanels(),
      this._buildDashboardPanels2(),
      this._buildGraphics(),
      this._buildSuggestions(),
    ]);
  }

  async _buildHeader() {
    const container = this.querySelector(".Header-container");
    if (!container) return;

    container.innerHTML = ""; // Limpieza

    const header = await slice.build("Header", { title: "Dashboard" });
    container.appendChild(header);
  }

  // Módulo aislado para la petición de datos
  async _loadDashboardData() {
    try {
      this.state.dashboardData = await this.services.getDashboard();
      console.log("Datos del Dashboard cargados:", this.state.dashboardData);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
    }
  }

  //Esta función se ejecuta automáticamente cuando se altera una transacción en la app
  async _refreshDashboard() {
    console.log(
      "Detectado cambio en transacciones. Actualizando métricas del home...",
    );

    // Volvemos a traer los datos frescos del servidor (balances, gastos nuevos, etc.)
    await this._loadDashboardData();

    // Repintamos únicamente los paneles dinámicos que dependen de las finanzas
    await Promise.all([
      this._buildDashboardPanels(),
      this._buildDashboardPanels2(),
      this._buildGraphics(),
      this._buildSuggestions(),
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
    const container = this.querySelector(".Sidebar-container");
    if (!container) return;

    container.innerHTML = ""; // Limpieza de seguridad
    const sidebar = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: [
        { text: "Dashboard", path: "/Home" },
        { text: "Transaction", path: "/Transaction" },
        { text: "Goals", path: "/Goals" },
      ],
    });
    container.appendChild(sidebar);
  }

  async _buildDashboardPanels() {
    const panelsContainer = this.querySelector(".dashboard-panels");
    if (!panelsContainer) return;

    panelsContainer.innerHTML = "";

    const balance = this.state.dashboardData?.data?.summary?.[0]?.balance;
    const expensesByCategory =
      this.state.dashboardData?.data?.expensesByCategory || [];

    const monthlyStatsSchema = [
      { type: "icon", nombre: "bar_grafic" },
      { type: "title", text: "Balance mensual" },
      { type: "value", text: `$${balance || 0}` },
    ];

    const divDonut = document.createElement("div");
    const chartSeries = expensesByCategory.map((item) => ({
      name: item.categoria,
      data: parseFloat(item.total || 0),
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

    panelsContainer.innerHTML = "";

    const incomeVsExpenses =
      this.state.dashboardData?.data?.incomeVsExpenses || [];
    const datosMesActual = incomeVsExpenses[0] || {};
    const ingresos = Number(datosMesActual.ingresos || 0);
    const gastos = Number(datosMesActual.gastos || 0);

    const datosMesPasado = incomeVsExpenses[1] || {};
    const ingresosMesPasado = Number(datosMesPasado.ingresos || 0);

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

    container.innerHTML = "";

    const incomeVsExpenses =
      this.state.dashboardData?.data?.incomeVsExpenses || [];
    const cronologicalData = [...incomeVsExpenses].reverse();
    const formatter = new Intl.DateTimeFormat("es", { month: "long" });

    const meses = cronologicalData.map((item) => {
      if (!item.mes) return "";
      const [year, month] = item.mes.split("-");
      const date = new Date(Number(year), Number(month) - 1, 1);
      const nombreMes = formatter.format(date);
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
        { name: "Gastos", data: gastosData },
        { name: "Ingresos", data: ingresosData },
      ],
    });

    container.appendChild(graphics);
  }

  async _buildSuggestions() {
    const container = this.querySelector(".suggestions-container");
    if (!container) return;

    container.innerHTML = "";

    const recommendations =
      this.state.dashboardData?.data?.recommendations || [];

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

    const cards = await Promise.all(
      suggestionsToRender.map((suggestion) =>
        slice.build("Target", {
          variant: suggestion.type || "info",
          context: [
            { type: "icon", nombre: "bar_grafic" },
            { type: "title", text: suggestion.title },
            { type: "text", text: suggestion.message },
          ],
        }),
      ),
    );

    cards.forEach((card) => container.appendChild(card));
  }
}

customElements.define("slice-home-page", HomePage);
