// Contrôleur de messagerie
const { Message, Match, User } = require('../models');
const { Op } = require('sequelize');
const { io } = require('../index.js');

// Envoyer un message en temps réel
const sendRealTimeMessage = async (req, res) => {
  try {
    const { matchId, content } = req.body;
    const senderId = req.user.id;
    
    // Vérifier que l'utilisateur fait partie du match
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { user1_id: senderId },
          { user2_id: senderId }
        ]
      }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Créer le message
    const message = await Message.create({
      match_id: matchId,
      sender_id: senderId,
      content
    });
    
    // Émettre le message en temps réel via Socket.IO
    if (io) {
      // Récupérer les détails de l'expéditeur
      const sender = await User.findByPk(senderId, {
        attributes: ['id', 'first_name']
      });
      
      // Émettre le message à tous les clients dans la room
      io.to(matchId).emit('newMessage', {
        id: message.id,
        match_id: matchId,
        sender_id: senderId,
        sender: {
          id: sender.id,
          first_name: sender.first_name
        },
        content: message.content,
        status: message.status,
        created_at: message.created_at
      });
    }
    
    res.json(message);
  } catch (error) {
    console.error('Error sending real-time message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Marquer un message comme lu
const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;
    
    // Récupérer le message
    const message = await Message.findByPk(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    
    // Vérifier que l'utilisateur est le destinataire du message
    // (le destinataire est l'utilisateur qui n'est pas l'expéditeur)
    const match = await Match.findByPk(message.match_id);
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    const recipientId = match.user1_id === userId ? match.user2_id : match.user1_id;
    
    if (message.sender_id === userId || recipientId !== userId) {
      return res.status(403).json({ error: 'You are not the recipient of this message' });
    }
    
    // Mettre à jour le statut du message
    await message.update({
      status: 'read'
    });
    
    res.json(message);
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  sendRealTimeMessage,
  markMessageAsRead
};