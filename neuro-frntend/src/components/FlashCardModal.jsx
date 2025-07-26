import React, { useState, useEffect, useRef } from 'react';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
  return null;
}

function setCookie(name, value, days) {
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

export default function FlashCardModal({ open, onClose, moduleId = 1 }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const synthRef = useRef(window.speechSynthesis);
  const utterRef = useRef(null);
  const learningStyle = getCookie('learningStyle');

  useEffect(() => {
    return () => {
      if (synthRef.current) synthRef.current.cancel();
    };
  }, []);

  // Fetch flash cards when modal opens
  useEffect(() => {
    if (open && moduleId) {
      fetchFlashCards();
    }
  }, [open, moduleId]);

  const fetchFlashCards = async () => {
    setLoading(true);
    setError(null);
    
    // Get the latest sentiment from localStorage or emotion history
    let currentSentiment = getCookie('latestSentiment');
    if (!currentSentiment) {
      const emotionHistory = JSON.parse(localStorage.getItem('emotionHistory') || '[]');
      const lastEmotion = emotionHistory[emotionHistory.length - 1];
      if (lastEmotion) {
        currentSentiment = lastEmotion.emotion;
        setCookie('latestSentiment', JSON.stringify({ sentiment: currentSentiment }), 7);
      } else {
        setCookie('latestSentiment', JSON.stringify({ sentiment: 'neutral' }), 7);
      }
    }
    
    try {
      const response = await fetch(`http://localhost:5050/api/flashcards?module=${moduleId}`, {
        method: 'GET',
        credentials: 'include', // This ensures cookies are sent
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.cards || !Array.isArray(data.cards) || data.cards.length === 0) {
        throw new Error('No flash cards available for this module');
      }

      setCards(data.cards);
      setIndex(0);
      setFlipped(false);
      setError(null);
    } catch (err) {
      console.error('Error fetching flash cards:', err);
      setError(err.message);
      
      // Only use fallback cards for network errors, not for valid API responses
      if (!err.message.includes('No flash cards available')) {
        setCards([
          { front: "What is the powerhouse of the cell?", back: "The mitochondria." },
          { front: "What is 2 + 2?", back: "4" },
          { front: "Who wrote 'Romeo and Juliet'?", back: "William Shakespeare." },
          { front: "What is the capital of France?", back: "Paris." },
        ]);
        setError('Using fallback cards - Server unavailable');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const card = cards[index];

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
    setFlipped(false);
    if (synthRef.current) synthRef.current.cancel();
  };
  
  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setFlipped(false);
    if (synthRef.current) synthRef.current.cancel();
  };

  const handleSpeak = () => {
    if (learningStyle === 'auditory' && 'speechSynthesis' in window) {
      const text = flipped ? card.back : card.front;
      utterRef.current = new window.SpeechSynthesisUtterance(text);
      synthRef.current.speak(utterRef.current);
    }
  };

  const handleStop = () => {
    if (learningStyle === 'auditory' && synthRef.current) {
      synthRef.current.cancel();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-full max-w-md flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Flash Cards</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>
        
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {error && (
          <div className="text-red-500 text-center mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg w-full">
            {error}
          </div>
        )}
        
        {!loading && cards.length > 0 && (
          <>
            <div
              className={`w-full h-48 flex items-center justify-center rounded-lg shadow-lg mb-4 cursor-pointer transition-all duration-300 transform hover:shadow-xl
                ${flipped ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-700'}
                ${flipped ? 'scale-105' : 'scale-100'}`}
              onClick={() => setFlipped((f) => !f)}
              onMouseEnter={handleSpeak}
              onMouseLeave={handleStop}
            >
              <div className="p-6 w-full">
                <span className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100 block">
                  {flipped ? card.back : card.front}
                </span>
              </div>
            </div>
            <div className="flex gap-4 mb-2">
              <button 
                onClick={prevCard} 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={nextCard} 
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Card {index + 1} of {cards.length}
            </div>
          </>
        )}
        
        {!loading && cards.length === 0 && !error && (
          <div className="text-center text-gray-500 dark:text-gray-400 p-8">
            No flash cards available for this module.
          </div>
        )}
      </div>
    </div>
  );
} 