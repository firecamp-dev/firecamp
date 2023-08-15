import { FC } from "react";
import cx from 'classnames';
import { AlertTriangle, Check, Info, XCircle } from 'lucide-react';

import { IAlert, EAlertType } from "./Alert.interface";
import './Alert.scss';

const Alert: FC<IAlert> = ({
    id = '',
    className = '',
    text = '',
    withBorder = false,
    
    success=false,
    error=false,
    info=false,
    warning=false
}) => {

    return (
       <div className={
            cx("alert mb-2 p-1 flex items-center relative rounded-sm",className,
                { "text-error border-error": error },
                { "text-info border-info": info },
                { "text-warning border-warning": warning },
                { "text-success border-success": success },
                { "text-transparent border-transparent": !error && !success && !warning && !info },
                { "border" : withBorder})}>
                    { error ? <XCircle /> : "" }
                    { info ? <Info /> : "" }
                    { warning ? <AlertTriangle /> : "" }
                    { success ? <Check /> : "" }
                    <span className="ml-1">{text}</span>
                    <div className={
                        cx(
                            "absolute left-0 right-0 top-0 bottom-0 opacity-10 rounded-sm",
                            { "bg-error": error },
                            { "bg-info": info },
                            { "bg-warning": warning },
                            { "bg-success": success },
                            { "bg-transparent": !error && !success && !warning && !info }
                        )}/>
       </div>
    );
};
export default Alert;