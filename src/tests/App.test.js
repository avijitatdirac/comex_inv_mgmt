import React from "react";
import ReactDOM from "react-dom";

import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { shallow } from "enzyme";

import App from "../App";
Enzyme.configure({ adapter: new Adapter() });

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe("Test App Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it("Should have Header component as child", () => {
    let header = wrapper.find("Header");
    expect(header).toHaveLength(1);
  });
  it("Should have SideMenu component as child", () => {
    let sideMenu = wrapper.find("SideMenu");
    expect(sideMenu).toHaveLength(1);
  });

  it("Should have 'outer-container' div", () => {
    expect(wrapper.find("div#outer-container")).toHaveLength(1);
  });

  it('should have a div with id "page-wrap"', () => {
    let div = wrapper.find("div#page-wrap");
    expect(div).toHaveLength(1);
  });
});
