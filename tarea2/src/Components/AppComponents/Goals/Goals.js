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

    // ✅ Un solo array unificado
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
      onClickCallback: () => this._buildModal(),
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

        onEdit: () => this._buildModal(goal, i),

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

  _buildModal(goal = null, index = null) {
    this.editingIndex = index;

    const backdrop = document.createElement("div");
    backdrop.className = "tg-modal-backdrop";

    const modal = document.createElement("div");
    modal.className = "tg-modal";

    modal.innerHTML = `
      <form class="tg-form">
        <div class="tg-modal-header">
          <h3 class="tg-modal-title">${goal ? "Edit Goal" : "New Goal"}</h3>
          <button type="button" class="tg-modal-close">×</button>
        </div>

        <div class="tg-form-body">
          <div class="tg-field">
            <label>Title</label>
            <input name="title" placeholder="Goal title" required />
          </div>

          <div class="tg-field">
            <label>Category</label>
            <input name="category" placeholder="Category" required />
          </div>

          <div class="tg-row">
            <div class="tg-field">
              <label>Current</label>
              <input name="current" type="number" min="0" required />
            </div>
            <div class="tg-field">
              <label>Total</label>
              <input name="total" type="number" min="1" required />
            </div>
          </div>

          <div class="tg-field">
            <label>Target Date</label>
            <input name="targetDate" type="date" required />
          </div>
        </div>

        <div class="tg-modal-actions">
          <button type="button" class="tg-btn tg-btn--cancel">Cancel</button>
          <button type="submit" class="tg-btn tg-btn--save">Save</button>
        </div>
      </form>
    `;

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    requestAnimationFrame(() =>
      backdrop.classList.add("tg-modal-backdrop--open"),
    );

    const close = () => backdrop.remove();

    modal.querySelector(".tg-modal-close").onclick = close;
    modal.querySelector(".tg-btn--cancel").onclick = close;

    if (goal) {
      modal.querySelector("[name='title']").value = goal.title || "";
      modal.querySelector("[name='category']").value = goal.category || "";
      modal.querySelector("[name='current']").value = goal.current ?? 0;
      modal.querySelector("[name='total']").value = goal.total ?? 1;
      modal.querySelector("[name='targetDate']").value = goal.targetDate || "";
    }

    modal.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const data = {
        title: form.title.value,
        category: form.category.value,
        current: Number(form.current.value),
        total: Number(form.total.value),
        targetDate: form.targetDate.value,
      };
      this._saveGoal(data);
      close();
    };
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
