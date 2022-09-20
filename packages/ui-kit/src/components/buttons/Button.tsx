import { FC } from "react";
import cx from 'classnames';
import { VscTriangleDown } from "@react-icons/all-files/vsc/VscTriangleDown"

import { IButton, ESize, EColor, EIconPosition } from "./interfaces/Button.interfaces";

const Button: FC<IButton> = ({
    id = '',
    className = '',
    text = '',
    icon = '',
    iconPosition = '',
    color = EColor.Secondary,
    transparent = false,
    ghost = false,
    size = ESize.Medium,
    fullWidth = false,
    uppercase = false,
    children = [],
    animation = true,
    onClick = () => { },
    withCaret = false,
    tooltip = '',
    ...domProps
}) => {

    return (
        <button
            tabIndex={1}
            key={id}
            id={id}
            data-tip={tooltip}
            className={cx(
                'text-center whitespace-pre cursor-pointer active:--animate-wiggle relative flex items-center rounded-sm justify-center ',
                {
                    'w-full': fullWidth,
                    'uppercase': uppercase,
                    'w-max': !fullWidth,
                    'border': !ghost,
                    'text-sm py-0 px-1': size == ESize.ExSmall,
                    'text-sm py-1 px-2': size == ESize.Small,
                    'text-base py-2 px-4': size == ESize.Medium,
                    'text-lg py-3 px-6': size == ESize.Large,
                    'text-primaryColorText bg-primaryColor !border-primaryColor': (color == EColor.Primary && !transparent),
                    'text-secondaryColorText bg-secondaryColor !border-secondaryColor': (color == EColor.Secondary && !transparent),
                    'text-secondaryColorText bg-danger !border-danger': (color == EColor.Danger && !transparent),
                    'text-primaryColor !border-primaryColor hover:bg-primaryColor': (color == EColor.Primary && transparent),
                    'hover:text-primaryColorText': (color == EColor.Primary && transparent && !ghost),
                    'text-appForeground !border-secondaryColor': (color == EColor.Secondary && transparent),
                    'text-danger !border-danger': (color == EColor.Danger && transparent),
                    'bg-transparent': transparent == true,
                    'flex-row': (iconPosition == EIconPosition.Left),
                    'flex-row-reverse': (iconPosition == EIconPosition.Right),
                    'hover:!bg-focusColor': ghost
                },
                className
            )}
            onClick={onClick}
            {...domProps}
        >
            {(icon != '' && iconPosition != '') ? icon : ''}
            {text ? (
                <span className={cx(
                    { 'ml-1': (iconPosition == EIconPosition.Left && size == ESize.Small) },
                    { 'mr-1': (iconPosition == EIconPosition.Right && size == ESize.Small) },
                    { 'ml-3': (iconPosition == EIconPosition.Left && size == ESize.Medium) },
                    { 'mr-3': (iconPosition == EIconPosition.Right && size == ESize.Medium) },
                    { 'ml-4': (iconPosition == EIconPosition.Left && size == ESize.Large) },
                    { 'mr-4': (iconPosition == EIconPosition.Right && size == ESize.Large) },
                )}>{text}</span>) : ''}

            {withCaret == true ? (<VscTriangleDown className='ml-2 toggle-arrow' size={12} />) : ('')}
        </button>
    );
};
export default Button;