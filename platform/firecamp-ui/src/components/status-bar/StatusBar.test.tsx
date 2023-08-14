import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { Twitter } from 'lucide-react';
import { default as StatusBar } from './StatusBar';

const Template = (args: any = {}) => {
    return <StatusBar {...args.StatusBar} >
        {
            (typeof args.PrimaryRegion !== "undefined" || typeof args.SecondaryRegion !== "undefined") &&
            (<>
                {typeof args.PrimaryRegion !== "undefined" && (<StatusBar.PrimaryRegion {...args.PrimaryRegion} />)}
                {typeof args.SecondaryRegion !== "undefined" && (<StatusBar.SecondaryRegion {...args.SecondaryRegion} />)}
            </>)
        }
    </StatusBar>
}

describe("StatusBar component", () => {

    test("should render the wrapper div with provided props", () => {
        let { container } = render(<Template
            StatusBar={{ id: "status-bar-wrapper", className: "className" }}
            PrimaryRegion={{ id: "status-bar-primary-region-id", children: 'My workspace' }}
            SecondaryRegion={{ id: "status-bar-secondary-region-id", children: <Twitter data-testid="twitter-icon" /> }}
        />);
        let StatusBarWrapper = container.firstElementChild;
        let PrimaryRegion = StatusBarWrapper.firstElementChild;
        let SecondaryRegion = StatusBarWrapper.lastElementChild;

        //validate the wrapper component attributes
        expect(StatusBarWrapper).toHaveClass('className bg-statusBar-background text-statusBar-foreground !border-statusBar-border text-base flex leading-6');
        expect(StatusBarWrapper.id).toBe("status-bar-wrapper");
        expect(Number(StatusBarWrapper.getAttribute('tabindex'))).toBe(1);

        expect(StatusBarWrapper.childElementCount).toBe(2);

        //validate primary region props
        expect(PrimaryRegion.id).toBe("status-bar-primary-region-id");
        expect(PrimaryRegion).toHaveClass('flex-1 flex');
        expect(PrimaryRegion.textContent).toBe('My workspace');

        //validate secondary region props
        expect(SecondaryRegion.id).toBe("status-bar-secondary-region-id");
        expect(SecondaryRegion).toHaveClass('ml-auto flex items-center');
        expect(screen.getByTestId('twitter-icon')).toBeInTheDocument();

    });

    test("should render with primary region only", () => {
        let { container } = render(<Template
            StatusBar={{ id: "status-bar-wrapper" }}
            PrimaryRegion={{ id: "status-bar-primary-region-id", children: 'My workspace' }} />);
        let StatusBarWrapper = container.firstElementChild;
        let PrimaryRegion = StatusBarWrapper.firstElementChild;

        //validate wrapper children count
        expect(StatusBarWrapper.childElementCount).toBe(1);

        //validate primary region props
        expect(PrimaryRegion.id).toBe("status-bar-primary-region-id");
        expect(PrimaryRegion).toHaveClass('flex-1 flex');
        expect(PrimaryRegion.textContent).toBe('My workspace');

    });

    test("should render with secondary region only", () => {
        let { container } = render(<Template
            StatusBar={{ id: "status-bar-wrapper" }}
            SecondaryRegion={{ id: "status-bar-secondary-region-id", children: 'My workspace' }} />);
        let StatusBarWrapper = container.firstElementChild;
        let SecondaryRegion = StatusBarWrapper.firstElementChild;

        //validate wrapper children count
        expect(StatusBarWrapper.childElementCount).toBe(1);

        //validate secondary region props
        expect(SecondaryRegion.id).toBe("status-bar-secondary-region-id");
        expect(SecondaryRegion).toHaveClass('ml-auto flex items-center');
        expect(SecondaryRegion.textContent).toBe('My workspace');

    });
});