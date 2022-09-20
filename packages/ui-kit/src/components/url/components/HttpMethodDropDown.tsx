import { FC, useState, useEffect } from 'react';
import {
  Dropdown,
  Button,
  EButtonSize,
  IDropdownOptions,
  EButtonColor,
} from '@firecamp/ui-kit';

const HttpMethodDropDown: FC<IHttpMethodDropDown> = ({
  id = '',
  className = '',
  dropdownOptions = ['GET', 'POST'],
  selectedOption = '',
  toolTip = '',
  onSelectItem = () => {},
}) => {
  let [isDropDownOpen, toggleDropDown] = useState(false);
  let [options, setOptions] = useState(
    dropdownOptions?.map((o) => {
      return { name: o };
    })
  );

  // Update options
  // useEffect(() => {
  //   let updatedOptions = dropdownOptions?.map((o) => {
  //     return { name: o };
  //   });
  //   if (!updatedOptions != options) setOptions(updatedOptions);
  // }, [dropdownOptions]);

  return (
    <Dropdown
      id={id}
      className={className}
      isOpen={isDropDownOpen}
      selected={selectedOption || ''}
      onToggle={toggleDropDown}
    >
      <Dropdown.Handler>
        <Button
          text={selectedOption}
          withCaret={true}
          size={EButtonSize.Small}
          tooltip={!isDropDownOpen && toolTip ? toolTip : ''}
          color={EButtonColor.Secondary}
        />
      </Dropdown.Handler>
      <Dropdown.Options
        options={options}
        onSelect={(element) => onSelectItem(element?.name)}
      />
    </Dropdown>
  );
};

export default HttpMethodDropDown;

interface IHttpMethodDropDown {

  /**
   * Dropdown unique identity
   */
  id: string;

  /**
   * Custom styling clssname
   */
  className?: string;

  /**
   * Dropdown options
   */
  dropdownOptions: string[]

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
