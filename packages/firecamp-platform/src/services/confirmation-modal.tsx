// @ts-nocheck
import ReactDOM from 'react-dom';
import ConfirmationModal from '../components/modals/confirmation/ConfirmationModal';

const confirm = (props: any) => {
  const rootElement = document.createElement('div');
  return new Promise((rs, rj) => {
    ReactDOM.render(
      <ConfirmationModal
        {...props}
        onResolve={(txt) => {
          rs(txt);
        }}
      />,
      rootElement
    );
  });
};
export default confirm;

console.log('yes, confirm is called');

setTimeout(() => {
  confirm({ isOpen: true, title: 'Testing the input on heaven' }).then(console.log);
}, 5000);
