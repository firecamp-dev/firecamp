import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import { DocButton, CustomDocButton } from "./DocButton.stories";

describe("Button : " , () => {

  const mountDocButton = () => render(<DocButton {...DocButton.args}/>);
  const mountCustomDocButton = () => render(<CustomDocButton {...CustomDocButton.args}/>);

  const getCustomDocButton = () => screen.getByText(CustomDocButton.args.text);
  const DEFAULT_DOC_BUTTON_VALUES = {
    text: 'Help',
    link: 'https://firecamp.io/docs/',
    target: '_blank',
    className: 'transparent without-padding small',
    showIcon:true,
    iconClassName: 'icon-info-24px-1 font-base fc-button-icon'
  }

  test('Doc button should render with all default props', () => {
    mountDocButton();
    let button = screen.getByText(DocButton.args.text);
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
    mountCustomDocButton();
    let button = getCustomDocButton();
    expect(button).toBeInTheDocument();
    
    if(CustomDocButton.args.link){
      expect(button).toHaveProperty('href', CustomDocButton.args.link);
    }
    if(CustomDocButton.args.target){
      expect(button).toHaveProperty('target', CustomDocButton.args.target);
    }
    if(CustomDocButton.args.className){
      expect(button).toHaveClass(CustomDocButton.args.className);
    }
    if(CustomDocButton.args.showIcon){
      //icon is rendered with default classnames to confirm the showIcon prop & iconClassName prop
      let iconElement = Array.from(button.children)[0];
      if(CustomDocButton.args.iconClassName){
        expect(iconElement).toHaveClass(CustomDocButton.args.iconClassName + 'font-base fc-button-icon');
      }else{
        expect(iconElement).toHaveClass(DEFAULT_DOC_BUTTON_VALUES.iconClassName);
      }
    }else{
      expect(button.children.length).toBe(0);
    }

    if(!["undefined", "null"].includes(typeof CustomDocButton.args.style) && Object.keys(CustomDocButton.args.style).length > 0){
      expect(button).toHaveStyle(CustomDocButton.args.style);
    }else{
      expect(button.style.length).toBe(0);
    }

  })

})
