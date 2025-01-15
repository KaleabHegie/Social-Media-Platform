const Message = require('../Models/MessageModel');  // Import the message model
const { ObjectId } = require('mongodb');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event: Send message
    socket.on('sendMessage', async (data, callback) => {
      console.log('Message data:', data);
      try {
        const { senderId, receiverId, content, media } = data;

        // Validate input data
        if (!senderId || !receiverId || (!content && !media)) {
          return callback({ success: false, message: 'Invalid data' });
        }

        // Create the message object
        const messageId = new ObjectId();
        const messageData = {
          _id: messageId,
          sender: senderId,
          content,
          media: media || null,
        };

        // Check if a message thread already exists for the sender and receiver
        let messageThread = await Message.find();


        const ChatsWithCurrentUser = messageThread.filter((chat) =>
          chat.participants.some(
            (participant) => participant.userId.toString() === senderId.toString()
          )
        ); 
        
        const finalChats = ChatsWithCurrentUser.filter((chat) =>
          chat.participants.some(
            (participant) => participant.userId.toString() === receiverId.toString()
          )
        );    


        messageThread = finalChats[0]

        if (!messageThread) {
          // If no existing thread, create a new one
          messageThread = new Message({
            participants: [
              { userId: senderId },
              { userId: receiverId },
            ],
            messages: [messageData],
          });
        } else {
          // If a thread exists, add the new message to the thread
          messageThread.messages.push(messageData);
        }

        // Save the updated message thread to the database
        await messageThread.save();

        // Emit the new message to the receiver
        io.to(receiverId).emit('receiveMessage', {
            senderId,
            receiverId,
            content,
            media,
            timestamp: new Date(),  // Make sure the message has a timestamp and other necessary fields
          });

        // Optionally emit to the sender too (to update the UI)
        io.to(senderId).emit('receiveMessage', {
            senderId,
            receiverId,
            content,
            media,
            timestamp: new Date(),  // Make sure the message has a timestamp and other necessary fields
          });

        // Send success callback
        callback({ success: true, message: 'Message sent successfully' });
      } catch (error) {
        console.error('Error sending message:', error);
        callback({ success: false, message: 'Failed to send message' });
      }
    });

    // Handle user disconnect event
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
