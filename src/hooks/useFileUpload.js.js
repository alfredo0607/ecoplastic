import { useState } from "react";
import { useSelector } from "react-redux";

import axios from "axios";

const useFileUpload = () => {
  const {
    user: { tokenInfo },
  } = useSelector((state) => state.auth);

  const [progressUpload, setProgressUpload] = useState(0);
  const [responseUpload, setResponseUpload] = useState(null);
  const [errorUploading, setErrorUploading] = useState(null);

  const uploadFiles = async (url, filesData, cb = null) => {
    try {
      const resp = await axios({
        url: "https://ecoplastic.herokuapp.com/api/v1/" + url,
        method: "POST",
        data: filesData,
        headers: {
          Authorization: `Bearer ${tokenInfo.token}`,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;

          let percentage = Math.floor((loaded * 100) / total);

          if (percentage < 100) setProgressUpload(percentage);
        },
      });

      setProgressUpload(100);
      setResponseUpload(resp.data.data);

      if (cb !== null) cb(resp.data.data, "success");
    } catch (error) {
      let errorResponse =
        typeof error.response?.data.errores === "string"
          ? error.response?.data.errores
          : "Ocurrio un error inesperado, por favor intentalo de nuevo más tarde";

      setErrorUploading(errorResponse);

      if (cb !== null) cb(errorResponse, "error");
    } finally {
      setTimeout(() => {
        setProgressUpload(0);
      }, 1000);

      setTimeout(() => {
        setErrorUploading(null);
        setResponseUpload(null);
      }, 3000);
    }
  };

  return {
    uploadFiles,
    progressUpload,
    responseUpload,
    errorUploading,
  };
};

export default useFileUpload;
