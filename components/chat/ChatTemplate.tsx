import { useState } from "react";
import { ChatMessage, ChatUserList } from "@/interfaces/interface";
import styles from "@/styles/chat.module.scss";
import Image from "next/image";
import { RefObject, Dispatch, SetStateAction } from "react";
import ChatMenu from "./ChatMenu";

type Props = {
  chatMessage: ChatMessage[];
  scrollRef: RefObject<HTMLDivElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  messageEnterKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  userName: string;
  onChatLeaveClick: () => void;
  chatUserList: ChatUserList[];
};

export default function ChatTemplate({
  chatMessage,
  scrollRef,
  message,
  setMessage,
  messageEnterKeyDown,
  userName,
  onChatLeaveClick,
  chatUserList,
}: Props) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const onMenuOpen = () => {
    setMenuOpen(true);
  };

  const onMenuClose = () => {
    setMenuOpen(false);
  };

  return (
    <div className={styles.chatTemplate}>
      <li className={styles.chatMessageBox}>
        <header>
          <Image width={20} height={20} alt="뒤로가기 아이콘" src={"/images/back.png"} onClick={onChatLeaveClick} />
          <Image width={20} height={20} alt="메뉴 아이콘" src={"/images/more.png"} onClick={onMenuOpen} />
        </header>
        {chatMessage.map((item, index) => {
          return (
            <li key={index} className={item.userName === userName ? styles.myMessage : styles.otherMessage}>
              <span>{item.userName}</span>
              <p>{item.message}</p>
            </li>
          );
        })}
        <div ref={scrollRef} />
      </li>
      <input
        className={styles.chatInput}
        type="text"
        placeholder="메세지를 입력해주세요"
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        onKeyDown={messageEnterKeyDown}
      />
      {menuOpen && <ChatMenu chatUserList={chatUserList} userName={userName} onMenuClose={onMenuClose} />}
    </div>
  );
}
