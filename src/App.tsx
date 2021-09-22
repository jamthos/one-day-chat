import { useState } from "react";
import styled from "styled-components";
import breakpoints from "./styles/breakpoints";
import users from "./data/users";
import channels from "./data/channels";
import Messages from "./components/Messages";

interface OldState {
  [index: string]: boolean;
}

function App() {
  const [channel, setChannel] = useState({ id: channels[0].channelId, name: channels[0].channelName });
  const [userId, setUserId] = useState(users[0]);
  const [isOldLoaded, setIsOldLoaded] = useState(() => {
    let oldState: OldState = {};
    channels.map((channel) => {
      oldState[channel.channelId] = false;
      return null;
    });
    return oldState;
  });

  return (
    <Wrapper>
      <Header>
        <h1>1 day chat App</h1>
        <p>All messages will be deleted at every 00:00 UTC</p>
      </Header>
      <ChatWindow>
        <ChatSidebar>
          <h2>1. Choose your user:</h2>
          <select name="userId" id="userId" value={userId} onChange={(e) => setUserId(e.target.value)}>
            {users.map((user) => (
              <option value={user} key={user}>
                {user}
              </option>
            ))}
          </select>
          <h2>2. Choose your channel:</h2>
          <ul>
            {channels.map((_channel) => (
              <li key={_channel.channelName}>
                <button
                  className={_channel.channelId === channel.id ? "active" : ""}
                  onClick={() => {
                    setChannel({ id: _channel.channelId, name: _channel.channelName });
                  }}
                >
                  {_channel.channelName}
                </button>
              </li>
            ))}
          </ul>
        </ChatSidebar>
        <ChatMessagesWrapper>
          <MessagesHeader>{channel.name}</MessagesHeader>
          <ChatMessages>
            <Messages channelId={channel.id} userId={userId} showOld={isOldLoaded} setOld={setIsOldLoaded} />
          </ChatMessages>
        </ChatMessagesWrapper>
      </ChatWindow>
    </Wrapper>
  );
}

export default App;

const Wrapper = styled.main`
  max-width: 100%;
  ${breakpoints.from.sm} {
    max-width: 540px;
  }
  ${breakpoints.from.md} {
    max-width: 720px;
  }
  ${breakpoints.from.lg} {
    max-width: 960px;
  }
  ${breakpoints.from.xl} {
    max-width: 1140px;
  }
  margin: 0 auto;
  padding: 1rem;
`;

const Header = styled.header`
  margin-bottom: 1rem;
  h1 {
    font-size: 1.5rem;
    font-weight: 500;
  }

  p {
    font-weight: 200;
  }
`;

const ChatWindow = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  background-color: #f4f5fb;
  border-radius: 0.25rem;
  box-shadow: 0 5px 2px -3px rgba(0, 0, 0, 0.125); ;
`;

const ChatSidebar = styled.div`
  grid-column: 1 / 13;
  ${breakpoints.from.sm} {
    grid-column: 1 / 5;
  }
  display: flex;
  flex-direction: column;

  h2 {
    padding: 0.5rem;
  }

  select {
    display: block;
    margin: 0 0.25rem 1rem;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
  }

  ul button {
    text-align: left;
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    border-bottom: #f0f4f8;
  }

  ul button:hover {
    color: #333;
    background-image: linear-gradient(to right, #fff, #e9eff5);
  }

  ul button.active {
    background-image: none;
    background-color: #fff;
    cursor: default;
  }
`;

const ChatMessagesWrapper = styled.div`
  grid-column: 1 / 13;
  ${breakpoints.from.sm} {
    grid-column: 5 / 13;
    border-left: 1px solid rgba(0, 0, 0, 0.1);
  }
`;
const ChatMessages = styled.div`
  position: relative;
  display: flex;
  flex-direction: column-reverse;
`;

const MessagesHeader = styled.h2`
  font-size: 1.175rem;
  font-weight: 500;
  padding: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  ${breakpoints.from.sm} {
    border-top: none;
  }
`;
