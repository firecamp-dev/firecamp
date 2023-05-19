import { FC } from 'react';

const Inherit: FC<IProps> = ({}) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-app-foreground">
      <div className="flex flex-col opacity-50">
        <div key={'text-app-foreground-inactive flex items-center mb-2 text-xl'}>
          Auth is inherited from parent.
        </div>
        <div
          className="text-sm text-app-foreground-inactive cursor-pointer"
          style={{ textDecoration: 'underline' }}
          // target="_blank"
          onClick={() => {}}
        ></div>
      </div>
    </div>
  );
};

export default Inherit;

interface IProps {}
