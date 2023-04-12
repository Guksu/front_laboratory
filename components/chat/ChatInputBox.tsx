import Image from "next/image";
import styles from "@/styles/chat.module.scss";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Props = {
  setMessage: Dispatch<SetStateAction<string>>;
  messageEnterKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onImgSubmit: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  message: string;
};

export default function ChatInputBox({ onImgSubmit, message, setMessage, messageEnterKeyDown }: Props) {
  return (
    <div className={styles.chatInputBox}>
      <label>
        <input type="file" accept="image/*" onChange={onImgSubmit} />
        <Image width={20} height={20} alt="파일첨부 아이콘" src={"/images/plus.png"} />
      </label>
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
