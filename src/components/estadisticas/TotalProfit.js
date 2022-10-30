import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import CheckIcon from "@material-ui/icons/Check";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56,
  },
}));

const TotalProfit = ({ className, estadisticas, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              SOLICITUDES APROBADAS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {estadisticas?.numAprobada}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CheckIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalProfit.propTypes = {
  className: PropTypes.string,
  estadisticas: PropTypes.any,
};

export default TotalProfit;
