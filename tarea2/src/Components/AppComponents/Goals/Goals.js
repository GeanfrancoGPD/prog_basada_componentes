export default class Goals extends HTMLElement {
  static menuItems = [
    { text: "Dashboard", path: "/Home" },
    { text: "Transaction", path: "/Transaction" },
    // { text: "Statistics", path: "/Statistics" },
    { text: "Goals", path: "/Goals" },
    // { text: "Settings", path: "/Settings" },
  ];

  constructor(props) {
    super();
    slice.attachTemplate(this);

    this.goals = [];
    this.services = slice.getComponent("Api-Services");

    this.editingIndex = null;
  }

  async init() {
    this.events = slice.events.bind(this);

    this.events.subscribe("goal:save", async ({ data, index }) => {
      const goal =
        index !== null ? this.goals.find((g) => g.id === index) : null;

      await this._saveGoal(goal, data);
      this._buildMetrics();
    });

    this.events.subscribe("goal:delete", async ({ index }) => {
      const goal = this.goals.find((g) => g.id === index);
      if (goal) {
        await this._deleteGoal(goal.id);
      }
      this._buildMetrics();
      this._buildGoalsList();
    });
    await this._IsLogin();
    await this._loadGoals();
    await Promise.all([
      this._buildButton(),
      this._buildSidebar(),
      this._buildHeader(),
      this._buildMetrics(),
      this._buildGoalsList(),
    ]);
  }

  update() {}

  async _IsLogin() {
    const auth = slice.context.getState("auth");
    if (!auth.isAuthenticated) {
      slice.router.navigate("/login");
      return false;
    }

    return true;
  }

  async _loadGoals() {
    const response = await this.services.getGoals();

    // Ajusta según la estructura real:
    this.goals = response.data || response.goals || response || [];
  }

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
    const container = this.querySelector(".Header-container");
    if (!container) return;

    container.innerHTML = ""; // Limpieza

    // Solo lo llamas, ¡y él hace toda la magia solo!
    const header = await slice.build("Header", { title: "Goals" });
    container.appendChild(header);
  }

  async _buildButton() {
    const addButton = await slice.build("Button", {
      value: "Agregar nueva meta",
      onClickCallback: () => this._openGoalModal(null, null),
    });
    const container = this.querySelector(".button");
    if (container) container.appendChild(addButton);
  }

  async _buildMetrics() {
    const metricsContainer = this.querySelector(".goals-Metrics");
    if (!metricsContainer) return;
    console.log("Construyendo métricas con metas:", this.goals);

    metricsContainer.innerHTML = "";
    let activeGoals = this.goals.filter((g) => g.estado === "activa").length;
    let totalGoals = this.goals.length;
    let completedGoals = this.goals.filter(
      (g) => g.estado === "completada",
    ).length;
    let progressPercent =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    console.log("Métricas calculadas:", {
      activeGoals,
      totalGoals,
      completedGoals,
      progressPercent,
    });
    const metricsProgress = document.createElement("div");
    metricsProgress.appendChild(
      await slice.build("Graphics", {
        type: "progress-donut",
        title: "Progreso de metas",
        currentValue: completedGoals,
        totalValue: totalGoals,
        height: 150,
      }),
    );

    const metricsTotal = document.createElement("div");
    metricsTotal.appendChild(
      await slice.build("Target", {
        variant: "stats",
        context: [
          { type: "icon", nombre: "bar_grafic" },
          { type: "title", text: "Tareas completadas" },
          { type: "value", text: `${completedGoals}` },
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
          { type: "value", text: `${totalGoals - completedGoals}` },
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
          { type: "value", text: `${progressPercent}%` },
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

        onDelete: () => this._deleteGoal(goal.id),

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

  async _saveGoal(goal, data) {
    console.log("Guardando goal:", goal, "con datos:", data);
    const dataToSave = {
      titulo: data.title,
      monto_objetivo: data.current,
      monto_actual: data.total,
      fecha_limite: data.targetDate,
      estado: goal ? goal.estado : "activa",
    };
    try {
      if (goal?.id) {
        const response = await this.services.updateGoal(goal.id, dataToSave);
        console.log("Respuesta de actualización:", response);
      } else {
        await this.services.createGoal(dataToSave);
      }

      await this._loadGoals();
      await this._buildGoalsList();
    } catch (error) {
      console.error(error);
    }
  }

  async _deleteGoal(id) {
    try {
      const response = await this.services.deleteGoal(id);
      console.log("Respuesta de eliminación:", response);

      await this._loadGoals();
      await this._buildGoalsList();
    } catch (error) {
      console.error(error);
    }
  }
}

customElements.define("slice-goals", Goals);
