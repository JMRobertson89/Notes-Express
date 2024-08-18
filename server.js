const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const dbPath = path.join(__dirname, 'db', 'db.json');  // Path to db dir

const PORT = process.env.port || 3001;

// TODO Middleware

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// TODO GET

//home

app.get('/', (req, res) => 
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

//notes

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);


app.get('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to GET notes");
        } else {
            try {
                const notes = JSON.parse(data);
                res.json(notes);
            } catch (parseErr) {
                console.error(err);
                res.status(500).send("Failed to PARSE notes");
            }
        }
    });
});




// TODO POST

app.post('/api/notes', (req, res) => {
    fs.readFile(dbPath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to read notes");
        } else {
            try {
                const notes = JSON.parse(data);
                const newNote = req.body;
                newNote.id = uuidv4();
                notes.push(newNote);
                fs.writeFile(dbPath, JSON.stringify(notes, null, 2), (err) => {
                    if (err) {
                        console.err(err);
                        res.status(500).send("Failed to POST notes")
                    } else {
                        res.json(newNote);
                    }
                });
            } catch (parseErr) {
                console.error(err);
                res.status(500).send("Failed to PARSE notes");
            }
        }
    });
});





// TODO DELETE


app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbPath, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Failed to read notes");
        } else {
            try {
                let notes = JSON.parse(data);
                const filteredNotes = notes.filter((note) => note.id !== noteId);

                fs.writeFile(dbPath, JSON.stringify(filteredNotes, null, 2), (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send("Failed to DELETE note");
                    } else {
                        res.send("Note deleted");
                    }
                });
            } catch (parseErr) {
                console.error(err);
                res.status(500).send("Failed to PARSE notes");
            }
        }
    });
});




app.listen(PORT, () => 
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);