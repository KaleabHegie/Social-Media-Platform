const Message = require('../Models/MessageModel'); // Import your Message model
const mongoose = require('mongoose');



    const messageController = {
      fetchMessages: async (req, res) => {
        const  selectedUserId  = req.query.selectedUserId;
    const currentUserId = req.user.id
    
        if (!currentUserId || !selectedUserId) {
          return res.status(400).json({ message: 'Both currentUserId and selectedUserId are required.' });
        }
    
        try {
          // Ensure currentUserId and selectedUserId are strings
          console.log("currentUserId:", currentUserId);
          console.log("selectedUserId:", selectedUserId);
    
          // Find the chat based on the participants with string comparison
          const options = {
            participants: { userId: currentUserId},
          };
          const chat = await Message.findOne({} , options).populate('messages.sender', 'username profilePhoto').select('messages');
    
          console.log("Chat found:", chat);  // Log the result for debugging
    
          if (!chat || chat.length === 0) {
            return res.status(404).json({ message: 'Chat not found.' });
          }
    
          // Return the messages from the found chat
          res.status(200).json({ messages: chat.messages });
        } catch (error) {
          console.error('Error fetching messages:', error);
          res.status(500).json({ message: 'Failed to fetch messages.' });
        }
      }
    };


module.exports = messageController;
