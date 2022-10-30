import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Avatar, Box, Button, Divider, List, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

import {
  FaRegIdBadge as FaRegIdBadgeIcon,
  FaRegUser as FaRegUserIcon,
  FaRegBuilding as FaRegBuildingIcon,
  FaRegNewspaper as FaRegNewspaperIcon,
  FaChartBar as FaChartBarIcon,
  FaRegPaperPlane as FaRegPaperPlaneIcon,
  FaWpforms as FaWpformsIcon,
  FaRegQuestionCircle as FaRegQuestionCircleIcon,
  FaServer as FaServerIcon,
  FaUserTie as FaUserTieIcon,
  FaUserEdit as FaUserEditIcon,
  FaFileInvoiceDollar as FaFileInvoiceDollarIcon,
  FaCogs as FaCogsIcon,
  FaHome as FaHomeIcon,
  FaBox as FaBoxIcon,
  FaChartLine as FaChartLineIcon,
  FaCommentsDollar as FaCommentsDollarIcon,
} from "react-icons/fa";

import NavItem from "./NavItem";
import { logoutUser } from "../../../redux/actions/authActions";

const linksAdmins = [
  {
    href: "/app/operators",
    icon: FaRegUserIcon,
    title: "Operarios",
    moduleName: "link_usuarios_menu",
  },
  {
    href: "/app/clientes",
    icon: FaRegBuildingIcon,
    title: "Clientes",
    moduleName: "link_clientes_menu",
  },
  {
    href: "/app/gestion_publicaciones",
    icon: FaRegNewspaperIcon,
    title: "Publicaciones",
    moduleName: "link_publicaciones_menu",
  },
  {
    href: "/app/gestion_solicitudes",
    icon: FaRegPaperPlaneIcon,
    title: "Solicitudes",
    moduleName: "link_solicitudes_menu",
  },
  {
    href: "/app/estadisticas",
    icon: FaServerIcon,
    title: "Estadisticas",
    moduleName: "link_estadisticas_menu",
  },
];

const linksUser = [
  {
    href: "/",
    icon: FaHomeIcon,
    title: "Inicio",
  },
  {
    href: "/app/cuenta",
    icon: FaRegIdBadgeIcon,
    title: "Mi Cuenta",
  },
  {
    href: "/app/mis_solicitudes",
    icon: FaBoxIcon,
    title: "Mis solicitudes",
  },
  {
    href: "/app/solicitudes",
    icon: FaCommentsDollarIcon,
    title: "Solicitudes de productos",
  },
  {
    href: "/app/publicaciones",
    icon: FaRegNewspaperIcon,
    title: "Mis publicaciones",
  },
  {
    href: "/app/estadisticas",
    icon: FaChartLineIcon,
    title: "Mis estadisticas",
  },
];

const useStyles = makeStyles(() => ({
  avatar: {
    cursor: "pointer",
    width: 64,
    height: 64,
  },
  name: {
    width: "80%",
    textAlign: "center",
    whiteSpace: "normal",
  },
}));

const NavBar = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const handleLogoutUser = () => dispatch(logoutUser());

  const [profileType, setProfileType] = useState("usuario");

  const handleChangeMenuProfile = (event, newProfile) => {
    if (newProfile !== null) {
      setProfileType(newProfile);
      localStorage.setItem("profile_menu", newProfile);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("profile_menu")) {
      setProfileType(localStorage.getItem("profile_menu"));
    }
  }, []);

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box alignItems="center" display="flex" flexDirection="column" p={2}>
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={`http://localhost:3006/uploads/images/imagenes_usuarios/${usuario.imagenUsuario}`}
          to="/app/cuenta"
        />
        <Typography className={classes.name} color="textSecondary" variant="h5">
          {usuario.nombreUsuario}
        </Typography>
        <Typography color="textSecondary" variant="body2">
          {`C.C ${usuario.cedulaUsuario}`}
        </Typography>
        <Button
          color="primary"
          size="small"
          variant="contained"
          style={{ marginTop: 10 }}
          onClick={handleLogoutUser}
        >
          Cerrar Sesión
        </Button>
      </Box>

      <Divider />

      <Box p={2}>
        <>
          {usuario.rol === "Admin" && (
            <Box
              alignItems="center"
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              marginBottom={2}
            >
              <Typography color="textSecondary" variant="h5">
                Perfil
              </Typography>

              <ToggleButtonGroup
                value={profileType}
                exclusive
                onChange={handleChangeMenuProfile}
                aria-label="Tipo de perfil"
                size="small"
              >
                <ToggleButton value="usuario" aria-label="Usuario">
                  <FaUserEditIcon />
                </ToggleButton>

                <ToggleButton
                  value="administrativo"
                  aria-label="Administrativo"
                >
                  <FaUserTieIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          <Divider />
        </>

        {usuario?.rol !== "Admin" && (
          <List>
            <>
              {linksUser.map((item) => (
                <NavItem
                  href={item.href}
                  title={item.title}
                  icon={item.icon}
                  key={item.title}
                />
              ))}
            </>
          </List>
        )}

        {usuario?.rol === "Admin" && (
          <List>
            {profileType === "usuario" ? (
              <>
                {linksUser.map((item) => (
                  <NavItem
                    href={item.href}
                    title={item.title}
                    icon={item.icon}
                    key={item.title}
                  />
                ))}
              </>
            ) : (
              <>
                {linksAdmins.map((item) => (
                  <div key={item.title}>
                    <>
                      <NavItem
                        href={item.href}
                        title={item.title}
                        icon={item.icon}
                      />
                      {item.title === "Configuraciones" && <Divider />}
                    </>
                  </div>
                ))}
              </>
            )}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default NavBar;
