import { FC } from "react";
import cx from 'classnames';
import { VscTriangleDown } from "@react-icons/all-files/vsc/VscTriangleDown"

import { IButton } from "./interfaces/Button.interfaces";

const Button: FC<IButton> = ({
    id = '',
    className = '',
    text = '',
    icon = '',
    transparent = false,
    ghost = false,

    primary, secondary, danger,
    xs, sm, md, lg,
    iconLeft, iconRight, iconCenter,

    fullWidth = false,
    uppercase = false,
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
                    'text-sm py-0 px-1': xs,
                    'text-sm py-1 px-2': sm,
                    'text-base py-2 px-4': md,
                    'text-lg py-3 px-6': lg,
                    'text-primaryColorText bg-primaryColor !border-primaryColor': primary && !transparent,
                    'text-secondaryColorText bg-secondaryColor !border-secondaryColor': secondary && !transparent,
                    'text-secondaryColorText bg-danger !border-danger': danger && !transparent,
                    'text-primaryColor !border-primaryColor hover:bg-primaryColor': primary && transparent,
                    'hover:text-primaryColorText': primary && transparent && !ghost,
                    'text-appForeground !border-secondaryColor': secondary && transparent,
                    'text-danger !border-danger': danger && transparent,
                    'bg-transparent': transparent == true,
                    'flex-row': iconLeft,
                    'flex-row-reverse': iconRight,
                    'hover:!bg-focusColor': ghost,
                    'cursor-default': (domProps.hasOwnProperty('disabled') && domProps.disabled)
                },
                className
            )}
            onClick={onClick}
            {...domProps}
        >
            { icon }
            {text ? (
                <span className={cx(
                    { 'ml-1': iconLeft && sm },
                    { 'mr-1': iconRight && sm },
                    { 'ml-3': iconLeft && md },
                    { 'mr-3': iconRight && md },
                    { 'ml-4': iconLeft && lg },
                    { 'mr-4': iconRight && lg },
                )}>{text}</span>) : ''}

            {withCaret == true ? (<VscTriangleDown className='ml-2 toggle-arrow' size={12} />) : ('')}
        </button>
    );
};
export default Button;