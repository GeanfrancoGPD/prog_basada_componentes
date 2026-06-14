const routes = [
  // Rutas principales
  { path: "/", component: "HomePage" },
  { path: "/404", component: "NotFound" },
  {
    path: "/Login",
    component: "Login",
  },
  {
    path: "/Register",
    component: "Register",
  },
  {
    path: "/Home",
    component: "HomePage",
  },
  {
    path: "/Docum/${category}/${id}",
    component: "LandingPage",
  },
  {
    path: "/Playground",
    component: "Playground",
  },
  {
    path: "/Transaction",
    component: "Transaction",
  },
  {
    path: "/Statistics",
    component: "Statistics",
  },
  {
    path: "/Goals",
    component: "Goals",
  },
  {
    path: "/Settings",
    component: "Settings",
  },
];

export default routes;
