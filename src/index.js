const express = require("express");
const cors = require("cors");
const movieData = require("../web/src/data/movies.json");
const users = require("../web/src/data/users.json");
const DataBase = require("better-sqlite3");

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

const db = new DataBase("./src/db/database.db", { verbose: console.log() });

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
  const queryAll = db.prepare("SELECT * FROM movies ORDER BY name");
  const queryGender = db.prepare(
    "SELECT * FROM movies WHERE gender = ? ORDER BY name"
  );
  const querySortAll = db.prepare("SELECT * FROM movies ORDER BY name DESC");
  const querySortGender = db.prepare(
    "SELECT * FROM movies WHERE gender = ? ORDER BY name DESC"
  );
  const allMovies = queryAll.all();
  const genderFilterParam = req.query.gender;
  const sortFilterParam = req.query.sort;
  const moviesByGender = queryGender.all(genderFilterParam);
  const moviesSortedGender = querySortGender.all(genderFilterParam);
  const moviesSorted = querySortAll.all();
  if (moviesByGender.length !== 0 && sortFilterParam === "desc") {
    res.send(moviesSortedGender);
  } else if (moviesByGender.length !== 0 && sortFilterParam === "asc") {
    res.send(moviesByGender);
  } else if (moviesByGender.length === 0 && sortFilterParam === "desc") {
    res.send(moviesSorted);
  } else if (moviesByGender.length === 0 && sortFilterParam === "asc") {
    res.send(allMovies);
  }
});

const staticServerPathImages = "./src/public-movies-images";
server.use(express.static(staticServerPathImages));

server.post("/login", (req, res) => {
  const query = db.prepare("SELECT * FROM users WHERE email = ?");
  const response = query.get(req.body.email);
  if (response !== undefined) {
    res.json({
      success: true,
      userId: response.userId,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o no encontrada/o",
    });
  }
});

server.post("/sign-up", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const querySelect = db.prepare("SELECT * FROM users WHERE email = ?");
  const foundUser = querySelect.get(email);
  if (foundUser === undefined) {
    const query = db.prepare("insert into users (email,password) values (?,?)");
    const result = query.run(email, password);
    res.json({
      success: true,
      userId: result.lastInsertRowid,
    });
  } else {
    res.json({
      success: false,
      errorMessage: "Usuaria/o ya registrada/o",
    });
  }
});

server.get("/user/movies", (req, res) => {
  console.log(req.headers.userid);
  const userId = parseInt(req.headers.userid);
  const movieIdsQuery = db.prepare(
    "SELECT idMovie FROM users_movies WHERE idUser = ?"
  );
  const moviesId = movieIdsQuery.all(userId);
  console.log(moviesId);
});

const staticServerPathCss = "./src/styles";
server.use(express.static(staticServerPathCss));
