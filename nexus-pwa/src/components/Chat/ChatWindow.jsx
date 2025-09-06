import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import ApiService from '../../services/api.service';
import io from 'socket.io-client';

const ChatWindow = () => {
  const { matchId } = useParams();
  const { isOnline, getMessagesByMatchId, saveMessage } = useOffline();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialiser la connexion WebSocket
    const newSocket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001');
    setSocket(newSocket);
    
    // Rejoindre la room de discussion
    newSocket.emit('joinRoom', matchId);
    
    // Écouter les nouveaux messages
    newSocket.on('newMessage', handleNewMessage);
    
    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  useEffect(() => {
    loadMessages();
  }, [matchId, isOnline]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    
    try {
      let data;
      
      if (isOnline) {
        // Charger depuis l'API
        data = await ApiService.getMessages(matchId);
      } else {
        // Charger depuis IndexedDB
        data = await getMessagesByMatchId(matchId);
      }
      
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      let message;
      
      if (isOnline) {
        // Envoyer via l'API
        message = await ApiService.sendMessage(matchId, newMessage);
      } else {
        // Créer un message temporaire pour l'affichage hors ligne
        message = {
          id: `temp_${Date.now()}`,
          match_id: matchId,
          content: newMessage,
          sender_id: localStorage.getItem('userId'),
          status: 'pending',
          created_at: new Date().toISOString()
        };
      }
      
      // Ajouter le message à l'interface
      setMessages(prev => [...prev, message]);
      
      // Sauvegarder dans IndexedDB
      await saveMessage(message);
      
      // Envoyer via WebSocket si en ligne
      if (isOnline && socket) {
        socket.emit('sendMessage', {
          matchId,
          content: newMessage,
          senderId: localStorage.getItem('userId')
        });
      }
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {loading && (
          <div className="loading">Chargement...</div>
        )}
        
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender_id === localStorage.getItem('userId') ? 'sent' : 'received'}`}
          >
            <div className="message-content">
              {message.content}
            </div>
            <div className="message-status">
              {message.status === 'pending' && <span>⏳</span>}
              {message.status === 'sent' && <span>✓</span>}
              {message.status === 'delivered' && <span>✓✓</span>}
              {message.status === 'read' && <span className="read">✓✓</span>}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tapez votre message..."
          disabled={!isOnline && !navigator.onLine}
        />
        <button type="submit" disabled={!newMessage.trim()}>
          Envoyer
        </button>
      </form>
      
      {!isOnline && (
        <div className="offline-notice">
          Vous êtes actuellement hors ligne. Les messages seront envoyés lorsque vous serez de nouveau en ligne.
        </div>
      )}
    </div>
  );
};

export default ChatWindow;