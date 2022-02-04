const express = require("express");
const cors = require("cors");
const movieData = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

server.set("view engine", "ejs");

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get("/movie/:movieId", (req, res) => {
  const movieId = req.params.movieId;
  const findMovie = movieData.movies.find(
    (movie) => movie.id === parseInt(movieId)
  );
  res.render("movie", findMovie);
});

const staticServerPath = "./src/public-react";
server.use(express.static(staticServerPath));

server.get("/movies", (req, res) => {
  const genderFilterParam = req.query.gender;
  const filteredMovies = movieData.movies.filter(
    (movie) => movie.gender === genderFilterParam
  );
  res.send(filteredMovies.length === 0 ? movieData.movies : filteredMovies);
});

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

server.post("/login", (req, res) => {
  console.log(req.body);
  console.log(users);
  const findUser = users.find(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  console.log(findUser);
  if (findUser) {
    res.json({
      success: true,
      userId: "id_de_la_usuaria_encontrada",
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

const staticServerPathCss = "./src/styles";
server.use(express.static(staticServerPathCss));