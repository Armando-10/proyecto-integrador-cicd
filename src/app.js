const express = require('express');

const app = express();
app.use(express.json());

// Almacenamiento en memoria (suficiente para el proyecto integrador)
let users = [];
let nextId = 1;

// 1. Estado del servicio
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API funcionando - version 8' });
});

// 2. Listar usuarios
app.get('/api/users', (req, res) => {
  res.status(200).json(users);
});

// 3. Crear usuario
app.post('/api/users', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    return res.status(400).json({ error: 'Faltan campos: name y email son obligatorios' });
  }
  const user = { id: nextId++, name, email };
  users.push(user);
  res.status(201).json(user);
});

// 4. Obtener usuario por id
app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.status(200).json(user);
});

// 5. Actualizar usuario
app.put('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  const { name, email } = req.body || {};
  if (!name && !email) {
    return res.status(400).json({ error: 'Envia name o email para actualizar' });
  }
  if (name) user.name = name;
  if (email) user.email = email;
  res.status(200).json(user);
});

// 6. Eliminar usuario
app.delete('/api/users/:id', (req, res) => {
  const index = users.findIndex((u) => u.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: 'Usuario no encontrado' });
  users.splice(index, 1);
  res.status(200).json({ message: 'Usuario eliminado' });
});

// Utilidad para pruebas: reinicia el estado
app.resetData = () => {
  users = [];
  nextId = 1;
};

module.exports = app;
