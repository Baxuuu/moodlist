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
      checked_afrobeat: false,
      checked_alt_rock: false,
      checked_alternative: false,
      checked_ambient: false,
      checked_black_metal: false,
      checked_blues: false,
      checked_chill: false,
      checked_classical: false,
      checked_club: false,
      checked_dance: false,
      checked_dancehall: false,
      checked_death_metal: false,
      checked_deep_house: false,
      checked_detroit_techno: false,
      checked_disco: false,
      checked_drum_and_bass: false,
      checked_dubstep: false,
      checked_edm: false,
      checked_electronic: false,
      checked_folk: false,
      checked_funk: false,
      checked_garage: false,
      checked_groove: false,
      checked_grunge: false,
      checked_guitar: false,
      checked_hard_rock: false,
      checked_hardcore: false,
      checked_hardstyle: false,
      checked_heavy_metal: false,
      checked_hip_hop: false,
      checked_house: false,
      checked_indie: false,
      checked_indie_pop: false,
      checked_industrial: false,
      checked_j_rock: false,
      checked_jazz: false,
      checked_k_pop: false,
      checked_latino: false,
      checked_metal: false,
      checked_opera: false,
      checked_party: false,
      checked_piano: false,
      checked_pop: false,
      checked_progressive_house: false,
      checked_psych_rock: false,
      checked_punk: false,
      checked_punk_rock: false,
      checked_r_n_b: false,
      checked_rainy_day: false,
      checked_reggae: false,
      checked_rock: false,
      checked_rock_n_roll: false,
      checked_ska: false,
      checked_soul: false,
      checked_tango: false,
      checked_techno: false,
      checked_trance: false,
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

  generatePlaylist(params) {
    var seed;
    if (params === "party") {
      seed = {
        limit: this.state.limit,
        seed_genres: ["pop", "party", "house", "disco", "club", "dance"],
        acousticness: this.state.acousticness,
        danceability: "1",
        energy: "1",
        instrumentalness: this.state.instrumentalness,
        liveness: "1",
        loudness: "0",
        popularity: "100",
        speechiness: this.state.speechiness,
        tempo: "150",
        valence: this.state.valence,
      };
    } else if (params === "sad") {
      seed = {
        limit: this.state.limit,
        seed_genres: ["chill", "indie", "hip-hop", "edm"],
        acousticness: this.state.acousticness,
        danceability: "0",
        energy: "0",
        instrumentalness: "0.5",
        liveness: "0",
        loudness: "0",
        popularity: "50",
        speechiness: "1",
        tempo: "50",
        valence: "1",
      };
    } else if (params === "training") {
      seed = {
        limit: this.state.limit,
        seed_genres: ["dubstep", "deep-house", "rock", "hard-rock"],
        acousticness: this.state.acousticness,
        danceability: "0.5",
        energy: "1",
        instrumentalness: this.state.instrumentalness,
        liveness: this.state.liveness,
        loudness: "-20",
        popularity: "50",
        speechiness: this.state.speechiness,
        tempo: "200",
        valence: this.state.valence,
      };
    } else if (params === "morning") {
      seed = {
        limit: this.state.limit,
        seed_genres: ["rock", "pop", "piano", "dance"],
        acousticness: this.state.acousticness,
        danceability: "0.8",
        energy: "0.6",
        instrumentalness: this.state.instrumentalness,
        liveness: this.state.liveness,
        loudness: "-30",
        popularity: "70",
        speechiness: this.state.speechiness,
        tempo: "120",
        valence: this.state.valence,
      };
    } else if (params === "moodlist") {
      var musicType = [];
      if (this.state.checked_afrobeat) {
        musicType.push("afrobeat");
      }
      if (this.state.checked_alt_rock) {
        musicType.push("alt-rock");
      }
      if (this.state.checked_alternative) {
        musicType.push("alternative");
      }
      if (this.state.checked_ambient) {
        musicType.push("ambient");
      }
      if (this.state.checked_black_metal) {
        musicType.push("black-metal");
      }
      if (this.state.checked_blues) {
        musicType.push("blues");
      }
      if (this.state.checked_chill) {
        musicType.push("chill");
      }
      if (this.state.checked_classical) {
        musicType.push("classical");
      }
      if (this.state.checked_club) {
        musicType.push("club");
      }
      if (this.state.checked_dance) {
        musicType.push("dance");
      }
      if (this.state.checked_dancehall) {
        musicType.push("dancehall");
      }
      if (this.state.checked_death_metal) {
        musicType.push("death-metal");
      }
      if (this.state.checked_deep_house) {
        musicType.push("deep-house");
      }
      if (this.state.checked_detroit_techno) {
        musicType.push("detroit-techno");
      }
      if (this.state.checked_disco) {
        musicType.push("disco");
      }
      if (this.state.checked_drum_and_bass) {
        musicType.push("drum-and-bass");
      }
      if (this.state.checked_dubstep) {
        musicType.push("dubstep");
      }
      if (this.state.checked_edm) {
        musicType.push("edm");
      }
      if (this.state.checked_electronic) {
        musicType.push("electronic");
      }
      if (this.state.checked_folk) {
        musicType.push("folk");
      }
      if (this.state.checked_funk) {
        musicType.push("funk");
      }
      if (this.state.checked_garage) {
        musicType.push("garage");
      }
      if (this.state.checked_groove) {
        musicType.push("groove");
      }
      if (this.state.checked_grunge) {
        musicType.push("grunge");
      }
      if (this.state.checked_guitar) {
        musicType.push("guitar");
      }
      if (this.state.checked_hard_rock) {
        musicType.push("hard-rock");
      }
      if (this.state.checked_hardcore) {
        musicType.push("hardcore");
      }
      if (this.state.checked_hardstyle) {
        musicType.push("hardstyle");
      }
      if (this.state.checked_heavy_metal) {
        musicType.push("heavy-metal");
      }
      if (this.state.checked_hip_hop) {
        musicType.push("hip-hop");
      }
      if (this.state.checked_house) {
        musicType.push("house");
      }
      if (this.state.checked_indie) {
        musicType.push("indie");
      }
      if (this.state.checked_indie_pop) {
        musicType.push("indie-pop");
      }
      if (this.state.checked_industrial) {
        musicType.push("industrial");
      }
      if (this.state.checked_j_rock) {
        musicType.push("j-rock");
      }
      if (this.state.checked_jazz) {
        musicType.push("jazz");
      }
      if (this.state.checked_k_pop) {
        musicType.push("k-pop");
      }
      if (this.state.checked_latino) {
        musicType.push("latino");
      }
      if (this.state.checked_metal) {
        musicType.push("metal");
      }
      if (this.state.checked_opera) {
        musicType.push("opera");
      }
      if (this.state.checked_party) {
        musicType.push("party");
      }
      if (this.state.checked_piano) {
        musicType.push("piano");
      }
      if (this.state.checked_pop) {
        musicType.push("pop");
      }
      if (this.state.checked_progressive_house) {
        musicType.push("progressive-house");
      }
      if (this.state.checked_psych_rock) {
        musicType.push("psych-rock");
      }
      if (this.state.checked_punk) {
        musicType.push("punk");
      }
      if (this.state.checked_punk_rock) {
        musicType.push("punk-rock");
      }
      if (this.state.checked_r_n_b) {
        musicType.push("r-n-b");
      }
      if (this.state.checked_rainy_day) {
        musicType.push("rainy-day");
      }
      if (this.state.checked_reggae) {
        musicType.push("reggae");
      }
      if (this.state.checked_rock) {
        musicType.push("rock");
      }
      if (this.state.checked_rock_n_roll) {
        musicType.push("rock-n-roll");
      }
      if (this.state.checked_ska) {
        musicType.push("ska");
      }
      if (this.state.checked_soul) {
        musicType.push("soul");
      }
      if (this.state.checked_tango) {
        musicType.push("tango");
      }
      if (this.state.checked_techno) {
        musicType.push("techno");
      }
      if (this.state.checked_trance) {
        musicType.push("trance");
      }

      seed = {
        limit: this.state.limit,
        seed_genres: musicType,
        acousticness: this.state.acousticness,
        danceability: this.state.danceability,
        energy: this.state.energy,
        instrumentalness: this.state.instrumentalness,
        liveness: this.state.liveness,
        loudness: this.state.loudness,
        popularity: this.state.popularity,
        speechiness: this.state.speechiness,
        tempo: this.state.tempo,
        valence: this.state.valence,
      };
    }

    spotifyApi
      .getRecommendations(seed)
      .then((response) => {
        console.log(response);
        let tracks = [];
        response.tracks.forEach((track) => {
          tracks.push(track.uri);
        });
        console.log(tracks);

        if (this.state.moodlist == "") {
          this.setState({ moodlist: "moja playlista" });
        }

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

  handleChange = (e, nv) => {
    this.setState({ [e.target.name]: nv });
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
                      style={{ marginTop: 40, marginBottom: 70, width: 1250 }}
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
                        onClick={() => this.generatePlaylist("moodlist")}
                      >
                        Generate a Moodlist
                      </Button>

                      <div>
                        <Button
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 15,
                            marginBottom: 25,
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => this.generatePlaylist("party")}
                        >
                          Generate Party Playlist
                        </Button>

                        <Button
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 15,
                            marginBottom: 25,
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => this.generatePlaylist("sad")}
                        >
                          Generate Sad Playlist
                        </Button>

                        <Button
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 15,
                            marginBottom: 25,
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => this.generatePlaylist("training")}
                        >
                          Generate Training Playlist
                        </Button>

                        <Button
                          style={{
                            marginLeft: 10,
                            marginRight: 10,
                            marginTop: 15,
                            marginBottom: 25,
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() => this.generatePlaylist("morning")}
                        >
                          Generate Happy Morning Playlist
                        </Button>
                      </div>
                    </div>
                    <FormGroup column id="pl">
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_afrobeat" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_afrobeat}
                        label="Afrobeat"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_alt_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_alt_rock}
                        label="Alt Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_alternative"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_alternative}
                        label="Alternative"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_ambient" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_ambient}
                        label="Ambient"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_black_metal"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_black_metal}
                        label="Black Metal"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_blues" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_blues}
                        label="Blues"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_chill" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_chill}
                        label="Chill"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_classical" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_classical}
                        label="Classical"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_club" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_club}
                        label="Club"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_dance" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_dance}
                        label="Dance"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_dancehall" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_dancehall}
                        label="Dancehall"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_death_metal"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_death_metal}
                        label="Death Metal"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_deep_house" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_deep_house}
                        label="Deep House"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_detroit_techno"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_detroit_techno}
                        label="Detroit Techno"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_disco" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_disco}
                        label="Disco"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_drum_and_bass"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_drum_and_bass}
                        label="Drum and Bass"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_dubstep" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_dubstep}
                        label="Dubstep"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_edm" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_edm}
                        label="EDM"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_electronic" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_electronic}
                        label="Electronic"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_folk" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_folk}
                        label="Folk"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_funk" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_funk}
                        label="Funk"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_garage" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_garage}
                        label="Garage"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_groove" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_groove}
                        label="Groove"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_grunge" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_grunge}
                        label="Grunge"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_guitar" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_guitar}
                        label="Guitar"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_hard_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_hard_rock}
                        label="Hard Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_hardcore" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_hardcore}
                        label="Hardcore"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_hardstyle" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_hardstyle}
                        label="Hardstyle"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_heavy_metal"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_heavy_metal}
                        label="Heavy Metal"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_hip_hop" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_hip_hop}
                        label="Hip Hop"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_house" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_house}
                        label="House"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_indie" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_indie}
                        label="Indie"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_indie_pop" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_indie_pop}
                        label="Indie Pop"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_industrial" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_industrial}
                        label="Industrial"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_j_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_j_rock}
                        label="J Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_jazz" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_jazz}
                        label="Jazz"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_k_pop" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_k_pop}
                        label="K Pop"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_latino" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_latino}
                        label="Latino"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_metal" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_metal}
                        label="Metal"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_opera" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_opera}
                        label="Opera"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_party" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_party}
                        label="Party"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_piano" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_piano}
                        label="Piano"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_pop" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_pop}
                        label="Pop"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_progressive_house"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_progressive_house}
                        label="Progressive House"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_psych_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_psych_rock}
                        label="Psych Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_punk" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_punk}
                        label="Punk"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_punk_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_punk_rock}
                        label="Punk Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_r_n_b" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_r_n_b}
                        label="R'n'B"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_rainy_day" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_rainy_day}
                        label="Rainy Day"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_reggae" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_reggae}
                        label="Reggae"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_rock" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_rock}
                        label="Rock"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox
                            color="primary"
                            name="checked_rock_n_roll"
                          />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_rock_n_roll}
                        label="Rock n Roll"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_ska" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_ska}
                        label="Ska"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_soul" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_soul}
                        label="Soul"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_tango" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_tango}
                        label="Tango"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_techno" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_techno}
                        label="Techno"
                      />
                      <FormControlLabel
                      style={{ color: "white" }}
                        control={
                          <Checkbox color="primary" name="checked_trance" />
                        }
                        onChange={this.handleChange}
                        value={this.state.checked_trance}
                        label="Trance"
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
