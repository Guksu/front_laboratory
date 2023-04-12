import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { io, Socket } from "socket.io-client";
import styles from "@/styles/chat.module.scss";
import { nameState } from "@/states";
import ChatTemplate from "@/components/chat/ChatTemplate";
import NickNameInput from "@/components/common/NickNameInput";
import { ChatMessage, ChatUserList } from "@/interfaces/interface";
import axios from "axios";

let socket: Socket;

export default function Home() {
  const [userName, setUserName] = useRecoilState(nameState);
  const [message, setMessage] = useState<string>("");
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([]);
  const [chatUserList, setChatUserList] = useState<ChatUserList[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect((): any => {
    if (userName !== "") {
      socket = io(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8080", { path: "/socket/chat" });

      socket.on("connect", () => {
        socket.emit("userJoin", { userName });
        console.log("소켓연결 성공!!!", socket.id);
      });

      socket.on("message", (receiveMessage: ChatMessage) => {
        console.log(`메세지 수신`);
        setChatMessage((prev) => [...prev, receiveMessage]);
      });

      socket.on("userList", (userList: ChatUserList[]) => {
        setChatUserList(userList);
      });
    }

    if (socket) return () => socket.disconnect();
  }, [userName]);

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

  const onImgSubmit = async (event: ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.currentTarget.files) {
        const form = new FormData();
        form.append("chatImage", event.currentTarget.files[0]);
        form.append("userName", userName);

        const res = await axios.post("http://localhost:8080/upload", form);

        if (res.status !== 200) {
          throw new Error("이미지 전송 오류");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChatLeaveClick = () => {
    setUserName("");
    setChatMessage([]);
    socket.disconnect();
  };

  const userNameEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      setUserName(event.currentTarget.value);
    }
  };

  const messageEnterKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey && event.nativeEvent.isComposing === false) {
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
          onChatLeaveClick={onChatLeaveClick}
          chatUserList={chatUserList}
          onImgSubmit={onImgSubmit}
        />
      )}
    </div>
  );
}
