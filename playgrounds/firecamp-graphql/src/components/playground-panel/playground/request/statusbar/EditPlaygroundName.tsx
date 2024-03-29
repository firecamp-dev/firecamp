import { FC } from 'react';
import { Pencil } from 'lucide-react';
import { shallow } from 'zustand/shallow';
import { IStore, useStore } from '../../../../../store';

const EditPlaygroundName: FC<any> = ({}) => {
  const { context, isRequestSaved, updatePlg, playground } = useStore(
    (s: IStore) => ({
      context: s.context,
      isRequestSaved: s.runtime.isRequestSaved,
      playground: s.playgrounds[s.runtime.activePlayground],
      savePlg: s.addItem,
      updatePlg: s.updateItem,
    }),
    shallow
  );

  const _rename = () => {
    if (!isRequestSaved) return;
    context.window
      .promptInput({
        title: 'Update Playground Info',
        value: playground.request?.name,
        btnLabels: { ok: 'Update' },
        validator: (value) => {
          const name = value.trim();
          if (!name) {
            return {
              isValid: false,
              message: 'The playground name is required',
            };
          } else if (name?.length <= 3) {
            return {
              isValid: false,
              message: 'The playground name must have minimum 3 characters',
            };
          } else {
            return { isValid: true, message: '' };
          }
        },
        executor: (plgName) => {
          return updatePlg(plgName);
        },
      })
      .then((res) => {
        // console.log(res)
      });
  };
  return <Pencil size={12} onClick={_rename} />;
};
export default EditPlaygroundName;
