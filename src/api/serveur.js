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

// Route d'inscription
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

// Route de connexion
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

// Route pour obtenir le profil utilisateur
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

// Route pour mettre à jour un utilisateur
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

// Route pour obtenir tous les produits
app.get('/produit', (req, res) => {
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.is_new, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
  `;
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const products = results.reduce((acc, row) => {
      const existingProduct = acc.find(p => p.id === row.id);

      if (!existingProduct) {
        const newProduct = {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          isNew: row.is_new,
          images: []
        };
        if (row.image_url) {
          newProduct.images.push({ url: row.image_url });
        }
        acc.push(newProduct);
      } else {
        if (row.image_url) {
          existingProduct.images.push({ url: row.image_url });
        }
      }

      return acc;
    }, []);

    res.json(products);
  });
});

// Route pour mettre à jour un produit
app.put('/produit/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, images, isNew } = req.body;

  const updateProductSql = 'UPDATE products SET name = ?, description = ?, price = ?, is_new = ? WHERE id = ?';
  connection.query(updateProductSql, [name, description, price, isNew, id], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    // Supprimer les anciennes images
    const deleteImagesSql = 'DELETE FROM product_images WHERE product_id = ?';
    connection.query(deleteImagesSql, [id], (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      // Insérer les nouvelles images
      const insertImageSql = 'INSERT INTO product_images (product_id, image_url) VALUES ?';
      const imageValues = images.map(url => [id, url]);

      connection.query(insertImageSql, [imageValues], (err) => {
        if (err) {
          res.status(500).send(err);
          return;
        }

        res.status(200).send({ message: 'Produit mis à jour avec succès !' });
      });
    });
  });
});

// Route pour rechercher des produits
app.get('/produit/recherche', (req, res) => {
  const { q } = req.query;
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.is_new, pi.image_url
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.name LIKE ? OR p.description LIKE ?
  `;
  connection.query(sql, [`%${q}%`, `%${q}%`], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const products = results.reduce((acc, row) => {
      const existingProduct = acc.find(p => p.id === row.id);

      if (!existingProduct) {
        const newProduct = {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          isNew: row.is_new,
          images: []
        };
        if (row.image_url) {
          newProduct.images.push({ url: row.image_url });
        }
        acc.push(newProduct);
      } else {
        if (row.image_url) {
          existingProduct.images.push({ url: row.image_url });
        }
      }

      return acc;
    }, []);

    res.json(products);
  });
});

// Route pour obtenir tous les utilisateurs
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

// Route pour ajouter un produit
app.post('/produit', (req, res) => {
  const { name, description, price, images, isNew } = req.body;

  const insertProductSql = 'INSERT INTO products (name, description, price, is_new) VALUES (?, ?, ?, ?)';
  connection.query(insertProductSql, [name, description, price, isNew], (err, result) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const productId = result.insertId;
    const insertImageSql = 'INSERT INTO product_images (product_id, image_url) VALUES ?';
    const imageValues = images.map(url => [productId, url]);

    connection.query(insertImageSql, [imageValues], (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.status(201).send({ message: 'Produit ajouté !' });
    });
  });
});

// Route pour ajouter un utilisateur
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

// Route pour supprimer un utilisateur
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

// Route pour supprimer un produit
app.delete('/produit/:id', (req, res) => {
  const { id } = req.params;

  const deleteImagesSql = 'DELETE FROM product_images WHERE product_id = ?';
  connection.query(deleteImagesSql, [id], (err) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    const deleteProductSql = 'DELETE FROM products WHERE id = ?';
    connection.query(deleteProductSql, [id], (err) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      res.status(200).send({ message: 'Produit supprimé !' });
    });
  });
});

app.get('/produit/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT p.id, p.name, p.description, p.price, p.is_new, pi.image_url, p.products_sold
    FROM products p
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.id = ?
  `;
  connection.query(sql, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ message: 'Produit non trouvé !' });
      return;
    }

    const product = results.reduce((acc, row) => {
      if (!acc.id) {
        acc = {
          id: row.id,
          name: row.name,
          description: row.description,
          price: row.price,
          isNew: row.is_new,
          products_sold: row.products_sold,
          images: []
        };
      }
      if (row.image_url) {
        acc.images.push({ url: row.image_url });
      }
      return acc;
    }, {});

    res.json(product);
  });
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution http://localhost:${port}`);
});
