import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';

const app = express();
const db = new sqlite3.Database('./database.db')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.post('/todo', (req, res) => {
    const { task } = req.body;
    db.run('INSERT INTO todo(task, is_finished) VALUES(?, 0)', [task],(err, rows) =>{
    })
})

app.get('/todo', (req, res) => {
    db.all('SELECT * FROM todo', (err, rows) => {
        res.json(rows)
    })
})  



app.listen(6969, () => {
    console.log("App running on port 6969");
});