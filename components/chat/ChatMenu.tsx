import { ChatUserList } from "@/interfaces/interface";
import styles from "@/styles/chat.module.scss";

type Props = {
  chatUserList: ChatUserList[];
  userName: string;
  onMenuClose: () => void;
};

export default function ChatMenu({ chatUserList, userName, onMenuClose }: Props) {
  return (
    <aside onClick={onMenuClose}>
      <div>
        <span>참가자 목록</span>
        {chatUserList.length > 0 && (
          <>
            <li className={styles.myName}>{`${userName} (나)`}</li>
            {chatUserList
              .filter((item: ChatUserList) => item.userName !== userName)
              .map((item: ChatUserList) => {
                return <li key={item.userId}>{item.userName}</li>;
              })}
          </>
        )}
      </div>
    </aside>
  );
}
