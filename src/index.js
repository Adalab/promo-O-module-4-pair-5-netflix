const express = require('express');
const cors = require('cors');
const movieData = require('../web/src/data/movies.json');

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4000;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

server.get('/movies', (req, res) => {
  const genderFilterParam = req.query.gender;
  console.log(genderFilterParam);
  const filteredMovies = movieData.movies.filter(movie => movie.gender === genderFilterParam);
  console.log(filteredMovies);
  res.send(filteredMovies.length === 0 ? movieData.movies : filteredMovies);
})