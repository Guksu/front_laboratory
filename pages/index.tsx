import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  userName: string;
  message: string;
}

let socket: Socket;

export default function Home() {
  const [userName, setUserName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);

  useEffect((): any => {
    socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080", { path: "/socket/chat" });

    socket.on("connect", () => {
      console.log("소켓연결 성공!!!", socket.id);
    });

    socket.on("message", (receiveMessage: ChatMessage) => {
      console.log("메세지 수신");
      setChatMessage((prev) => [...prev, receiveMessage]);
    });

    if (socket) return () => socket.disconnect();
  }, []);

  const onMessageSubmit = () => {
    socket.emit("sendMessage", { userName, message }, () => setMessage(""));
  };

  const enterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onMessageSubmit();
    }
  };

  return (
    <div>
      <div>
        {chatMessage.map((item, index) => {
          return <div key={index}>{`${item.userName} : ${item.message}`}</div>;
        })}
      </div>
      <form>
        <input type="text" placeholder="닉네임을 입력해주세요" onChange={(e) => setUserName(e.currentTarget.value)} />
        <input type="text" placeholder="메세지를 입력해주세요" onChange={(e) => setMessage(e.currentTarget.value)} onKeyDown={enterKeyDown} />
        <button type="button" onClick={onMessageSubmit}>
          메세지 전송
        </button>
      </form>
    </div>
  );
}
