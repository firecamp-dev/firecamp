import { FC } from "react";
import { ICount } from "./interfaces/Count.interfaces"

/**
 * Show count indicator for Tab
 */
const Count: FC<ICount> = ({ number = '' }) => {
  if (!number) return <sup />;
<<<<<<< HEAD
  return <sup className="px-1 bg-primaryColor text-primaryColorText rounded-2xl leading-3">{number}</sup>;
=======
  return <sup className="px-1 leading-3 bg-primaryColor text-primaryColorText rounded-2xl	">{number}</sup>;
>>>>>>> 78c16d250f98304d08c16c6532e818a385270562
};

export default Count;

