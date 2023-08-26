const express = require('express');
const router = express.Router();
const fetchuser = require('../../../middleware/keepPlus/fetchuser');
const Notes = require('../../../models/keepPlus/Notes');
const { body, validationResult } = require('express-validator');

// ROUT 1 : Get all notes of loggedin user GET -> /api/notes/fetchallnotes. Login Require
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.status(200).json(notes)
    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

// ROUT 2 : Add a new note using POST -> /api/notes/addnote. Login Require
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter a valid description').isLength({ min: 5 })
], async (req, res) => {
    try {
        const { title, description, tags } = req.body;
        const error = validationResult(req)
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        const note = new Notes({
            title, description, tags, user: req.user.id
        })

        const saveNote = await note.save();
        res.status(200).json(saveNote)
    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }

});

// ROUT 3: Update an existing note using PUT: /api/notes/updateNote/:id. Login require
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tags } = req.body;

        // creating a newNote object
        const newNote = {}
        if (title) { newNote.title = title };
        if (description) { newNote.description = description }
        if (tags) { newNote.tags = tags }

        // Finding the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

// ROUT 4: Delete an existing note using DELETE: /api/notes/deleteNote/:id. Login require
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Finding the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not found");
        }

        // allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ sucess: "Sucessfully deleted note" });

    } catch (err) {
        // catching unknown erros
        console.error(err);
        res.status(500).send("Internal Server Error")
    }
});

module.exports = router