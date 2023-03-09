import { FC } from "react";
import classnames from 'classnames';

import { IStatusBar, IPrimaryRegion, ISecondaryRegion } from "./interfaces/StatusBar.interfaces"
import './StatusBar.scss';

/**
 * Firecamp status bar
 */
const StatusBar: FC<IStatusBar>
    & {
        PrimaryRegion: FC<IPrimaryRegion>,
        SecondaryRegion: FC<ISecondaryRegion>
    }
    = ({
        id = '',
        className = '',
        children = ''
    }) => {

        return (
            <div
                tabIndex={1}
                id={id}
                className={classnames(className, "bg-statusBarBackground text-statusBarForeground !border-statusBarBorder text-base flex leading-6")}>
                {children}
            </div>
        );
    };

const PrimaryRegion: FC<IPrimaryRegion> = ({ id = '', children = '' }) => {
    return (
        <div className="flex-1 flex" id={id}>
            {children}
        </div>
    )
}

const SecondaryRegion: FC<ISecondaryRegion> = ({ id = '', children = '' }) => {
    return (
        <div className="ml-auto flex items-center" id={id}>
            {children}
        </div>
    )
}

StatusBar.PrimaryRegion = PrimaryRegion
StatusBar.SecondaryRegion = SecondaryRegion

export default StatusBar;
