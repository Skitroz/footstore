const express = require('express');
const mysql = require('mysql');
const app = express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const port = 3001;

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'footballstore'
});

connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de donnée :', err);
    return;
  }
  console.log('Connecté à la base de donnée !');
});

app.post('/inscription', async (req, res) => {
  const { username, password, email, role = 'admin' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [username, hashedPassword, email, role], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).send({ message: 'Utilisateur inscrit ! Vous allez être redirigé...' });
  });
});

app.post('/connexion', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  connection.query(sql, [username], async (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (results.length === 0) {
      res.status(400).send({ message: 'Utilisateur non trouvé !' });
      return;
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).send({ message: 'Mot de passe incorrect !' });
      return;
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key', { expiresIn: '1h' });
    res.send({ token });
  });
});

app.get('/profile', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secret_key');

  const sql = 'SELECT role FROM users WHERE id = ?';
  connection.query(sql, [decoded.id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ message: 'Utilisateur non trouvé !' });
      return;
    }

    res.send({ role: results[0].role });
  });
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'UPDATE users SET username = ?, email = ?, password = ?, role = ? WHERE id = ?';
  connection.query(sql, [username, email, hashedPassword, role, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send({ message: 'Utilisateur mis à jour !' });
  });
});

app.get('/produit', (req, res) => {
  const sql = 'SELECT id, name, image_url, alt_text, price FROM products';
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.get('/users', (req, res) => {
  const sql = 'SELECT id, username, email, role FROM users';
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.post('/produit', async(req, res) => {
  const { name, image_url, alt_text, price } = req.body;
  const sql = 'INSERT INTO products (name, image_url, alt_text, price) VALUES (?, ?, ?, ?)';
  connection.query(sql, [name, image_url, alt_text, price], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).send({ message: 'Produit ajouté !' });
  })
})

app.post('/users', async (req, res) => {
  const { username, password, email, role = 'user' } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = 'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)';
  connection.query(sql, [username, hashedPassword, email, role], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(201).send({ message: 'Utilisateur ajouté !' });
  });
});

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send({ message: 'Utilisateur supprimé !' });
  });
});

app.delete('/produit/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.status(200).send({ message: 'Produit supprimé !' });
  });
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution http://localhost:${port}`);
});
