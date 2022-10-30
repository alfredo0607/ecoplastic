/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { Paper, Box, Typography } from "@mui/material";
import HeaderSolicitudes from "../../components/solicitudes/HeaderSolicitudes";
import { getUserToken } from "../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../helpers/fetchRequest";
import CardSolicitud from "../../components/solicitudes/CardSolicitud";
import ContentDetailsSolicitud from "../../components/solicitudes/ContentDetailsSolicitud";
/* TODO: poner la funcionalidad del socket, para actualizar cada solicitud */

const ShowSolicitudes = ({ type = "user" }) => {
  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [solicitudes, setSolicitudes] = useState([]);

  const [totalSolicitudes, setTotalSolicitudes] = useState(0);

  const filters = useMemo(() => {
    let filters = {};

    if (type === "user") {
      filters = {
        busqueda: true,
        tags: false,
        tipoSolicitud: true,
        areas: false,
        estado: true,
        usuarios: false,
      };
    } else {
      filters = {
        busqueda: true,
        tags: true,
        tipoSolicitud: true,
        areas: true,
        estado: true,
        usuarios: true,
      };
    }

    return filters;
  }, [type]);

  // const handleShowDetails = (solicitud) => {
  //   if (!solicitud.empty) {
  //     navigate(`?SID=${1}&UID=${1}`, {
  //       replace: true,
  //     });
  //     setTitle(`Detalles Solicitud #${1}`);
  //     setShowDetails({ show: true, id: 1, empty: false });
  //   } else {
  //     navigate(``, { replace: true });
  //     if (type === "user") setTitle(`Mis Solicitudes`);
  //     else setTitle(`Solicitudes`);

  //     setShowDetails({ show: false, id: null, empty: true });
  //   }
  // };

  const getSolicitudesUser = async (page = 0, limit = 10, filters = null) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const ruta =
        type === "mis" ? "get_mis_solicitud" : "get_mis_solicitud_productos";

      const {
        data: { data },
      } = await fetchRequest(
        `/solicitudes/${ruta}/${usuario?.idUsuario}`,
        "GET"
      );

      setSolicitudes(data.request);
      setTotalSolicitudes(data.request.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSolicitudesUser();
  }, [type]);

  return (
    <Paper style={{ marginTop: 15, position: "relative" }}>
      <HeaderSolicitudes
        totalSolicitudes={totalSolicitudes}
        handleUpdateList={getSolicitudesUser}
        filters={filters}
      />

      <Box p={2}>
        {solicitudes.length === 0 && (
          <>
            <Typography align="center">
              No se encontrarón resultados para los filtros seleccionados, o no
              tienes solicitudes que responder.
            </Typography>
          </>
        )}

        {solicitudes.length !== 0 &&
          solicitudes.map((data) => (
            <CardSolicitud data={data} key={data.idSolicitud} />
          ))}
      </Box>
    </Paper>
  );
};

export default ShowSolicitudes;
