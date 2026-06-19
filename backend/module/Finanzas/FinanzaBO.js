import bcrypt from "bcrypt";
import FinanzaRepository from "../Finanzas/FinanzaRepository.js";
import RecommendationService from "./services/FinanzaRecomendations.js";

export class FinanceBO {
  constructor() {
    this.repository = new FinanzaRepository();
    this.service = new RecommendationService(this.repository);
  }
  async login(req, res) {
    try {
      const { gmail, password } = req.body;

      if (!gmail || !password) {
        return res.status(400).json({
          success: false,
          message: "Email y contraseña son requeridos",
        });
      }

      console.log("gmail:", gmail, "password:", password);

      // Consumimos el repositorio mapeado de forma estática
      const user = await this.repository.getUserByEmail(gmail);
      console.log("user:", user);

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "El usuario no existe" });
      }

      const validPassword = await bcrypt.compare(password, user.contrasena);

      if (!validPassword) {
        return res
          .status(401)
          .json({ success: false, message: "Contraseña incorrecta" });
      }

      // IMPORTANTE: Inicializar la sesión
      req.session = req.session || {};
      req.session.user = {
        id: user.id, // Sin [0]
        nombre: user.nombre, // Sin [0]
        email: user.gmail, // Sin [0]
      };

      return res.status(200).json({
        success: true,
        message: "Login exitoso",
        user: req.session.user,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async register(req, res) {
    try {
      const { username, gmail, password } = req.body;

      if (!username || !gmail || !password) {
        return res.status(400).json({
          success: false,
          message: "Todos los campos son obligatorios",
        });
      }

      // 1. Validar si ya existe el correo usando el repositorio
      const existingUser = await this.repository.getUserByEmail(gmail);
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "El correo ya está registrado" });
      }

      // 2. Encriptar la contraseña de forma segura
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      // 3. Crear el usuario pasando los parámetros en el orden que espera tu base de datos
      await this.repository.createUser(username, gmail, passwordHash);

      return res
        .status(201)
        .json({ success: true, message: "Usuario creado con éxito" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // ==========================
  // DASHBOARD
  // ==========================

  async getDashboard(req, res) {
    const usuario_id = req.session?.user?.id;

    if (!usuario_id) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const [
      summary,
      expensesByCategory,
      incomeVsExpenses,
      goals,
      recommendations,
    ] = await Promise.all([
      this.repository.getDashboardSummary(usuario_id),
      this.repository.getExpensesByCategory(usuario_id),
      this.repository.getIncomeVsExpenses(usuario_id),
      this.repository.getGoalsByUser(usuario_id),
      this.service.generateRecommendations(usuario_id),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        summary,
        expensesByCategory,
        incomeVsExpenses,
        goals,
        recommendations,
      },
    });
  }

  async getExpensesByCategory(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const categories = await this.repository.getExpensesByCategory(usuario_id);

    return res.status(200).json({
      success: true,
      data: categories,
    });
  }

  async getIncomeVsExpenses(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const result = await this.repository.getIncomeVsExpenses(usuario_id);

    return res.status(200).json({
      success: true,
      data: result,
    });
  }

  async getCategories(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const categories = await this.repository.getAllCategories();

    return res.status(200).json({
      success: true,
      data: { categories },
    });
  }

  // ==========================
  // TRANSACTIONS
  // ==========================

  async getTransactions(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const transactions =
      await this.repository.getTransactionsByUser(usuario_id);
    const categories = await this.repository.getAllCategories();

    return res.status(200).json({
      success: true,
      data: { transactions, categories },
    });
  }

  async createTransaction(req, res) {
    const { tipo, monto, categoria_id, descripcion, fecha } = req.body;
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    if (!tipo || !monto || !categoria_id || !descripcion || !fecha) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    // ¡Orden corregido para que coincida con el Repositorio!
    await this.repository.createTransaction(
      usuario_id,
      monto,
      tipo,
      descripcion,
      categoria_id,
      fecha,
    );

    return res.status(201).json({
      success: true,
      message: "Transacción creada correctamente",
    });
  }

  async updateTransaction(req, res) {
    const { id } = req.params;
    const { tipo, monto, categoria_id, descripcion, fecha } = req.body;

    // Validación de seguridad para que no lleguen undefined a la DB
    if (!tipo || !monto || !categoria_id || !descripcion || !fecha) {
      return res.status(400).json({
        success: false,
        message: "Todos los campos son requeridos",
      });
    }

    await this.repository.updateTransaction(
      id,
      monto,
      tipo,
      descripcion,
      categoria_id,
      fecha,
    );

    return res.status(200).json({
      success: true,
      message: "Transacción actualizada",
    });
  }

  async deleteTransaction(req, res) {
    const { id } = req.params;

    await this.repository.deleteTransaction(id);

    return res.status(200).json({
      success: true,
      message: "Transacción eliminada",
    });
  }

  // ==========================
  // GOALS
  // ==========================

  async getGoals(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const goals = await this.repository.getGoalsByUser(usuario_id);

    return res.status(200).json({
      success: true,
      data: goals,
    });
  }

  async createGoal(req, res) {
    const { titulo, monto_objetivo, monto_actual, fecha_limite, estado } =
      req.body;
    const usuario_id = req.params.id || req.session?.user?.id;

    console.log(
      "createGoal - id:",
      usuario_id,
      "titulo:",
      titulo,
      "monto_objetivo:",
      monto_objetivo,
      "monto_actual:",
      monto_actual,
      "fecha_limite:",
      fecha_limite,
      "estado:",
      estado,
    );

    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    if (
      !titulo ||
      !monto_objetivo ||
      !fecha_limite ||
      !estado ||
      !monto_actual
    ) {
      return res.status(400).json({
        success: false,
        message: "Datos incompletos",
      });
    }

    await this.repository.createGoal(
      usuario_id,
      titulo,
      monto_objetivo,
      monto_actual || 0,
      fecha_limite,
      estado || "pendiente",
    );

    return res.status(201).json({
      success: true,
      message: "Meta creada correctamente",
    });
  }

  async updateGoal(req, res) {
    const { id } = req.params;
    const { titulo, monto_objetivo, monto_actual, fecha_limite, estado } =
      req.body;

    await this.repository.updateGoal(
      id,
      titulo,
      monto_objetivo,
      monto_actual,
      fecha_limite,
      estado,
    );

    return res.status(200).json({
      success: true,
      message: "Meta actualizada",
    });
  }

  async deleteGoal(req, res) {
    const { id } = req.params;

    await this.repository.deleteGoal(id);

    return res.status(200).json({
      success: true,
      message: "Meta eliminada",
    });
  }

  async getGoalProgress(req, res) {
    const usuario_id = req.session?.user?.id;
    if (!usuario_id)
      return res.status(401).json({ success: false, message: "No autorizado" });

    const progress = await this.repository.getGoalProgress(usuario_id);

    return res.status(200).json({
      success: true,
      data: progress[0],
    });
  }

  // ==========================
  // CATEGORIES
  // ==========================

  async getCategories(req, res) {
    const categories = await this.repository.getCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  }

  async getUsers(req, res) {
    try {
      // Control de acceso: Verificar que el usuario esté autenticado
      //   const usuario_id = req.session?.user?.id;
      //   if (!usuario_id) {
      //     return res
      //       .status(401)
      //       .json({ success: false, message: "No autorizado" });
      //   }

      const usuarios = await this.repository.getAllUsers();

      return res.status(200).json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { nombre, gmail, password } = req.body;

    // Validar que el usuario exista
    const existingUser = await this.repository.getUserById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña si se proporciona
    let passwordHash = existingUser.contrasena; // Mantener la contraseña actual si no se proporciona una nueva
    if (password) {
      const salt = await bcrypt.genSalt(12);
      passwordHash = await bcrypt.hash(password, salt);
    }

    await this.repository.updateUser(id, nombre, gmail, passwordHash);

    return res.status(200).json({
      success: true,
      message: "Usuario actualizado",
    });
  }

  async updateUserPassword(req, res) {
    const { id } = req.body;
    const { password } = req.body;
    console.log("datos:", id, password);
    // Validar que el usuario exista
    const existingUser = await this.repository.getUserById(id);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Usuario no encontrado" });
    }

    // Encriptar la nueva contraseña
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    await this.repository.updateUserPassword(id, passwordHash);

    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada",
    });
  }
}
