import Checkbox from './Checkbox';

const CheckboxGroup = ({
  onToggleCheck = (v: {[k: string]: any}) => {},
  checkboxLabel = '',
  showLabel = true,
  list = []
}) => {
  return (
    <div>
      {showLabel ? <label className="cursor-pointer">{checkboxLabel || ''}: </label> : ''}
      <div>
        <div className="flex">
          {list.map((checkbox, index) => {
            return (
              <Checkbox
                key={index}
                isChecked={checkbox.isChecked || false}
                label={checkbox.label || ''}
                showLabel={checkbox.showLabel || false}
                disabled={checkbox.disabled || false}
                onToggleCheck={() =>
                  onToggleCheck({ [checkbox.id]: !checkbox.isChecked })
                }
                className="mr-2"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CheckboxGroup;

