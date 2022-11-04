import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import daysjs from "dayjs";
import PersonIcon from "@mui/icons-material/Person";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Rating,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Link } from "react-router-dom";
import es from "dayjs/locale/es";

const labels = {
  2.5: "Ok",
  3: "Ok+",
  3.5: "Bueno",
  4: "Bueno+",
  4.5: "Excelente",
  5: "Excelente+",
};

const getLabelText = (value) =>
  `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },
  statsItem: {
    alignItems: "center",
    display: "flex",
  },
  statsIcon: {
    marginRight: theme.spacing(1),
  },
}));

const ProductCard = ({ className, product, ...rest }) => {
  const classes = useStyles();

  return (
    <Link to={`/app/product/${product?.idproductos}`}>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={3}>
            <img
              style={{ width: "80%" }}
              alt="Product"
              src={`http://localhost:3006/${product?.cover}`}
            />
          </Box>
          <Typography
            align="left"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {product.titulo}
          </Typography>

          <Box mb={1}>
            <Rating
              style={{
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: 5,
              }}
              name="calification"
              value={product?.rating}
              precision={0.5}
              size="medium"
              max={5}
              getLabelText={getLabelText}
              readOnly
            />
          </Box>

          <Typography
            sx={{
              display: "-webkit-box",
              overflow: "hidden",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
            }}
            variant="body1"
          >
            {product.descripcion}
          </Typography>
        </CardContent>
        <Box flexGrow={1} />
        <Divider />
        <Box p={2}>
          <Grid container justifyContent="space-between" spacing={2}>
            <Grid className={classes.statsItem} item>
              <AccessTimeIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                {daysjs(product?.createdate)
                  .locale(es)
                  .format("YYYY-MM-DD hh:mm")}
              </Typography>
            </Grid>
            <Grid className={classes.statsItem} item>
              <PersonIcon className={classes.statsIcon} color="action" />

              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                {product?.nombre} - {product?.nombre_empresa}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Link>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  publicacion: PropTypes.any,
};

export default ProductCard;
