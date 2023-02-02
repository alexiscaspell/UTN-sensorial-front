import React from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Chip
} from "@material-ui/core";
import useStyles from "./styles";

const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

const handleTranslate = (status) => {
  if (status==="Pendiente")
    return "Pending"
  if (status==="No alcanzado")
    return "Declined"
  if (status==="Alcanzado")
    return "Sent"
}

export default function TableComponent({ data }) {
  const classes = useStyles();
  var keys = Object.keys(data[0]).map(i => i.toUpperCase());
  keys.shift(); // delete "id" key

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {/*keys.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))*/}
          <TableCell>Nombre</TableCell>
          <TableCell>Descripción</TableCell>
          <TableCell>Indicador</TableCell>
          <TableCell>Fecha Inicial</TableCell>
          <TableCell>Fecha Final</TableCell>
          <TableCell>Valor Esperado</TableCell>
          <TableCell>Valor Actual</TableCell>
          <TableCell>Estado</TableCell>

        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ _id, name, description, startDate, endDate, indicatorName, value, actualvalue="30", status="No alcanzado" }) => (
          <TableRow key={_id}>
            <TableCell className="pl-3 fw-normal">{name}</TableCell>
            <TableCell>{description}</TableCell>
            <TableCell>{indicatorName}</TableCell>
            <TableCell>{new Date(startDate).toLocaleDateString() + " " + new Date(startDate).toLocaleTimeString()}</TableCell>
            <TableCell>{new Date(endDate).toLocaleDateString() + " " + new Date(endDate).toLocaleTimeString()}</TableCell>
            <TableCell>{value}</TableCell>
            <TableCell>{actualvalue}</TableCell>
            <TableCell>
              <Chip label={status} classes={{root: classes[states[handleTranslate(status).toLowerCase()]]}}/>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
