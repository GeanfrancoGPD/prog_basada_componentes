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
      default: [
        {
          name: "Gastos",
          data: [1200, 1750, 1540, 1980, 2200, 2410],
        },
      ],
      required: false,
    },
    accentColor: {
      type: "string",
      default: "var(--primary-color)",
      required: false,
    },
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

  async render() {
    this._pendingRender = false;
    if (!this.$context) this.$context = this.querySelector(".graphics-context");
    if (!this.$context) return;

    if (this._chart) {
      await this._chart.destroy();
      this._chart = null;
    }

    this.$context.innerHTML = "";

    const chartHost = document.createElement("div");
    chartHost.classList.add("graphics-chart-host");
    chartHost.style.width = `${this.width || "100%"}`;
    chartHost.style.height = `${this.height || 220}px`;
    this.$context.appendChild(chartHost);

    const resolvedAccent =
      this.accentColor ||
      getComputedStyle(this).getPropertyValue("--primary-color").trim() ||
      "#4f46e5";

    const isPieOrDonut = this.type === "donut" || this.type === "pie";

    let finalSeries = this.series || [];
    let finalLabels = this.categories || [];

    if (isPieOrDonut && this.series && this.series.length > 0) {
      // Si detecta que data NO es un array (es un número plano), extrae todo automáticamente
      if (
        typeof this.series[0] === "object" &&
        !Array.isArray(this.series[0].data)
      ) {
        finalSeries = this.series.map((item) => item.data); // [35, 25, 20, 20]
        finalLabels = this.series.map((item) => item.name); // ["Ocio", "Transporte", ...]
      }
      // Caso de fallback por si acaso le pasas la estructura vieja de barras
      else if (
        typeof this.series[0] === "object" &&
        Array.isArray(this.series[0].data)
      ) {
        finalSeries = this.series[0].data;
      }
    }

    // Configuración base con diseño limpio y moderno
    const options = {
      chart: {
        type: this.type || "bar",
        height: this.height || 220,
        fontFamily: "inherit", // Sincroniza con la fuente de tu app
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
        markers: { radius: 12 }, // Marcadores de leyenda circulares y modernos
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

    // ========================================================
    // CONDICIONALES DE DISEÑO MODERNO (LOOK UPDATE)
    // ========================================================
    if (isPieOrDonut) {
      options.labels = finalLabels;

      // GENERACIÓN DE PALETA MONOCROMÁTICA DINÁMICA
      // 'resolvedAccent' tiene el color base de tu CSS (ej: #4f46e5 o rgb)
      // Generamos variantes alterando la opacidad para ir del más oscuro al más claro
      options.colors = finalSeries.map((_, index) => {
        // Cuantos más elementos, más se reduce la opacidad de los últimos
        const opacity = 1 - index * (0.7 / Math.max(finalSeries.length - 1, 1));

        // Convertimos el color base en un color con opacidad transparente
        // Si tu base es HEX, ApexCharts acepta formatos con opacidad usando RGBA o aplicando color con 'fill'
        return resolvedAccent;
      });

      // Para que la opacidad funcione perfecto sobre el color base en ApexCharts:
      options.fill = {
        type: "solid",
        opacity: finalSeries.map((_, index) => {
          // El primero va al 100% (1) de opacidad (oscuro) y los siguientes se van aclarando
          return Math.max(1 - index * 0.18, 0.3);
        }),
      };

      options.stroke = {
        show: true,
        width: 3,
        // Al usar opacidades, el borde DEBE ser del color exacto del fondo de la tarjeta
        // para que "corte" las rebanadas limpiamente.
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
                  const total = w.globals.seriesTotals.reduce(
                    (a, b) => a + b,
                    0,
                  );
                  return `$${total.toLocaleString()}`;
                },
              },
            },
          },
        },
      };
    } else {
      // Diseño para Barras / Líneas
      options.colors = [resolvedAccent];
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

    this._chart = new apexcharts(chartHost, options);
    await this._chart.render();
  }
}

customElements.define("slice-graphics", Graphics);
