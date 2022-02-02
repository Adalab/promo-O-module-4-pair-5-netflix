// login

const getMoviesFromApi = (params) => {
  // console.log(params);
  console.log("Se están pidiendo las películas de la app");
  return fetch(`//localhost:4000/movies?gender=${params.gender}`, { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    });
};

const objToExport = {
  getMoviesFromApi: getMoviesFromApi,
};

export default objToExport;
