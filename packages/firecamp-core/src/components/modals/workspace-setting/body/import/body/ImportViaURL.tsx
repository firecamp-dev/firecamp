import { FC } from 'react';
import { Button, EButtonColor, EButtonSize } from '@firecamp/ui-kit';
import { useForm } from 'react-hook-form';
import { _object } from '@firecamp/utils';

const ImportViaURL: FC<IImportViaURL> = ({
  isImporting = false,
  onImport = () => {},
}) => {
  const { register, handleSubmit, errors } = useForm();

  let _submitURL = ({ url = '' }) => {
    if (_object.size(errors) || isImporting) return;
    let trimmedURL = url.trim();
    console.log(`trimmedURL`, trimmedURL);
    onImport(trimmedURL);
  };

  return (
    <div className="pb-24">
      <label className="fc-input-label">or Via URL</label>
      <div className="flex first-expanded fc-input-wrapper">
        <form onSubmit={handleSubmit(_submitURL)}>
          <input
            placeholder="Type URL and Hit Enter to import"
            className="small border-alt fc-input"
            autoFocus={true}
            type="text"
            name="url"
            ref={register({
              required: true,
              minLength: 1,
            })}
          />
          <div
            style={{
              fontSize: '10px',
              color: 'red',
            }}
          >
            {errors.url && 'Invalid URL'}
          </div>
        </form>
        <Button
          // TODO: className="font-light"
          color={EButtonColor.Primary}
          size={EButtonSize.Small}
          text="Import"
          disabled={isImporting}
          onClick={handleSubmit(_submitURL)}
        />
      </div>
    </div>
  );
};
export default ImportViaURL;

interface IImportViaURL {
  isImporting: boolean;
  onImport: Function;
}
