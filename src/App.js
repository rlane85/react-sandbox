import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://panelpi.ddns.net/pushSocket";

function App() {
  const [connected, setConnected] = useState(false);
  const [weather, setWeather] = useState({});

  useEffect(() => {
    if (!connected) {
      fetch("http://panelpi.ddns.net/api/pushSocket")
        .then(
          (response) => {
            console.log(response);
          },
          (error) => {
            console.log(error);
          }
        );
    }
    const socket = socketIOClient(ENDPOINT, {
      transports: ["websocket", "polling"],
    });
    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => {
      setConnected(false);
    });
    socket.on("packetObject", (data) => {
      console.log('%c⧭', 'color: #ff0000', data);
      setConnected(true);

      setWeather((prevWeather) => ({ ...prevWeather, ...data }));
    });
    // CLEAN UP THE EFFECT
    return () => {
      
      socket.disconnect();
    }
    //
  }, []);
  return (
    <div>
      <p>{connected.toString()}</p>
      <p>{JSON.stringify(weather)}</p>
    </div>
  );
}

export default App;
