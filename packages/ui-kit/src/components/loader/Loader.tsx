//@ts-nocheck
import React, { FC } from "react";

import { ILoader } from "./interfaces/Loader.interfaces";
import './Loader.scss';


const Loader: FC<ILoader> = React.forwardRef((ref) => {

    return (
        <div className="flex w-16 items-center text-appForegroundInActive loader">Loading<span className="wave-loader overflow-hidden">...</span></div>
    );

})

export default Loader;
