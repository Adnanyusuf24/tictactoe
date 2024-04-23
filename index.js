const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Mule:Test1234@cluster0.xnqqeoh.mongodb.net/yourDatabaseName?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define a schema for game results
const GameResultSchema = new mongoose.Schema({
    username: String,
    difficulty: String,
    hits: Number
});

const GameResult = mongoose.model('GameResult', GameResultSchema);

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.static('public'));

// Route for the main menu
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'menu.html'));
});

// Route for the game page
app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

// Route to save game results
app.post('/save', async (req, res) => {
    const { username, difficulty, hits } = req.body;
    const newGameResult = new GameResult({
        username: username,
        difficulty: difficulty,
        hits: hits
    });

    try {
        const doc = await newGameResult.save();
        console.log('Game result saved:', doc);
        res.status(200).json({ message: 'Game result saved successfully', data: doc });
    } catch (err) {
        console.error('Error saving game result:', err);
        res.status(500).json({ message: 'Failed to save game result' });
    }
});
app.get('/getResults', async (req, res) => {
    try {
        const topResults = await GameResult.find({}).sort({ hits: -1 }).limit(10); // Fetch top 10 results
        res.json(topResults);
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        res.status(500).send('Failed to fetch leaderboard');
    }
});

app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
