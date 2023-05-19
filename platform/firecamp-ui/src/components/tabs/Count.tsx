import { FC } from "react";
import { ICount } from "./interfaces/Count.interfaces"

/**
 * Show count indicator for Tab
 */
const Count: FC<ICount> = ({ number = '' }) => {
  if (!number) return <sup />;
  return <sup className="px-1 leading-3 bg-primaryColor text-primary-colorText rounded-2xl">{number}</sup>;
};

export default Count;

