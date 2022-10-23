import * as React from "react";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import { getUserToken } from "../helpers/setGetToken";

const useLoadMessagesItems = ({
  url = `/solicitudes/obtener_mensajes_notas/1`,
  method = "GET",
  dataSend = {},
  limit = 10,
  othersQueryParams = "",
  fieldNameItems,
  formatResponse = null,
  isPagination = false,
}) => {
  const [loadingItems, setLoadingItems] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [items, setItems] = React.useState([]);
  const [hasNextPage, setHasNextPage] = React.useState(true);
  const [error, setError] = React.useState(undefined);

  const loadItems = async () => {
    setLoadingItems(true);

    try {
      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(
        `${url}?page=${page}&limit=${limit}${othersQueryParams}`,
        method,
        dataSend
      );

      const { hasNextPage } = response.data.data;
      const messages = response.data.data[fieldNameItems];

      if (typeof formatResponse === "function") {
        const formatedMessages = formatResponse(messages);
        console.log(formatedMessages);
        if (isPagination) setItems([...formatedMessages]);
        else setItems((prevState) => [...prevState, ...formatedMessages]);
      } //else {
      //   if (isPagination) setItems([...messages]);
      //   else setItems((prevState) => [...prevState, ...messages]);
      // }

      setHasNextPage(hasNextPage);
    } catch (error) {
      setError(error);
    } finally {
      setLoadingItems(false);
    }
  };

  const loadPreviousItems = (pageNumber) => {
    if (pageNumber) {
      setPage(pageNumber);
    } else {
      setPage((page) => page - 1);
    }
  };

  const loadMoreItems = (pageNumber) => {
    if (hasNextPage) {
      if (pageNumber) setPage(pageNumber);
      else setPage((page) => page + 1);
    }
  };

  React.useEffect(() => {
    loadItems();
  }, [page]);

  return {
    loadingItems,
    loadPreviousItems,
    items,
    hasNextPage,
    error,
    loadItems,
    loadMoreItems,
    setItems,
  };
};

export default useLoadMessagesItems;
