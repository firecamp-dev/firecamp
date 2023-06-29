import { FC, useState } from 'react';
import cx from 'classnames';
import { DropdownMenu, Button } from '@firecamp/ui';

const HttpMethodDropDown: FC<IHttpMethodDropDown> = ({
  id = '',
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
    classNames={{
      dropdown: '-mt-2',
    }}
    width={70}
    sm
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
