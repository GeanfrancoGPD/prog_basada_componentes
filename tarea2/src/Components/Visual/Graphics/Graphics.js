import apexcharts from "../../../deps/apexcharts/apexcharts.esm.js";

export default class Graphics extends HTMLElement {
  static props = {
    type: { type: "string", default: "bar", required: false },
    height: { type: "number", default: 220, required: false },
    width: { type: "number|string", default: "100%", required: false },
    title: { type: "string", default: "Evolución de gastos", required: false },
    categories: {
      type: "array",
      default: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
      required: false,
    },
    series: {
      type: "array",
      default: [{ name: "Gastos", data: [1200, 1750, 1540, 1980, 2200, 2410] }],
      required: false,
    },
    accentColor: {
      type: "string",
      default: "var(--primary-color)",
      required: false,
    },
    currentValue: { type: "number", default: 7500, required: false },
    totalValue: { type: "number", default: 10000, required: false },
  };

  constructor(props) {
    super();
    slice.attachTemplate(this);
    this.$context = this.querySelector(".graphics-context");
    this._chart = null;
    this._pendingRender = false;
    slice.controller.setComponentProps(this, props);
  }

  connectedCallback() {
    if (this._pendingRender) this.render();
  }

  async init() {
    if (this.isConnected) {
      await this.render();
      return;
    }
    this._pendingRender = true;
  }

  async update() {
    if (this.isConnected) {
      await this.render();
      return;
    }
    this._pendingRender = true;
  }

  // ─── Render principal ────────────────────────────────────────────────────────

  async render() {
    this._pendingRender = false;
    if (!this.$context) this.$context = this.querySelector(".graphics-context");
    if (!this.$context) return;

    // El progress-donut no usa ApexCharts — lo manejamos aparte
    if (this.type === "progress-donut") {
      this._destroyChart();
      this.$context.innerHTML = "";
      this._renderProgressDonut();
      return;
    }

    this._destroyChart();
    this.$context.innerHTML = "";

    const chartHost = document.createElement("div");
    chartHost.classList.add("graphics-chart-host");
    chartHost.style.width = `${this.width || "100%"}`;
    chartHost.style.height = `${this.height || 220}px`;
    this.$context.appendChild(chartHost);

    const options = this._buildBaseOptions();
    this._applyTypeOptions(options);

    this._chart = new apexcharts(chartHost, options);
    await this._chart.render();
  }

  // ─── Helpers comunes ─────────────────────────────────────────────────────────

  _destroyChart() {
    if (this._chart) {
      this._chart.destroy();
      this._chart = null;
    }
  }

  _resolvedAccent() {
    return (
      this.accentColor ||
      getComputedStyle(this).getPropertyValue("--primary-color").trim() ||
      "#4f46e5"
    );
  }

  _normalizeSeries() {
    const isPieOrDonut = this.type === "donut" || this.type === "pie";
    let finalSeries = this.series || [];
    let finalLabels = this.categories || [];

    if (isPieOrDonut && finalSeries.length > 0) {
      if (
        typeof finalSeries[0] === "object" &&
        !Array.isArray(finalSeries[0].data)
      ) {
        finalLabels = finalSeries.map((item) => item.name);
        finalSeries = finalSeries.map((item) => item.data);
      } else if (
        typeof finalSeries[0] === "object" &&
        Array.isArray(finalSeries[0].data)
      ) {
        finalSeries = finalSeries[0].data;
      }
    }

    return { finalSeries, finalLabels };
  }

  // ─── Opciones base (compartidas por todas las gráficas ApexCharts) ────────────

  _buildBaseOptions() {
    const { finalSeries } = this._normalizeSeries();
    const isPieOrDonut = this.type === "donut" || this.type === "pie";

    return {
      chart: {
        type: this.type || "bar",
        height: this.height || 220,
        fontFamily: "inherit",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: true, speed: 600 },
      },
      series: finalSeries,
      dataLabels: { enabled: false },
      tooltip: { theme: "light" },
      legend: {
        show: true,
        position: isPieOrDonut ? "right" : "top",
        horizontalAlign: "left",
        fontSize: "13px",
        labels: { colors: "var(--font-primary-color)" },
        markers: { radius: 12 },
      },
      title: {
        text: this.title || "Gráfica",
        align: "left",
        style: {
          color: "var(--font-primary-color)",
          fontSize: "16px",
          fontWeight: 600,
        },
      },
    };
  }

  // ─── Dispatcher por tipo ─────────────────────────────────────────────────────

  _applyTypeOptions(options) {
    const isPieOrDonut = this.type === "donut" || this.type === "pie";

    if (isPieOrDonut) {
      this._buildPieDonutOptions(options);
    } else {
      this._buildCartesianOptions(options);
    }
  }

  // ─── Opciones pie / donut ────────────────────────────────────────────────────

  _buildPieDonutOptions(options) {
    const { finalSeries, finalLabels } = this._normalizeSeries();
    const accent = this._resolvedAccent();

    options.labels = finalLabels;
    options.colors = finalSeries.map(() => accent);

    options.fill = {
      type: "solid",
      opacity: finalSeries.map((_, i) => Math.max(1 - i * 0.18, 0.3)),
    };

    options.stroke = {
      show: true,
      width: 3,
      colors: ["var(--background-card, #ffffff)"],
    };

    options.plotOptions = {
      pie: {
        expandOnClick: true,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: "var(--font-secondary-color)",
              offsetY: -5,
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 700,
              color: "var(--font-primary-color)",
              offsetY: 5,
              formatter: (val) => `$${Number(val).toLocaleString()}`,
            },
            total: {
              show: true,
              label: "Total",
              color: "var(--font-secondary-color)",
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return `$${total.toLocaleString()}`;
              },
            },
          },
        },
      },
    };
  }

  // ─── Opciones barras / líneas / área ─────────────────────────────────────────

  _buildCartesianOptions(options) {
    const accent = this._resolvedAccent();

    options.colors = [accent];
    options.stroke = {
      curve: "smooth",
      width: this.type === "bar" ? 0 : 3,
    };
    options.fill = {
      type: this.type === "area" ? "gradient" : "solid",
      gradient: {
        shadeIntensity: 0.35,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 90, 100],
      },
    };
    options.grid = {
      borderColor: "rgba(148, 163, 184, 0.18)",
      strokeDashArray: 4,
      padding: { left: 8, right: 8, top: 8, bottom: 0 },
    };
    options.xaxis = {
      categories: this.categories || [],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "var(--font-secondary-color)", fontSize: "12px" },
      },
    };
    options.yaxis = {
      labels: {
        style: { colors: "var(--font-secondary-color)", fontSize: "12px" },
        formatter: (value) => `$${Math.round(value).toLocaleString()}`,
      },
    };
    options.subtitle = {
      text: "Comparativa mensual",
      align: "left",
      style: { color: "var(--font-secondary-color)" },
    };
  }

  // ─── Progress donut (nativo, sin ApexCharts) ─────────────────────────────────

  _renderProgressDonut() {
    const current = this.currentValue ?? 0;
    const total = this.totalValue ?? 1;
    const pct = Math.min(Math.max(current / total, 0), 1);
    const pctText = Math.round(pct * 100) + "%";

    const accent = this._resolvedAccent();
    const SIZE = 160;
    const STROKE = 14;
    const R = (SIZE - STROKE) / 2;
    const CIRC = 2 * Math.PI * R;
    const offset = CIRC * (1 - pct);

    const currentFmt = current.toLocaleString();
    const totalFmt = total.toLocaleString();

    // Contenedor raíz
    const wrapper = document.createElement("div");
    wrapper.classList.add("graphics-progress-donut");
    wrapper.style.cssText = `
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
    `;

    // SVG donut
    const svgNS = "http://www.w3.org/2000/svg";
    const svgWrap = document.createElement("div");
    svgWrap.style.cssText = `position: relative; width: ${SIZE}px; height: ${SIZE}px;`;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    svg.setAttribute("width", SIZE);
    svg.setAttribute("height", SIZE);

    // Track
    const track = document.createElementNS(svgNS, "circle");
    track.setAttribute("cx", SIZE / 2);
    track.setAttribute("cy", SIZE / 2);
    track.setAttribute("r", R);
    track.setAttribute("fill", "none");
    track.setAttribute(
      "stroke",
      "rgba(var(--primary-color-rgb, 99,102,241), 0.12)",
    );
    track.setAttribute("stroke-width", STROKE);

    // Progress arc
    const arc = document.createElementNS(svgNS, "circle");
    arc.setAttribute("cx", SIZE / 2);
    arc.setAttribute("cy", SIZE / 2);
    arc.setAttribute("r", R);
    arc.setAttribute("fill", "none");
    arc.setAttribute("stroke", accent);
    arc.setAttribute("stroke-width", STROKE);
    arc.setAttribute("stroke-linecap", "round");
    arc.setAttribute("stroke-dasharray", CIRC);
    arc.setAttribute("stroke-dashoffset", offset);
    arc.setAttribute("transform", `rotate(-90 ${SIZE / 2} ${SIZE / 2})`);
    arc.style.transition = "stroke-dashoffset 0.6s ease";

    svg.appendChild(track);
    svg.appendChild(arc);
    svgWrap.appendChild(svg);

    // Etiqueta central (overlay absoluto)
    const centerLabel = document.createElement("div");
    centerLabel.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    `;
    centerLabel.innerHTML = `
      <span style="display:block;font-size:1.6rem;font-weight:500;color:var(--font-primary-color)">${pctText}</span>
      <span style="display:block;font-size:0.7rem;color:var(--font-secondary-color);margin-top:2px">del objetivo</span>
    `;
    svgWrap.appendChild(centerLabel);

    // Línea actual / total
    const totals = document.createElement("p");
    totals.style.cssText = `
      margin: 0;
      font-size: 0.85rem;
      color: var(--font-secondary-color);
      text-align: center;
    `;
    totals.textContent = `$${currentFmt} / $${totalFmt}`;

    // Título (si hay)
    if (this.title) {
      const titleEl = document.createElement("p");
      titleEl.style.cssText = `
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: var(--font-primary-color);
        text-align: center;
      `;
      titleEl.textContent = this.title;
      wrapper.appendChild(titleEl);
    }

    wrapper.appendChild(svgWrap);
    wrapper.appendChild(totals);
    this.$context.appendChild(wrapper);
  }
}

customElements.define("slice-graphics", Graphics);
