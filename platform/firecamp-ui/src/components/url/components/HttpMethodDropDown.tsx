import { FC, useState } from 'react';
import { Dropdown, Button } from '@firecamp/ui';

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
          tooltip={!isDropDownOpen && toolTip ? toolTip : ''}
          secondary
          withCaret
          sm
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
