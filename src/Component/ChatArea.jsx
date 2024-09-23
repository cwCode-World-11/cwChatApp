import UserProfile from "./UserProfile";
import Chat from "./Chat";
import SendMsg from "./SendMsg";

const ChatArea = () => {
  return (
    <main>
      <section>
        <UserProfile />
        <Chat />
        <SendMsg />
      </section>
    </main>
  );
};

export default ChatArea;
