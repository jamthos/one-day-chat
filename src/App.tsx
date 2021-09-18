import React from "react";
import styled from "styled-components";
import breakpoints from "./styles/breakpoints";

function App() {
  return (
    <Wrapper>
      <h1>1 day chat App</h1>
      <p>All messages will be deleted at every 00:00 UTC</p>
      <ChatWindow>
        <h2>Hello Chat</h2>
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

const ChatWindow = styled.div`
  width: 100%;
  background-color: #ccc;
  min-height: 400px;
`;
