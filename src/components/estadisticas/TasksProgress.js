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
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.red[600],
    height: 56,
    width: 56,
  },
}));

const TasksProgress = ({ className, estadisticas, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              SOLICITUDES RECHAZADAS
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {estadisticas?.numRechazadas}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <CloseIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

TasksProgress.propTypes = {
  className: PropTypes.string,
  estadisticas: PropTypes.any,
};

export default TasksProgress;
