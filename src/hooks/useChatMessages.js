import { useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useFileUpload from "./useFileUpload.js";
import { fetchRequest, setRequestToken } from "../helpers/fetchRequest";
import { getUserToken } from "../helpers/setGetToken";
import useLoadMessagesItems from "./useLoadMessagesItems.js";

//* TODO: implementar sistema de busqueda, */

export const useChatMessages = (config) => {
  const {
    loadMessagesConfig,
    sendFilesMethod,
    sendMessageConfig,
    extendsMessageObject,
    extendsMessageObjectFieldName,
    fieldNameMessage,
  } = config;

  const scrollableRootRef = useRef(null);
  const lastScrollDistanceToBottomRef = useRef();
  const inputChatRef = useRef(null);

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);
  const { uploadFiles, progressUpload } = useFileUpload();
  const { loadingItems, items, loadMoreItems, hasNextPage, error, setItems } =
    useLoadMessagesItems(loadMessagesConfig);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: loadingItems,
    hasNextPage,
    onLoadMore: loadMoreItems,
    disabled: !!error,
    rootMargin: "10px 0px 0px 0px",
  });

  const reversedItems = useMemo(() => [...items].reverse(), [items]);

  const handleRootScroll = useCallback(() => {
    const rootNode = scrollableRootRef.current;

    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop;
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom;
    }
  }, []);

  const rootRefSetter = useCallback(
    (node) => {
      rootRef(node);
      scrollableRootRef.current = node;
    },
    [rootRef]
  );

  const handleKeyPressKeyDown = (e) => {
    /* TODO: Enviar notificacion socket.io de que el usuario esta escribiendo */

    if (e.keyCode === 13 && e.shiftKey) {
      e.preventDefault();

      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;

      const valueInput = inputChatRef.current.value;

      const newInputValue = `${valueInput.substring(
        0,
        start
      )}\n${valueInput.substring(end)}`;

      inputChatRef.current.value = newInputValue;

      inputChatRef.current.selectionStart = start + 1;
      inputChatRef.current.selectionEnd = start + 1;

      return false;
    }

    if (e.keyCode === 13 && !e.shiftKey) {
      e.preventDefault();

      if (inputChatRef.current.value.trim() === "") return;

      sendNewMessage();
    }
  };

  const sendNewMessage = async () => {
    const messageID = uuid();
    const messageValue = inputChatRef.current.value;

    const messageObject = {
      senderID: usuario.idUsuario,
      messageID: messageID,
      senderIsCreator: true,
      messageText: messageValue.trim(),
      senderName: usuario.nombreUsuario,
      senderImage: usuario.imagenUsuario,
      messageDate: new Date(),
      isFile: false,
      isSystem: false,
      fileInfo: null,
      isSending: true,
      hasSended: false,
      hasViewed: false,
    };

    setItems((prevState) => [messageObject, ...prevState]);

    try {
      const { url, method, formatedData } = sendMessageConfig;

      const token = getUserToken();
      setRequestToken(token);

      const response = await fetchRequest(url, method, {
        ...formatedData,
        [fieldNameMessage]: getInputValue(),
      });

      if (extendsMessageObject) {
        if (typeof extendsMessageObjectFieldName !== "string") return;

        const extendsData = response.data.data[extendsMessageObjectFieldName];

        setItems((prevState) =>
          prevState.map((item) => {
            if (item.messageID === messageID) {
              item = {
                ...item,
                ...extendsData,
                isSending: false,
                hasSended: true,
              };
            }

            return item;
          })
        );
      } else {
        setItems((prevState) =>
          prevState.map((item) => {
            if (item.messageID === messageID) {
              item = {
                ...item,
                isSending: false,
                hasSended: true,
              };
            }

            return item;
          })
        );
      }
    } catch (error) {
      setItems((prevState) =>
        prevState.map((item) => {
          if (item.idMensaje === messageID) {
            item = {
              ...item,
              isSending: false,
              hasSended: false,
            };
          }

          return item;
        })
      );
    }

    inputChatRef.current.value = "";
  };

  /* const handleSendFiles = async () => {

    if (filesArray.length === 0) {
      setMessageFromFiles({ type: 'error', message: 'Por favor selecciona al menos un archivo a subir.' });

      setTimeout(() => {
        setMessageFromFiles(null);
      }, 3500);

      return;
    }

    const formData = new FormData();
    formData.append('idUsuarioEnvia', usuario.idUsuario);

    for (const file of filesArray)
      formData.append('archivos', file);

    uploadFiles(urlUploadFiles, formData, (data) => {

      setMessageFromFiles({ type: 'success', message: 'Los archivos se subieron correctamente' });

      setItems(prevState => [
        ...data.messages,
        ...prevState
      ]);

      setTimeout(() => {
        setMessageFromFiles(null);
        setOpenFormFiles(false);
      }, 3500);

    });

  } */

  const getInputValue = () => inputChatRef.current.value.trim();

  useEffect(() => {
    const scrollableRoot = scrollableRootRef.current;
    const lastScrollDistanceToBottom =
      lastScrollDistanceToBottomRef.current ?? 0;

    if (scrollableRoot)
      scrollableRoot.scrollTop =
        scrollableRoot.scrollHeight - lastScrollDistanceToBottom;
  }, [reversedItems, rootRef]);

  useEffect(() => {
    const inputChat = inputChatRef.current;

    if (inputChat) {
      inputChat.addEventListener("keydown", handleKeyPressKeyDown);
      inputChat.addEventListener("keypress", handleKeyPressKeyDown);
    }

    return () => {
      if (inputChat) {
        inputChat.removeEventListener("keydown", handleKeyPressKeyDown);
        inputChat.removeEventListener("keypress", handleKeyPressKeyDown);
      }
    };
  }, []);

  return {
    inputChatRef,
    sendNewMessage,
    getInputValue,
    items: reversedItems,
    scrollInfiniteData: {
      infiniteRef,
      handleRootScroll,
      rootRefSetter,
      hasNextPage,
    },
  };
};

/*
Datos que recibe:
  - Se le debe enviar un objeto de configuracion para todas los endpoints

Funciones que deberia devolver este hook y datos:
  - Enviar Mensaje -> unicamente deberia pasarsele nada, un callback para saber si la respuesta fue correcta o no
  - una referencia para capturar el valor del input y agregarle el evento y capturar su valor
  - enviar archivo -> capacidad para enviar los archivos de las dos formas, no explorer y explorer
  - referencia para scroll infinito
*/

/*
  Ejemplo de uso:

  const config = {
    loadMessagesConfig: {},
    sendFilesMethod: {},
    sendMessageConfig: {
      url: '',
      method: '',
      dataFormat: {
        textoMensaje: getInputValue()
      }
    }
  }

  const {} = useChatMessages(config);

*/
