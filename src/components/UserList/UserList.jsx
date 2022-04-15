import React, { useState, useEffect } from "react";
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
    page: 0,
  });

  let initCols = [
    {
      name: "userName",
      label: "Username",
      options: {
        sort: false,
      },
    },
    {
      name: "name",
      label: "Name",
      options: {
        sort: false,
      },
    },
    {
      name: "email",
      label: "Email",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "gender",
      label: "Gender",
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "registered",
      label: "Email",
      options: {
        filter: false,
        sort: false,
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
        default:
      }
    },
  };

  const getData = async (page, filter) => {
    let url;
    if (filter) {
      url = `/api/?page=${page + 1}&gender=${filter}&results=10`;
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
      }));
    } else if (result.status === 404) {
      setState((prevState) => ({
        ...prevState,
        userListData: 404,
      }));
    }
  };

  useEffect(() => {
    getData(state.page);
    // eslint-disable-next-line
  }, []);

  const handleChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      gender: event.target.value,
    }));
    getData(state.page, event.target.value);
  };

  const changePage = (page) => {
    setState((prevState) => ({
      ...prevState,
      page: page,
    }));
    if (state.gender !== "all") {
      getData(page, state.gender);
    } else {
      getData(page);
    }
  };

  const resetFilter = () => {
    setState((prevState) => ({
      ...prevState,
      gender: "all",
    }));
    getData(state.page);
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
            />
            <Button
              className={classes.buttonIcon}
              variant="contained"
              color="primary"
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
