import React, { useState, useEffect, useCallback } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { format, parseISO } from "date-fns";
import { get } from "../../helper/network";
import arraySort from "array-sort";

const useStyles = makeStyles({
  container: {
    padding: "3rem",
  },
  buttonIcon: {
    height: "100%",
    backgroundColor: "#0080ff",
    borderRadius: "0 4px 4px 0",
  },
  button: {
    height: "100%",
  },
  formControl: {
    minWidth: 230,
  },
});

const UserList = () => {
  const classes = useStyles();

  const [state, setState] = useState({
    gender: "all",
    userListData: [],
    userListDataTemp: [],
    page: 0,
    search: "",
  });

  let initCols = [
    {
      name: "userName",
      label: "Username",
    },
    {
      name: "name",
      label: "Name",
    },
    {
      name: "email",
      label: "Email",
    },
    {
      name: "gender",
      label: "Gender",
    },
    {
      name: "registered",
      label: "Registered Date",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return format(parseISO(value), "dd/MM/yyyy");
        },
      },
    },
  ];

  let initOptions = {
    selectableRows: "single",
    selectableRowsHideCheckboxes: true,
    download: false,
    search: false,
    print: false,
    filterType: "dropdown",
    viewColumns: false,
    filter: false,
    rowsPerPage: 10,
    count: 100,
    page: state.page,
    serverSide: true,
    rowsPerPageOptions: [],
    onTableChange: (action, tableState) => {
      switch (action) {
        case "changePage":
          changePage(tableState.page, tableState.sortOrder);
          break;
        case "sort":
          let temp;
          if (tableState.sortOrder.direction === "desc") {
            temp = arraySort(state.userListData, tableState.sortOrder.name, {
              reverse: true,
            });
          } else {
            temp = arraySort(state.userListData, tableState.sortOrder.name);
          }
          setState((prevState) => ({
            ...prevState,
            userListData: temp,
          }));
          break;
        default:
      }
    },
  };

  const getData = useCallback(
    async (page) => {
      let url;
      if (state.gender !== "all") {
        url = `/api/?page=${page + 1}&gender=${state.gender}&results=10`;
      } else {
        url = `/api/?page=${page + 1}&results=10&seed=abc`;
      }

      const result = await get(url);
      if (result.status === 200) {
        result.data.results.map((x) => {
          return (
            (x.userName = x.login.username),
            x.name ? (x.name = x.name.first + " " + x.name.last) : null,
            (x.registered = x.registered.date)
          );
        });
        setState((prevState) => ({
          ...prevState,
          userListData: result.data.results,
          userListDataTemp: result.data.results,
        }));
      } else if (result.status === 404) {
        setState((prevState) => ({
          ...prevState,
          userListData: 404,
          userListDataTemp: 404,
        }));
      }
    },
    [state.gender]
  );

  useEffect(() => {
    getData(state.page);
  }, [getData, state.page, state.gender]);

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      gender: event.target.value,
      page: 0,
    }));
  };

  const changePage = (page) => {
    setState((prevState) => ({
      ...prevState,
      page: page,
    }));
  };

  const resetFilter = () => {
    setState((prevState) => ({
      ...prevState,
      gender: "all",
    }));
    getData(state.page);
  };

  const handleChangeSearch = (e) => {
    setState((prevState) => ({
      ...prevState,
      search: e.target.value,
    }));
  };

  const handleClickSearch = () => {
    let tempData = [...state.userListDataTemp];
    tempData = state.userListDataTemp.filter((val) => {
      if (state.search === "") {
        return val;
      } else if (
        val.userName.toLowerCase().includes(state.search.toLowerCase()) ||
        val.name.toLowerCase().includes(state.search.toLowerCase()) ||
        val.email.toLowerCase().includes(state.search.toLowerCase()) ||
        val.gender.toLowerCase().includes(state.search.toLowerCase()) ||
        val.registered.toLowerCase().includes(state.search.toLowerCase())
      ) {
        return val;
      }
      return false;
    });
    setState((prevState) => ({
      ...prevState,
      userListData: tempData,
    }));
  };

  return (
    <Grid container direction="row" spacing={3} className={classes.container}>
      <Grid item xs={12}>
        <Typography variant="h5">Example With Search and Filter</Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Search.."
              label="Search"
              onChange={handleChangeSearch}
            />
            <Button
              className={classes.buttonIcon}
              variant="contained"
              color="primary"
              onClick={handleClickSearch}
            >
              <SearchIcon />
            </Button>
          </Grid>
          <Grid item>
            <FormControl
              size="small"
              variant="outlined"
              className={classes.formControl}
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Age
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={state.gender}
                onChange={handleChange}
                label="Age"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <Button
              className={classes.button}
              variant="outlined"
              size="medium"
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <MUIDataTable
          data={state.userListData}
          columns={initCols}
          options={initOptions}
        />
      </Grid>
    </Grid>
  );
};

export default UserList;
