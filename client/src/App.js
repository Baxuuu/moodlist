import React, { Component, useState } from 'react';
import { withRouter } from 'react-router-dom';
import './App.css';
import Playlist from './components/Playlist';
import { AppBar, Toolbar, Typography, Button, Grid, Paper, Slider, TextField } from "@material-ui/core";
import teal from '@material-ui/core/colors/teal';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import spotify_logo from './spotify_logo.png';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

var limit;

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      light: '#4bdf7f',
      main: '#1ED760',
      dark: '#159643',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  }
});

class App extends Component {

  constructor(){
    super();
    const params = this.getHashParams();
    console.log(params);
    const token = params.access_token;
    let user_id = {id : ''};

    if (token) {
      spotifyApi.setAccessToken(token);
    }
  
    spotifyApi.getMe().then((result => { user_id.id = result.id;}))
    console.log(user_id);
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      id: user_id,
      playlist_uri: ''
    }
    console.log(this.state);
  }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    //console.log(hashParams);
    return hashParams;
  }

  getNowPlaying(){
    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        this.setState({
          nowPlaying: { 
              name: response.item.name, 
              albumArt: response.item.album.images[0].url
            }
        });
        console.log('Checked');
      })
  }

  logOut(){
    this.setState({loggedIn : false, id : null, playlist_uri : '' }, () => {
      this.props.history.push("/");
    })
  }



  generatePlaylist(){
    //let id = spotifyApi.getMe().then((result) =>{return result.id});
    let seed = { limit: 10, seed_genres: ["electronic", "drum-and-bass", "techno"], acousticness : 0.0, danceability : 1.0,
        energy: 1.0, instrumentalness: 0, liveness : 0.0, loudness : -60 ,
        popularity: 50, speechiness : 0.5, tempo : 150, valence : 0.0 };

     spotifyApi.getRecommendations(seed).then((response) => {
       console.log(response);
      let tracks = [];
      response.tracks.forEach(track => {
        tracks.push(track.uri);
      })
      console.log(tracks)

      let options = {
        "name" : "Moodlist generated playlist",
        "public" : false   
      }

      spotifyApi.createPlaylist(this.state.id.id, options ).then((response) => {
        console.log("Playlist created")
        console.log(response.uri)
        var uri = response.uri;
        spotifyApi.addTracksToPlaylist(this.state.id.id, response.id, tracks)
        .then(response => {

          console.log(response);

          fetch('http://localhost:8888/api/details', {
            method: 'POST',
            //mode: 'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id : this.state.id.id,
              genres : seed.seed_genres,
              acousticness : seed.acousticness, 
              danceability : seed.danceability,
              energy: seed.energy,
              instrumentalness: seed.instrumentalness,
              liveness : seed.liveness, 
              loudness : seed.liveness ,
              popularity: seed.popularity,
              speechiness : seed.speechiness, 
              tempo : seed.tempo, 
              valence : seed.valence
            })

          }).then(response => response.json())
            .then(data => {
              console.log(data)
              this.setState({ playlist_uri: uri})
            })
            
          })


        });
      }).catch((error) => {console.log(error)});
    
    
  }

  render() {

    return (
      <MuiThemeProvider theme={theme}>
      
      <div className="App">
        { !this.state.loggedIn &&
          <body>
            <Typography variant="h3" style={{color: "white", marginTop: '15%'}}>
              Moodlist
            </Typography>
            <Typography variant="h4" style={{color: "white"}}>
            Create personalized playlists on Spotify
            </Typography>
            <Typography variant="h4" style={{color: "white"}}>
            with your own preferences
            </Typography>
            <Button style={{marginLeft: 10, marginRight: 10, marginTop: 15}} variant="contained" color="primary" href='http://localhost:8888'>
                Log in with Spotify
            </Button>
          </body>
        }

        { this.state.loggedIn &&
          <div>
            <div>
              <AppBar position="static" color="primary">
                <Toolbar>
                  <Typography variant="h5" color="inherit">
                    Moodlist
                  </Typography>
                  <Typography variant="subtitle2" color="inherit" style={{marginLeft: 50}}>
                    A Spotify Playlist Generator
                  </Typography>
                  <div style={{display: 'flex', justifyContent: 'right', marginLeft: 1250}}>
                  <Button style={{marginLeft: 10, marginRight: 10}} variant="contained" onClick={() => this.logOut()}>
                    Log out
                  </Button>
                  </div>
                </Toolbar>
              </AppBar>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
            <Grid container style={{marginTop: 40, marginBottom: 70, width: 1350}}>
              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                  orientation="vertical"
                  defaultValue={0.3}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={0.01}
                  min={0}
                  max={1}
                />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Acousticness
                </Typography>
              </Grid>
              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Danceability
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Energy
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Instrumentalness
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider id="liveness"
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Liveness
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={-42}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={-60}
                    max={0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Loudness
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={30}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={0}
                    max={100}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Popularity
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Speechiness
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={100}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={10}
                    min={50}
                    max={200}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Tempo
                </Typography>
              </Grid>

              <Grid item sm style={{height: 300, width: 30}}>
                <Slider
                    orientation="vertical"
                    defaultValue={0.3}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={0.01}
                    min={0}
                    max={1.0}
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Valence
                </Typography>
              </Grid>
              <Grid item sm style={{height: 300, width: 30}}>
                <Slider 
                    id="limit"
                    orientation="vertical"
                    defaultValue={30}
                    aria-labelledby="discrete-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    min={1}
                    max={100}
                    color="secondary"
                  />
                <Typography style={{marginTop: 15, color: "white"}}>
                  Limit
                </Typography>
              </Grid>
            </Grid>
            </div>
            <div>
              <TextField id="playlist-name" label="Playlist Name" color="primary" />

              <Button style={{marginLeft: 10, marginRight: 10, marginTop: 15, marginBottom: 25}} variant="contained" color="primary" onClick={() => this.generatePlaylist()}>
                Generate a playlist
              </Button>
              <div id="pl">
                <img src={spotify_logo} alt="Logo" style={{marginTop: 50}} />
              </div>
              <div id="playlist">
              <Playlist playlist_uri={this.state.playlist_uri} />
              </div>
            </div>
            <footer>
              <AppBar position="static" color="primary">
                    <Typography variant="caption" color="inherit" align="center" style={{marginTop: 7, marginBottom: 7}}>
                      Moodlist
                    </Typography>
                </AppBar>
              </footer>
          </div>
        }

      </div>
      
      </MuiThemeProvider>
    );
    
  }
}

export default withRouter(App);
