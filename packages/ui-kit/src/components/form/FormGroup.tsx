//@ts-nocheck
import { FC } from "react";
import cx from 'classnames';
//import '../../scss/tailwind.scss';

import { IFormGroup } from "./interfaces/FormGroup.interfaces"

const FormGroup: FC<IFormGroup> = ({
    id = '',
    className = '',
    label = '',
    error = '',
    children = []
}) => {

    return (
        <div id={id} className={cx(className, 'pb-6')}>
            {label != '' ? (<label className="text-appForeground text-sm mb-1 block">{label}</label>) : ''}
            {children}
            {error && <span className="absolute text-sm text-error">{error}</span>}
        </div>
    );
};
export default FormGroup