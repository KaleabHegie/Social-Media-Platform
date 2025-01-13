// module.exports = (io) => {
//     io.on('connection', (socket) => {
//       console.log('A user connected:', socket.id);
  
//       socket.on('sendMessage', async (data, callback) => {
//         try {
//           const { senderId, receiverId, content, media } = data;
  
//           if (!senderId || !receiverId || (!content && !media)) {
//             return callback({ success: false, message: 'Invalid data' });
//           }
  
//           // Logic for chat and message handling
//           console.log(`Message from ${senderId} to ${receiverId}:`, content);
  
//           // Emit the message to the receiver
//           io.to(receiverId).emit('messageReceived', { senderId, content, media });
  
//           callback({ success: true, message: 'Message sent successfully' });
//         } catch (error) {
//           console.error('Error sending message:', error);
//           callback({ success: false, message: 'Failed to send message' });
//         }
//       });
  
//       socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//       });
//     });
//   };
  