import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GetAppIcon from "@mui/icons-material/GetApp";
import { Link } from "react-router-dom";

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
    <Link to={"/app/product/1"}>
      <Card className={clsx(classes.root, className)} {...rest}>
        <CardContent>
          <Box display="flex" justifyContent="center" mb={3}>
            <Avatar alt="Product" src={product.media} variant="square" />
          </Box>
          <Typography
            align="center"
            color="textPrimary"
            gutterBottom
            variant="h4"
          >
            {product.title}
          </Typography>
          <Typography align="center" color="textPrimary" variant="body1">
            {product.description}
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
                Updated 2hr ago
              </Typography>
            </Grid>
            <Grid className={classes.statsItem} item>
              <GetAppIcon className={classes.statsIcon} color="action" />
              <Typography
                color="textSecondary"
                display="inline"
                variant="body2"
              >
                {product.totalDownloads} Downloads
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
  product: PropTypes.object.isRequired,
};

export default ProductCard;
