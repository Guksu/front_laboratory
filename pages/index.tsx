import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
import styles from "../styles/chat.module.scss";
import { nameState } from "@/states";

interface ChatMessage {
  userName: string;
  message: string;
}

let socket: Socket;

export default function Home() {
  const [userName, setUserName] = useRecoilState(nameState);
  const [message, setMessage] = useState<string>("");
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chatMessage]);

  const onMessageSubmit = () => {
    socket.emit("sendMessage", { userName, message });
    setMessage("");
  };

  const userNameEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setUserName(event.currentTarget.value);
    }
  };

  const messageEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onMessageSubmit();
    }
  };

  return (
    <div className={styles.main}>
      {userName === "" ? (
        <input className={styles.userNameInput} type="text" placeholder="닉네임을 입력해주세요" onKeyDown={(e) => userNameEnterKeyDown(e)} />
      ) : (
        <div className={styles.chatTemplate}>
          <div className={styles.chatMessageBox}>
            {chatMessage.map((item, index) => {
              return (
                <div key={index} className={item.userName === userName ? styles.myMessage : styles.otherMessage}>
                  <span>{item.userName}</span>
                  <p>{item.message}</p>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
          <input
            className={styles.chatInput}
            type="text"
            placeholder="메세지를 입력해주세요"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
            onKeyDown={messageEnterKeyDown}
          />
        </div>
      )}
    </div>
  );
}
