import { Fragment } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import cx from 'classnames';
import {
    IDropdownV2,
    IOptionsV2,
    IItemV2,
} from './interfaces/Dropdown.interfaces';

const DEFAULT_STYLES = {
    disabled: 'opacity-50',
    optionContainerDefault1: 'rounded bg-appBackground border border-appForeground',
    optionContainerDefault2: 'border border-focusBorder focus-visible:!shadow-none',
    nestedOptionTrigger: 'flex items-center',
    optionItem: 'flex items-center text-appForeground px-2',
    separator: 'my-1 bg-appForeground opacity-50'
}

//TODO: use enum in place const

// DropDownV2 is used in Invite Popup
const DropDownV2 = ({
    showOptionArrow = false, handleRenderer, options, onSelect, 
    displayDefaultOptionClassName = 0,  disabled = false,
    optionContainerClassName = "",className = '',
}: IDropdownV2) => {

    return (<DropdownMenu.Root>

        <DropdownMenu.Trigger className={cx({  [DEFAULT_STYLES.disabled] : disabled })} disabled={disabled} asChild>
            <span className={className}>{handleRenderer()}
            </span>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
            <DropdownMenu.Content className={cx(
                { [DEFAULT_STYLES.optionContainerDefault1]: displayDefaultOptionClassName === 1 },
                { [DEFAULT_STYLES.optionContainerDefault2]: displayDefaultOptionClassName === 2 },
                {"d-none border-0": options.length === 0},
                optionContainerClassName)}
                sideOffset={5}>

                {
                    options.map((item) => {
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
                                onClick={() => onSelect(item)} />
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
        <DropdownMenu.SubTrigger className={cx([DEFAULT_STYLES.nestedOptionTrigger], { [DEFAULT_STYLES.disabled] : disabled })} disabled={disabled} asChild>
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
                    { [DEFAULT_STYLES.optionContainerDefault1]: displayDefaultOptionClassName === 1 },
                    { [DEFAULT_STYLES.optionContainerDefault2]: displayDefaultOptionClassName === 2 },
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
        className={cx({ [DEFAULT_STYLES.optionItem]: defaultItemClass }, className, { [DEFAULT_STYLES.disabled] : disabled })}
        disabled={disabled}
        onClick={onClick}>
        {typeof prefix === 'function' && prefix()}
        {text}
        {typeof postfix === 'function' && postfix()}
    </DropdownMenu.Item>
};
const Separator = () => {
    return (<DropdownMenu.Separator className={DEFAULT_STYLES.separator} style={{ height: "1px" }} />
    );
};

export default DropDownV2;