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
        "google_image_url": "https://www.google.com/search?q=Itumeleng+Khune&tbm=isch"
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
