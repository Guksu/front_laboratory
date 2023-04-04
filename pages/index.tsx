import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
import styles from "@/styles/chat.module.scss";
import { nameState } from "@/states";
import { ChatMessage } from "@/dataType";
import ChatTemplate from "@/components/chat/ChatTemplate";
import NickNameInput from "@/components/common/NickNameInput";

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
    if (message !== "") {
      socket.emit("sendMessage", { userName, message });
      setMessage("");
    }
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
        <NickNameInput userNameEnterKeyDown={userNameEnterKeyDown} />
      ) : (
        <ChatTemplate
          chatMessage={chatMessage}
          scrollRef={scrollRef}
          message={message}
          setMessage={setMessage}
          messageEnterKeyDown={messageEnterKeyDown}
          userName={userName}
        />
      )}
    </div>
  );
}
