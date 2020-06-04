var express = require('express');
const Playlist = require('../models/playlist');
var mongoose = require('mongoose');
var router = express.Router();


router.get('/api/details', (req, res) => {

    Playlist.find({user_id : req.body.user_id}, (err, result) => { 
        if (err) return res.json(err)

        let avg_details = {
            "acousticness": 0,
            "danceability": 0,
            "energy": 0,
            "instrumentalness": 0,
            "liveness": 0,
            "loudness": 0,
            "popularity": 0,
            "speechiness": 0,
            "tempo": 0,
            "valence": 0,
        };

        result.forEach(playlist => {
            avg_details.acousticness += playlist.acousticness;
            avg_details.danceability += playlist.danceability;
            avg_details.energy += playlist.energy;
            avg_details.instrumentalness += playlist.instrumentalness;
            avg_details.liveness += playlist.liveness;
            avg_details.loudness += playlist.loudness;
            avg_details.popularity += playlist.popularity;
            avg_details.speechiness += playlist.speechiness;
            avg_details.tempo += playlist.tempo;
            avg_details.valence += playlist.valence;
        })

        console.log(avg_details);

        for(var key in avg_details) {
            if(avg_details.hasOwnProperty(key)) {
                avg_details[key] = avg_details[key]/result.length;
                avg_details[key] = Math.round(avg_details[key] * 100) / 100;
            }

        }

        res.send(avg_details)
    })
})

router.post('/api/details', (req, res) => {
    console.log(req.body);
    const newPlaylist = new Playlist({
        user_id : req.body.user_id,
        genres : req.body.genres,
        acousticness : req.body.acousticness,
        danceability : req.body.danceability,
        energy : req.body.energy,
        instrumentalness : req.body.instrumentalness,
        liveness : req.body.liveness,
        loudness : req.body.loudness,
        popularity : req.body.popularity,
        speechiness : req.body.speechiness,
        tempo : req.body.tempo,
        valence : req.body.valence
    });
    newPlaylist.save((err, event) => {
        if (err) return res.json(err);
        res.send(event);
    })
})

module.exports = router;