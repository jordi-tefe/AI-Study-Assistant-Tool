'use client';

import React, { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/ChatBot.module.css'; // Add appropriate styles for your chatbot
import styles1 from "../../styles/QuizGenerator.module.css";

interface ChatMessage {
  sender: 'user' | 'bot';
  message: string;
}

// Props interface to accept the uploaded file
interface ChatBotProps {
    file?: File | null; // File that user uploads (can be null initially)
    text:string;
  }
const ChatBot: React.FC<ChatBotProps> = ({ file, text }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]); // State to store messages
  const [userInput, setUserInput] = useState<string>(''); // State to store user input
  const [loading, setLoading] = useState<boolean>(false); // State to handle loading state

  const handleSendMessage = async () => {
    if (!userInput.trim()) return; // Avoid sending empty messages

    const newMessage: ChatMessage = {
      sender: 'user',
      message: userInput,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setUserInput('');
    setLoading(true); // Show loading while waiting for response

    try {
        // Create a new FormData object to send text + file
      // const formData = new FormData();
      // formData.append('message', userInput); // Add the user's message to form data
      // if (file) {
      //   formData.append('file', file); // If there's a file, add it to the form data
      // }
      // Send the user input to the backend to generate AI response
      const response = await axios.post('https://ai-study-assistant-tool.onrender.com/chatbot', {
        text: text,
        message: userInput,
      });
     // Create a bot response message object using the server reply
     const botMessage: ChatMessage = {
        sender: 'bot', // Sender is the bot
        message: response.data.reply, // Bot's reply message from server
      };
       // Add the bot's message to the chat
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
       // If an error happens, show an error message from the bot
       setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: 'bot',
          message: 'Sorry, something went wrong.', // Error fallback message
        },
      ]);
    } finally {
      setLoading(false); // Hide loading indicator once response is handled
    }
  };

  return (
    <div className={styles1.uploadContainer}>
      <div className={styles.chatBox}>
        <div className={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${styles.message} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}
            >
              {msg.message}
            </div>
          ))}
          {/* {loading && <div className={styles.loading}>...</div>} */}
          {loading && (
                       
<div className={styles.Buttons}></div>
                    )

             }
        </div>

        <div className={styles.inputContainer}>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder= {!text ? "Insert the File..." : "Ask me anything..."}
            className={styles.inputField}
          />
          <button onClick={handleSendMessage}  disabled={loading || !text} className={styles.sendButton}>
          {loading ? "Processing..." : "Send"}
         

         
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
