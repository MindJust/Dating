import React, { createContext, useState, useContext, useEffect } from 'react';
import { openDB } from 'idb';

const OfflineContext = createContext();

// Nom et version de la base de données IndexedDB
const DB_NAME = 'NexusDB';
const DB_VERSION = 1;

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [db, setDb] = useState(null);

  // Initialiser la base de données IndexedDB
  useEffect(() => {
    const initDB = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            // Créer le store pour les messages
            if (!db.objectStoreNames.contains('messages')) {
              const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
              messagesStore.createIndex('matchId', 'match_id', { unique: false });
              messagesStore.createIndex('createdAt', 'created_at', { unique: false });
            }
            
            // Créer le store pour les profils
            if (!db.objectStoreNames.contains('profiles')) {
              const profilesStore = db.createObjectStore('profiles', { keyPath: 'user_id' });
              profilesStore.createIndex('updatedAt', 'updated_at', { unique: false });
            }
            
            // Créer le store pour les matchs
            if (!db.objectStoreNames.contains('matches')) {
              const matchesStore = db.createObjectStore('matches', { keyPath: 'id' });
              matchesStore.createIndex('userId', 'user_id', { unique: false });
              matchesStore.createIndex('createdAt', 'created_at', { unique: false });
            }
          }
        });
        
        setDb(database);
      } catch (error) {
        console.error('Failed to initialize IndexedDB:', error);
      }
    };
    
    initDB();
  }, []);

  // Gérer les changements d'état de connexion
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fonction pour sauvegarder un message dans IndexedDB
  const saveMessage = async (message) => {
    if (!db) return;
    
    try {
      await db.put('messages', message);
    } catch (error) {
      console.error('Failed to save message to IndexedDB:', error);
    }
  };

  // Fonction pour récupérer les messages d'un match depuis IndexedDB
  const getMessagesByMatchId = async (matchId) => {
    if (!db) return [];
    
    try {
      const index = db.transaction('messages').store.index('matchId');
      const messages = await index.getAll(matchId);
      return messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } catch (error) {
      console.error('Failed to get messages from IndexedDB:', error);
      return [];
    }
  };

  // Fonction pour sauvegarder un profil dans IndexedDB
  const saveProfile = async (profile) => {
    if (!db) return;
    
    try {
      await db.put('profiles', profile);
    } catch (error) {
      console.error('Failed to save profile to IndexedDB:', error);
    }
  };

  // Fonction pour récupérer un profil depuis IndexedDB
  const getProfile = async (userId) => {
    if (!db) return null;
    
    try {
      return await db.get('profiles', userId);
    } catch (error) {
      console.error('Failed to get profile from IndexedDB:', error);
      return null;
    }
  };

  // Fonction pour sauvegarder un match dans IndexedDB
  const saveMatch = async (match) => {
    if (!db) return;
    
    try {
      await db.put('matches', match);
    } catch (error) {
      console.error('Failed to save match to IndexedDB:', error);
    }
  };

  // Fonction pour récupérer les matchs depuis IndexedDB
  const getMatches = async () => {
    if (!db) return [];
    
    try {
      const matches = await db.getAll('matches');
      return matches.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } catch (error) {
      console.error('Failed to get matches from IndexedDB:', error);
      return [];
    }
  };

  const value = {
    isOnline,
    db,
    saveMessage,
    getMessagesByMatchId,
    saveProfile,
    getProfile,
    saveMatch,
    getMatches
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};