//@ts-nocheck
import { FC } from "react";
import { ICustomMessage } from './interfaces/CustomMessage.interfaces'

const CustomMessage: FC<ICustomMessage> = ({ message = '' }) => {
  // console.log({message});
  
  if (!message || typeof message !== 'string') return <span />;
  return <div className="p-3"> {message}</div>;
};

export default CustomMessage;
