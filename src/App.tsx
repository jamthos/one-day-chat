import React from "react";
import styled from "styled-components";
import breakpoints from "./styles/breakpoints";

interface MessageBlockProps {
  readonly isMine?: boolean;
}

function App() {
  return (
    <Wrapper>
      <Header>
        <h1>1 day chat App</h1>
        <p>All messages will be deleted at every 00:00 UTC</p>
      </Header>
      <ChatWindow>
        <ChatSidebar>
          <h2>1. Choose your user:</h2>
          <select name="userId" id="userId">
            <option value="Joyce">Joyce</option>
            <option value="Russell">Russell</option>
            <option value="Sam">Sam</option>
          </select>
          <h2>2. Choose your channel:</h2>
          <ul>
            <li>
              <button className="active">General Channel</button>
            </li>
            <li>
              <button>Technology Channel</button>
            </li>
            <li>
              <button>LGTM Channel</button>
            </li>
          </ul>
        </ChatSidebar>
        <ChatMessages>
          <MessagesHeader>General Channel</MessagesHeader>

          <MessageBlock>
            <MessageAvatar>
              <div></div>
              <span>Russell</span>
            </MessageAvatar>
            <MessageBody>
              Hello, I'm Russell.
              <br />
              How can I help you today?
            </MessageBody>
            <MessageTimestamp>08:00</MessageTimestamp>
          </MessageBlock>

          <MessageBlock isMine>
            <MessageTimestamp>08:00</MessageTimestamp>
            <MessageBody>Hi, Russell I need more information about Developer Plan.</MessageBody>
            <MessageAvatar>
              <div></div>
              <span>Joyce</span>
            </MessageAvatar>
          </MessageBlock>
        </ChatMessages>
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
  min-height: 400px;
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
  grid-template-columns: repeat(1fr, 12);
  background-color: #f4f5fb;
  min-height: 400px;
`;

const ChatSidebar = styled.div`
  grid-column: 1 / 4;
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

const ChatMessages = styled.div`
  grid-column: 4 / 13;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
`;

const MessagesHeader = styled.h2`
  font-size: 1.175rem;
  font-weight: 500;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const MessageAvatar = styled.div`
  color: #aaa;
  font-size: 0.75rem;
  text-align: center;

  div {
    width: 48px;
    height: 48px;
    border-radius: 48px;
    background-color: pink;
  }
`;

const MessageBody = styled.div`
  background-color: #fff;
  padding: 1rem;
  margin: 0 1rem;
  border-radius: 0.25rem;
  position: relative;
  align-self: stretch;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);
`;

const MessageTimestamp = styled.div`
  align-self: center;
  font-size: 0.75rem;
`;

const MessageBlock = styled.div<MessageBlockProps>`
  display: flex;
  padding: 1rem;
  align-items: flex-start;
  justify-content: ${(props) => (props.isMine ? "flex-end" : "flex-start")};

  & ${MessageBody} {
    text-align: ${(props) => (props.isMine ? "right" : "left")};
  }
  & ${MessageBody}:before {
    content: "";
    width: 12px;
    height: 12px;
    background-color: #fff;
    position: absolute;
    top: 18px;
    transform: rotate(45deg);
    ${(props) => (props.isMine ? "right" : "left")}: -6px;
  }
`;
