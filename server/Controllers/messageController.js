const Message = require("../Models/MessageModel"); // Import your Message model

const messageController = {
  fetchMessages: async (req, res) => {
    const currentUserId = req.user.id; // Hardcoded for testing; replace with req.body or req.params in a real app
    const selectedUserId = req.query.selectedUserId;

  

    if (!currentUserId || !selectedUserId) {
      return res
        .status(400)
        .json({
          message: "Both currentUserId and selectedUserId are required.",
        });
    }

    try {
      const chats = await Message.find({is_group : false})
        .populate("messages.sender", "username profilePhoto") // Populate sender details
        .select("messages participants"); // Select required field

      const ChatsWithCurrentUser = chats.filter((chat) =>
        chat.participants.some(
          (participant) =>
            participant.userId.toString() === currentUserId.toString()
        )
      );

      const finalChats = ChatsWithCurrentUser.filter((chat) =>
        chat.participants.some(
          (participant) =>
            participant.userId.toString() === selectedUserId.toString()
        )
      );

      console.log(finalChats)

      if (finalChats.length === 0) {
        // No chat found, create a new one
        const newChat = new Message({
          participants: [
            { userId: currentUserId, last_opened_at: new Date() },
            { userId: selectedUserId, last_opened_at: new Date() },
          ],
          messages: [], // Initialize with an empty array of messages
        });

        const savedChat = await newChat.save();
        return res.status(201).json({ messages: savedChat });
      }

      // Update the last_opened_at for the current user
      // Find the message where the user is a participant and log it before update
      const messageBefore = await Message.findOne({
        "participants.userId": currentUserId,
      });

      if (!messageBefore) {
        return;
      }

      // Update the last_opened_at for the current user
      await Message.updateOne(
        { "participants.userId": currentUserId }, // Find the relevant participant
        { $set: { "participants.$.last_opened_at": new Date() } } // Update the timestamp
      );

      // Fetch the updated message and log it after the update
      const messageAfter = await Message.findOne({
        "participants.userId": currentUserId,
      });

      res.status(200).json({ messages: finalChats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages." });
    }
  },

  fetchMessagesGroup: async (req, res) => {
    const selectedGroupId = req.query.selectedGroupId;
    try {
      const finalChats = await Message.findById(selectedGroupId)
        .populate("messages.sender", "user_name profile_photo_url") // Populate sender details
        .select("messages participants");

      res.status(200).json({ messages: finalChats });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages." });
    }
  },
};

module.exports = messageController;
