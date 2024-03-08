const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const db = new sqlite3.Database('bookmarks.db');

app.use(express.json());
app.use(express.static('public'));


// Create Bookmarks table if not exists
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

// Add Bookmark
app.post('/bookmarks', (req, res) => {
    const { title, url } = req.body;
    const timestamp = new Date().toLocaleString();
    db.run('INSERT INTO Bookmarks (title, url, timestamp) VALUES (?, ?, ?)', [title, url, timestamp], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add bookmark' });
        }
        res.status(201).json({ message: 'Bookmark added successfully' });
    });
});

// Get all Bookmarks
app.get('/bookmarks', (req, res) => {
    db.all('SELECT * FROM Bookmarks', (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch bookmarks' });
        }
        res.json(rows);
    });
});

// Delete Bookmark
app.delete('/bookmarks/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM Bookmarks WHERE id = ?', id, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete bookmark' });
        }
        res.json({ message: 'Bookmark deleted successfully' });
    });
});

// Search Bookmarks
app.get('/bookmarks/search', (req, res) => {
    const searchTerm = req.query.q;
    db.all(`SELECT * FROM Bookmarks WHERE title LIKE '%${searchTerm}%' OR url LIKE '%${searchTerm}%'`, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to search bookmarks' });
        }
        res.json(rows);
    });
});

// Route to handle requests to the root path
app.get('/', (req, res) => {
    res.send('Bookmark Manager API is running. Please use the /bookmarks endpoint to manage bookmarks.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
