import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import {PrimaryButton, SecondaryButton, DangerButton, TransparentButton, GhostButton, FullWidthButton, ButtonWithUpperCaseText, ButtonSizes, ButtonIconPosition, CaretButton} from "./Button.stories";

describe("Button : " , () => {

  const BUTTON_SIZE_PADDING = [
    'text-sm py-0 px-1', // xs
    'text-sm py-1 px-2', // sm
    'text-base py-2 px-4',// md
    'text-lg py-3 px-6' // lg
  ]

  const mountPrimaryButtonComponent = () => render(<PrimaryButton {...PrimaryButton.args}/>);
  const mountSecondaryButtonComponent = () => render(<SecondaryButton {...SecondaryButton.args}/>);
  const mountDangerButtonComponent = () => render(<DangerButton {...DangerButton.args}/>);
  const mountTransparentButtonComponent = () => render(<TransparentButton {...TransparentButton.args}/>);
  const mountGhostButtonComponent = () => render(<GhostButton {...GhostButton.args}/>);
  const mountFullWidthButtonComponent = () => render(<FullWidthButton {...FullWidthButton.args}/>);
  const mountButtonWithUpperCaseTextComponent = () => render(<ButtonWithUpperCaseText {...ButtonWithUpperCaseText.args}/>);
  const mountButtonSizesComponent = () => render(<ButtonSizes {...ButtonSizes.args}/>);
  const mountButtonIconPositionComponent = () => render(<ButtonIconPosition {...ButtonIconPosition.args}/>);
  const mountCaretButtonComponent = () => render(<CaretButton {...CaretButton.args}/>);
  
  test('Primary button should render', () => {
    mountPrimaryButtonComponent();
    let button = screen.getByRole('button', { name: PrimaryButton.args.text });
    if(PrimaryButton.args.transparent){
      expect(button).toHaveClass('text-primaryColor !border-primaryColor hover:bg-primaryColor'); 
      if(!PrimaryButton.args.ghost){
        expect(button).toHaveClass('text-primaryColorText bg-primaryColor !border-primaryColor'); 
      }
    }else if(!PrimaryButton.args.transparent){
      expect(button).toHaveClass('text-primaryColorText bg-primaryColor !border-primaryColor'); 
    }
    
  });
  
  test('Secondary button should render', () => {
    mountSecondaryButtonComponent();
    let button = screen.getByRole('button', { name: SecondaryButton.args.text });
    if(SecondaryButton.args.transparent){
      expect(button).toHaveClass('text-appForeground !border-secondaryColor'); 
    }else if(!SecondaryButton.args.transparent){
      expect(button).toHaveClass('text-secondaryColorText bg-secondaryColor !border-secondaryColor'); 
    }
  });

  test('Danger button should render', () => {
    mountDangerButtonComponent();
    let button = screen.getByRole('button', { name: DangerButton.args.text });
    if(DangerButton.args.transparent){
      expect(button).toHaveClass('text-danger !border-danger'); 
    }else if(!DangerButton.args.transparent){
      expect(button).toHaveClass('text-secondaryColorText bg-danger !border-danger'); 
    }
  });
  
  test('Transparent button should render', () => {
    mountTransparentButtonComponent();
    let button = screen.getByRole('button', { name: TransparentButton.args.text });
    if(TransparentButton.args.primary){
      expect(button).toHaveClass('text-primaryColor !border-primaryColor hover:bg-primaryColor');
      if(!TransparentButton.args.ghost)
        expect(button).toHaveClass('hover:text-primaryColorText');
    }else if(TransparentButton.args.secondary){
      expect(button).toHaveClass('text-appForeground !border-secondaryColor'); 
    }else if(TransparentButton.args.danger){
      expect(button).toHaveClass('text-danger !border-danger'); 
    }
    expect(button).toHaveClass('bg-transparent'); 
  });
  
  test('Ghost button should render', () => {
    mountGhostButtonComponent();
    let button = screen.getByRole('button', { name: GhostButton.args.text });
    expect(button).not.toHaveClass('border hover:text-primaryColorText'); 
    expect(button).toHaveClass('hover:!bg-focusColor'); 
  });

  test('Full Width button should render', () => {
    mountFullWidthButtonComponent();
    let button = screen.getByRole('button', { name: FullWidthButton.args.text });
    expect(button).not.toHaveClass('w-max'); 
    expect(button).toHaveClass('w-full'); 
  });

  test('Button with upper case text should render', () => {
    mountButtonWithUpperCaseTextComponent();
    let button = screen.getByRole('button', { name: ButtonWithUpperCaseText.args.text });
    expect(button).toHaveClass('uppercase'); 
  });

  test('Button with different sizes should have appropriate styles', () => {
    mountButtonSizesComponent();
    ButtonSizes.args.variant.forEach((element: {text: string}, index: number) => {
      let button = screen.getByRole('button', { name: element.text });
      expect(button).toHaveClass(BUTTON_SIZE_PADDING[index]);
    });
  });

  test('Button with icon should render icon at proper position', () => {
    mountButtonIconPositionComponent();
    ButtonIconPosition.args.variant.forEach((element: {text: string, iconLeft: boolean, iconRight: boolean}, index: number) => {
      let button = screen.getByText(element.text);
      if(element.iconLeft){
        expect(button.parentElement).toHaveClass("flex-row");
        expect(button).not.toHaveClass("mr-1 mr-3 mr-4");
      }else{
        expect(button.parentElement).toHaveClass("flex-row-reverse");
        expect(button).not.toHaveClass("ml-1 ml-3 ml-4");
      }
      
    });
  });

  test('Button with caret icon should render ', () => {
    mountCaretButtonComponent();
    let button = screen.getByRole('button', { name: CaretButton.args.text });
    
    let caretElement = button.lastChild;
    expect(caretElement).toHaveClass("ml-2 toggle-arrow");
  });

})
