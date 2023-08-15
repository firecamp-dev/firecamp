//@ts-nocheck
import { FC } from "react";
import { Menu as MenuIcon } from 'lucide-react';
import {
    Menu,
    MenuItem,
    MenuButton,
    SubMenu
} from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';
import '@szhsin/react-menu/dist/transitions/slide.css';

import { IMenuBar } from "./interfaces/MenuBar.interfaces"

const MenuBar: FC<IMenuBar> = ({
    id = '',
    className = '',
    menu = [],
}) => {
    return (
        <Menu className="menubar"
            key='right'
            direction='right'
            align='start'
            menuButton={
                <MenuButton>
                    <MenuIcon
                        title="Account"
                        size={40}
                        height={40}
                    />
                </MenuButton>
            }
            height={40}
            transition>
            <MenuItem>New File</MenuItem>
            <SubMenu label="Open">
                <MenuItem>index.html</MenuItem>
                <MenuItem>example.js</MenuItem>
                <SubMenu label="Styles">
                    <MenuItem>about.css</MenuItem>
                    <MenuItem>home.css</MenuItem>
                    <MenuItem>index.css</MenuItem>
                </SubMenu>
            </SubMenu>
            <MenuItem>Save</MenuItem>
        </Menu>
    );
};


export default MenuBar

MenuBar.defaultProps = {
    id: null,
    className: null,
    menu: []
};

