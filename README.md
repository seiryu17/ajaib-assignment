# ajaib-assignment

This project is commissioned by ajaib to test my techical skill for my job application as the frontend web engineer in ajaib company.

## Dependency

The dependency i used to build this project :

- Material UI
- Axios
- Date/fns
- ArraySort

## The First Step

The first thing i did is to make the main page of the project, which is The title of the project "Example With Search and Filter" using typhography component,
after that i started to implement the TextField and the Button component for the debounce search,
after that i implement the TextField and Button component for the filter function,
the next thing i make the helper to ease me to try and catch API from backend, and then im using Axios as helper to fetch data from backend which is from https://randomuser.me/documentation, and after that im using useEffect to fetch the data when the page loaded at the first time.

## Pagination

after finish fetching the data and then i serve the data to the datatable, the next thing im implementing the pagination in the datatable, so everytime user click the next page, frontend will request API with the page parameter to backend.

## Filter

i create the filter function, to allow user to filter the data by gender, so everytime the user choose the dropdown the state will be filled in and frontend will request to the backend by the state filled in before with the filter gender paramater provided by the backend, but i figured out the filter wont work with the seed parameter, seed parameter is to ensure the data you get is the same even you refresh the page or refetch data from the API, so the filter is just to filter gender but with another random data.

## Reset Filter

i create the reset filter function by resetting the state filled before.

## Sort By Column

this function is to allow user sorting the column by clicking the column name, this sort is implemented by sorting the data from the existing table, because the backend doesnt provide the sort parameter for the API, so i just sort the 10 existing data to show how i done it, im using sort array to sort the data array from the existing data.

## Search By Keyword

this function is to allow user search the data by typing anything to the search textfield, this search is also implemented to search data from the existing table, becuase the backend doesnt provide the keyword paramter for the API, ive try the keyword API but it does nothing, so its just searching for the 10 existing data, im using filter built-in function from javascript to achive this.
