# 💰 Finance API

API REST para la gestión de finanzas personales.

## Características

- Registro e inicio de sesión mediante **Express Session**.
- Gestión de transacciones (ingresos y gastos).
- Gestión de metas financieras.
- Dashboard financiero.
- Estadísticas por categoría y evolución mensual.
- Cambio de contraseña.

---

# Autenticación

La autenticación se realiza mediante **Express Session**.

Al iniciar sesión correctamente, el servidor crea una sesión y almacena la información del usuario. Los endpoints protegidos utilizan el middleware `authMiddleware` para verificar que exista una sesión activa.

No es necesario enviar un token JWT en los encabezados.

---

# Endpoints

## Auth

### Registro

```http
POST /register
```

Body:

```json
{
  "nombre": "Juan Pérez",
  "gmail": "juan@gmail.com",
  "password": "123456"
}
```

---

### Login

```http
POST /login
```

Body:

```json
{
  "gmail": "juan@gmail.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "message": "Inicio de sesión exitoso"
}
```

---

## Usuarios

### Obtener usuarios

```http
GET /usuarios
```

Obtiene la lista de usuarios registrados.

---

### Dashboard

```http
GET /dashboard
```

Requiere sesión activa.

Obtiene toda la información necesaria para construir el dashboard financiero del usuario.

Respuesta:

```json
{
  "success": true,
  "data": {
    "summary": {
      "ingresos": 5000,
      "gastos": 2500,
      "balance": 2500
    },
    "expensesByCategory": [
      {
        "categoria": "Comida",
        "total": 1200
      }
    ],
    "incomeVsExpenses": [
      {
        "mes": "2025-01",
        "ingresos": 3000,
        "gastos": 1500
      }
    ],
    "goals": [
      {
        "id": 1,
        "titulo": "Comprar Laptop",
        "monto_objetivo": 1500,
        "monto_actual": 900,
        "fecha_limite": "2025-12-31",
        "estado": "activa"
      }
    ],
    "recommendations": [
      {
        "type": "warning",
        "title": "Gasto concentrado",
        "message": "La categoría Comida representa el 45% de tus gastos."
      }
    ]
  }
}
```

Incluye:

- Resumen financiero.
- Distribución de gastos por categoría.
- Evolución mensual de ingresos y gastos.
- Metas financieras.
- Recomendaciones automáticas personalizadas.

### Gastos por categoría

```http
GET /statistics/categories
```

Requiere sesión activa.

Response:

```json
[
  {
    "categoria": "Comida",
    "total": 1200
  }
]
```

---

### Ingresos vs Gastos

```http
GET /statistics/income-vs-expenses
```

Requiere sesión activa.

Response:

```json
[
  {
    "mes": "2025-01",
    "ingresos": 3000,
    "gastos": 1500
  }
]
```

---

# Transacciones

### Obtener transacciones

```http
GET /transactions
```

Requiere sesión activa.

Obtiene todas las transacciones del usuario autenticado.

**Respuesta (JSON):**

```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "categoria": "Alquiler",
        "total": "1600.00"
      },
      {
        "categoria": "Alimentos",
        "total": "730.00"
      },
      {
        "categoria": "Servicios",
        "total": "255.00"
      },
      {
        "categoria": "Entretenimiento",
        "total": "235.00"
      }
    ],
    "transactions": [
      {
        "id": 12,
        "tipo": "gasto",
        "monto": "150.00",
        "descripcion": "Concierto de fin de semana",
        "fecha": "2026-05-23T04:00:00.000Z"
      },
      {
        "id": 8,
        "tipo": "ingreso",
        "monto": "600.00",
        "descripcion": "Consultoría de software extra",
        "fecha": "2026-05-20T04:00:00.000Z"
      }
    ]
  }
}
```

---

### Crear transacción

```http
POST /transactions
```

Requiere sesión activa.

Body:

```json
{
  "categoria_id": 1,
  "tipo": "gasto",
  "monto": 100,
  "descripcion": "Cena",
  "fecha": "2025-01-15"
}
```

---

### Actualizar transacción

```http
PUT /transactions/:id
```

Requiere sesión activa.

Actualiza una transacción existente.

---

### Eliminar transacción

```http
DELETE /transactions/:id
```

Requiere sesión activa.

Elimina una transacción existente.

---

# Metas Financieras

### Obtener metas

```http
GET /goals
```

Requiere sesión activa.

Obtiene todas las metas financieras del usuario.

**respuesta del servidor**

```json
_renderGoalModal(goal = null, index = null) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <form class="tg-form">
        <div class="tg-modal-header">
          <h3 class="tg-modal-title">${goal ? "Editar Meta" : "Nueva Meta"}</h3>
          <button type="button" class="tg-modal-close">&times;</button>
        </div>

        <div class="tg-form-body">
          <div class="tg-field">
            <label>Título</label>
            <input name="title" placeholder="Ej. Fondo de emergencia" required />
          </div>

          <div class="tg-field">
            <label>Categoría</label>
            <input name="category" placeholder="Ej. Ahorro" required />
          </div>

          <div class="tg-row">
            <div class="tg-field">
              <label>Monto Actual</label>
              <input name="current" type="number" min="0" placeholder="0" required />
            </div>
            <div class="tg-field">
              <label>Meta Total</label>
              <input name="total" type="number" min="0" placeholder="0" required />
            </div>
          </div>

          <div class="tg-field">
            <label>Fecha Límite</label>
            <input name="targetDate" type="date" required />
          </div>
        </div>

        <div class="tg-modal-actions">
          <button type="button" class="tg-btn tg-btn--cancel">Cancelar</button>
          <button type="submit" class="tg-btn tg-btn--save">Guardar</button>
        </div>
      </form>
    `;

    const form = wrapper.querySelector("form");

    if (goal) {
      // Usar form.elements evita el conflicto con la propiedad nativa 'title'
      form.elements["title"].value = goal.title || "";
      form.elements["category"].value = goal.category || "";
      form.elements["current"].value = goal.current || 0;
      form.elements["total"].value = goal.total || 0;
      form.elements["targetDate"].value = goal.targetDate || "";
    }

    wrapper.querySelector(".tg-modal-close").onclick = () =>
      slice.events.emit("modal:close");
    wrapper.querySelector(".tg-btn--cancel").onclick = () =>
      slice.events.emit("modal:close");

    form.onsubmit = (e) => {
      e.preventDefault();
      slice.events.emit("goal:save", {
        data: {
          title: form.elements["title"].value,
          category: form.elements["category"].value,
          current: Number(form.elements["current"].value),
          total: Number(form.elements["total"].value),
          targetDate: form.elements["targetDate"].value,
        },
        index,
      });
      slice.events.emit("modal:close");
    };

    return wrapper;
  }
```

---

### Crear meta

```http
POST /goals
```

Requiere sesión activa.

Body:

```json
{
  "titulo": "Comprar Laptop",
  "monto_objetivo": 1500,
  "monto_actual": 300,
  "fecha_limite": "2025-12-31"
}
```

---

### Actualizar meta

```http
PUT /goals/:id
```

Requiere sesión activa.

Actualiza una meta financiera.

---

### Eliminar meta

```http
DELETE /goals/:id
```

Requiere sesión activa.

Elimina una meta financiera.

---

### Progreso de metas

```http
GET /goals/progress
```

Requiere sesión activa.

Response:

```json
{
  "total_metas": 5,
  "metas_completadas": 2,
  "porcentaje_completado": 40
}
```

---

# Categorías

### Obtener categorías

```http
GET /categories
```

Requiere sesión activa.

Obtiene las categorías disponibles para clasificar transacciones.

---

# Perfil

### Cambiar contraseña

```http
PUT /profile/password
```

Requiere sesión activa.

Body:

```json
{
  "currentPassword": "123456",
  "newPassword": "654321"
}
```

---

# Consultas SQL Internas

## Usuarios

### getUserByEmail

Obtiene un usuario por correo electrónico.

```sql
SELECT id, nombre, gmail, password_hash AS contrasena
FROM usuarios
WHERE gmail = $1
```

---

### getUserById

Obtiene un usuario por ID.

```sql
SELECT id, nombre, gmail
FROM usuarios
WHERE id = $1
```

---

### getAllUsers

Obtiene todos los usuarios registrados.

```sql
SELECT id, nombre, gmail, moneda_preferida
FROM usuarios
ORDER BY nombre ASC
```

---

### createUser

Crea un nuevo usuario.

```sql
INSERT INTO usuarios(nombre, gmail, password_hash)
VALUES($1,$2,$3)
```

---

## Transacciones

### getTransactionsByUser

Obtiene todas las transacciones de un usuario.

```sql
SELECT t.id, t.tipo, t.monto, t.descripcion, t.fecha, c.nombre AS categoria
FROM transacciones t
INNER JOIN categorias c ON c.id = t.categoria_id
WHERE t.usuario_id = $1
ORDER BY t.fecha DESC
```

---

### createTransaction

Registra una nueva transacción.

```sql
INSERT INTO transacciones(usuario_id, categoria_id, tipo, monto, descripcion, fecha)
VALUES($1,$2,$3,$4,$5,$6)
```

---

### getBalanceByUser

Calcula el balance actual del usuario.

```sql
SELECT COALESCE(
    SUM(
        CASE
            WHEN tipo = 'ingreso' THEN monto
            ELSE -monto
        END
    ),0
) AS balance
FROM transacciones
WHERE usuario_id = $1
```

---

### getTotalExpensesByUser

Calcula el total de gastos.

```sql
SELECT COALESCE(SUM(monto),0) AS total_gastos
FROM transacciones
WHERE usuario_id = $1
AND tipo = 'gasto'
```

---

### getExpensesByCategory

Agrupa gastos por categoría.

```sql
SELECT c.nombre AS categoria,
       COALESCE(SUM(t.monto),0) AS total
FROM transacciones t
INNER JOIN categorias c ON c.id = t.categoria_id
WHERE t.usuario_id = $1
AND t.tipo = 'gasto'
GROUP BY c.nombre
ORDER BY total DESC
```

---

### getIncomeByCategory

Agrupa ingresos por categoría.

```sql
SELECT c.nombre AS categoria,
       COALESCE(SUM(t.monto),0) AS total
FROM transacciones t
INNER JOIN categorias c ON c.id = t.categoria_id
WHERE t.usuario_id = $1
AND t.tipo = 'ingreso'
GROUP BY c.nombre
ORDER BY total DESC
```

---

### getMonthlyExpenses

Obtiene gastos agrupados por mes.

```sql
SELECT TO_CHAR(fecha,'YYYY-MM') AS mes,
       COALESCE(SUM(monto),0) AS total
FROM transacciones
WHERE usuario_id = $1
AND tipo = 'gasto'
GROUP BY mes
ORDER BY mes
```

---

### getMonthlyIncome

Obtiene ingresos agrupados por mes.

```sql
SELECT TO_CHAR(fecha,'YYYY-MM') AS mes,
       COALESCE(SUM(monto),0) AS total
FROM transacciones
WHERE usuario_id = $1
AND tipo = 'ingreso'
GROUP BY mes
ORDER BY mes
```

---

### getIncomeVsExpenses

Obtiene ingresos y gastos agrupados por mes.

```sql
SELECT TO_CHAR(fecha,'YYYY-MM') AS mes,
       COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto END),0) AS ingresos,
       COALESCE(SUM(CASE WHEN tipo='gasto' THEN monto END),0) AS gastos
FROM transacciones
WHERE usuario_id = $1
GROUP BY mes
ORDER BY mes
```

---

## Metas

### getGoalsByUser

Obtiene las metas financieras del usuario.

```sql
SELECT id,
       titulo,
       monto_objetivo,
       monto_actual,
       fecha_limite,
       estado
FROM metas_financieras
WHERE usuario_id = $1
ORDER BY fecha_limite ASC
```

---

### createGoal

Crea una nueva meta financiera.

```sql
INSERT INTO metas_financieras(
    usuario_id,
    titulo,
    monto_objetivo,
    monto_actual,
    fecha_limite
)
VALUES($1,$2,$3,$4,$5)
```

---

### getActiveGoals

Obtiene las metas activas.

```sql
SELECT id,
       titulo,
       monto_objetivo,
       monto_actual,
       fecha_limite,
       estado
FROM metas_financieras
WHERE usuario_id = $1
AND estado = 'activa'
ORDER BY fecha_limite
```

---

### getGoalProgress

Calcula el porcentaje de cumplimiento de metas.

```sql
SELECT COUNT(*) AS total_metas,
       COUNT(CASE WHEN estado = 'completada' THEN 1 END) AS metas_completadas,
       ROUND(
           (
               COUNT(CASE WHEN estado = 'completada' THEN 1 END)::numeric /
               NULLIF(COUNT(*),0)
           ) * 100,
           2
       ) AS porcentaje_completado
FROM metas_financieras
WHERE usuario_id = $1
```

---

## Dashboard

### getDashboardSummary

Obtiene un resumen financiero general.

```sql
SELECT
    COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto ELSE 0 END),0) AS ingresos,
    COALESCE(SUM(CASE WHEN tipo='gasto' THEN monto ELSE 0 END),0) AS gastos,
    COALESCE(SUM(CASE WHEN tipo='ingreso' THEN monto ELSE -monto END),0) AS balance
FROM transacciones
WHERE usuario_id = $1
```

Incluye:

- Total de ingresos.
- Total de gastos.
- Balance general.

---

## Seguridad

### updateUserPassword

Actualiza la contraseña del usuario.

```sql
UPDATE usuarios
SET password_hash = $2
WHERE id = $1
```
