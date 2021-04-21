const express = require("express");
const app = express();
const morgan = require('morgan');

//invoke middleware morgan function so the request is logged whit common format
app.use(morgan('common'));

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