require('dotenv').config();
const express = require('express');
const connect=require('./config/db')
connect()
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/admin.route');
const memberRoutes = require('./routes/membre.route');
const taskRoutes = require('./routes/tache.route');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/tasks', taskRoutes);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
