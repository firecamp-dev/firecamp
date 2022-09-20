// @ts-nocheck
import { FC } from 'react';
import { Container, Notes } from '@firecamp/ui-kit';
import Blackhole from './Blackhole';
import ImportViaURL from './ImportViaURL';

const ImportViaDropOrURL: FC<IImportViaDropOrURL> = ({
  isImporting = false,
  importNotification = {},
  addProjectInArray = () => {},
  onImportViaRawOrURL = () => {},
}) => {
  return (
    <Container.Body className="p-4">
      <div className="fc-notes text-dark">
        <span className="iconv2-info-icon"></span>
        You can simply drop or select the Firecamp collection file in this
        import-zone. Other major API spec and formats are also supported.
      </div>
      <Blackhole
        isImporting={isImporting}
        importNotification={importNotification}
        addProjectInArray={addProjectInArray}
      />
      <ImportViaURL
        isImporting={isImporting}
        onImport={(url) => onImportViaRawOrURL(url, 'URL')}
      />
      <Notes
        type="info"
        title="Firecamp is API specs friendly platform "
        description="You can import your favourite API specification and formats like <span>Open API, Async API, Insomnia, Postman, HAR etc...</span>"
      />
    </Container.Body>
  );
};
export default ImportViaDropOrURL;

interface IImportViaDropOrURL {
  isImporting: boolean;
  importNotification: any; // {}
  addProjectInArray: Function;
  onImportViaRawOrURL: Function;
}
