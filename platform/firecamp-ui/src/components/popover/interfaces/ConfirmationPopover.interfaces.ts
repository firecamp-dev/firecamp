import { EPopoverPosition } from './Popover.interfaces';

export interface IConfirmationPopover {
  /**
   * To specify the id for the popover which will be used with handler / tooltip
   */
  id?: string;

  /**
   * It specifies one or more class names
   */
  className?: string;

  /**
   * Popover position
   */
  position?: EPopoverPosition;

  /**
   * To specify the custom handler for the ConfirmationPopover
   */
  handler?: any;

  /**
   * To specify the title displayed into popover container
   */
  title?: string;

  /**
   * To specify the custom message displayed into popover container
   */
  message?: string;

  /**
   * To set the placement for the popover
   */
  placement?: string;
  /**
   * To provide the additional details for using default handler(display icon, text, tooltip, confirm/cancel button text) if custom handler is not provided
   */
  _meta?: I_Meta;

  /**
   * To specify the function executed on affirmation from the user
   */
  onConfirm?: () => void;

  /**
   * To toggle the confirmation display as open/close & need to pass detach as false
   */
  isOpen?: boolean;

  /**
   * Detach the component (use as an individual component).
   */
  detach?: boolean;

  /**
   * To specify the function on toggle event of the handler provided & need to pass detach as false
   */
  onToggle?: (isOpen: boolean) => any;
}

interface I_Meta {
  showDefaultHandler?: boolean;
  showDeleteIcon?: boolean;
  defaultHandlerText?: string;
  tooltip?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}
