/*
 Requirements
 1.Return a list of all movies
 2. Return data (description, genre, director, image URL, whether it’s featured or not) about a
    single movie by title to the user
 3. Return data about a genre (description) by name/title
 4. Return data about a director (bio, birth year, death year) by name
 5. Allow new users to register
 6. Allow users to update their user info
 7. Allow existing users to deregister
 */

const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const models = require("./models.js");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
app.use(cors());
const { check, validationResult } = require("express-validator");
const uuid = require("uuid");

/*
  Middleware To be used on each request
*/
//invoke middleware morgan function so the request is logged whit common format
app.use(bodyParser.json());
// eslint-disable-next-line no-unused-vars
const auth = require("./auth")(app);

app.use(morgan("common"));

require("./passport");

const movies = models.movie;
const users = models.user;
const directors = models.director;
const actors = models.actor;
const genres = models.genre;

// mongoose.connect('mongodb://localhost:27017/myMoviesDB',{ userNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { userNewUrlParser: true, useUnifiedTopology: true })

app.get("/", (req, res) => {
  res.send(
    "Welcome to my Classics. Here you can find all the info you are looking for about classic movies of all ages!!"
  );
});

/**
 * @method registerUser
 * @param {string} endpoint - Endpoint to register new user.
 * @param {func} reqHandler - Callback
 * @return {object} - Returns object of newly registered user.
 */
app.post(
  "/users",
  [
    check("username", "username is required").isLength({ min: 5 }),
    check(
      "username",
      "username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("password", "password is required").not().isEmpty(),
    check("email", "email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = users.hashPassword(req.body.password);
    users
      .findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res
            .status(400)
            .send(req.body.username + " " + "already exists");
        } else {
          users
            .create({
              username: req.body.username,
              password: hashedPassword,
              email: req.body.email,
              birthday: req.body.birthday,
            })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//get all users json
app.get(
  "/users",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * @method getAllMovies
 * @param {string} endpoint - Endpoint to fetch all movies.
 * @param {func} passportAuthenticate - Passwort authentication method with method used for authentication and options.
 * @param {func} requestHandler - Callback queries database for all movies.
 * @returns {object} - Returns json object of all movies from the database.
 */
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .find()
      .populate({ path: "genre", select: ["name", "description"] })
      .then((movies) => {
        res.status(201).json(movies);
        console.log(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

//defines url documentation and respons whit sendfile
app.get("/documentation", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

/**
 * create routes and define response sending json object
 * @method getMovieDetails
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passportAuthenticate - Passwort authentication method with method used for authentication .
 * @param {func} populate - Invoke populate function from populate reference from database
 * @param {func} requestHandler - Callback to query database for the requested movie.
 * @returns {object} - Returns object from the database of the requested movie by title.
 */
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    movies
      .findOne({ title: req.params.title })
      .populate("genre", "name")
      .then((usermovie) => {
        res.json(usermovie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * create Director routes and define response sending json object
 * @method getAllDirectors
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passportAuthenticate - Passwort authentication method with method used for authentication .
 * @param {func} requestHandler - Callback to query database
 * @returns {object} - Returns object from the database of the requested list of all directors.
 */
app.get(
  "/directors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    directors
      .find()
      .then((directorSearch) => {
        res.status(201).json(directorSearch);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * create routes of director by name and define response sending json object
 * @method getDirectorName
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passportAuthenticate - Passwort authentication method with method used for authentication .
 * @returns {object} - Returns object from the database of the requested director by name.
 */
app.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    directors
      .findOne({ name: req.params.name })
      .then((nameDirector) => {
        res.json(nameDirector);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * create routes of all actor and define response sending json object
 * @method getAllActors
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passport - Passwort authentication method with method used for authentication .
 * @param {func} requestHandler - Callback to query database
 * @returns {object} - Returns object from the database of the requested  list of all actors.
 */
app.get(
  "/actors",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    actors
      .find()
      .then((actorSearch) => {
        res.status(201).json(actorSearch);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);

/**
 * create route of actor by nameand define response sending json object
 * @method gettActorByName
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passport - Passwort authentication method with method used for authentication .
 * @param {func} requestHandler - Callback to query database
 * @returns {object} - Returns object from the database of the requested actor by name.
 */
app.get(
  "/actors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    actors
      .findOne({ name: req.params.name })
      .then((nameActor) => {
        res.json(nameActor);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * create routes of all genres and define response sending json object
 * @method getAllGenres
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passport - Passwort authentication method with method used for authentication .
 * @param {func} reqHandler - Callback to query database for the requested genres.
 * @returns {object} - Returns object from the database of the requested list of all genres.
 */
app.get(
  "/genres",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    genres
      .find()
      .then((genreSearch) => {
        res.status(201).json(genreSearch);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send(`Error: ${err}`);
      });
  }
);
/**
 * create routes of genres by name  and define response sending json object
 * @method getGenreByName
 * @param {string} endpoint - Endpoint to fetch movie details.
 * @param {func} passportAuthenticate - Passwort authentication method with method used for authentication .
 * @param {func} requestHandler - Callback to query database for the requested genres.
 * @returns {object} - Returns object from the database of the requested genres by name.
 */
app.get(
  "/genres/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    genres
      .findOne({ name: req.params.name })
      .then((infoGenre) => {
        res.json(infoGenre);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//get user by name

app.get(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOne({ username: req.params.username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error:" + err);
      });
  }
);

//delete user
app.delete(
  "/users/:username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndRemove({ username: req.params.username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.username + " was not found");
        } else {
          res.status(200).send(req.params.username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

/**
 * 
 add movies to favorites list
 @method addToFavorites
 * @param {string} endpoint - Endpoint to add movie to favorites list .
 * @param {func} passport - Passwort authentication method with method used for authentication and options.
 * @param {func} requestHandler - Callback that locates use 
 * @returns {object} - Returns updated user object.
 */
app.post(
  "/users/:username/favorites/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: { favoritesMovies: req.params.movieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);
/**
 * 
 //delete favorites froma user
 * @method deleteFromFavorite
 * @param {string} endpoint - Endpoint to delete movie from favorites
 * @param {func} passport- Passwort authentication method with method used for authentication and options.
 
 * @returns {object} - Returns object.
 */

app.delete(
  "/users/:username/favorites/:movieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndUpdate(
        { username: req.params.username },
        {
          $pull: { favoritesMovies: req.params.movieID },
        },
        { new: true }
      )
      .then((userQueried) => {
        res.status(201).json(userQueried);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);
//get favorites movie by name
app.get(
  "/users/:username/favorites/:movie",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOne({ favoritesMovies: req.params.favoritesMovies })
      .then((favMov) => {
        res.json(favMov);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error:" + err);
      });
  }
);
//get watchlist movie by name
app.get(
  "/users/:username/watchlist/:movie",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOne({ watchListMovies: req.params.watchListMovies })
      .then((watchMov) => {
        res.json(watchMov);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("error:" + err);
      });
  }
);

//add movies to watchlist
app.post(
  "/users/:username/watchlist/:movie",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users.findOneAndUpdate(
      { username: req.params.username },
      {
        $push: { watchListMovies: req.params.movieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);
//delete watchlist movie by name
app.delete(
  "/users/:username/watchlist/:movie",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    users
      .findOneAndRemove({ watchListmovies: req.params.watchListMovies })
      .then((watchMov) => {
        if (!watchMov) {
          res.status(400).send(req.params.watchListMovies + " was not found");
        } else {
          res.status(200).send(req.params.watchListMovies + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

//routes request for static file to public folder
app.use(express.static("public"));
//error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! try again!!");
});
//listen request to the portal localhost:8080
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
