import { FC } from "react";
import { ICount } from "./interfaces/Count.interfaces"

/**
 * Show count indicator for Tab
 */
const Count: FC<ICount> = ({ number = '' }) => {
  if (!number) return <sup />;
  return <sup className="px-1">{number}</sup>;
};

export default Count;

