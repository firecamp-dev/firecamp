// @ts-nocheck
import ReactDOM from 'react-dom';
import ConfirmationModal from '../components/modals/confirmation/ConfirmationModal';

export default (props: any) => {
  const rootElement = document.createElement('div');

  ReactDOM.render(<ConfirmationModal {...props} />, rootElement);
};
