import DB from "../../components/DBComponent.js";

const db = DB;
db.init();

export default class FinanzaRepository {
  async getUserByEmail(gmail) {
    const result = await db.excecuteNameQuery("getUserByEmail", { gmail });
    return result && result.length > 0 ? result[0] : null;
  }

  async getUserById(usuario_id) {
    const result = await db.excecuteNameQuery("getUserById", { usuario_id });
    return result && result.length > 0 ? result[0] : null;
  }

  // NUEVO: Insertar un nuevo usuario en el registro
  async createUser(nombre, gmail, password_hash) {
    return await db.excecuteNameQuery("createUser", {
      nombre,
      gmail,
      password_hash,
    });
  }

  async getDashboardSummary(usuario_id) {
    return await db.excecuteNameQuery("getDashboardSummary", { usuario_id });
  }

  async getExpensesByCategory(usuario_id) {
    return await db.excecuteNameQuery("getExpensesByCategory", { usuario_id });
  }

  async getIncomeVsExpenses(usuario_id) {
    return await db.excecuteNameQuery("getIncomeVsExpenses", { usuario_id });
  }

  async getGoalProgress(usuario_id) {
    return await db.excecuteNameQuery("getGoalProgress", { usuario_id });
  }

  async getGoalsByUser(usuario_id) {
    return await db.excecuteNameQuery("getGoalsByUser", { usuario_id });
  }

  async getTransactionsByUser(usuario_id) {
    return await db.excecuteNameQuery("getTransactionsByUser", { usuario_id });
  }

  async getAllUsers() {
    return await db.excecuteNameQuery("getAllUsers", {});
  }

  async updateUserPassword(usuario_id, newPasswordHash) {
    return await db.excecuteNameQuery("updateUserPassword", {
      usuario_id,
      newPasswordHash,
    });
  }

  //Goals

  async createGoal(
    usuario_id,
    titulo,
    monto_objetivo,
    monto_actual,
    fecha_limite,
    estado,
  ) {
    return await db.excecuteNameQuery("createGoal", {
      usuario_id,
      titulo,
      monto_objetivo,
      monto_actual,
      fecha_limite,
      estado,
    });
  }

  async updateGoal(
    id,
    titulo,
    monto_objetivo,
    monto_actual,
    fecha_limite,
    estado,
  ) {
    return await db.excecuteNameQuery("updateGoal", {
      id,
      titulo,
      monto_objetivo,
      monto_actual,
      fecha_limite,
      estado,
    });
  }

  async deleteGoal(id) {
    return await db.excecuteNameQuery("deleteGoal", { id });
  }

  // Transactions

  async createTransaction(usuario_id, monto, tipo, categoria_id, fecha) {
    return await db.excecuteNameQuery("createTransaction", {
      usuario_id,
      monto,
      tipo,
      categoria_id,
      fecha,
    });
  }

  async updateTransaction(id, monto, tipo, categoria_id, fecha) {
    return await db.excecuteNameQuery("updateTransaction", {
      id,
      monto,
      tipo,
      categoria_id,
      fecha,
    });
  }

  async deleteTransaction(id) {
    return await db.excecuteNameQuery("deleteTransaction", { id });
  }

  async getCategories() {
    return await db.excecuteNameQuery("getCategories", {});
  }
}
