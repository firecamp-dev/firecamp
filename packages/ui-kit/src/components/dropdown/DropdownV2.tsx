import { Fragment } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import {
    IDropdownV2,
    IOptionsV2,
    IItemV2,
} from './interfaces/Dropdown.interfaces';

const DropDownV2 = ({
    showOptionArrow = false, handleRenderer, option, onSelect, optionContainerClassName = "",
    displayDefaultOptionClassName = 0, className = '', disabled = false
}: IDropdownV2) => {

    return (<DropdownMenu.Root>

        <DropdownMenu.Trigger className={cx({ 'opacity-50': disabled })} disabled={disabled} asChild>
            <span className={className}>{handleRenderer()}
            </span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content className={cx(
                { "rounded bg-appBackground border border-appForeground ": displayDefaultOptionClassName === 1 },
                { "border border-focusBorder focus-visible:!shadow-none": displayDefaultOptionClassName === 2 },
                optionContainerClassName)}
                sideOffset={5}>

                {
                    option.map((item) => {
                        if (item.list !== undefined) {
                            return <Fragment key={item.id}>
                                <DropDownNested className={item.className}
                                    selectedElement={item.name}
                                    onSelect={onSelect}
                                    list={item.list}
                                    postfix={item.postfix}
                                    prefix={item.prefix}
                                    disabled={item.disabled}
                                    displayDefaultOptionClassName={displayDefaultOptionClassName}
                                    optionContainerClassName={item.optionContainerClassName}
                                />
                                {item.showSeparator && <Separator />}
                            </Fragment>
                        }
                        return <Fragment key={item.id}>
                            <Item
                                className={item.className}
                                text={item.name}
                                prefix={item.prefix}
                                postfix={item.postfix}
                                disabled={item.disabled}
                                onClick={() => onSelect(item.name)} />
                            {item.showSeparator && <Separator />}
                        </Fragment>
                    })
                }

                {showOptionArrow && <DropdownMenu.Arrow />}
            </DropdownMenu.Content>

        </DropdownMenu.Portal>
    </DropdownMenu.Root>
    );
};
const DropDownNested = ({ postfix, prefix, selectedElement, list, onSelect, className = '', displayDefaultOptionClassName = 0, optionContainerClassName = '', disabled = false }: IOptionsV2) => {

    return <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger className={cx('flex items-center', { 'opacity-50': disabled })} disabled={disabled} asChild>
            <span>
                {typeof prefix === 'function' && prefix()}
                <span className={className}>
                    {selectedElement}
                </span>
                {typeof postfix === 'function' && postfix()}
            </span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.Portal>
            <DropdownMenu.SubContent
                className={cx(
                    { "rounded bg-appBackground border border-appForeground ": displayDefaultOptionClassName === 1 },
                    { "border border-focusBorder focus-visible:!shadow-none": displayDefaultOptionClassName === 2 },
                    optionContainerClassName)}
                sideOffset={5}
                alignOffset={0}
            >
                {
                    list.map((item) => {
                        if (item.list !== undefined) {
                            return <Fragment key={item.id}>
                                <DropDownNested
                                    selectedElement={item.name}
                                    className={item.className}
                                    onSelect={onSelect}
                                    list={item.list}
                                    postfix={item.postfix}
                                    prefix={item.prefix}
                                    disabled={item.disabled}
                                    displayDefaultOptionClassName={displayDefaultOptionClassName}

                                />
                                {item.showSeparator && <Separator />}
                            </Fragment>
                        }
                        return <Fragment key={item.id}>
                            <Item
                                className={item.className}
                                text={item.name}
                                prefix={item.prefix}
                                postfix={item.postfix}
                                disabled={item.disabled}
                                onClick={() => onSelect(item.name)} />
                            {item.showSeparator && <Separator />}
                        </Fragment>
                    })
                }
                <DropdownMenu.Arrow />
            </DropdownMenu.SubContent>
        </DropdownMenu.Portal>
    </DropdownMenu.Sub>

};
const Item = ({ text, onClick, disabled = false, prefix, postfix, className = '', defaultItemClass = true }: IItemV2) => {
    return <DropdownMenu.Item
        className={cx({ 'flex items-center text-appForeground px-2': defaultItemClass }, className, { 'opacity-50': disabled })}
        disabled={disabled}
        onClick={onClick}>
        {typeof prefix === 'function' && prefix()}
        {text}
        {typeof postfix === 'function' && postfix()}
    </DropdownMenu.Item>
};
const Separator = () => {
    return (<DropdownMenu.Separator className="my-1 bg-appForeground opacity-50 " style={{ height: "1px" }} />
    );
};

export default DropDownV2;