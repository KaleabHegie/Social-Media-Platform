const Message = require("../Models/MessageModel"); // Import your Message model

const messageController = {
  fetchMessages: async (req, res) => {
    const currentUserId = req.user.id; // Hardcoded for testing; replace with req.body or req.params in a real app
    const selectedUserId = req.query.selectedUserId;

    console.log(currentUserId);
    console.log(selectedUserId);
    console.log("cURRENT uSER ID "+currentUserId);

    if (!currentUserId || !selectedUserId) {
      return res
        .status(400)
        .json({ message: "Both currentUserId and selectedUserId are required." });
    }

    try {
      const query = {
        participants: {
          $elemMatch: { userId: { $in: [currentUserId, selectedUserId] } },
        },
      };

      console.log(query);

      const chats = await Message.find()
        .populate("messages.sender", "username profilePhoto") // Populate sender details
        .select("messages participants"); // Select required field

      const ChatsWithCurrentUser = chats.filter((chat) =>
        chat.participants.some(
          (participant) => participant.userId.toString() === currentUserId.toString()
        )
      );

      const finalChats = ChatsWithCurrentUser.filter((chat) =>
        chat.participants.some(
          (participant) => participant.userId.toString() === selectedUserId.toString()
        )
      );

      if (!finalChats) {
        console.error("No chat found between these participants.");
        return res.status(404).json({ message: "Chat not found." });
      }

      // Update the last_opened_at for the current user
      // Find the message where the user is a participant and log it before update
      const messageBefore = await Message.findOne({
        "participants.userId": currentUserId,
      });
      console.log("Before update:", messageBefore?.participants);

      if (!messageBefore) {
        console.log("No message found for the user.");
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
      console.log("After update:", messageAfter?.participants);

      res.status(200).json({ messages: finalChats });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages." });
    }
  },
};

module.exports = messageController;
