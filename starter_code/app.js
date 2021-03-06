require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

// require spotify-web-api-node package here:

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/artists", (req, res, next) => {
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items[1]);
    let artistResult =  data;
    res.render('artists', {artistResult} );
    
  })
  .catch(err => {
    console.log('The error while searching artists occurred: ', err);
  });
});

app.get("/albums/:artistId", (req, res, next) => {
  
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data => {
    //console.log('The received data from the API: ', data.body);
    let albumResult = data;
    res.render('albums', {albumResult} );
  })
  .catch(err => {
    console.log('The error while searching albums occurred: ', err);
  });

})

app.get("/tracks/:albumId", (req, res, next) => {
  console.log(req.params.albumId);
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    let tracksResult = data;
    res.render('tracks', {tracksResult} );
  })
  .catch(err => {
    console.log('The error while searching album tracks occurred: ', err);
  });

})



app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
