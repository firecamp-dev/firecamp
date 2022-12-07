import {render, screen, waitFor} from "@testing-library/react";
import "@testing-library/jest-dom";
import {CopyButtonWithTextPreview, CopyButtonWithoutTextPreview, CopyButtonWithoutAnimation, CopyButtonWithCustomComponent} from "./CopyButton.stories";
import { click } from "../../../__mocks__/eventMock";

describe("Button : " , () => {

  const mountCopyButtonWithTextComponent = () => render(<CopyButtonWithTextPreview {...CopyButtonWithTextPreview.args}/>);
  const mountCopyButtonWithoutTextComponent = () => render(<CopyButtonWithoutTextPreview {...CopyButtonWithoutTextPreview.args}/>);
  const mountCopyButtonWithoutAnimationTextComponent = () => render(<CopyButtonWithoutAnimation {...CopyButtonWithoutAnimation.args}/>);
  const mountCopyButtonWithCustomComponent = () => render(<CopyButtonWithCustomComponent {...CopyButtonWithCustomComponent.args}/>);
  
  const getCopyButton = () => screen.getByTestId('copy-button');
  const getCopyAnimation = () => screen.queryByText(/Copied/i);
  const getCustomComponentByText = () => screen.queryByText(/Custom component disables copy functionality/i);

  test('Copy button should render with a preview of text to be copied', () => {
    mountCopyButtonWithTextComponent();
    let button = screen.getByTestId('copy-button');
    expect(button).toHaveClass('fc-copy bg-gray-800');
    expect(button.textContent).toEqual(CopyButtonWithTextPreview.args.text);
  });
  
  test('Copy button should render without a preview of text to be copied', () => {
    mountCopyButtonWithoutTextComponent();
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
  
    mountCopyButtonWithoutAnimationTextComponent();
    const button = getCopyButton();
    const copyElement = button.lastChild as HTMLElement;
  
    expect(copyElement).toHaveClass('iconv2-copy-icon');
    click(copyElement);
    await waitFor(() => getCopyButton());
    const animationExist = await getCopyAnimation();
    
      if(CopyButtonWithoutAnimation.args.animation){
        expect(animationExist).toBeInTheDocument();  
      }else{
        expect(animationExist).toBeNull();  
      }    

  });
  
  test('Copy button should render the custom component', async () => {
  
    mountCopyButtonWithCustomComponent();
    const button = getCopyButton();
    const copyElement = button.lastChild as HTMLElement;
  
    expect(copyElement).not.toHaveClass('iconv2-copy-icon');
    const customComponent = getCustomComponentByText();
    expect(customComponent).toBeInTheDocument();

  });
  

})
