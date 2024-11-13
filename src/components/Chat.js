// src/Chat.js
import React, { useState, useEffect } from "react";
import { Socket } from "phoenix";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const socket = new Socket("ws://localhost:4000/socket");
    socket.connect();

    const chatChannel = socket.channel("room:lobby");
    chatChannel
      .join()
      .receive("ok", (resp) => console.log("Joined successfully", resp))
      .receive("error", (resp) => console.log("Unable to join", resp));

    chatChannel.on("new_message", (payload) => {
      setMessages((prevMessages) => [...prevMessages, payload.body]);
    });

    setChannel(chatChannel);

    return () => chatChannel.leave();
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      channel.push("new_message", { body: message });
      setMessage("");
    }
  };

  return (
    <div>
      <h1>Chat Room</h1>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
