import * as React from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Box } from "@mui/material";
import Page from "../../../components/Page";
import { getUserToken } from "../../../helpers/setGetToken";
import { fetchRequest, setRequestToken } from "../../../helpers/fetchRequest";
import TabsPerfilUsuario from "./TabsPerfilUsuario";
import UserCard from "./UserCard";
import UserCardActions from "./UserCardActions";

const { useEffect, useState, useRef } = React;

const PerfilUsuario = () => {
  const { id } = useParams();

  const isMounted = useRef(true);

  const [loadingData, setLoadingData] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [errorLoading, setErrorLoading] = useState(null);

  const getUser = async (id) => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest("/users/get-user-detail/" + id);

      if (isMounted.current) {
        setUserInfo(data);
        setLoadingData(false);
      }
    } catch (error) {
      let newError = "";

      if (error.response.status === 422) {
        newError =
          "Ocurrio un error obteniendo la información del usuario, por favor comprueba que el ID del usuario a consultar sea un ID existente y valido";
      } else {
        newError =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde.";
      }

      if (isMounted.current) {
        setErrorLoading(newError);
      }
    }
  };

  useEffect(() => {
    getUser(id);

    return () => {
      isMounted.current = false;
    };
  }, [id]);

  return (
    <Page title={`Usuarios | Perfil de ${userInfo?.usersDetails?.nombre}`}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={3}>
          <Paper>
            <Box p={2}>
              <UserCard
                userInfo={userInfo}
                loadingData={loadingData}
                errorLoading={errorLoading}
              />

              <UserCardActions
                idUser={id}
                userInfo={userInfo?.usersDetails}
                setUserInfo={setUserInfo}
              />
            </Box>
          </Paper>
        </Grid>

        <TabsPerfilUsuario
          idUser={id}
          // userInfo={userInfo?.usersDetails}
          setUserInfo={setUserInfo}
        />
      </Grid>
    </Page>
  );
};

export default PerfilUsuario;
