const express = require('express');
const path = require('path');

const doubtRoutes = require('./routes/doubt');

const app = express();

app.use(express.json());

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Use doubt routes
app.use('/api/doubts', doubtRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});