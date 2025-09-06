// Contrôleur de matchs
const { Match, Message, User } = require('../models');
const { Op } = require('sequelize');

// Récupérer les matchs de l'utilisateur
const getMatches = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer les matchs où l'utilisateur est user1 ou user2
    const matches = await Match.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ],
        status: 'active'
      },
      include: [
        {
          model: User,
          as: 'user1',
          attributes: ['id', 'first_name']
        },
        {
          model: User,
          as: 'user2',
          attributes: ['id', 'first_name']
        },
        {
          model: Message,
          as: 'messages',
          limit: 1,
          order: [['created_at', 'DESC']]
        }
      ],
      order: [['created_at', 'DESC']]
    });
    
    // Formater les matchs pour le frontend
    const formattedMatches = matches.map(match => {
      // Déterminer l'autre utilisateur dans le match
      const otherUser = match.user1_id === userId ? match.user2 : match.user1;
      
      // Récupérer le dernier message
      const lastMessage = match.messages.length > 0 ? match.messages[0] : null;
      
      return {
        id: match.id,
        user: {
          id: otherUser.id,
          first_name: otherUser.first_name
        },
        last_message: lastMessage ? {
          content: lastMessage.content,
          created_at: lastMessage.created_at
        } : null,
        created_at: match.created_at
      };
    });
    
    res.json(formattedMatches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer les messages d'un match
const getMessages = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.id;
    
    // Vérifier que l'utilisateur fait partie du match
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Récupérer les messages du match
    const messages = await Message.findAll({
      where: {
        match_id: matchId
      },
      order: [['created_at', 'ASC']]
    });
    
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Envoyer un message
const sendMessage = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    
    // Vérifier que l'utilisateur fait partie du match
    const match = await Match.findOne({
      where: {
        id: matchId,
        [Op.or]: [
          { user1_id: userId },
          { user2_id: userId }
        ]
      }
    });
    
    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }
    
    // Créer le message
    const message = await Message.create({
      match_id: matchId,
      sender_id: userId,
      content
    });
    
    res.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getMatches,
  getMessages,
  sendMessage
};