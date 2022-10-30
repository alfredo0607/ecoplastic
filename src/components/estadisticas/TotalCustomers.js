import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.green[600],
    height: 56,
    width: 56,
  },
  differenceIcon: {
    color: colors.green[900],
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1),
  },
}));

const TotalCustomers = ({ className, estadisticas, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              SOLICITUDES ENVIADAS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {estadisticas?.numSolicitudes}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <SendIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TotalCustomers.propTypes = {
  className: PropTypes.string,
  estadisticas: PropTypes.any,
};

export default TotalCustomers;
