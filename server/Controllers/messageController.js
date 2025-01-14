const Message = require('../Models/MessageModel'); // Import your Message model

const messageController = {
  
  fetchMessages: async (req, res) => {

    // Hardcoded for testing; replace with req.body or req.params in a real app
    const currentUserId = req.user.id
    const selectedUserId = req.query.selectedUserId

    console.log(currentUserId)
    console.log(selectedUserId)
    


    if (!currentUserId || !selectedUserId) {
      return res.status(400).json({ message: 'Both currentUserId and selectedUserId are required.' });
    }

    try {
  

      
      const query = {
        participants: { $elemMatch: { userId: { $in: [currentUserId, selectedUserId] } } }
      };

      console.log(query)

      const chat = await Message.findOne({query})
        .populate('messages.sender', 'username profilePhoto') // Populate sender details
        .select('messages participants'); // Select required field


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
