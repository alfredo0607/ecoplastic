import React, { useState } from "react";
import clsx from "clsx";
import moment from "moment";
import PerfectScrollbar from "react-perfect-scrollbar";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { truncateString } from "../utils/truncateString";
import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {},
  actions: {
    justifyContent: "flex-end",
  },
}));

const LatestOrders = ({ className, solicitudes, ...rest }) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root, className)} {...rest}>
      <CardHeader title="Ultimas solicitudes" />
      <Divider />
      <PerfectScrollbar>
        <Box minWidth={800}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell sortDirection="desc">
                  <Tooltip enterDelay={300} title="Sort">
                    <TableSortLabel active direction="desc">
                      Fecha
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
                <TableCell>Estado</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {solicitudes.map((order) => (
                <TableRow hover key={order.idSolicitud}>
                  <TableCell>{order.idSolicitud}</TableCell>
                  <TableCell>{truncateString(order.mensaje, 40)}</TableCell>
                  <TableCell>
                    {moment(order.createDate).format("DD/MM/YYYY")}
                  </TableCell>
                  <TableCell>
                    <Chip color="primary" label={order.estado} size="small" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <Box display="flex" justifyContent="flex-end" p={2}>
        <Link to={"/app/solicitudes"} >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Ver todas
        </Button>
        </Link>
      </Box>
    </Card>
  );
};

LatestOrders.propTypes = {
  className: PropTypes.string,
  solicitudes: PropTypes.any,
};

export default LatestOrders;
