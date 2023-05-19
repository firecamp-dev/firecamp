import "@testing-library/jest-dom";
import { screen, render } from "@testing-library/react";
import Help from "./Help";
import { IHelp } from "./interfaces/Help.interfaces";

const HelpComponentArgs: IHelp = {
    docLink: 'https://firecamp.io/',
    client: 'New issue'
}

describe("Help & Support component", () => {

    test("validating the component styles using classname", () => {
        const { container } = render(<Help {...HelpComponentArgs} />);
        const HelpComponentDiv = container.firstElementChild;

        //validating wrapper component class name
        expect(HelpComponentDiv).toHaveClass('absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-app-foreground');

        //validating links wrapper class name
        const linkWrapper = HelpComponentDiv.firstElementChild;
        expect(linkWrapper).toHaveClass('flex flex-col opacity-50');

        //validating the link element length & its wrapper div class name for theme color & text size
        const allLink = screen.getAllByRole('link');
        expect(allLink).toHaveLength(3);

        expect(allLink[0].parentElement).toHaveClass('text-app-foreground-inactive flex items-center mb-2 text-xl')
    });

    test("validating the default links ", () => {
        render(<Help />);

        const allLink = screen.getAllByRole('link');
        expect(allLink[0]).toHaveAttribute('href', 'https://firecamp.io/docs/');
        expect(allLink[1]).toHaveAttribute('href', 'https://github.com/firecamp-io/firecamp/issues/new?assignees=&labels=&template=bug_report.md&title=[http]%20Title%20or%20Feature%20request');
        expect(allLink[2]).toHaveAttribute('href', 'https://discord.com/invite/8hRaqhK');
        
    });

    test("validating the dynamic link for the documentation", () => {
         render(<Help {...HelpComponentArgs} />);

        const allLink = screen.getAllByRole('link');
        expect(allLink[0]).toHaveAttribute('href', HelpComponentArgs.docLink);
        expect(allLink[0]).toHaveClass('text-app-foreground-inactive');
    });

    test("validating the dynamic title to raise a new github issue", () => {
        render(<Help {...HelpComponentArgs} />);

        const allLink = screen.getAllByRole('link');
        expect(allLink[1]).toHaveAttribute('href', `https://github.com/firecamp-io/firecamp/issues/new?assignees=&labels=&template=bug_report.md&title=[${HelpComponentArgs.client}]%20Title%20or%20Feature%20request`);
        expect(allLink[1]).toHaveClass('text-app-foreground-inactive');

    });

});