import React, { Component, useState } from "react";
import { withRouter } from "react-router-dom";
import "./App.css";
import Playlist from "./components/Playlist";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Grid,
  Paper,
  Slider,
  TextField,
  Input,
  Container,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import {
  createMuiTheme,
  MuiThemeProvider,
  makeStyles,
} from "@material-ui/core/styles";
import spotify_logo from "./spotify_logo.png";

import SpotifyWebApi from "spotify-web-api-js";
const spotifyApi = new SpotifyWebApi();

const theme = createMuiTheme({
  palette: {
    type: "dark",
    width: "100%",
    primary: {
      light: "#4bdf7f",
      main: "#1ED760",
      dark: "#159643",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
});

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    console.log(params);
    const token = params.access_token;
    let user_id = { id: "" };

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    spotifyApi.getMe().then((result) => {
      user_id.id = result.id;
    });
    console.log(user_id);
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: "Not Checked", albumArt: "" },
      id: user_id,
      playlist_uri: "",
      acousticness: "0.3",
      danceability: "0.3",
      energy: "0.3",
      instrumentalness: "0.3",
      liveness: "0.3",
      loudness: "-42",
      popularity: "30",
      speechiness: "0.3",
      tempo: "100",
      valence: "0.3",
      limit: "30",
      moodlist: "",
    };
    console.log(this.state);
  }

  getHashParams() {
    var hashParams = {};
    var e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    e = r.exec(q);
    while (e) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    //console.log(hashParams);
    return hashParams;
  }

  getNowPlaying() {
    spotifyApi.getMyCurrentPlaybackState().then((response) => {
      this.setState({
        nowPlaying: {
          name: response.item.name,
          albumArt: response.item.album.images[0].url,
        },
      });
      console.log("Checked");
    });
  }

  logOut() {
    this.setState({ loggedIn: false, id: null, playlist_uri: "" }, () => {
      this.props.history.push("/");
    });
  }

  generatePlaylist() {
    //let id = spotifyApi.getMe().then((result) =>{return result.id});
    let seed = {
      limit: this.state.limit,
      seed_genres: ["electronic", "drum-and-bass", "techno"],
      acousticness: this.state.acousticness,
      danceability: this.state.danceability,
      energy: this.state.energy,
      instrumentalness: this.state.instrumentalness,
      liveness: this.state.liveness,
      loudness: this.state.loudness,
      popularity: this.state.popularity,
      speechiness: this.state.speechiness,
      tempo: this.state.tempo,
      valence: this.state.tempo,
    };

    spotifyApi
      .getRecommendations(seed)
      .then((response) => {
        console.log(response);
        let tracks = [];
        response.tracks.forEach((track) => {
          tracks.push(track.uri);
        });
        console.log(tracks);

        let options = {
          name: this.state.moodlist,
          public: false,
        };

        spotifyApi
          .createPlaylist(this.state.id.id, options)
          .then((response) => {
            console.log("Playlist created");
            console.log(response.uri);
            var uri = response.uri;
            spotifyApi
              .addTracksToPlaylist(this.state.id.id, response.id, tracks)
              .then((response) => {
                console.log(response);

                fetch("http://localhost:8888/api/details", {
                  method: "POST",
                  //mode: 'cors',
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    user_id: this.state.id.id,
                    genres: seed.seed_genres,
                    acousticness: seed.acousticness,
                    danceability: seed.danceability,
                    energy: seed.energy,
                    instrumentalness: seed.instrumentalness,
                    liveness: seed.liveness,
                    loudness: seed.liveness,
                    popularity: seed.popularity,
                    speechiness: seed.speechiness,
                    tempo: seed.tempo,
                    valence: seed.valence,
                  }),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    console.log(data);
                    this.setState({ playlist_uri: uri });
                  });
              });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  updateAcousticness = (event, newValue) => {
    this.setState({ acousticness: newValue });
  };
  updateDanceability = (event, newValue) => {
    this.setState({ danceability: newValue });
  };
  updateEnergy = (event, newValue) => {
    this.setState({ energy: newValue });
  };
  updateInstrumentalness = (event, newValue) => {
    this.setState({ instrumentalness: newValue });
  };
  updateLiveness = (event, newValue) => {
    this.setState({ liveness: newValue });
  };
  updateLoudness = (event, newValue) => {
    this.setState({ loudness: newValue });
  };
  updatePopularity = (event, newValue) => {
    this.setState({ popularity: newValue });
  };
  updateSpeechiness = (event, newValue) => {
    this.setState({ speechiness: newValue });
  };
  updateTempo = (event, newValue) => {
    this.setState({ tempo: newValue });
  };
  updateValence = (event, newValue) => {
    this.setState({ valence: newValue });
  };
  updateLimit = (event, newValue) => {
    this.setState({ limit: newValue });
  };
  updateMoodlist = (e) => {
    this.setState({
      moodlist: e.target.value,
    });
  };

  handleChange = (e) => {
    console.log("just do something");
  };

  render() {
    return (
      <Container fixed>
        <MuiThemeProvider theme={theme}>
          <div className="App">
            {!this.state.loggedIn && (
              <body>
                <Typography
                  variant="h3"
                  style={{ color: "white", marginTop: "15%" }}
                >
                  Moodlist
                </Typography>
                <Typography variant="h4" style={{ color: "white" }}>
                  Create personalized playlists on Spotify
                </Typography>
                <Typography variant="h4" style={{ color: "white" }}>
                  with your own preferences
                </Typography>
                <Button
                  style={{ marginLeft: 10, marginRight: 10, marginTop: 15 }}
                  variant="contained"
                  color="primary"
                  href="http://localhost:8888"
                >
                  Log in with Spotify
                </Button>
              </body>
            )}

            {this.state.loggedIn && (
              <Grid
                container
                direction="column"
                justify="flex-start"
                alignItems="stretch"
              >
                <AppBar position="static" color="primary">
                  <Toolbar>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="flex-start"
                    >
                      <Typography variant="h5" color="inherit">
                        Moodlist
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="inherit"
                        style={{ marginLeft: 50 }}
                      >
                        A Spotify Playlist Generator
                      </Typography>
                      <Button
                        style={{ marginLeft: 10, marginRight: 10 }}
                        variant="contained"
                        onClick={() => this.logOut()}
                      >
                        Log out
                      </Button>
                    </Grid>
                  </Toolbar>
                </AppBar>
                <Grid>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Grid
                      container
                      style={{ marginTop: 40, marginBottom: 70, width: 1350 }}
                    >
                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1}
                          onChange={this.updateAcousticness}
                          value={this.state.acousticness}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Acousticness
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.acousticness}
                        </Typography>
                      </Grid>
                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateDanceability}
                          value={this.state.danceability}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Danceability
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.danceability}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateEnergy}
                          value={this.state.energy}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Energy
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.energy}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateInstrumentalness}
                          value={this.state.instrumentalness}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Instrumentalness
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.instrumentalness}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          id="liveness"
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateLiveness}
                          value={this.state.liveness}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Liveness
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.liveness}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={-42}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          min={-60}
                          max={0}
                          onChange={this.updateLoudness}
                          value={this.state.loudness}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Loudness
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.loudness}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={30}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={1}
                          min={0}
                          max={100}
                          onChange={this.updatePopularity}
                          value={this.state.popularity}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Popularity
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.popularity}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateSpeechiness}
                          value={this.state.speechiness}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Speechiness
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.speechiness}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={100}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={10}
                          min={50}
                          max={200}
                          onChange={this.updateTempo}
                          value={this.state.tempo}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Tempo
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.tempo}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
                        <Slider
                          orientation="vertical"
                          defaultValue={0.3}
                          aria-labelledby="discrete-slider"
                          valueLabelDisplay="auto"
                          step={0.01}
                          min={0}
                          max={1.0}
                          onChange={this.updateValence}
                          value={this.state.valence}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Valence
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.valence}
                        </Typography>
                      </Grid>

                      <Grid item sm style={{ height: 300, width: 30 }}>
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
                          onChange={this.updateLimit}
                          value={this.state.limit}
                        />
                        <Typography style={{ marginTop: 15, color: "white" }}>
                          Limit
                        </Typography>
                        <Typography style={{ color: "white" }}>
                          {this.state.limit}
                        </Typography>
                      </Grid>
                    </Grid>
                  </div>
                  <div>
                    <TextField
                      id="playlist-name"
                      label="Moodlist Name"
                      color="primary"
                      onChange={this.updateMoodlist}
                      value={this.state.moodlist}
                    />

                    <Button
                      style={{
                        marginLeft: 10,
                        marginRight: 10,
                        marginTop: 15,
                        marginBottom: 25,
                      }}
                      variant="contained"
                      color="primary"
                      onClick={() => this.generatePlaylist()}
                    >
                      Generate a Moodlist
                    </Button>

                    <FormGroup column id="pl">
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_afrobeat"
                          />
                        }
                        onChange={this.handleChange}
                        label="afrobeat"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_alt-rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="alt-rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_alternative"
                          />
                        }
                        onChange={this.handleChange}
                        label="alternative"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_ambient"
                          />
                        }
                        onChange={this.handleChange}
                        label="ambient"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_black-metal"
                          />
                        }
                        onChange={this.handleChange}
                        label="black-metal"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_blues"
                          />
                        }
                        onChange={this.handleChange}
                        label="blues"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_chill"
                          />
                        }
                        onChange={this.handleChange}
                        label="chill"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_classical"
                          />
                        }
                        onChange={this.handleChange}
                        label="classical"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_club"
                          />
                        }
                        onChange={this.handleChange}
                        label="club"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_dance"
                          />
                        }
                        onChange={this.handleChange}
                        label="dance"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_dancehall"
                          />
                        }
                        onChange={this.handleChange}
                        label="dancehall"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_death-metal"
                          />
                        }
                        onChange={this.handleChange}
                        label="death-metal"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_deep-house"
                          />
                        }
                        onChange={this.handleChange}
                        label="deep-house"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_detroit-techno"
                          />
                        }
                        onChange={this.handleChange}
                        label="detroit-techno"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_disco"
                          />
                        }
                        onChange={this.handleChange}
                        label="disco"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_drum-and-bass"
                          />
                        }
                        onChange={this.handleChange}
                        label="drum-and-bass"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_dubstep"
                          />
                        }
                        onChange={this.handleChange}
                        label="dubstep"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_edm"
                          />
                        }
                        onChange={this.handleChange}
                        label="edm"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_electronic"
                          />
                        }
                        onChange={this.handleChange}
                        label="electronic"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_folk"
                          />
                        }
                        onChange={this.handleChange}
                        label="folk"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_funk"
                          />
                        }
                        onChange={this.handleChange}
                        label="funk"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_garage"
                          />
                        }
                        onChange={this.handleChange}
                        label="garage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_groove"
                          />
                        }
                        onChange={this.handleChange}
                        label="groove"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_grunge"
                          />
                        }
                        onChange={this.handleChange}
                        label="grunge"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_guitar"
                          />
                        }
                        onChange={this.handleChange}
                        label="guitar"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_hard-rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="hard-rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_hardcore"
                          />
                        }
                        onChange={this.handleChange}
                        label="hardcore"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_hardstyle"
                          />
                        }
                        onChange={this.handleChange}
                        label="hardstyle"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_heavy-metal"
                          />
                        }
                        onChange={this.handleChange}
                        label="heavy-metal"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_hip-hop"
                          />
                        }
                        onChange={this.handleChange}
                        label="hip-hop"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_house"
                          />
                        }
                        onChange={this.handleChange}
                        label="house"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_indie"
                          />
                        }
                        onChange={this.handleChange}
                        label="indie"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_indie-pop"
                          />
                        }
                        onChange={this.handleChange}
                        label="indie-pop"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_industrial"
                          />
                        }
                        onChange={this.handleChange}
                        label="industrial"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_j-rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="j-rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_jazz"
                          />
                        }
                        onChange={this.handleChange}
                        label="jazz"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_k-pop"
                          />
                        }
                        onChange={this.handleChange}
                        label="k-pop"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_latino"
                          />
                        }
                        onChange={this.handleChange}
                        label="latino"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_metal"
                          />
                        }
                        onChange={this.handleChange}
                        label="metal"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_opera"
                          />
                        }
                        onChange={this.handleChange}
                        label="opera"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_party"
                          />
                        }
                        onChange={this.handleChange}
                        label="party"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_piano"
                          />
                        }
                        onChange={this.handleChange}
                        label="piano"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_pop"
                          />
                        }
                        onChange={this.handleChange}
                        label="pop"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_progressive-house"
                          />
                        }
                        onChange={this.handleChange}
                        label="progressive-house"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_psych-rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="psych-rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_punk"
                          />
                        }
                        onChange={this.handleChange}
                        label="punk"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_punk-rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="punk-rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_r-n-b"
                          />
                        }
                        onChange={this.handleChange}
                        label="r-n-b"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_rainy-day"
                          />
                        }
                        onChange={this.handleChange}
                        label="rainy-day"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_reggae"
                          />
                        }
                        onChange={this.handleChange}
                        label="reggae"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_rock"
                          />
                        }
                        onChange={this.handleChange}
                        label="rock"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_rock-n-roll"
                          />
                        }
                        onChange={this.handleChange}
                        label="rock-n-roll"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_ska"
                          />
                        }
                        onChange={this.handleChange}
                        label="ska"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_soul"
                          />
                        }
                        onChange={this.handleChange}
                        label="soul"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_tango"
                          />
                        }
                        onChange={this.handleChange}
                        label="tango"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_techno"
                          />
                        }
                        onChange={this.handleChange}
                        label="techno"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked="true"
                            color="primary"
                            name="checked_trance"
                          />
                        }
                        onChange={this.handleChange}
                        label="trance"
                      />
                    </FormGroup>

                    <div id="playlist">
                      <Playlist playlist_uri={this.state.playlist_uri} />
                    </div>
                  </div>
                </Grid>
                <footer>
                  <AppBar position="static" color="primary">
                    <Typography
                      variant="caption"
                      color="inherit"
                      align="center"
                      style={{ marginTop: 7, marginBottom: 7 }}
                    >
                      Moodlist
                    </Typography>
                  </AppBar>
                </footer>
              </Grid>
            )}
          </div>
        </MuiThemeProvider>
      </Container>
    );
  }
}

export default withRouter(App);
