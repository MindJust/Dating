// Nexus Core API - Point d'entrée
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const socketIo = require('socket.io');
const sequelize = require('./config/database');
const { validateEnvVars } = require('./config/env'); // Ajout de la validation des variables d'environnement
const configRoutes = require('./routes/config.routes');
const authRoutes = require('./routes/auth.routes');
const discoveryRoutes = require('./routes/discovery.routes');
const matchRoutes = require('./routes/match.routes');
const safetyRoutes = require('./routes/safety.routes');
const premiumRoutes = require('./routes/premium.routes');
const adminRoutes = require('./routes/admin.routes');

// Valider les variables d'environnement au démarrage
validateEnvVars();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware de sécurité
// Amélioration de la configuration CORS
if (process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN) {
  throw new Error('CORS_ORIGIN must be defined in production environment');
}

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:5173'],
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));

// Middleware de logging
app.use(morgan('combined'));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/config', configRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/discovery', discoveryRoutes);
app.use('/api/v1/matches', matchRoutes);
app.use('/api/v1/safety', safetyRoutes);
app.use('/api/v1/premium', premiumRoutes);
app.use('/api/v1/admin', adminRoutes);

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Nexus Core API is running' });
});

// Middleware de gestion d'erreurs amélioré
app.use((err, req, res, next) => {
  // Log l'erreur avec plus de contexte
  console.error({
    timestamp: new Date().toISOString(),
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    userId: req.user?.id
  });

  // Ne pas exposer les détails techniques en production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = isDevelopment ? err.message : 'An unexpected error occurred';
  const errorDetails = isDevelopment ? { stack: err.stack } : {};

  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: errorMessage,
    ...errorDetails
  });
});

// Middleware pour les routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('joinRoom', (matchId) => {
    socket.join(matchId);
  });
  
  socket.on('sendMessage', (data) => {
    // Émettre le message à tous les clients dans la room
    io.to(data.matchId).emit('newMessage', data);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Synchronisation de la base de données et démarrage du serveur
const PORT = process.env.PORT || 3001;

sequelize.authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Nexus Core API is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });

module.exports = { app, io };