// // TODO : update tests based on new button

// import { useState } from "react";
// import "@testing-library/jest-dom";
// import { screen, render, waitFor } from "@testing-library/react";
// import { default as Modal } from './Modal';
// import Button from "../buttons/Button";
// import { click } from "../../../__mocks__/eventMock";

// // const Template = (args: any) => {
// //     const [isOpen, toggleOpen] = useState(true);

// //     return <div className="bg-app-background h-screen w-screen block">
// //         <Button text={isOpen ? "Close Modal" : "Open Modal"} onClick={() => toggleOpen(true)} data-testid={'togglePreview'} />
// //         <Modal {...args} isOpen={isOpen} onClose={() => toggleOpen(false)}>
// //             <Modal.Header>
// //                 <div className="text-modal-foreground-active text-lg mb-6">Modal Header</div>
// //             </Modal.Header>
// //             <Modal.Body >
// //                 <div>
// //                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
// //                     Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
// //                 </div>
// //             </Modal.Body>
// //             <Modal.Footer>
// //                 <div className="text-sm mt-6">
// //                     Modal Footer
// //                 </div>
// //             </Modal.Footer>
// //         </Modal>
// //     </div>
// // };

// describe("Modal component", () => {

//     test("Validating child element count and styles of modal wrapper", () => {
//         // render(<Template id={'modal-container-div'} />);

//         // const ModalContainer = screen.queryByTestId('root');
//         // const ModalContainerDiv = ModalContainer.querySelector('#modal-container-div');

//         // expect(ModalContainerDiv).toHaveClass('max-w-screen-md min-w-screen-md bg-modal-background text-app-foreground w-full relative z-9999 max-h-modal flex fc-modal-wrapper');
//         // expect(ModalContainerDiv.childElementCount).toBe(3);
    
//     });

//     // test("Validating default classnames for modal children elements", () => {
//     //     render(<Template id={'modal-container-div'} />);

//     //     const ModalContainer = screen.queryByTestId('root');
//     //     const ModalContainerDiv = ModalContainer.querySelector('#modal-container-div');
//     //     const ModalContainerElements = ModalContainerDiv.children;

//     //     //Header - dont have default class names

//     //     //Body
//     //     expect(ModalContainerElements[1]).toHaveClass('flex flex-col overflow-auto')

//     //     //Footer
//     //     expect(ModalContainerElements[2]).toHaveClass('flex')
//     // });

//     // test("should appears/disappers based on button click event", async () => {
//     //     render(<Template id={'modal-container-div'} />);

//     //     // when react-responsive-modal is visible
//     //     const container = screen.queryByTestId('overlay');
//     //     expect(container).toHaveStyle("animation: react-responsive-modal-overlay-in 300ms");

//     //     // validate the button text for popup state
//     //     let button = screen.queryByText('Close Modal');
//     //     expect(button).toBeInTheDocument();

//     //     // modal should not be visible after clicking close button
//     //     const ClosePopupButton = screen.queryByTestId("close-button");
//     //     click(ClosePopupButton);

//     //     button = await waitFor(() => screen.queryByText('Open Modal'));
//     //     expect(button).toBeInTheDocument();

//     //     // visibility of react-responsive-modal is seen by update in style property 
//     //     expect(container).toHaveStyle("animation: react-responsive-modal-overlay-out 300ms");
//     // });

// });
