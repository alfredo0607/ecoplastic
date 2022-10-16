import React from "react";
import { Navigate } from "react-router-dom";
import NotFoundView from "./components/errors/NotFoundView";
import DashboardLayout from "./layouts/DashboardLayout";
import MainLayout from "./layouts/MainLayout";
import LoginView from "./views/auth/LoginView";
import RecoveryPasswordView from "./views/auth/RecoveryPasswordView";
import RegisterView from "./views/auth/RegisterView";
import Cuenta from "./views/cuenta/CuentaView";
import Dashboard from "./views/Dashboard/Dashboard";
import ProductDetail from "./views/product/productDetail/ProductDetail";
import GestionPublicacionesView from "./views/publicaciones/gestion de publicaciones/GestionPublicacionesView";
import PublicacionesView from "./views/publicaciones/mis publicaciones";
import RegisterUsersView from "./views/RegisterUsersView";
import PerfilUsuario from "./views/users/PerfilView";
import Usuarios from "./views/users/UsuarioView";

const routes = (isLoggedIn) => [
  {
    path: "/",
    element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/login" />,
    children: [
      { path: "app/cuenta", element: <Cuenta /> },
      { path: "app/operators", element: <Usuarios /> },
      { path: "/operators/:id", element: <PerfilUsuario /> },
      { path: "app/dashboard", element: <Dashboard /> },
      { path: "app/product/:id", element: <ProductDetail /> },
      { path: "app/publicaciones", element: <PublicacionesView /> },

      //   { path: "/products", element: <ProductListView /> },
      //   { path: "/settings", element: <SettingsView /> },
      //   { path: "/configuraciones", element: <ConfiguracionesView /> },
      //   { path: "/solicitudes", element: <MisSolicitudesScreen /> },
      {
        path: "app/gestion_publicaciones",
        element: <GestionPublicacionesView />,
      },
      { path: "/", element: <Navigate to="app/dashboard" /> },
      { path: "*", element: <NotFoundView /> },
    ],
  },
  {
    path: "/",
    element: !isLoggedIn ? <MainLayout /> : <Navigate to="/app/dashboard" />,
    children: [
      { path: "/", element: <Navigate to="/login" /> },
      { path: "/login", element: <LoginView /> },
      { path: "/register-business", element: <RegisterView /> },
      { path: "/register-users", element: <RegisterUsersView /> },
      { path: "/recovery", element: <RecoveryPasswordView /> },
      { path: "*", element: <Navigate to="/login" /> },
    ],
  },
];

export default routes;
