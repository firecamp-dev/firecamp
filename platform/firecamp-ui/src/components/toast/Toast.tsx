import * as Toast from '@radix-ui/react-toast';
export default () => (
  <Toast.Provider label="This is the toast">
    <Toast.Root type="foreground">
      <Toast.Description>File removed successfully.</Toast.Description>
      <Toast.Close>Dismiss</Toast.Close>
    </Toast.Root>

    <Toast.Root type="foreground" duration={10000}>
      <Toast.Description>File removed successfully.</Toast.Description>
      <Toast.Action altText="Undo (Alt+U)">
        Undo <kbd>Alt</kbd>+<kbd>U</kbd>
      </Toast.Action>
      <Toast.Close>Dismiss</Toast.Close>
    </Toast.Root>

    <Toast.Root>
      <Toast.Title />
      <Toast.Description />
      <Toast.Action altText="action" />
      <Toast.Close />
    </Toast.Root>
    <Toast.Viewport />
  </Toast.Provider>
);
