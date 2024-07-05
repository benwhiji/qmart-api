const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 

const app = express();
const router = express.Router();

// Middleware to parse JSON
app.use(express.json());


// Enable CORS for all routes
app.use(cors());
app.options('*', cors());
// Player data
const players = [
  
    {
        "name": "Bruce Bvuma",
        "rank": 44,
        "position": "Goalkeeper",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Bruce+Bvuma&tbm=isch"
    },
    {
        "name": "Brandon Petersen",
        "rank": 1,
        "position": "Goalkeeper",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Brandon+Petersen&tbm=isch"
    },
    {
        "name": "Itumeleng Khune",
        "rank": 32,
        "position": "Goalkeeper",
        "age": 37,
        "start_date": "2023-06-30",
        "google_image_url": "data:image/jpeg;base64,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"
    },
    {
        "name": "Karabo Molefe",
        "rank": 34,
        "position": "Goalkeeper",
        "age": 21,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Karabo+Molefe&tbm=isch"
    },
    {
        "name": "Edmilson Dove",
        "rank": 2,
        "position": "Defender",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Edmilson+Dove&tbm=isch"
    },
    {
        "name": "Zitha Kwinika",
        "rank": 4,
        "position": "Defender",
        "age": 30,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Zitha+Kwinika&tbm=isch"
    },
    {
        "name": "Dillan Solomons",
        "rank": 18,
        "position": "Defender",
        "age": 27,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Dillan+Solomons&tbm=isch"
    },
    {
        "name": "Happy Mashiane",
        "rank": 19,
        "position": "Defender",
        "age": 26,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Happy+Mashiane&tbm=isch"
    },
    {
        "name": "Thabo Mokoena",
        "rank": 20,
        "position": "Defender",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Thabo+Mokoena&tbm=isch"
    },
    {
        "name": "Siyethemba Sithebe",
        "rank": 6,
        "position": "Midfielder",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Siyethemba+Sithebe&tbm=isch"
    },
    {
        "name": "Yusuf Maart",
        "rank": 8,
        "position": "Midfielder",
        "age": 28,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Yusuf+Maart&tbm=isch"
    },
    {
        "name": "Mduduzi Mdantsane",
        "rank": 3,
        "position": "Midfielder",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Mduduzi+Mdantsane&tbm=isch"
    },
    {
        "name": "Nkosingiphile Ngcobo",
        "rank": 12,
        "position": "Midfielder",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Nkosingiphile+Ngcobo&tbm=isch"
    },
    {
        "name": "Edson Castillo",
        "rank": 17,
        "position": "Midfielder",
        "age": 30,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Edson+Castillo&tbm=isch"
    },
    {
        "name": "Sabelo Radebe",
        "rank": 33,
        "position": "Midfielder",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Sabelo+Radebe&tbm=isch"
    },
    {
        "name": "Keagan Dolly",
        "rank": 10,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Keagan+Dolly&tbm=isch"
    },
    {
        "name": "Ashley Du Preez",
        "rank": 9,
        "position": "Forward",
        "age": 26,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Ashley+Du+Preez&tbm=isch"
    },
    {
        "name": "Christian Saile",
        "rank": 21,
        "position": "Forward",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Christian+Saile&tbm=isch"
    },
    {
        "name": "Pule Mmodi",
        "rank": 13,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Pule+Mmodi&tbm=isch"
    },
    {
        "name": "Ranga Chivaviro",
        "rank": 7,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://www.google.com/search?q=Ranga+Chivaviro&tbm=isch"
    }


  // Add more players here if needed
];

const schedule = [
  
    {
        "date": "2024-07-01",
        "time": "18:00",
        "opponent": "Orlando Pirates",
        "venue": "FNB Stadium"
    },
    {
        "date": "2024-07-05",
        "time": "15:30",
        "opponent": "Mamelodi Sundowns",
        "venue": "Loftus Versfeld Stadium"
    },
    {
        "date": "2024-07-10",
        "time": "20:00",
        "opponent": "Cape Town City",
        "venue": "Cape Town Stadium"
    },
    {
        "date": "2024-07-15",
        "time": "16:00",
        "opponent": "SuperSport United",
        "venue": "Lucas Masterpieces Moripe Stadium"
    },
    {
        "date": "2024-07-20",
        "time": "19:30",
        "opponent": "Stellenbosch FC",
        "venue": "Danie Craven Stadium"
    }


  // Add more players here if needed
];

const matchResults = [
 
    {
        "date": "2024-05-02",
        "opponent": "Mamelodi Sundowns",
        "score": "1-5",
        "highlights_url": "https://za.soccerway.com/teams/south-africa/kaizer-chiefs/3528/matches/"
    },
    {
        "date": "2024-05-07",
        "opponent": "TS Galaxy",
        "score": "2-2",
        "highlights_url": "https://za.soccerway.com/teams/south-africa/kaizer-chiefs/3528/matches/"
    },
    {
        "date": "2024-04-15",
        "opponent": "Orlando Pirates",
        "score": "3-1",
        "highlights_url": "https://www.besoccer.com/team/matches/kaizer-chiefs"
    },
    {
        "date": "2024-03-22",
        "opponent": "Cape Town City",
        "score": "0-0",
        "highlights_url": "https://www.besoccer.com/team/matches/kaizer-chiefs"
    },
    {
        "date": "2023-12-10",
        "opponent": "AmaZulu",
        "score": "2-1",
        "highlights_url": "https://www.goal.com/en-za/team/kaizer-chiefs/fixtures-results/9g72y015b6fgkgtpx1c67qemi"
    },
    {
        "date": "2023-11-05",
        "opponent": "SuperSport United",
        "score": "1-1",
        "highlights_url": "https://www.goal.com/en-za/team/kaizer-chiefs/fixtures-results/9g72y015b6fgkgtpx1c67qemi"
    }

  // Add more players here if needed
];
// Endpoint to get match schedule
router.get('/api/schedule', (req, res) => {
   // const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'schedule.json'), 'utf-8'));
    //res.json(players);
    res.json(schedule);
});

// Endpoint to get player profiles
router.get('/api/players', (req, res) => {
    res.json(players);
});

// Endpoint to get match results
router.get('/api/results', (req, res) => {
    //const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'match.json'), 'utf-8'));
    res.json(matchResults);
});

app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);
