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
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/498985-1715331461.jpg?lm=1"
    },
    {
        "name": "Brandon Petersen",
        "rank": 1,
        "position": "Goalkeeper",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/268567-1715331381.jpg?lm=1"
    },
    {
        "name": "Itumeleng Khune",
        "rank": 32,
        "position": "Goalkeeper",
        "age": 37,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/39616-1715331526.jpg?lm=1"
    },
    {
        "name": "Karabo Molefe",
        "rank": 34,
        "position": "Goalkeeper",
        "age": 21,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/655033-1614589017.jpg?lm=1"
    },
    {
        "name": "Edmilson Dove",
        "rank": 2,
        "position": "Defender",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/426964-1715331742.jpg?lm=1"
    },
    {
        "name": "Zitha Kwinika",
        "rank": 4,
        "position": "Defender",
        "age": 30,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/332245-1715331684.jpg?lm=1"
    },
    {
        "name": "Dillan Solomons",
        "rank": 18,
        "position": "Defender",
        "age": 27,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/426964-1715331742.jpg?lm=1"
    },
    {
        "name": "Happy Mashiane",
        "rank": 19,
        "position": "Defender",
        "age": 26,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/554214-1715332180.jpg?lm=1"
    },
    {
        "name": "Thabo Mokoena",
        "rank": 20,
        "position": "Defender",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/header/default.jpg?lm=1"
    },
    {
        "name": "Siyethemba Sithebe",
        "rank": 6,
        "position": "Midfielder",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/header/420546-1715332594.jpg?lm=1"
    },
    {
        "name": "Yusuf Maart",
        "rank": 8,
        "position": "Midfielder",
        "age": 28,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/494384-1715332538.jpg?lm=1"
    },
    {
        "name": "Mduduzi Mdantsane",
        "rank": 3,
        "position": "Midfielder",
        "age": 29,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/510067-1715332884.jpg?lm=1"
    },
    {
        "name": "Nkosingiphile Ngcobo",
        "rank": 12,
        "position": "Midfielder",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/471293-1715332945.jpg?lm=1"
    },
    {
        "name": "Edson Castillo",
        "rank": 17,
        "position": "Midfielder",
        "age": 30,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/235702-1715332669.jpg?lm=1"
    },
    {
        "name": "Sabelo Radebe",
        "rank": 33,
        "position": "Midfielder",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/467614-1715332833.jpg?lm=1"
    },
    {
        "name": "Keagan Dolly",
        "rank": 10,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/234006-1715333121.jpg?lm=1"
    },
    {
        "name": "Ashley Du Preez",
        "rank": 9,
        "position": "Forward",
        "age": 26,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/478498-1715333246.jpg?lm=1"
    },
    {
        "name": "Christian Saile",
        "rank": 21,
        "position": "Forward",
        "age": 24,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/1099035-1715333564.jpg?lm=1"
    },
    {
        "name": "Pule Mmodi",
        "rank": 13,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/613120-1715333194.jpg?lm=1"
    },
    {
        "name": "Ranga Chivaviro",
        "rank": 7,
        "position": "Forward",
        "age": 31,
        "start_date": "2023-06-30",
        "google_image_url": "https://img.a.transfermarkt.technology/portrait/big/417766-1715333520.jpg?lm=1"
    }


  // Add more players here if needed
];

const schedule = [
  
    {
        "date": "2024-07-01",
        "time": "18:00",
        "opponent": "Orlando Pirates",
        "venue": "FNB Stadium",
        "url": "https://tmssl.akamaized.net/images/wappen/head/2557.png?lm=1474757243"
    },
    {
        "date": "2024-07-05",
        "time": "15:30",
        "opponent": "Mamelodi Sundowns",
        "venue": "Loftus Versfeld Stadium",
        "url": "https://tmssl.akamaized.net/images/wappen/head/6356.png?lm=1611130082"
    },
    {
        "date": "2024-07-10",
        "time": "20:00",
        "opponent": "Cape Town City",
        "venue": "Cape Town Stadium",
        "url": "https://tmssl.akamaized.net/images/wappen/head/2303.png?lm=1488051605"
    },
    {
        "date": "2024-07-15",
        "time": "16:00",
        "opponent": "SuperSport United",
        "venue": "Lucas Masterpieces Moripe Stadium",
        "url": "https://tmssl.akamaized.net/images/wappen/head/2891.png?lm=1474825244"
    },
    {
        "date": "2024-07-20",
        "time": "19:30",
        "opponent": "Stellenbosch FC",
        "venue": "Danie Craven Stadium",
        "url": "https://tmssl.akamaized.net/images/wappen/small/23287.png?lm=1567439992"
    }


  // Add more players here if needed
];

const matchResults = [
 
    {
        "date": "2024-05-02",
        "Challenger": "Kaizer Chiefs",
        "opponent": "Mamelodi Sundowns",
        "score": "1-5",
        "opp_url": "https://tmssl.akamaized.net/images/wappen/head/6356.png?lm=1611130082",
        "cha_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "highlights_url": "https://za.soccerway.com/teams/south-africa/kaizer-chiefs/3528/matches/"
    },
    {
        "date": "2024-05-07",
        "Challenger":"Kaizer Chiefs",
        "opponent": "TS Galaxy",
        "score": "2-2",
        "cha_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "opp_url": "https://tmssl.akamaized.net/images/wappen/head/67074.png?lm=1543132402",
        "highlights_url": "https://za.soccerway.com/teams/south-africa/kaizer-chiefs/3528/matches/"
    },
    {
        "date": "2024-04-15",
        "Challenger":"Orlando Pirates",
        "opponent": "Kaizer Chiefs",
        "score": "3-1",
        "cha_url": "https://tmssl.akamaized.net/images/wappen/head/2557.png?lm=1474757243",
        "opp_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "highlights_url": "https://www.besoccer.com/team/matches/kaizer-chiefs"
    },
    {
        "date": "2024-03-22",
        "Challenger":"Kaizer Chiefs",
        "opponent": "Cape Town City",
        "score": "0-0",
        "cha_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "opp_url": "https://tmssl.akamaized.net/images/wappen/head/2303.png?lm=1488051605",
        "highlights_url": "https://www.besoccer.com/team/matches/kaizer-chiefs"
    },
    {
        "date": "2023-12-10",
        "Challenger":"Kaizer Chiefs",
        "opponent": "AmaZulu",
        "score": "2-1",
        "cha_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "opp_url": "https://tmssl.akamaized.net/images/wappen/head/9370.png?lm=1499719939",
        "highlights_url": "https://www.goal.com/en-za/team/kaizer-chiefs/fixtures-results/9g72y015b6fgkgtpx1c67qemi"
    },
    {
        "date": "2023-11-05",
        "Challenger":"Kaizer Chiefs",
        "opponent": "SuperSport United",
        "score": "1-1",
        
        "cha_url":"https://tmssl.akamaized.net/images/wappen/head/568.png?lm=1404764408",
        "opp_url": "https://tmssl.akamaized.net/images/wappen/head/2891.png?lm=1474825244",
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
