// store/modules/socket.js
import { io } from 'socket.io-client';

export const socketModule = {
  namespaced: true,
  state: {
    socket: null,
  },
  mutations: {
    setSocket(state, socket) {
      state.socket = socket;
    },
  },
  actions: {
    connectSocket({ commit }) {
      const socket = io('http://localhost:5000'); // Replace with your server URL
      commit('setSocket', socket);

      socket.on('connect', () => {
        console.log('Connected to server:', socket.id);
      });

      socket.on('messageReceived', (data) => {
        console.log('New message received:', data);
        // Handle the received message (e.g., display it in your app store or component)
      });
    },
    sendMessage({ state }, { senderId, receiverId, content }) {
      if (state.socket && content.trim()) {
        state.socket.emit(
          'sendMessage',
          { senderId, receiverId, content },
          (response) => {
            if (response.success) {
              console.log('Message sent:', response.message);
            } else {
              console.error('Error:', response.message);
            }
          }
        );
      }
    },
  },
};
