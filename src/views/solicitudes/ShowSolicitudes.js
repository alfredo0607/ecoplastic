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

const ShowSolicitudes = ({ setTitle, type = "user" }) => {
  /* const classes = useStyles(); */
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);

  const [solicitudes, setSolicitudes] = useState([]);
  const [showDetails, setShowDetails] = useState({
    show: false,
    id: null,
    empty: true,
  });

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

      const {
        data: { data },
      } = await fetchRequest(
        `/solicitudes/obtener_solicitudes_usuario/${usuario?.idUsuario}?page=${page}&limit=${limit}&type=${type}`,
        "POST",
        { filters }
      );

      setSolicitudes(data.solicitudes);
      setTotalSolicitudes(data.total);
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     getSolicitudesUser(0, 10, null);
  //   }, []);

  // useEffect(() => {
  //   if (search !== "" && queryParams.get("SID")) {
  //     setShowDetails({ show: true, id: queryParams.get("SID"), empty: false });
  //   }
  // }, []);

  return (
    <Paper style={{ marginTop: 15, position: "relative" }}>
      <HeaderSolicitudes
        show={showDetails.show}
        // handleShowDetails={handleShowDetails}
        totalSolicitudes={totalSolicitudes}
        handleUpdateList={getSolicitudesUser}
        filters={filters}
      />

      {/* {showDetails.show && (
        <ContentDetailsSolicitud type={type} actualUser={usuario?.idUsuario} />
      )} */}

      {!showDetails.show && (
        <Box p={2}>
          {totalSolicitudes === 0 && (
            <>
              {/* <Typography align="center">
                No se encontrarón resultados para los filtros seleccionados, o
                puede que no hayas enviado ninguna solicitud aún. Para crear una
                nueva solicitud dale al de arriba &quot;Nueva Solicitud&quot;.
              </Typography> */}

              <Typography align="center">
                No se encontrarón resultados para los filtros seleccionados, o
                no tienes solicitudes que responder.
              </Typography>
            </>
          )}

          <CardSolicitud />
        </Box>
      )}
    </Paper>
  );
};

export default ShowSolicitudes;
