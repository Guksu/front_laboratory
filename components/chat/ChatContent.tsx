import Image from "next/image";
import styles from "@/styles/chat.module.scss";
import { ChatMessage } from "@/interfaces/interface";
import { RefObject } from "react";

type Props = {
  chatMessage: ChatMessage[];
  onChatLeaveClick: () => void;
  scrollRef: RefObject<HTMLDivElement>;
  onMenuOpen: () => void;
  userName: string;
};

export default function ChatContent({ chatMessage, onChatLeaveClick, scrollRef, onMenuOpen, userName }: Props) {
  return (
    <main className={styles.chatMessageBox}>
      <header>
        <Image width={20} height={20} alt="뒤로가기 아이콘" src={"/images/back.png"} onClick={onChatLeaveClick} />
        <Image width={20} height={20} alt="메뉴 아이콘" src={"/images/more.png"} onClick={onMenuOpen} />
      </header>
      {chatMessage.map((item: ChatMessage, index: number) => {
        return (
          <li key={index} className={item.userName === userName ? styles.myMessage : styles.otherMessage}>
            <span>{item.userName}</span>
            {item.message && <p>{item.message}</p>}
            {item.imagePath && <Image width={200} height={200} alt="채팅 이미지" src={item.imagePath || ""} />}
          </li>
        );
      })}
      <div ref={scrollRef} />
    </main>
  );
}
