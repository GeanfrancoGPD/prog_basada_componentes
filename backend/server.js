import app from "./util/middleware.js";
import FinanzaRouter from "./module/Finanzas/FinanzaRouter.js";

app.use("/api/finanzas", FinanzaRouter);

const port = process.env.PORT || 5000;

// --- START ---
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor ejecutandose en el puerto ${port}`);
});
