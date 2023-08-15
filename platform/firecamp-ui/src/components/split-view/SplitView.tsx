//@ts-nocheck
import { forwardRef, useEffect, useRef, useState } from 'react';
import cx from "classnames";

import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import 'react-reflex/styles.css'

const SplitViewItemCls = ({
    renderCollapsedComp = () => <span />,
    renderMainComp = () => <span />,
    reflexOptions = {},
    ...props
}) => {

    const nodeRef = useRef();
    let [isCollapsed, setCollapse] = useState(false);
    const { orientation, innerRef } = props;
    let { threshold } = reflexOptions;

    useEffect(() => {
        setTimeout(() => {
            let size = getSize();
            console.log(size, threshold)
            if (size >= 0) {
                if (size < threshold) {
                    setCollapse(true)
                }
                else {
                    isCollapsed === true && setCollapse(false)
                }
            }
        })
    }, [props.flex])

    const getSize = () => {
        switch (orientation) {
            case 'horizontal':
                return innerRef.current?.offsetHeight
            case 'vertical':
                return innerRef.current?.offsetWidth
            default:
                return 0
        }
    }

    let maxSize = isCollapsed ? 24 : "100%";
    return (
        <ReflexElement
            {...reflexOptions}
            className={cx(reflexOptions.className, { [reflexOptions?.collapsedClassName]: isCollapsed })}
            maxSize={maxSize}
            flex={props.flex} //note: props.flex is dynamic, calculated at runtime, where is reflexOptions.flex is static props
        >
            {isCollapsed ? renderCollapsedComp({ innerRef }) : renderMainComp({ innerRef, threshold })}
        </ReflexElement>
    )
}

const SplitViewItem = forwardRef((props, ref) => {
    return <SplitViewItemCls innerRef={ref} {...props} />;
})

 const SplitView = ({
    id = '',
    className = '',
}) => {

    return (
        <ReflexContainer orientation="vertical">

            {
                <SplitViewItem
                    id="leftpane-test"
                    reflexOptions={{
                        flex: 0.2,
                        threshold: 100,
                        className: "left-pane bg-activityBar-background text-activityBar-foreground h-full p-4",
                        collapsedClassName: "left-pane-handler"
                    }}
                    renderCollapsedComp={({ innerRef }) => {
                        return (
                            <div className="pane-content bg-activityBar-background h-full flex justify-center" ref={innerRef}>
                                <button onClick={_ => { }}
                                    className="pane-content bg-activityBar-background h-full text-activityBar-foreground flex align-center flex-col items-center">
                                    <ChevronRight
                                        title="Account"
                                        size={16}
                                    />
                                    <span className="rotate-90 pl-12">Request</span>
                                </button>
                            </div>
                        )
                    }}
                    renderMainComp={({ innerRef, threshold }) => {
                        return (
                            <div className="pane-content" ref={innerRef}>
                                <label>
                                    I will collapse when I get smaller than
                                    &nbsp;{threshold}px
                                </label>
                            </div>
                        )
                    }}
                />
            }

            {<ReflexSplitter propagate={true}
                propagateDimensions={true}
                propagateDimensionsRate={1}
                className="relative"
            />}

            {/* <ReflexElement minSize={100} className="middle-pane p-4">
                        <div className="pane-content">
                            <label>
                                Minimum size: <br/> 100 px
                            </label>
                        </div>
                    </ReflexElement> */}

            {/* { <ReflexSplitter propagate={true}/>} */}

            {

                <SplitViewItem
                    reflexOptions={{
                        flex: 0.2,
                        threshold: 100,
                        className: "right-pane bg-primaryColor h-full text-primaryColor-text p-4",
                        collapsedClassName: "right-pane-handler"
                    }}
                    renderCollapsedComp={({ innerRef }) => {
                        return (
                            <div className="pane-content bg-primaryColor h-full flex justify-center" ref={innerRef}>
                                <button onClick={_ => { }} className="pane-content bg-primaryColor h-full text-primaryColor-text flex align-center flex-col items-center">
                                    <ChevronLeft
                                        // title="Account"
                                        size={16}
                                    />
                                </button>
                            </div>
                        )
                    }}
                    renderMainComp={({ innerRef, threshold }) => {
                        return (
                            <div className="pane-content" ref={innerRef}>
                                <label>
                                    I will collapse when I get smaller than
                                    &nbsp;{threshold}px
                                </label>
                            </div>
                        )
                    }}
                />
            }
        </ReflexContainer>
    );
};

export default SplitView
