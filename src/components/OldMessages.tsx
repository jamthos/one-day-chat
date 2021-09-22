import { useRef } from "react";
import { useQuery, gql } from "@apollo/client";
import MessageNode from "./MessageNode";
import { StandardButton, MoreButtonWrapper, StatusMessageDiv } from "../styles/StyledElements";
import { FaArrowUp } from "react-icons/fa";

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
    notifyOnNetworkStatusChange: true,
  });

  moreCount.current = moreMsgQuery.data?.more.length;

  return (
    <>
      <MoreButtonWrapper>
        <StandardButton
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
          <FaArrowUp />
        </StandardButton>
        <p>
          <strong>{moreCount.current}</strong> older messages loaded
        </p>
        {moreMsgQuery.loading && (
          <StatusMessageDiv>
            <p>Loading..."</p>
          </StatusMessageDiv>
        )}
        {moreMsgQuery.error && (
          <StatusMessageDiv>
            <p>{moreMsgQuery.error}</p>
          </StatusMessageDiv>
        )}
      </MoreButtonWrapper>
      <div>
        {moreMsgQuery.data &&
          showOld[channelId] === true &&
          [...moreMsgQuery.data.more].reverse().map((data, idx) => {
            return <MessageNode data={data} key={data.messageId} userId={userId} hasError={false} />;
          })}
      </div>
    </>
  );
}
