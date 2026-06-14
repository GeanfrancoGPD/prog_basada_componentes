export default class Goals extends HTMLElement {
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

    this.goals = [
      {
        title: "New Tesla Model 3",
        category: "Personal Travel",
        icon: "car",
        current: 28000,
        total: 45000,
        targetDate: "2024-12-20",
      },
    ];

    this.editingIndex = null;
  }

  async init() {
    this.events = slice.events.bind(this);

    this.events.subscribe("goal:save", ({ data, index }) => {
      if (index !== null) {
        this.goals[index] = data;
      } else {
        this.goals.push(data);
      }

      this._buildGoalsList();
    });

    await Promise.all([
      this._buildButton(),
      this._buildSidebar(),
      this._buildHeader(),
      this._buildMetrics(),
      this._buildGoalsList(),
    ]);
  }

  update() {}

  async _buildSidebar() {
    const sidebar = this.querySelector(".Sidebar-container");
    if (!sidebar) return;
    const menu = await slice.build("Sidebar", {
      title: "Dashboard fintraack",
      items: Goals.menuItems,
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
    if (container) container.appendChild(header);
  }

  async _buildButton() {
    const addButton = await slice.build("Button", {
      value: "Agregar nueva meta",
      onClickCallback: () => this._openGoalModal(),
    });
    const container = this.querySelector(".button");
    if (container) container.appendChild(addButton);
  }

  async _buildMetrics() {
    const metricsContainer = this.querySelector(".goals-Metrics");
    if (!metricsContainer) return;

    const metricsProgress = document.createElement("div");
    metricsProgress.appendChild(
      await slice.build("Graphics", {
        type: "progress-donut",
        title: "Progreso de metas",
        currentValue: 7,
        totalValue: 10,
        height: "150px",
      }),
    );

    const metricsTotal = document.createElement("div");
    metricsTotal.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Tareas completadas" },
          { type: "value", text: "4" },
          { type: "badge", text: "-4.2%" },
        ],
      }),
    );

    const metricsPending = document.createElement("div");
    metricsPending.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Tareas pendientes" },
          { type: "value", text: "6" },
          { type: "badge", text: "+2.5%" },
        ],
      }),
    );

    const metricsUltimate = document.createElement("div");
    metricsUltimate.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Progreso general" },
          { type: "value", text: "50%" },
          { type: "badge", text: "+1.5%" },
        ],
      }),
    );

    const grid = await slice.build("Grid", {
      columns: "4",
      items: [metricsProgress, metricsTotal, metricsPending, metricsUltimate],
    });

    metricsContainer.appendChild(grid);
  }

  async _buildGoalsList() {
    const goalsListContainer = this.querySelector(".goals-list");
    if (!goalsListContainer) return;

    goalsListContainer.innerHTML = "";

    const items = [];

    for (let i = 0; i < this.goals.length; i++) {
      const goal = this.goals[i];

      const goalEl = await slice.build("TargetGoals", {
        ...goal,
        id: i + 1,

        onEdit: () => this._openGoalModal(goal, i),

        onDelete: () => this._deleteGoal(i),

        onComplete: () => {
          this.goals[i].completed = true;
          this._buildGoalsList();
        },
      });

      items.push(goalEl);
    }

    const grid = await slice.build("Grid", {
      columns: "3",
      items,
    });

    goalsListContainer.appendChild(grid);
  }

  _openGoalModal(goal = null, index = null) {
    slice.events.emit("modal:open", {
      type: "goal",
      data: goal,
      index,
    });
  }

  _saveGoal(data) {
    if (this.editingIndex !== null) {
      this.goals[this.editingIndex] = data;
      this.editingIndex = null;
    } else {
      this.goals.push(data);
    }

    this._buildGoalsList();
  }

  _deleteGoal(index) {
    this.goals.splice(index, 1);
    this._buildGoalsList();
  }
}

customElements.define("slice-goals", Goals);
