import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bodyParser from 'body-parser';
import session from 'express-session'
import bcrypt from 'bcrypt';

const app = express();
const db = new sqlite3.Database('./database.db')
const userdb = new sqlite3.Database('./users.db')
const PORT = 6969

//middleware
app.use(cors())
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())


function isAuth(req, res, next) {
  if (req.session.user) {
      next()
  } else {
      res.status(403).send({ 
          message: "Access Denied"
      })
  }
}

//authentication
app.post('/login', (req, res) => {
  const sql = "SELECT * FROM users WHERE username = ?"
  const { username, password } = req.body

  userdb.get(sql, username, (err, row) => {
      if (row) {
         console.log(row.password)
          //123456 == $2b$10$WBadFLJvPwPehtPcL9jRNuOGrLrGOIuUD6OLRqyKt570BsrQ9f.b6
          bcrypt.compare(password, row.password, function(err, result) {
              if (result) {
                req.session.user = { username: username}
                req.session.save(function (err) {
                  res.redirect('http://localhost:5173/')
                })
              } else {
                res.json('The username or password is invalid')
              }
          });
      } 
  })
})

app.get('/logout', (req, res) => {
  req.session.user = null
  req.session.save(function (err) {
    if (err) next(err)

    req.session.regenerate(function (err) {
      if (err) next(err)
            res.json('You have successfully logout')
    })
  })    
})

app.get('/todo', (req, res) => {
  const sql = 'SELECT * FROM tasks'
  db.all(sql, (err, rows) => {
      res.json(rows)
  })
})  

app.post('/todo', (req, res) => {
    const { task_name } = req.body;
    const sql = 'INSERT INTO tasks(task_name, is_finished) VALUES(?, 0)'
    db.run(sql, [task_name],(err, rows) =>{
        res.redirect('http://localhost:5173/')
    }) 
})

app.put('/todo/:id', (req, res) => {
    const { id } = req.params
    const { task_name, is_finished } = req.body
    const sql = 'UPDATE tasks SET task_name = ?, is_finished = ? WHERE id = ?'
    db.run(sql, [task_name, is_finished, id], (err, rows) => {

    })
})

app.delete('/todo/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM tasks WHERE id = ?'
    db.run(sql, [id], (err, rows) => {
      res.send('Todo item deleted')
    })
  })

app.get('/todo/:is_finished', (req, res) => {
    const { is_finished } = req.params;
    // console.log(req.params)
    const sql = 'SELECT * FROM tasks WHERE is_finished = ?'
    db.all(sql, [is_finished], (err, rows) => {
      res.json(rows)
    })
  })

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});