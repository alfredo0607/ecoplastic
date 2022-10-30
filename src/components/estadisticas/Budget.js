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
import LaptopWindowsIcon from "@material-ui/icons/LaptopWindows";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
  avatar: {
    backgroundColor: colors.blue[600],
    height: 56,
    width: 56,
  },
  differenceIcon: {
    color: colors.red[900],
  },
  differenceValue: {
    color: colors.red[900],
    marginRight: theme.spacing(1),
  },
}));

const Budget = ({ className, estadisticas, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardContent>
        <Grid container justifyContent="space-between" spacing={3}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="h6">
              PUBLICACIONES
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {estadisticas?.numPublicaciones}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <LaptopWindowsIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string,
  estadisticas: PropTypes.any,
};

export default Budget;
