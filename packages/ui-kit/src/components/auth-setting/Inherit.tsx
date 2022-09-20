import { FC } from "react";

const Inherit: FC<IInherit> = ({
  parentName = '',
  openParentAuthModal = () => { },
  message = '',
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-appForeground">
      {' '}
      <div className="flex flex-col opacity-50">
        <div key={'text-appForegroundInActive flex items-center mb-2 text-xl'}>Auth is inherited from parent.</div>
        <div
          className="text-sm text-appForegroundInActive cursor-pointer"
          style={{ textDecoration: 'underline' }}
          // target="_blank"
          onClick={openParentAuthModal}
        >
          {' '}
          {message ||
            `click here to view auth inherited from ${parentName || 'parent'
            }`}{' '}
        </div>
      </div>
    </div>
  );
};

export default Inherit;

interface IInherit {

  /**
   * Current module/ element's parent name
   */
  parentName: string

  /**
   * Open parent auth setting modal
   */
  openParentAuthModal: () => void

  /**
   * Inherit auth message
   */
  message: string
}
