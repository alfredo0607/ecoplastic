import React, { useState } from "react";
import clsx from "clsx";
import { Link as RouterLink } from "react-router-dom";
import PropTypes from "prop-types";
import { v4 as uuid } from "uuid";
import moment from "moment";
import es from "dayjs/locale/es";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import dayjs from "dayjs";
import { truncateString } from "../utils/truncateString";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
  image: {
    height: 48,
    width: 48,
  },
});

const LatestProducts = ({ className, publication, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader
        subtitle={`${publication.length} en total`}
        title="Ultimos productos"
      />
      <Divider />
      <List>
        {publication.map((product, i) => (
          <ListItem divider={i < product.length - 1} key={product.id}>
            <ListItemAvatar>
              <img
                alt="Product"
                className={classes.image}
                src={`http://localhost:3006/${product?.cover}`}
              />
            </ListItemAvatar>
            <ListItemText
              primary={truncateString(product.publicationTitle, 40)}
              secondary={`Creado ${dayjs(product.create)
                .locale(es)
                .format("YYYY/MM/DD")}`}
            />
            <IconButton edge="end" size="small">
              <MoreVertIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box display="flex" justifyContent="flex-end" p={2}>
        <RouterLink to="/app/publicaciones">
          <Button
            color="primary"
            endIcon={<ArrowRightIcon />}
            size="small"
            variant="text"
          >
            Ver todos
          </Button>
        </RouterLink>
      </Box>
    </Card>
  );
};

LatestProducts.propTypes = {
  className: PropTypes.string,
  publication: PropTypes.any,
};

export default LatestProducts;
