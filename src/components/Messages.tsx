import { useRef, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import styled, { keyframes } from "styled-components";
import OldMessages from "./OldMessages";
import SubmitMessage from "./SubmitMessage";
import MessageNode from "./MessageNode";
import { StandardButton, MoreButtonWrapper } from "../styles/StyledElements";
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

          {msgQuery.loading && <FloatingStatusMessage>Loading...</FloatingStatusMessage>}
          {msgQuery.error && <FloatingStatusMessage>{msgQuery.error}</FloatingStatusMessage>}

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

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

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

const FloatingStatusMessage = styled.div`
  background-color: #f9ffa6;
  color: #333;
  font-weight: bold;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: 200ms ${fadeIn} ease-out;
  animation-delay: 500ms;
  animation-fill-mode: both;
`;
