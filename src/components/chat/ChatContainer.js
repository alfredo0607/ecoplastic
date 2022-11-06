import * as React from "react";
import clsx from "clsx";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import EmojiEmotionsOutlinedIcon from "@mui/icons-material/EmojiEmotionsOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import Picker from "emoji-picker-react";
import EmojiPicker, {
  EmojiStyle,
  SkinTones,
  Theme,
  Categories,
  EmojiClickData,
  Emoji,
  SuggestionMode,
} from "emoji-picker-react";
import { set } from "draft-js/lib/DefaultDraftBlockRenderMap";
import { useChatMessages } from "../../hooks/useChatMessages";
import DividerWithText from "../utils/DividerWithText";
import MessageBasicCard from "./MessageBasicCard";
import DialogViewer from "../utils/DialogViewer";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: 550,
    overflowY: "hidden",
    borderRadius: theme.spacing(0.5),
    border: `1px solid ${theme.palette.divider}`,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: theme.spacing(1, 2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  content: {
    flex: 1,
    overflowY: "auto",
    padding: theme.spacing(1, 2),
  },
  footerContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    padding: theme.spacing(1, 2),
  },
  input: {
    marginRight: theme.spacing(1.5),
  },
  buttonMargin: {
    marginRight: theme.spacing(1.5),
  },
  titleText: {
    color:
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.7)"
        : "rgba(255, 255, 255, 0.9)",
  },
}));

const getPositionMessage = (params) => {
  const {
    prevSender,
    actualSender,
    nextSender,
    prevIDSender,
    actualIDSender,
    nextIDSender,
  } = params;

  let position = 1;

  if (!prevSender && nextSender) {
    if (actualSender) {
      position = 1;
    } else {
      if (!prevIDSender) position = 1;

      if (!nextIDSender) position = 3;

      if (prevIDSender === actualIDSender && actualIDSender === nextIDSender)
        position = 2;

      if (prevIDSender === actualIDSender && actualIDSender !== nextIDSender)
        position = 3;

      if (prevIDSender !== actualIDSender && actualIDSender === nextIDSender)
        position = 1;

      if (prevIDSender !== actualIDSender && actualIDSender !== nextIDSender)
        position = 1;
    }
  }

  if (prevSender && !nextSender) {
    if (actualSender) {
      position = 3;
    } else {
      if (!prevIDSender) position = 1;

      if (!nextIDSender) position = 3;

      if (prevIDSender === actualIDSender && actualIDSender === nextIDSender)
        position = 2;

      if (prevIDSender === actualIDSender && actualIDSender !== nextIDSender)
        position = 3;

      if (prevIDSender !== actualIDSender && actualIDSender === nextIDSender)
        position = 1;

      if (prevIDSender !== actualIDSender && actualIDSender !== nextIDSender)
        position = 1;
    }
  }

  if (prevSender && nextSender) {
    if (actualSender) {
      position = 2;
    } else {
      if (!prevIDSender) position = 1;

      if (!nextIDSender) position = 3;

      if (prevIDSender === actualIDSender && actualIDSender === nextIDSender)
        position = 2;

      if (prevIDSender === actualIDSender && actualIDSender !== nextIDSender)
        position = 3;

      if (prevIDSender !== actualIDSender && actualIDSender === nextIDSender)
        position = 1;

      if (prevIDSender !== actualIDSender && actualIDSender !== nextIDSender)
        position = 1;
    }
  }

  if (!prevSender && !nextSender) {
    if (actualSender) {
      position = 1;
    } else {
      if (!prevIDSender) position = 1;

      if (!nextIDSender) position = 3;

      if (prevIDSender === actualIDSender && actualIDSender === nextIDSender)
        position = 2;

      if (prevIDSender === actualIDSender && actualIDSender !== nextIDSender)
        position = 3;

      if (prevIDSender !== actualIDSender && actualIDSender === nextIDSender)
        position = 1;

      if (prevIDSender !== actualIDSender && actualIDSender !== nextIDSender)
        position = 1;
    }
  }

  return position;
};

const { useMemo } = React;
const { useState } = React;

const ChatContainer = ({
  customClasses,
  containerHeight = 550,
  configUseChat,
}) => {
  const classes = useStyles();
  const { mainContainer, header, content, footer } = customClasses || {};

  const {
    user: { usuario },
  } = useSelector((state) => state.auth);
  const { inputChatRef, sendNewMessage, items, scrollInfiniteData } =
    useChatMessages(configUseChat);
  const [inputStr, setInputStr] = useState("");
  /* Emoji Picker */
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmoji, setSelectedEmoji] = useState("");
  const openEmojiPicker = Boolean(anchorEl);
  const idPopoverEmojiPicker = openEmojiPicker
    ? "popover-picker-emoji-chat"
    : undefined;
  const onEmojiClick = (emojiData, event) => {
    setSelectedEmoji((prevInput) => prevInput + emojiData.emoji);
  };
  /* Dialog viewer */
  const [openViewer, setOpenViewer] = useState(false);
  const [viewerOptions, setViewerOptions] = useState({
    type: "",
    url: "",
    title: "",
  });

  const handleCloseViewer = () => setOpenViewer(false);

  const mappedItems = useMemo(() => {
    return items.reduce((acc, message) => {
      const date = dayjs(message.messageDate).locale(es).format("DD/MM/YYYY");
      const existFilter = acc.filter((item) => item.date === date)[0];

      if (existFilter) {
        const indice = acc.findIndex((item) => item.date === date);

        return acc.map((item, i) => {
          if (i === indice) {
            return {
              ...item,
              messages: [...item.messages, message],
            };
          }

          return item;
        });
      } else {
        return [
          ...acc,
          {
            date: date,
            messages: [message],
          },
        ];
      }
    }, []);
  }, [items]);

  return (
    <div
      className={clsx(classes.mainContainer, {
        [mainContainer]: customClasses?.mainContainer,
      })}
      style={{
        height: containerHeight,
        maxHeight: containerHeight,
        minHeight: containerHeight,
      }}
    >
      <div
        className={clsx(classes.header, {
          [header]: customClasses?.header,
        })}
      >
        <Typography className={classes.titleText} variant="h4">
          Chat de la solicitud
        </Typography>
        {/* Aqui el header
        <IconButton size="small">
          <SendOutlinedIcon />
        </IconButton> */}
      </div>

      <div
        className={clsx(classes.content, {
          [content]: customClasses?.content,
        })}
        ref={scrollInfiniteData.rootRefSetter}
        onScroll={scrollInfiniteData.handleRootScroll}
      >
        {scrollInfiniteData.hasNextPage && (
          <div ref={scrollInfiniteData.infiniteRef}>Cargando mas mensajes</div>
        )}

        {mappedItems.map((subItem) => (
          <React.Fragment key={subItem.date}>
            <Box mb={1} mt={1}>
              <DividerWithText>
                <Typography variant="body2">{subItem.date}</Typography>
              </DividerWithText>
            </Box>

            {subItem.messages.map((message, i) => {
              const prevIndex = i - 1;
              const nextIndex = i + 1;

              const side =
                message.senderID === usuario.idUsuario ? "right" : "left";

              const actualSender = message.senderID === usuario.idUsuario;
              const prevItemSender = subItem.messages[prevIndex]
                ? subItem.messages[prevIndex].senderID === usuario.idUsuario
                : actualSender
                ? false
                : true;
              const nextItemSender = subItem.messages[nextIndex]
                ? subItem.messages[nextIndex].senderID === usuario.idUsuario
                : actualSender
                ? false
                : true;

              const prevIDSender = subItem.messages[prevIndex]
                ? subItem.messages[prevIndex].senderID
                : false;
              const actualIDSender = message.senderID;
              const nextIDSender = subItem.messages[nextIndex]
                ? subItem.messages[nextIndex].senderID
                : false;

              const positionMessage = getPositionMessage({
                prevSender: prevItemSender,
                actualSender,
                nextSender: nextItemSender,
                prevIDSender,
                actualIDSender,
                nextIDSender,
              });

              return (
                <MessageBasicCard
                  key={i}
                  side={side}
                  textMessage={message.messageText}
                  dateMessage={message.messageDate}
                  position={positionMessage}
                  avatarURL={message.senderImage}
                  senderName={message.senderName}
                  sendingMessage={message.isSending}
                  wasSended={message.hasSended}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>

      <div
        className={clsx(classes.footerContainer, {
          [footer]: customClasses?.footer,
        })}
      >
        <IconButton size="small" className={classes.buttonMargin}>
          <AttachFileOutlinedIcon />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={3}
          placeholder="Escribe algo ..."
          variant="outlined"
          margin="dense"
          spellCheck="false"
          inputRef={inputChatRef}
          className={classes.input}
          value={selectedEmoji}
          onChange={(e) => setSelectedEmoji(e.target.value)}
        />
        <Tooltip title="Seleccionar Emoji">
          <IconButton
            aria-describedby={idPopoverEmojiPicker}
            onClick={(event) => setAnchorEl(event.currentTarget)}
            size="large"
          >
            <EmojiEmotionsOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Popover
          id={idPopoverEmojiPicker}
          open={openEmojiPicker}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <Picker
            theme={"dark"}
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            native
            groupNames={{
              smileys_people: "personas y caras",
              animals_nature: "animales y naturaleza",
              food_drink: "comida y bebidas",
              travel_places: "lugares y viajes",
              activities: "actividades",
              objects: "objetos",
              symbols: "simbolos",
              flags: "banderas",
              recently_used: "usados recientemente",
            }}
          />
        </Popover>

        <IconButton size="small"></IconButton>
        <Tooltip title="Enviar Mensaje">
          <IconButton
            aria-describedby={idPopoverEmojiPicker}
            onClick={sendNewMessage}
            size="large"
          >
            <SendOutlinedIcon />
          </IconButton>
        </Tooltip>
      </div>
      {/* Dialog para las imagenes y los pdf */}
      <DialogViewer
        openViewer={openViewer}
        handleCloseViewer={handleCloseViewer}
        viewerOptions={viewerOptions}
      />
    </div>
  );
};

export default ChatContainer;
