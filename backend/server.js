const express = require('express');
const path = require('path');

const doubtRoutes = require('./routes/doubt');

const app = express();

app.use(express.json());

// Serve frontend (optional, if you have frontend files in ../frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Root route for Railway health check
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Use doubt routes
app.use('/api/doubts', doubtRoutes);

// Use Railway’s dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
