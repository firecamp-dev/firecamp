import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { VscMenu } from "@react-icons/all-files/vsc/VscMenu";
import Button from "./Button";
import { IButton } from "./interfaces/Button.interfaces";

const Template = (args: IButton) => <Button {...args} />;
const TemplateWithVariant = ({variant}: {variant: IButton[]}) => <div className='flex flex-col gap-2'>{variant.map((args,index) => <div key={index}><Button {...args} /></div>)}</div>

describe("Button : " , () => {

  const BUTTON_SIZE_PADDING = [
    'text-sm py-0 px-1', // xs
    'text-sm py-1 px-2', // sm
    'text-base py-2 px-4',// md
    'text-lg py-3 px-6' // lg
  ]

  test('Primary button should render', () => {
    
    const PrimaryButtonArgs : IButton = { text: 'Primary Button', primary: true, md: true };
    render(<Template {...PrimaryButtonArgs}/>);

    let button = screen.getByRole('button', { name: PrimaryButtonArgs.text });
    if(PrimaryButtonArgs.transparent){
      expect(button).toHaveClass('text-primaryColor !border-primaryColor hover:bg-primaryColor'); 
      if(!PrimaryButtonArgs.ghost){
        expect(button).toHaveClass('text-primaryColorText bg-primaryColor !border-primaryColor'); 
      }
    }else if(!PrimaryButtonArgs.transparent){
      expect(button).toHaveClass('text-primaryColorText bg-primaryColor !border-primaryColor'); 
    }
    
  });
  
  test('Secondary button should render', () => {
    const SecondaryButtonArgs : IButton = { text: 'Secondary Button', secondary: true, md: true };
    render(<Template {...SecondaryButtonArgs}/>);

    let button = screen.getByRole('button', { name: SecondaryButtonArgs.text });
    if(SecondaryButtonArgs.transparent){
      expect(button).toHaveClass('text-app-foreground !border-secondaryColor'); 
    }else if(!SecondaryButtonArgs.transparent){
      expect(button).toHaveClass('text-secondaryColorText bg-secondaryColor !border-secondaryColor'); 
    }
  });

  test('Danger button should render', () => {
    const DangerButtonArgs : IButton = { text: 'Danger Button', danger: true, md: true };
    render(<Template {...DangerButtonArgs}/>);

    let button = screen.getByRole('button', { name: DangerButtonArgs.text });
    if(DangerButtonArgs.transparent){
      expect(button).toHaveClass('text-danger !border-danger'); 
    }else if(!DangerButtonArgs.transparent){
      expect(button).toHaveClass('text-secondaryColorText bg-danger !border-danger'); 
    }
  });
  
  test('Transparent button should render', () => {
    const TransparentButtonArgs : IButton = { text: 'Transparent Button', primary: true, md: true, transparent: true };
    render(<Template {...TransparentButtonArgs}/>);

    let button = screen.getByRole('button', { name: TransparentButtonArgs.text });
    if(TransparentButtonArgs.primary){
      expect(button).toHaveClass('text-primaryColor !border-primaryColor hover:bg-primaryColor');
      if(!TransparentButtonArgs.ghost)
        expect(button).toHaveClass('hover:text-primaryColorText');
    }else if(TransparentButtonArgs.secondary){
      expect(button).toHaveClass('text-app-foreground !border-secondaryColor'); 
    }else if(TransparentButtonArgs.danger){
      expect(button).toHaveClass('text-danger !border-danger'); 
    }
    expect(button).toHaveClass('bg-transparent'); 
  });
  
  test('Ghost button should render', () => {
    const GhostButtonArgs : IButton = { text: 'Ghost Button', primary: true, md: true, ghost: true };
    render(<Template {...GhostButtonArgs}/>);

    let button = screen.getByRole('button', { name: GhostButtonArgs.text });
    expect(button).not.toHaveClass('border hover:text-primaryColorText'); 
    expect(button).toHaveClass('hover:!bg-focusColor'); 
  });

  test('Full Width button should render', () => {
    const FullWidthButtonArgs : IButton = { text: 'FullWidth Button', primary: true, md: true, fullWidth: true };
    render(<Template {...FullWidthButtonArgs}/>);

    let button = screen.getByRole('button', { name: FullWidthButtonArgs.text });
    expect(button).not.toHaveClass('w-max'); 
    expect(button).toHaveClass('w-full'); 
  });

  test('Button with upper case text should render', () => {
    const ButtonWithUpperCaseTextComponentArgs : IButton = { text: 'Button with uppercase text', primary: true, md: true, uppercase: true };
    render(<Template {...ButtonWithUpperCaseTextComponentArgs}/>);

    let button = screen.getByRole('button', { name: ButtonWithUpperCaseTextComponentArgs.text });
    expect(button).toHaveClass('uppercase'); 
  });

  test('Button with different sizes should have appropriate styles', () => {
    const ButtonSizesArgs = {
      variant: [
        { text: 'Extra Small Button', primary: true, xs: true },
        { text: 'Small Button', primary: true, sm: true },
        { text: 'Medium Button', primary: true, md: true },
        { text: 'Large Button', primary: true, lg: true }
      ]
    }
    render(<TemplateWithVariant {...ButtonSizesArgs}/>);

    ButtonSizesArgs.variant.forEach((element: {text: string}, index: number) => {
      let button = screen.getByRole('button', { name: element.text });
      expect(button).toHaveClass(BUTTON_SIZE_PADDING[index]);
    });
  });

  test('Button with icon should render icon at proper position', () => {
    const ButtonIconPosition : {variant: IButton[]}= {
      variant: [
        {
          text: 'Sample Button (with left icon)', 
          primary: true, 
          md: true, 
          icon: <VscMenu
            title="Account"
            size={16}
            className="z-20"
          />, 
          iconLeft: true
        },
        {
          text: 'Sample Button (with right icon)', 
          primary: true, 
          md: true, 
          icon: <VscMenu
            title="Account"
            size={16}
            className="z-20"
          />, 
          iconRight: true
        }
      ]
    };
    render(<TemplateWithVariant {...ButtonIconPosition}/>);
    
    ButtonIconPosition.variant.forEach((element: {text: string, iconLeft: boolean, iconRight: boolean}, index: number) => {
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
    const CaretButtonArgs = { text: 'Button with caret icon', primary: true, md: true, withCaret: true };
    render(<Template {...CaretButtonArgs}/>);
    
    let button = screen.getByRole('button', { name: CaretButtonArgs.text });
    
    let caretElement = button.lastChild;
    expect(caretElement).toHaveClass("ml-2 toggle-arrow");
  });

})
