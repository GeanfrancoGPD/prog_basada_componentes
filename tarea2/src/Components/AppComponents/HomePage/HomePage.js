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
    ]);
  }

  async _buildSidebar() {
    const sidebar = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: [
        { text: "Dashboard", path: "/" },
        { text: "transactions", path: "/Playground" },
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
        svg: `
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M4 19H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M7 15V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M11 15V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M15 15V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M19 15V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        `,
      },
      { type: "title", text: "Gastos mensuales" },
      { type: "value", text: "$5,120.30" },
      { type: "badge", text: "-4.2%" },
    ];

    const budgetInfoSchema = [
      {
        type: "icon",
        svg: `
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 8.5V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 16.5H12.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <path d="M10.3 4.5L2.8 18a1.8 1.8 0 0 0 1.56 2.7h15.28A1.8 1.8 0 0 0 21.2 18L13.7 4.5a1.9 1.9 0 0 0-3.4 0Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        `,
      },
      { type: "title", text: "Recomendación" },
      {
        type: "text",
        text: "Tus gastos en ocio subieron esta semana. Revisa categorías con más variación.",
      },
    ];

    const [statsCard, infoCard] = await Promise.all([
      slice.build("Target", {
        variant: "stats",
        context: monthlyStatsSchema,
      }),
      slice.build("Target", {
        variant: "info",
        context: budgetInfoSchema,
      }),
    ]);

    panelsContainer.appendChild(statsCard);
    panelsContainer.appendChild(infoCard);
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
            svg: `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 19H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 15V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M11 15V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 15V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 15V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `,
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
            svg: `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 19H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 15V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M11 15V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 15V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 15V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `,
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
            svg: `
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M4 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M4 19H20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 15V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M11 15V9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M15 15V7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M19 15V11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          `,
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
}

customElements.define("slice-home-page", HomePage);
