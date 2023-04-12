import { ChangeEvent, useState } from "react";
import { ChatMessage, ChatUserList } from "@/interfaces/interface";
import styles from "@/styles/chat.module.scss";
import { RefObject, Dispatch, SetStateAction } from "react";
import ChatMenu from "./ChatMenu";
import ChatContent from "./ChatContent";
import ChatInputBox from "./ChatInputBox";

type Props = {
  chatMessage: ChatMessage[];
  scrollRef: RefObject<HTMLDivElement>;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  messageEnterKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  userName: string;
  onChatLeaveClick: () => void;
  chatUserList: ChatUserList[];
  onImgSubmit: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
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
  onImgSubmit,
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
      <ChatContent chatMessage={chatMessage} scrollRef={scrollRef} onChatLeaveClick={onChatLeaveClick} onMenuOpen={onMenuOpen} userName={userName} />
      <ChatInputBox setMessage={setMessage} onImgSubmit={onImgSubmit} message={message} messageEnterKeyDown={messageEnterKeyDown} />
      {menuOpen && <ChatMenu chatUserList={chatUserList} userName={userName} onMenuClose={onMenuClose} />}
    </div>
  );
}
