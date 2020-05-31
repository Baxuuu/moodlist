import React, { Component } from 'react';
import SpotifyPlayer from 'react-spotify-player';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import teal from '@material-ui/core/colors/teal';


class Playlist extends React.Component {
    constructor(props){
        super(props); 
    };

   render() {

       if(!this.props.playlist_uri)
        return (
            <div>
                
                
            </div>
            
        )

        const size = {
            width: '100%',
            height: 300,
          };
          const view = 'list'; // or 'coverart'
          const theme = 'black'; // or 'white'

        return (
            <SpotifyPlayer
                uri={this.props.playlist_uri}
                size={size}
                view={view}
                theme={theme}
            />
        )

   }
}

export default Playlist;