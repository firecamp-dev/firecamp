import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

import Button from './DocButton';
import { IDocButton } from "./interfaces/DocButton.interfaces";

const Template = (args: IDocButton) => <Button {...args} />;
const DocButtonArgs = { 
  text: 'Help',
  link:"",
  className:"",
  iconClassName: ""
};
const CustomDocButtonArgs = { 
  text: 'Custom Help Text',
  link: 'https://firecamp.io/',
  className: 'p-3',
  showIcon: false,
  iconClassName: 'ic-info-24px-1 font-base',
  style: {
    background: "coral"
  },
  target: "_blank"
};


describe("Button : " , () => {

  const getCustomDocButton = () => screen.getByText(CustomDocButtonArgs.text);
  const DEFAULT_DOC_BUTTON_VALUES = {
    text: 'Help',
    link: 'https://firecamp.io/docs/',
    target: '_blank',
    className: 'transparent without-padding',
    showIcon:true,
    iconClassName: 'fc-button-icon'
  }

  test('Doc button should render with all default props', () => {
    render(<Template {...DocButtonArgs}/>);
    let button = screen.getByText(DocButtonArgs.text);
    expect(button).toBeInTheDocument();
    expect(button).toHaveProperty('href', DEFAULT_DOC_BUTTON_VALUES.link);
    expect(button).toHaveProperty('target', DEFAULT_DOC_BUTTON_VALUES.target);
    expect(button).toHaveClass(DEFAULT_DOC_BUTTON_VALUES.className);

    //icon is rendered with default classnames to confirm the showIcon prop & iconClassName prop
    let iconElement = Array.from(button.children)[0];
    expect(iconElement).toHaveClass(DEFAULT_DOC_BUTTON_VALUES.iconClassName);
    expect(button.style.length).toBe(0);
  });

  test('Doc button should render provided classname or have the default classname', () => {
    render(<Template {...CustomDocButtonArgs}/>);
    
    let button = getCustomDocButton();
    expect(button).toBeInTheDocument();
    
    if(CustomDocButtonArgs.link){
      expect(button).toHaveProperty('href', CustomDocButtonArgs.link);
    }
    if(CustomDocButtonArgs.target){
      expect(button).toHaveProperty('target', CustomDocButtonArgs.target);
    }
    if(CustomDocButtonArgs.className){
      expect(button).toHaveClass(CustomDocButtonArgs.className);
    }
    if(CustomDocButtonArgs.showIcon){
      //icon is rendered with default classnames to confirm the showIcon prop & iconClassName prop
      let iconElement = Array.from(button.children)[0];
      if(CustomDocButtonArgs.iconClassName){
        expect(iconElement).toHaveClass(CustomDocButtonArgs.iconClassName + 'font-base fc-button-icon');
      }else{
        expect(iconElement).toHaveClass(DEFAULT_DOC_BUTTON_VALUES.iconClassName);
      }
    }else{
      expect(button.children.length).toBe(0);
    }

    if(!["undefined", "null"].includes(typeof CustomDocButtonArgs.style) && Object.keys(CustomDocButtonArgs.style).length > 0){
      expect(button).toHaveStyle(CustomDocButtonArgs.style);
    }else{
      expect(button.style.length).toBe(0);
    }

  })

})
