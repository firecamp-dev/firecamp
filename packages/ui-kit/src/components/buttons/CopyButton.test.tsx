import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from './CopyButton';
import { click } from "../../../__mocks__/eventMock";
import { ICopyButton } from "./interfaces/CopyButton.interfaces";

const CopyButtonWithTextPreviewArgs = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  onCopy: (text: string) => console.log(`copied-text`, text)
}
const CopyButtonWithoutTextPreviewArgs = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: false,
  onCopy: (text: string) => console.log(`copied-text`, text)
};
const CopyButtonWithoutAnimationArgs = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  showText: true,
  animation: false,
  onCopy: (text: string) => console.log(`copied-text-without-animation`, text)
};

const CopyButtonWithCustomComponentArgs = { 
  className: 'border p-3',
  text: 'Copy Button Text' ,
  children: [
    <div key="custom-component" className='h-2 p-3 border border-primaryColor text-primaryColor'>Custom component disables copy functionality</div>
  ]
};

const Template = (args: ICopyButton) => <Button {...args} />;

describe("Button : " , () => {

  const mountCopyButtonWithTextComponent = () => render(<Template {...CopyButtonWithTextPreviewArgs}/>);
  
  const getCopyButton = () => screen.getByTestId('copy-button');
  const getCopyAnimation = () => screen.queryByText(/Copied/i);
  const getCustomComponentByText = () => screen.queryByText(/Custom component disables copy functionality/i);

  test('Copy button should render with a preview of text to be copied', () => {
    mountCopyButtonWithTextComponent();
    let button = screen.getByTestId('copy-button');
    expect(button).toHaveClass('fc-copy bg-gray-800');
    expect(button.textContent).toEqual(CopyButtonWithTextPreviewArgs.text);
  });
  
  test('Copy button should render without a preview of text to be copied', () => {
    render(<Template {...CopyButtonWithoutTextPreviewArgs}/>);
    let button = screen.getByTestId('copy-button');
    
    expect(button).toBeInTheDocument();
    expect(button.textContent).toEqual('');
  });
  
  test('Copy button should render the copied text as animation on click event', async () => {
  
    mountCopyButtonWithTextComponent();
    const button = getCopyButton();
    const copyElement = button.lastChild as HTMLElement;
  
    expect(copyElement).toHaveClass('iconv2-copy-icon');
    click(copyElement);
    await waitFor(() => getCopyButton());
    const animationExist = await getCopyAnimation();
    
    expect(animationExist).toBeInTheDocument();

  });
  
  test('Copy button should render the copy text without animation on click event', async () => {
  
    render(<Template {...CopyButtonWithoutAnimationArgs}/>);
    const button = getCopyButton();
    const copyElement = button.lastChild as HTMLElement;
  
    expect(copyElement).toHaveClass('iconv2-copy-icon');
    click(copyElement);
    await waitFor(() => getCopyButton());
    const animationExist = await getCopyAnimation();
    
      if(CopyButtonWithoutAnimationArgs.animation){
        expect(animationExist).toBeInTheDocument();  
      }else{
        expect(animationExist).toBeNull();  
      }    

  });
  
  test('Copy button should render the custom component', async () => {

    render(<Template {...CopyButtonWithCustomComponentArgs}/>);
    const button = getCopyButton();
    const copyElement = button.lastChild as HTMLElement;
  
    expect(copyElement).not.toHaveClass('iconv2-copy-icon');
    const customComponent = getCustomComponentByText();
    expect(customComponent).toBeInTheDocument();

  });
  

})
