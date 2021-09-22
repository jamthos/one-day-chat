import { useRef, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";
import OldMessages from "./OldMessages";
import SubmitMessage from "./SubmitMessage";
import MessageNode from "./MessageNode";
import breakpoints from "../styles/breakpoints";

interface MessagesProps {
  readonly channelId: string;
  readonly userId: string;
  readonly showOld: { [index: string]: boolean };
  readonly setOld: Function;
}

interface TempMessage {
  readonly datetime: string;
  readonly messageId: string;
  readonly userId: string;
  readonly channelId: string;
  readonly text: string;
}

export default function Messages({ channelId, userId, showOld, setOld }: MessagesProps) {
  const [unsentMessages, setUnsentMessages] = useState([]);
  const oldMessageId = useRef(null);
  const newMessageId = useRef(null);

  const MESSAGES = gql`
    query ($channelId: String!) {
      msgs: fetchLatestMessages(channelId: $channelId) {
        messageId
        datetime
        userId
        text
      }
    }
  `;

  const msgQuery = useQuery(MESSAGES, {
    variables: { channelId: channelId },
    notifyOnNetworkStatusChange: true,
  });

  const loadNewMessages = function () {
    msgQuery.fetchMore({});
    console.log(newMessageId.current);
  };

  if (msgQuery.data && msgQuery.data.msgs.length) newMessageId.current = msgQuery.data.msgs[0].messageId;
  if (msgQuery.data && msgQuery.data.msgs.length)
    oldMessageId.current = msgQuery.data.msgs[msgQuery.data.msgs.length - 1].messageId;

  return (
    <div>
      <MessageWindow>
        <div>
          {showOld[channelId] === false && msgQuery.data?.msgs.length >= 10 && (
            <MoreButtonWrapper>
              <StandardButton
                onClick={() => {
                  setOld({ ...showOld, [channelId]: true });
                }}
              >
                Load Older Messages
              </StandardButton>
            </MoreButtonWrapper>
          )}
          <div>
            {/* Load old messages on click */}
            {showOld[channelId] === true && (
              <OldMessages channelId={channelId} userId={userId} messageId={oldMessageId.current} showOld={showOld} />
            )}

            {/* Show current messages */}
            {msgQuery.data &&
              [...msgQuery.data.msgs].reverse().map((data, idx) => {
                return <MessageNode data={data} key={data.messageId} userId={userId} hasError={false} />;
              })}
          </div>

          {/* Show messages that weren't sent due to error */}
          <div style={{ backgroundColor: "lightgoldenrodyellow" }}>
            {unsentMessages?.map((msg: TempMessage, idx) => {
              if (msg.channelId === channelId && msg.userId === userId) {
                return <MessageNode data={msg} key={idx} userId={userId} hasError={true} />;
              } else {
                return null;
              }
            })}
          </div>

          {msgQuery.loading && <StatusMessage>Loading...</StatusMessage>}
          {msgQuery.error && <StatusMessage>{msgQuery.error}</StatusMessage>}

          {/* <StatusMessage>Loading...</StatusMessage> */}

          <MoreButtonWrapper>
            <StandardButton onClick={loadNewMessages}>Load New Messages</StandardButton>
          </MoreButtonWrapper>
        </div>
      </MessageWindow>

      <SubmitMessage
        onMessageSubmit={loadNewMessages}
        onMessageError={setUnsentMessages}
        channelId={channelId}
        userId={userId}
      />
    </div>
  );
}

const MessageWindow = styled.div`
  height: 60vh;
  ${breakpoints.from.sm} {
    height: 650px;
  }
  overflow-y: scroll;
  display: flex;
  flex-direction: column-reverse;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
`;

const StandardButton = styled.button`
  padding: 0.5rem 1rem;
  color: #fff;
  font-weight: bold;
  background-color: lightseagreen;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);

  &:hover {
    background-color: lightskyblue;
  }
`;

const MoreButtonWrapper = styled.div`
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.55);
  p {
    padding-top: 0.25rem;
    font-size: 0.875rem;
    color: #aaa;
  }
`;

const StatusMessage = styled.div`
  background-color: lightsteelblue;
  color: #fff;
  font-weight: bold;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
