import {PrimaryButton} from "./Button.stories";
import {render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Primary Button : " , () =>{
  test('Should Render', () => {
    render(<PrimaryButton {...PrimaryButton.args}/>);
    let button = screen.getByText("Primary Button"); 
    expect(button).toBeInTheDocument(); 
  });

})
