// Index des modèles de données avec Supabase
const User = require('./user.model');
const Profile = require('./profile.model');
const Match = require('./match.model');
const Message = require('./message.model');
const Report = require('./report.model');
const AppConfig = require('./appConfig.model');
const Venue = require('./venue.model');
const Like = require('./like.model'); // Ajout du modèle Like
const PremiumPlan = require('./premiumPlan.model'); // Ajout du modèle PremiumPlan

module.exports = {
  User,
  Profile,
  Match,
  Message,
  Report,
  AppConfig,
  Venue,
  Like, // Export du modèle Like
  PremiumPlan // Export du modèle PremiumPlan
};