// import http from 'http';
// import ws from 'ws';
// import connection from '../db/db';

// wss.on('connection', (ws) => {
//   console.log('Client connected');

//   // Handle messages from clients
//   ws.on('message', (message) => {
//     console.log(`Received: ${message}`);

//     // Parse the JSON message
//     let data;
//     try {
//       data = JSON.parse(message);
//     } catch (error) {
//       console.error('Error parsing message:', error);
//       return;
//     }

//     // Insert the message into the database
//     connection.query(
//       'INSERT INTO chat (sender_id, receiver_id, content) VALUES (?, ?, ?)',
//       [data.senderId, data.receiverId, data.content],
//       (error, results) => {
//         if (error) {
//           console.error('Error inserting message into the database:', error);
//           return;
//         }

//         // Broadcast the message to the relevant clients
//         wss.clients.forEach((client) => {
//           if (
//             client !== ws &&
//             client.readyState === WebSocket.OPEN &&
//             (client.userId === data.senderId || client.userId === data.receiverId)
//           ) {
//             client.send(message);
//           }
//         });
//       }
//     );
//   });

//   // Handle disconnections
//   ws.on('close', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server listening on port 3000');
// });
