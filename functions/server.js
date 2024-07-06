const express = require('express');
const serverless = require('serverless-http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const router = express.Router();

// Middleware to parse JSON
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
    host: 'blsopza3o8uqakng94xn-mysql.services.clever-cloud.com',
    port: 3306,
    user: 'uxtqltiq64qw68eg',
    password: '8E4SA9PGe2IVDqmphLNK',
    database: 'blsopza3o8uqakng94xn'
});

// Check if the connection was successful
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as ID', db.threadId);
});

// Function to send error responses
function sendErrorResponse(res, statusCode, message) {
    res.status(statusCode).json({ error: message });
}

// Endpoint to get match schedule
router.get('/api/schedule', (req, res) => {
    const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'schedule.json'), 'utf-8'));
    res.json(schedule);
});

// Endpoint to get player profiles
router.get('/api/players', (req, res) => {
    const players = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'player.json'), 'utf-8'));
    res.json(players);
});

// Endpoint to get match results
router.get('/api/results', (req, res) => {
    const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'match.json'), 'utf-8'));
    res.json(matchResults);
});

// Endpoint to add a comment
router.post('/api/comments', (req, res) => {
    const { name, comment } = req.body;
    const created_at = new Date();

    const query = 'INSERT INTO `fan-comments` (name, comment, created_at) VALUES (?, ?, ?)';
    db.query(query, [name, comment, created_at], (err, result) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to add comment');
        res.status(201).json({ message: 'Comment added', id: result.insertId });
    });
});

// Endpoint to reply to a comment
router.post('/api/comments/:commentId/reply', (req, res) => {
    const { commentId } = req.params;
    const { fan_name, fan_reply } = req.body;
    const created_at = new Date();

    const query = 'INSERT INTO `fan-comment-reply` (comment_id, fan_name, fan_reply, created_at) VALUES (?, ?, ?, ?)';
    db.query(query, [commentId, fan_name, fan_reply, created_at], (err, result) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to add reply');
        res.status(201).json({ message: 'Reply added', id: result.insertId });
    });
});

// Endpoint to get all comments or filter by comment ID and replies
router.get('/api/comments', (req, res) => {
    const { commentId } = req.query;

    let query;
    if (commentId) {
        query = `
            SELECT c.id, c.name, c.comment, c.created_at, r.id as reply_id, r.fan_name, r.fan_reply, r.created_at as reply_created_at
            FROM \`fan-comments\` c
            LEFT JOIN \`fan-comment-reply\` r ON c.id = r.comment_id
            WHERE c.id = ?
        `;
    } else {
        query = `
            SELECT c.id, c.name, c.comment, c.created_at, r.id as reply_id, r.fan_name, r.fan_reply, r.created_at as reply_created_at
            FROM \`fan-comments\` c
            LEFT JOIN \`fan-comment-reply\` r ON c.id = r.comment_id
        `;
    }

    db.query(query, [commentId], (err, results) => {
        if (err) return sendErrorResponse(res, 500, 'Failed to retrieve comments');
        res.json(results);
    });
});

app.use('/.netlify/functions/server', router);

module.exports = app;
module.exports.handler = serverless(app);
