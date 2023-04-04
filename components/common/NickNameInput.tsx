import styles from "@/styles/chat.module.scss";

type Props = {
  userNameEnterKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export default function NickNameInput({ userNameEnterKeyDown }: Props) {
  return <input className={styles.userNameInput} type="text" placeholder="닉네임을 입력해주세요" onKeyDown={(e) => userNameEnterKeyDown(e)} />;
}
