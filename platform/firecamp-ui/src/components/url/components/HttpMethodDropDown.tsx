import { FC, useState } from 'react';
import cx from 'classnames';
import { Button, DropdownMenu } from '@firecamp/ui';

const HttpMethodDropDown: FC<IHttpMethodDropDown> = ({
  id = '',
  className = '',
  dropdownOptions = ['GET', 'POST'],
  selectedOption = '',
  toolTip = '',
  onSelectItem = () => {},
}) => {
  const [isDropDownOpen, toggleDropDown] = useState(false);
  const [options] = useState(
    dropdownOptions?.map((o) => {
      return { name: o };
    })
  );

  return (
    <DropdownMenu
      id={id}
      onOpenChange={(v) => toggleDropDown(v)}
      handleRenderer={() => (
        <Button
          text={selectedOption}
          className={cx({ open: isDropDownOpen })}
          tooltip={!isDropDownOpen && toolTip ? toolTip : ''}
          secondary
          withCaret
          sm
        />
      )}
      selected={selectedOption || ''}
      options={options}
      onSelect={(element) => onSelectItem(element?.name)}
      width={70}
      classNames={{
        dropdown: 'pt-0 pb-2 -mt-2',
        item: '!text-sm !py-1 !px-2 !leading-[18px]',
      }}
    />
  );
};

export default HttpMethodDropDown;

interface IHttpMethodDropDown {
  /**
   * Dropdown unique id
   */
  id: string;

  /**
   * Custom styling class name
   */
  className?: string;

  /**
   * Dropdown options
   */
  dropdownOptions: string[];

  /**
   * Selected dropdown option
   */
  selectedOption: string;

  /**
   * Selected option tooltip
   */
  toolTip?: string;

  /**
   * On select dropdown option
   */
  onSelectItem: (name: string) => void;
}
