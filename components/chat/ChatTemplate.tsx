import { ChatMessage } from "@/dataType";
import styles from "@/styles/chat.module.scss";
import { RefObject, Dispatch, SetStateAction } from "react";

type Props = {
  chatMessage: ChatMessage[];
  scrollRef: RefObject<HTMLDivElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  messageEnterKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  userName: string;
};

export default function ChatTemplate({ chatMessage, scrollRef, message, setMessage, messageEnterKeyDown, userName }: Props) {
  return (
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
  );
}
