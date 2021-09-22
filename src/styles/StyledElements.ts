import styled, {keyframes} from "styled-components";
import breakpoints from "./breakpoints";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const MoreButtonWrapper = styled.div`
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.55);

  p {
    padding-top: 0.25rem;
    font-size: 0.875rem;
    color: #aaa;
    animation: 200ms ${fadeIn} ease-out;
    animation-delay: 300ms;
    animation-fill-mode: both;
  }
`;

export const StandardButton = styled.button`
  width: 100%;
  ${breakpoints.from.sm}{
    width: auto;
  }
  padding: 0.5rem 1rem;
  color: #fff;
  font-weight: bold;
  background-color: #17a2b8;
  border-radius: 0.25rem;
  box-shadow: 0 3px 2px -2px rgba(0, 0, 0, 0.125);

  &:hover {
    background-color: #138496;
  }
`;

export const StatusMessageDiv = styled.div`
  font-weight: 600;
  margin-left: auto;
  animation: 200ms ${fadeIn} ease-out;
  animation-delay: 500ms;
  animation-fill-mode: both;

  p{
    color: #666;
  }
`;