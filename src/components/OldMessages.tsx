import { useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import styled from "styled-components";
import MessageNode from "./MessageNode";

interface MessagesProps {
  readonly channelId: string;
  readonly userId: string;
  readonly messageId: string | null;
  readonly showOld: { [index: string]: boolean };
}

export default function OldMessages({ channelId, userId, messageId, showOld }: MessagesProps) {
  const moreCount = useRef(0);

  const MORE_MESSAGES = gql`
    query ($channelId: String!, $old: Boolean!, $messageId: String!) {
      more: fetchMoreMessages(channelId: $channelId, old: $old, messageId: $messageId) {
        messageId
        datetime
        userId
        text
      }
    }
  `;

  const moreMsgQuery = useQuery(MORE_MESSAGES, {
    variables: { channelId: channelId, old: true, messageId: messageId },
  });

  moreCount.current = moreMsgQuery.data?.more.length;

  return (
    <div>
      <MoreButtonWrapper>
        <MoreButton
          onClick={() => {
            let oldMessageId =
              moreMsgQuery.data.more.length > 0
                ? moreMsgQuery.data.more[moreMsgQuery.data.more.length - 1].messageId
                : null;
            if (oldMessageId && typeof moreMsgQuery.fetchMore !== "undefined") {
              console.log("Fetch more");
              moreMsgQuery.fetchMore({
                variables: {
                  messageId: oldMessageId,
                  old: true,
                  channelId: channelId,
                },
              });
            }
          }}
        >
          Load Older Messages
        </MoreButton>{" "}
        <p>
          <strong>{moreCount.current}</strong> older messages loaded
        </p>
        {moreMsgQuery.loading && " Loading..."}
        {moreMsgQuery.error && "message: " + moreMsgQuery.error}
      </MoreButtonWrapper>
      <div>
        {moreMsgQuery.data &&
          showOld[channelId] === true &&
          [...moreMsgQuery.data.more].reverse().map((data, idx) => {
            return <MessageNode data={data} key={data.messageId} userId={userId} />;
          })}
      </div>
    </div>
  );
}

const MoreButtonWrapper = styled.div`
  margin: 1rem 1rem 0;

  p {
    padding-top: 0.25rem;
    font-size: 0.875rem;
    color: #aaa;
  }
`;

const MoreButton = styled.button`
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