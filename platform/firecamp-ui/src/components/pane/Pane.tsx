import React, { FC, useRef, useState } from "react";
import { IPane, IHeader, IBody } from "./interfaces/Pane.interfaces";
import cx from 'classnames';

import { VscChevronRight } from '@react-icons/all-files/vsc/VscChevronRight';
import { VscChevronDown } from '@react-icons/all-files/vsc/VscChevronDown';
import './Pane.scss';


import ToolBar from "../ToolBar/ToolBar";

const Pane: FC<IPane> & {
    Header: FC<IHeader>,
    Body: FC<IBody>
} = ({
    expanded = false,
    className,
    headerClassName,
    bodyClassName,
    height='',
    headerTitleRenderer = () => <></>,
    headerActionRenderer = () => <></>,
    bodyRenderer = () => <></>,
}) => {
        const [_expanded, toggle] = useState(expanded);
        const _toggle = ()=>toggle(!_expanded)
        const rendererProps = { toggle: _toggle, expanded: _expanded };
        return (<div style={{height: height}} className={cx("pane  flex flex-col overflow-auto", { 'expanded border-b border-app-border !overflow-hidden': _expanded },{'custom-height' : (height != '')}, className)} tabIndex={1}>
            <Pane.Header
                className={headerClassName}
                toggle={_toggle}
                expanded={_expanded}
                titleRenderer={headerTitleRenderer}
                actionRenderer={headerActionRenderer}
              />
               {
                _expanded
                    ? <Pane.Body className={bodyClassName}>
                    { bodyRenderer(rendererProps) }
                </Pane.Body>
                        : ""
                    
                }
              {
                
              }
        </div>);
    };

const Header: FC<IHeader> = ({ titleRenderer, actionRenderer, className, expanded, toggle }) => {

    const actionDomRef = useRef<HTMLDivElement>();
    const onToggle = (e: any)=> {
        if(actionDomRef.current.contains(e.target)) return;
        toggle()
    }
    return (
        <div className={cx("pane-header cursor-pointer border-b border-app-border px-2 py-1", className)} 
             tabIndex={1}
             onClick={onToggle}>
            {
                expanded
                    ? <VscChevronDown size={16} className="mr-1" />
                        : <VscChevronRight size={16} className="mr-1" />
                    
            }
            <div className='pane-title whitespace-pre text-sm'>
                {titleRenderer()}
            </div>
            <div className='pane-action ml-auto' ref={actionDomRef}>
                {actionRenderer()}
            </div>
        </div>
    );
};

const Body: FC<IBody> = ({ children, className }) => {
    return (
        <div className={cx("pane-body p-2 focus-outer", className)} tabIndex={1}>
            {children}
        </div>
    );
};

Pane.Header = Header
Pane.Body = Body

export default Pane;