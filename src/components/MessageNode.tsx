import styled from "styled-components";
import breakpoints from "../styles/breakpoints";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface MessageNodeProps {
  readonly data: Message;
  readonly userId: string;
  readonly hasError: boolean;
}

interface Message {
  readonly datetime: string;
  readonly messageId: string;
  readonly userId: string;
  readonly text: string;
}

interface MessageBlockProps {
  readonly isMine?: boolean;
}

interface MessageTimestampProps {
  readonly hasError?: boolean;
}

export default function MessageNode({ data, userId, hasError }: MessageNodeProps) {
  let msgDate = new Date(data.datetime);
  let statusMessage = hasError ? (
    <span>
      <FaExclamationCircle style={{ fill: "red" }} /> Error
    </span>
  ) : (
    <span>
      <FaCheckCircle style={{ fill: "green" }} /> Sent
    </span>
  );

  return (
    <MessageBlock isMine={userId === data.userId ? true : false}>
      <MessageAvatar>
        <div></div>
        <span>{data.userId}</span>
      </MessageAvatar>
      <MessageBody>
        <p>{data.text}</p>
      </MessageBody>
      <MessageTimestamp hasError={hasError}>
        {hasError && (
          <span style={{ paddingRight: "4px" }}>
            <button onClick={() => console.log("Resend message")}>Resend</button>
            <button onClick={() => console.log("Delete message")}>Delete</button>
          </span>
        )}
        {msgDate.toTimeString().substring(0, 5)}
        <span>{userId === data.userId ? statusMessage : ""}</span>
      </MessageTimestamp>
    </MessageBlock>
  );
}

const MessageAvatar = styled.div`
  color: #aaa;
  font-size: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;

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
  ${breakpoints.from.md} {
    margin: 0 1rem;
  }
  border-radius: 0.25rem;
  position: relative;
  align-self: stretch;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);

  p {
    white-space: pre-line;
  }
`;

const MessageTimestamp = styled.div<MessageTimestampProps>`
  align-self: center;
  font-size: 0.75rem;
  display: flex;

  span {
    padding-left: 0.25rem;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: ${(props) => (props.hasError ? "red" : "#aaa")};

    svg {
      display: inline;
    }
  }
`;

const MessageBlock = styled.div<MessageBlockProps>`
  display: flex;
  flex-direction: column;
  ${breakpoints.from.md} {
    flex-direction: ${(props) => (props.isMine ? "row-reverse" : "row")};
  }
  padding: 1rem;
  align-items: flex-start;
  max-width: 100%;

  & ${MessageAvatar} {
    ${breakpoints.to.md} {
      align-self: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
      transform: translateY(-10px);

      div {
        width: 32px;
        height: 32px;
      }
    }
  }

  & ${MessageTimestamp} {
    ${breakpoints.to.md} {
      align-self: ${(props) => (props.isMine ? "flex-start" : "flex-end")};
      padding-top: 0.25rem;
    }
  }

  & ${MessageBody} {
    text-align: ${(props) => (props.isMine ? "right" : "left")};
  }

  & ${MessageBody}:before {
    content: "";
    width: 12px;
    height: 12px;
    background-color: #fff;
    position: absolute;
    top: -6px;
    ${(props) => (props.isMine ? "right" : "left")}: 10px;
    ${breakpoints.from.md} {
      top: 18px;
      ${(props) => (props.isMine ? "right" : "left")}: -6px;
    }
    transform: rotate(45deg);
  }
`;
