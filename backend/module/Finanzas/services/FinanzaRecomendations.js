export default class RecommendationService {
  constructor(repository) {
    this.repository = repository;
  }

  async generateRecommendations(usuario_id) {
    const recommendations = [];

    const summary = await this.repository.getDashboardSummary(usuario_id);

    const categories = await this.repository.getExpensesByCategory(usuario_id);

    const goals = await this.repository.getGoalsByUser(usuario_id);

    // Balance negativo
    if (Number(summary.balance) < 0) {
      recommendations.push({
        type: "danger",
        title: "Balance negativo",
        message:
          "Tus gastos superan tus ingresos. Considera reducir gastos este mes.",
      });
    }

    // Categoría dominante
    if (categories.length > 0) {
      const topCategory = categories[0];

      const porcentaje =
        (Number(topCategory.total) / Number(summary.gastos || 1)) * 100;

      if (porcentaje > 40) {
        recommendations.push({
          type: "warning",
          title: "Gasto concentrado",
          message: `La categoría "${topCategory.categoria}" representa ${porcentaje.toFixed(
            0,
          )}% de tus gastos.`,
        });
      }
    }

    // Metas atrasadas
    const today = new Date();

    goals.forEach((goal) => {
      if (!goal.fecha_limite) return;

      const limitDate = new Date(goal.fecha_limite);

      const progress =
        (Number(goal.monto_actual) / Number(goal.monto_objetivo)) * 100;

      const daysRemaining = (limitDate - today) / (1000 * 60 * 60 * 24);

      if (daysRemaining < 30 && progress < 70) {
        recommendations.push({
          type: "warning",
          title: "Meta en riesgo",
          message: `La meta "${goal.titulo}" vence pronto y lleva solo ${progress.toFixed(
            0,
          )}% de avance.`,
        });
      }

      if (progress >= 80 && progress < 100) {
        recommendations.push({
          type: "success",
          title: "Meta casi completada",
          message: `Ya alcanzaste ${progress.toFixed(
            0,
          )}% de la meta "${goal.titulo}".`,
        });
      }
    });

    if (recommendations.length === 0) {
      recommendations.push({
        type: "info",
        title: "Buen trabajo",
        message: "Tus finanzas se encuentran estables actualmente.",
      });
    }

    return recommendations;
  }
}
