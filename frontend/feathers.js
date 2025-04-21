import io from "socket.io-client";
import { feathers } from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import authentication from "@feathersjs/authentication-client";
import { BACKEND_URL } from "./extra_config";

const FEATHERS_SERVER =
  // "http://localhost:3030";
  BACKEND_URL;
// "https://xzist-backend-wz7cm4qrza-ew.a.run.app";
// const FEATHERS_SERVER = "koko";

const socket = io(FEATHERS_SERVER);
const client = feathers();

client.configure(socketio(socket));

if (typeof window !== "undefined") {
  client.configure(
    authentication({
      storage: window.localStorage,
    })
  );
}

export default client;

// const messageService = client.service('messages')

// messageService.on('created', (message) => console.log('Created a message', message))

// // Use the messages service from the server
// messageService.create({
//   text: 'Message from client'
// })
