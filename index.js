const express = require("express");
const app = express();
const morgan = require('morgan');
bodyParser = require('body-parser'),
uuid = require('uuid');
//invoke middleware morgan function so the request is logged whit common format
app.use(morgan('common'));

app.use(bodyParser.json());

//top movies json 
let classicMovies = [{
    title: "The godfather",
    director: "Francis Ford Coppola",
    genres:"gangster"
},
{
    title:"Pulp Fiction",
    director:"Quentin Tarantino",
    genres:"neo-noir black comedy"
},
{
     title:"The Shining",
     director:" Stanley Kubrick",
     genres:"Horror"
},
{
     title:"Scarface",
     director:"Brian De Palma",
     genres:"gangstar"
},
{
     title :"Taxi Driver",
     director:"Martin Scorsese",
     genres:"neo-noir drama"
},
{ 
     title: "Goodfellas",
     director:"Martin Scorsese",
     genres:"gangster"

},
{    
    title: "Psycho",
    director: "Alfred Hitchcock",
    genres:"psychological horror"

},
{
    title: "Bonnie and Clyde",
    director:"Arthur Pen",
    genres:"biographical crime"
},
{
    title: "Schindler's List",
    director: "Steven Spielberg",
    genres:"historical drama"
},
{
    title: "Django",
    director:"Quentin Tarantino",
    genres:"revisionist western"
}
];
//list of directors
let directors = [
    {   name : "Quentin Tarantino",
        bio : "Quentin Tarantino is an American film director, screenwriter, producer, and actor. His films are characterized by nonlinear storylines, dark humor, aestheticization of violence, extended scenes of dialogue, ensemble casts, references to popular culture and a wide variety of other films, eclectic soundtracks primarily containing songs and score pieces from the 1960s to the 1980s, alternate history, and features of neo-noir film.",
        born : "March 27, 1963"
     
},
{
       name: "Martin Scorsese",
       bio : "Martin Scorses is an American film director, producer, screenwriter, and actor. One of the major figures of the New Hollywood era, he is widely regarded as one of the most significant and influential directors in film history.",
       born: "November 17, 1942"
    },
    {
       name: "Alfred Hitchcock",
       bio : "was an English film director, producer, and screenwriter. He is one of the most influential and widely studied filmmakers in the history of cinema. Known as the 'Master of Suspense', he directed over 50 feature films in a career",
       born: "13 August 1899",
       dead: "29 April 1980)"
    }

];
//list of actors
let actors = [
         {  
             name:"Samuel Leroy Jackson",
             bio:"is an American actor and producer. Widely regarded as one of the most popular actors of his generation, the films in which he has appeared have collectively grossed over $27 billion worldwide, making him the highest-grossing actor of all time",
             born:"December 21, 1948"

         },
        {
            name:"Alfredo James Pacino",
            bio:"is an American actor and filmmaker. In a career spanning over five decades, he has received many awards and nominations, including an Academy Award, two Tony Awards, and two Primetime Emmy Awards. He is one of the few performers to have received the Triple Crown of Acting. He has also been honored with the AFI Life Achievement Award, the Cecil B. DeMille Award, and the National Medal of Arts.",
            born:"April 25, 1940"
        },
        {
            name:"Robert Anthony De Niro Jr.",
            bio:"is an American actor, producer, and director. He is particularly known for his nine collaborations with filmmaker Martin Scorsese, and is the recipient of various accolades, including two Academy Awards, a Golden Globe Award, the Cecil B. DeMille Award, and a Screen Actors Guild Life Achievement Award. In 2009, De Niro received the Kennedy Center Honor, and received a Presidential Medal of Freedom from U.S. President Barack Obama in 2016.",
            born:"August 17, 1943"
        }

];
//list of genres
let genres = [
    {
        category:"Psychological horror",
        description:"Psychological horror usually aims to create discomfort or dread by exposing common or universal psychological and emotional vulnerabilities/fears and revealing the darker parts of the human psyche that most people may repress or deny.",
        movies:["The shining","Persona","Suspiria"]
    },
    {   category:"indipendent movie",
        description:"indie movie is a feature film or short film that is produced outside the major film studio system, in addition to being produced and distributed by independent entertainment companies.",
        movies:["Blue Velvet","Eraserhead","Ghost Dog: The Way of the Samurai"]

    },
];
// define url the request can be sent and response whit send
app.get("/",(req,res) => {
      res.send("Welcome to my Classics. Here you can find all the info you are looking for about classic movies of all ages!!");
});
//defines url documentation and respons whit sendfile
app.get("/documentation", (req,res) =>{
    res.sendFile("public/documentation.html",{root:__dirname});
});
//defines ulr movies and response whit json
app.get("/movies",(req,res) =>{
    res.json(classicMovies);
});
//create routes and define response sending json object
app.get("/movies/:title",(req,res)=>{
    res.json(classicMovies.find((classicMovies)=>{
        return classicMovies.title === req.params.title
    }));
})
//create routes and send directors json object
app.get("/directors",(req,res)=>{
    res.json(directors);
    
})
//create route and send json object by name
app.get("/directors/:name",(req,res)=>{
    res.json(directors.find((directors)=>{
        return directors.name === req.params.name
    }));

})
app.get("/actors",(req,res)=>{
    res.json(actors);
});
app.get("/actors/:name",(req,res)=>{
    res.json(actors.find((actors)=>{
        return actors.name === req.params.name
    }));
});
app.get("/genres",(req,res)=>{
    res.json(genres)
})
app.post("/users/:username",(req,res)=>{
    res.send("user add")
});

    
app.delete("/users/:username",(req,res)=>{
    res.send("user was deleted")
});
app.get("/users/:username/favorites",(req,res)=>{
    res.send("list of favorites")
});
app.post("/users/:username/favorites",(req,res)=>{
    res.send("add list favorites")
});
app.delete("/users/:username/favorites/:movie",(req,res)=>{
    res.send("remove from favorites")
});
app.get("/users/:username/favorites/watchlist",(req,res)=>{
    res.send("all movies to the watchlist")
});
app.post("/users/:username/favorites/watchlist:movie",(req,res)=>{
    res.send("add to favorites");
});
app.delete("/users/:username/favorites/watchlist:movie",(req,res)=>{
    res.send("delete from watchlist")
});





//routes request for static file to public folder
app.use(express.static('public'));
 //error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke! try again!!');
  });
   //listen request to the portal localhost:8080
  app.listen(8080,()=>{
    console.log("your app is listening")
});