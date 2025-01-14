const Message = require('../Models/MessageModel'); // Import your Message model

const messageController = {
  
  fetchMessages: async (req, res) => {
    // Hardcoded for testing; replace with req.body or req.params in a real app
    const currentUserId = "67762e2b350490143fa750c4";
    const selectedUserId = "6784c20e057f6e6742efdf36";
    


    if (!currentUserId || !selectedUserId) {
      return res.status(400).json({ message: 'Both currentUserId and selectedUserId are required.' });
    }

    try {
      // Query to find the document with both participants
      const query = {
        $and: [
          { participants: { $elemMatch: { userId: currentUserId } } },
          { participants: { $elemMatch: { userId: selectedUserId } } }
        ]
      };

      const chat = await Message.find()
        .populate('messages.sender', 'username profilePhoto') // Adjust according to your schema
        .select('messages participants');

      if (!chat) {
        console.error("No chat found between these participants.");
        return res.status(404).json({ message: 'Chat not found.' });
      }

      res.status(200).json({ messages: chat });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages.' });
    }
  }
};

module.exports = messageController;
