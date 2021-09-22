import { useState, useRef, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";

interface SubmitMessageProps {
  onMessageSubmit: Function;
  onMessageError: Function;
  userId: string;
  channelId: string;
}

interface TempMessage {
  readonly datetime: string;
  readonly messageId: string;
  readonly userId: string;
  readonly channelId: string;
  readonly text: string | null;
}

let tempMessages: TempMessage[] = [];

export default function SubmitMessage({ onMessageSubmit, onMessageError, userId, channelId }: SubmitMessageProps) {
  const [message, setMessage] = useState<string>("");
  const timeOutRef = useRef<number | null>(null);

  function saveLocalMessage(messageText: string) {
    if (timeOutRef.current) clearTimeout(timeOutRef.current);
    timeOutRef.current = window.setTimeout(() => {
      if (messageText !== "") {
        localStorage.setItem(userId + channelId, messageText);
      } else {
        localStorage.removeItem(userId + channelId);
      }
      console.log(messageText);
    }, 500);
  }

  const SEND_MESSAGE = gql`
    mutation newMessage($channelId: String!, $userId: String!, $text: String!) {
      postMessage(channelId: $channelId, userId: $userId, text: $text) {
        datetime
        text
        userId
        messageId
      }
    }
  `;

  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE, {
    onError: (error) => {
      console.error(error.message);
      onMessageError([...tempMessages]);
    },
    onCompleted: () => {
      tempMessages.pop();
      localStorage.removeItem(userId + channelId);
      setMessage("");
      onMessageSubmit();
    },
  });

  useEffect(() => {
    if (localStorage.getItem(userId + channelId)) {
      let savedMessage = localStorage.getItem(userId + channelId);
      setMessage(savedMessage || "");
    } else {
      setMessage("");
    }
  }, [channelId, userId]);

  return (
    <SubmitWrapper>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          tempMessages.push({
            datetime: Date(),
            text: message,
            userId: userId,
            channelId: channelId,
            messageId: "temp",
          });
          sendMessage({
            variables: {
              userId: userId,
              channelId: channelId,
              text: message,
            },
          });
        }}
      >
        <MessageTextarea
          name="newMessage"
          id="newMessage"
          onChange={(e) => {
            setMessage(e.target.value);
            saveLocalMessage(e.target.value);
          }}
          value={message}
          placeholder="Type your message here..."
        />
        <br />
        <StandardButton type="submit">Send Message</StandardButton>
        <div>{loading && "loading..."}</div>
      </form>
    </SubmitWrapper>
  );
}

const SubmitWrapper = styled.div`
  padding: 1rem;
`;

const MessageTextarea = styled.textarea`
  width: 100%;
  height: 10ch;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.175);
`;

const StandardButton = styled.button`
  margin: 0.5rem 0;
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
