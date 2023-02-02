import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import Chip from '@material-ui/core/Chip';
import useStyles from "./styles";

import {getObjetiveStatus} from "../../api/Api"
import { useInterval } from "../../utils/customhooks"
import { parseDate} from "../../utils/utils"


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'Nombre', numeric: false, disablePadding: true, label: 'Nombre' },
  { id: 'Descripción', numeric: false, disablePadding: false, label: 'Descripción' },
  { id: 'Indicador', numeric: false, disablePadding: false, label: 'Indicador' },
  { id: 'Fecha Inicial', numeric: false, disablePadding: false, label: 'Fecha Inicial' },
  { id: 'Fecha Final', numeric: false, disablePadding: false, label: 'Fecha Final' },
  { id: 'Valor Esperado', numeric: false, disablePadding: false, label: 'Valor Esperado' },
  { id: 'Valor actual', numeric: false, disablePadding: false, label: 'Valor Actual' },
  { id: 'Estado', numeric: false, disablePadding: false, label: 'Estado' },

];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell >
          {/*props.isAdmin && <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}/>*/}
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? '' : ''}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h4" id="tableTitle" component="div">
          Objetivos
        </Typography>
      )}

      {numSelected > 0 ? (
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          startIcon={<DeleteIcon />}
          onClick={props.handleDeleteObjetive}
        >
          Delete
        </Button>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};


EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));


EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};



export default function EnhancedTable(props) {
  const classes = useStyles();

  const rows = props.data
  //console.log("ROW") 
  //console.log(rows)
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState();
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteObjetive = () => {
    //console.log(selected)
    props.handleDeleteObjetive(selected)
    setSelected([])
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar handleDeleteObjetive={handleDeleteObjetive} numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              isAdmin={props.isAdmin}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data, index) => 
                   <RowCustom data={data} index={index} isSelected={isSelected} handleClick={handleClick} actualBoardId={props.actualBoardId} handleUpdateDeletedObjetive={props.handleUpdateDeletedObjetive}/>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {/*<FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />*/}
    </div>
  );
}

function RowCustom(props) {
  const classes = useStyles();

  const [status, setStatus] = React.useState();
  const [actualValue, setActualValue] = React.useState();
  let {_id,name,description,indicatorName,startDate,endDate,value} = props.data

  const isItemSelected = props.isSelected(_id);
  const labelId = `enhanced-table-checkbox-${props.index}`;

  const handleFetchObjetiveStatus = async () => {
    console.log("fetch objetive")
    console.log(props.data._id)
    let res = await getObjetiveStatus(props.actualBoardId,props.data._id)
      if (res.ok){
        //console.log(res)
        let data = await res.json()
        console.log(data)
        setStatus(data.status)
        setActualValue(data.valor)
      }    
      /*if (res.status == 409) {
        props.handleUpdateDeletedObjetive(_id)
      }*/
      
  }

  useEffect( () => { 
    async function getInitialData(){
        await handleFetchObjetiveStatus()
    }
    getInitialData()
  },[]);

  useInterval(async () => { //custom hook
    handleFetchObjetiveStatus()
  }, 50*1000);

  return (
    <TableRow
      hover
      onClick={(event) => props.handleClick(event, _id)}
      role="checkbox"
      aria-checked={isItemSelected}
      tabIndex={-1}
      key={_id}
      selected={isItemSelected}
    >
      <TableCell padding="checkbox">
        { props.isAdmin && <Checkbox
          checked={isItemSelected}
          inputProps={{ 'aria-labelledby': labelId }}
        /> }
      </TableCell>
      <TableCell component="th" id={labelId} scope="row" padding="none">
        {name}
      </TableCell>
      <TableCell>{description}</TableCell>
      <TableCell>{indicatorName}</TableCell>
      <TableCell>{parseDate(startDate)}</TableCell>
      <TableCell>{parseDate(endDate)}</TableCell>
      <TableCell>{value}%</TableCell>                        
        <TableCell>{actualValue ?? "-" }%</TableCell>
      <TableCell>
        {!!status && <Chip label={status.replace('_',' ')} classes={{root: classes[states[handleTranslate(status).toLowerCase()]]}}/>}
      </TableCell>                     
    </TableRow>
  );
}

const handleTranslate = (status) => {
  if (status==="pendiente")
    return "Pending"
  if (status==="no_cumplido")
    return "Declined"
  if (status==="cumplido")
    return "Sent"
}

const states = {
  sent: "success",
  pending: "primary",
  declined: "secondary",
};
