const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const { DateTime } = require('luxon');

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

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(express.json());

// Helper function for error responses
const sendErrorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({ error: message });
};

// Endpoint to get match schedule
app.get('/api/schedule', (req, res) => {
    try {
        const schedule = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'schedules.json'), 'utf-8'));
        res.json(schedule);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to get player profiles
app.get('/api/players', (req, res) => {
    try {
        const players = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'players.json'), 'utf-8'));
        res.json(players);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to get match results
app.get('/api/results', (req, res) => {
    try {
        const matchResults = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'match.json'), 'utf-8'));
        res.json(matchResults);
    } catch (err) {
        sendErrorResponse(res, 500, 'Internal Server Error');
    }
});

// Endpoint to add a comment
app.post('/api/comments', (req, res) => {
    const { name, comment } = req.body;
    const created_at = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

    const query = 'INSERT INTO `fan-comments` (name, comment, created_at) VALUES (?, ?, ?)';
    db.query(query, [name, comment, created_at], (err, result) => {
        if (err) {
            console.error('Failed to add comment:', err);
            return sendErrorResponse(res, 500, 'Failed to add comment');
        }
        res.status(201).json({ message: 'Comment added', id: result.insertId });
    });
});

// Endpoint to reply to a comment
app.post('/api/comments/:commentId/reply', (req, res) => {
    const { commentId } = req.params;
    const { fan_name, fan_reply } = req.body;
    const created_at = DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss');

    const query = 'INSERT INTO `fan-comment-reply` (comment_id, fan_name, fan_reply, created_at) VALUES (?, ?, ?, ?)';
    db.query(query, [commentId, fan_name, fan_reply, created_at], (err, result) => {
        if (err) {
            console.error('Failed to add reply:', err);
            return sendErrorResponse(res, 500, 'Failed to add reply');
        }
        res.status(201).json({ message: 'Reply added', id: result.insertId });
    });
});

// Endpoint to get all comments or filter by comment ID and replies
app.get('/api/comments', (req, res) => {
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
        if (err) {
            console.error('Failed to retrieve comments:', err);
            return sendErrorResponse(res, 500, 'Failed to retrieve comments');
        }
        res.json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
