import * as React from "react";

import { useSelector } from "react-redux";
import { Alert } from "@mui/material";

import PhoneIcon from "@mui/icons-material/Phone";

import TitleForm from "./TitleForm";
import { getUserToken } from "../../../../helpers/setGetToken";
import {
  fetchRequest,
  setRequestToken,
} from "../../../../helpers/fetchRequest";
import CardContactUser from "../perfil/CardContactUser";
import NoRows from "../../../../components/NoRows";
import LoadingForms from "../../../../components/LoadingForms";

const { useState, useEffect } = React;

const InfoTelefonoForm = ({ idUser }) => {
  const {
    user: { permisos, usuario },
  } = useSelector((state) => state.auth);

  const [contacts, setContacts] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(null);

  const getRegistrosContacto = async () => {
    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `/users/obtener_informacion_contacto/${idUser}`
      );
      const { registros, total } = response.data.data;

      setContacts(registros);
      setTotalContacts(total);
    } catch (error) {
      let errorMsg = "";

      if (error.response?.status === 422) {
        errorMsg = error.response.data.errores;
      } else {
        errorMsg =
          "Ocurrio un error interno en el servidor, por favor intentalo de nuevo más tarde. CODIGO: " +
          error.response.status;
      }

      setErrorLoading(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRegistrosContacto();
  }, []);

  if (errorLoading) {
    return (
      <>
        <TitleForm title="INFORMACION BANCARIA" icon={PhoneIcon} />
        <Alert severity="error">{errorLoading}</Alert>
      </>
    );
  }

  return (
    <>
      {loading && <LoadingForms />}

      <TitleForm title="CONTACTO DE EMERGENCIA" icon={PhoneIcon} />


      {totalContacts === 0 && (
        <NoRows message="El usuario no tiene números de contacto registrados" />
      )}

      {contacts.map((contact) => (
        <CardContactUser
          key={String(contact.idRegistro)}
          id={contact.idRegistro}
          tipo={contact.nombre}
          numero={contact.celular}
          idUser={idUser}
          setTotalContacts={setTotalContacts}
          setContacts={setContacts}
        />
      ))}
    </>
  );
};

export default InfoTelefonoForm;
