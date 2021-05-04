const mongoose = require("mongoose");
 

let movieSchema = mongoose.Schema({
    title:    {type: String, required:true},
    description: {type:String, required:true},
    genre:    [{type:mongoose.Schema.Types.ObjectId, ref:"genre"}],
    director:  [{type:mongoose.Schema.Types.ObjectId, ref:"director"}],
    imagePath:  String,
    rating:   String

});

let userSchema = mongoose.Schema({
    username:{type: String, required: true},
    password:{type:String, required:true},
    email: {type:String, required:true},
    birthdate: Date,
    favoritesMovies:[{type:mongoose.Schema.Types.ObjectId, ref:"movie"}],
    watchListMovies:[{type:mongoose.Schema.Types.ObjectId, ref:"movie"}]
});

let directorSchema = mongoose.Schema({
    name:{type:String, required: true},
    bio:{type:String, required: true},
    birthYear: Date,
    deathYear: Date,
    movies:[{type:mongoose.Schema.Types.ObjectId, ref:"movie"}]

});

let genreSchema = mongoose.Schema({
    name: { type:String, required:true},
    description:{ type: String, required: true}
});

let actorSchema = mongoose.Schema({
    name: { type:String, required: true},
    bio: {type:String, required: true},
    birthYear: Date,
    movies: [{type:mongoose.Schema.Types.ObjectId, ref:"movie"}]

});

let movie = mongoose.model("movie",movieSchema)
let user = mongoose.model("user",userSchema)
let director = mongoose.model("director", directorSchema);
let genre = mongoose.model("genre", genreSchema)
let actor = mongoose.model("actor", actorSchema);


module.exports.movie = movie;
module.exports.user = user;
module.exports.director = director;
module.exports.genre = genre;
module.exports.actor = actor;
