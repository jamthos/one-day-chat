import { useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";
import OldMessages from "./OldMessages";
import MessageNode from "./MessageNode";

interface MessagesProps {
  readonly channelId: string;
  readonly userId: string;
  readonly showOld: { [index: string]: boolean };
  readonly setOld: Function;
}

export default function Messages({ channelId, userId, showOld, setOld }: MessagesProps) {
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
      <pre style={{ padding: "0 1rem" }}>
        {oldMessageId.current} / {newMessageId.current}
      </pre>
      {showOld[channelId] === false && (
        <div>
          <MoreButton
            onClick={() => {
              if (showOld[channelId] === false) {
                console.log("Load more");
              }
              if (showOld[channelId] === false) setOld({ ...showOld, [channelId]: true });
            }}
          >
            Load Older Messages
          </MoreButton>
        </div>
      )}
      <div>
        {/* Load old messages on click */}
        {showOld[channelId] === true && (
          <OldMessages channelId={channelId} userId={userId} messageId={oldMessageId.current} showOld={showOld} />
        )}
        {/* Show Current Messages */}
        {msgQuery.data &&
          [...msgQuery.data.msgs].reverse().map((data, idx) => {
            return <MessageNode data={data} key={data.messageId} userId={userId} />;
          })}
      </div>
      <div>
        <MoreButton onClick={loadNewMessages}>Load Newer Messages</MoreButton>
      </div>
    </div>
  );
}

const MoreButton = styled.button`
  margin: 1rem;
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
