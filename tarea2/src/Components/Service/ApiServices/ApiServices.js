// /Services/ApiService.js
import FecthManager from "../FetchManager/FetchManager.js";

export default class ApiServices {
  constructor() {
    this.base = new FecthManager({
      baseUrl: "http://localhost:5000/api/finanzas",
      timeout: 10000,
    });

    slice.context.create("auth", {
      user: null,
      isAuthenticated: false,
    });
  }

  // =====================
  // AUTH
  // =====================

  async login(gmail, password) {
    const res = await this.base.request("POST", { gmail, password }, "/login");

    return res;
  }

  async register(payload) {
    const res = await this.base.request("POST", payload, "/register");

    return res;
  }

  async logout() {
    return await this.base.request("POST", {}, "/logout");
  }

  // =====================
  // DASHBOARD
  // =====================

  async getDashboard() {
    return await this.base.request("GET", null, "/dashboard");
  }

  // =====================
  // TRANSACTIONS
  // =====================

  async getTransactions() {
    return await this.base.request("GET", null, "/transactions");
  }

  async createTransaction(data) {
    return await this.base.request("POST", data, "/transactions");
  }

  async updateTransaction(id, data) {
    return await this.base.request("PUT", data, `/transactions/${id}`);
  }

  async deleteTransaction(id) {
    return await this.base.request("DELETE", null, `/transactions/${id}`);
  }

  // =====================
  // GOALS
  // =====================

  async getGoals() {
    return await this.base.request("GET", null, "/goals");
  }

  async createGoal(data) {
    return await this.base.request("POST", data, "/goals");
  }

  async updateGoal(id, data) {
    return await this.base.request("PUT", data, `/goals/${id}`);
  }

  async deleteGoal(id) {
    return await this.base.request("DELETE", null, `/goals/${id}`);
  }
}
