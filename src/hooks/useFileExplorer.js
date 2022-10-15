import { useState, useEffect, useRef } from "react";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import { getUserToken } from "../helpers/setGetToken";

export const useFileExplorer = (
  userID,
  { limit, shared, extensions } = { limit: 10, shared: 0 }
) => {
  const timeOutRef = useRef(null);

  const [files, setFiles] = useState([]);

  const [extensionsAndPage, setExtensionsAndPage] = useState({
    page: 0,
    extensions: extensions,
    query: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [search, setSearch] = useState("");

  const getFiles = async () => {
    setLoading(true);

    try {
      const { page, extensions, query } = extensionsAndPage;

      const baseURL = `/users/obtener_archivos_usuario/${userID}`;
      const parameters = `page=${page}&limit=${limit}&shared=${shared}&q=${query}`;

      const token = getUserToken();
      setRequestToken(token);

      const {
        data: { data },
      } = await fetchRequest(`${baseURL}?${parameters}`, "POST", {
        extensions,
      });

      const { options, hasNextPage } = data;

      if (page === 0) setFiles(options);
      else setFiles((files) => [...files, ...options]);

      setHasNextPage(hasNextPage);
    } catch (error) {
      let msgErr = "";

      if (error.response?.status === 422) msgErr = error.response.data.errores;
      else
        msgErr =
          "Ocurrio un error interno del servidor, por favor intentalo de nuevo más tarde";

      setError(msgErr);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeExtensions = (newExtensions) => {
    setExtensionsAndPage((prevState) => ({
      ...prevState,
      page: 0,
      extensions: newExtensions,
    }));
  };

  const handleLoadMoreFiles = () => {
    setExtensionsAndPage((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  };

  const handleRefreshFiles = () => {
    setExtensionsAndPage((prevState) => ({
      ...prevState,
      page: 0,
      extensions: extensions,
    }));
  };

  const handleChangeSearch = ({ target }) => {
    const value = target.value;
    setSearch(value);

    clearTimeout(timeOutRef.current);

    timeOutRef.current = setTimeout(() => {
      setExtensionsAndPage((prevState) => ({
        ...prevState,
        query: value,
      }));
    }, 400);
  };

  useEffect(() => {
    getFiles();

    return () => clearTimeout(timeOutRef.current);
  }, [extensionsAndPage]);

  return {
    files,
    loading,
    error,
    hasNextPage,
    search,
    setFiles,
    handleChangeExtensions,
    handleLoadMoreFiles,
    handleRefreshFiles,
    handleChangeSearch,
  };
};
