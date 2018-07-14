import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow } from "enzyme";

import { Form } from "semantic-ui-react";
import AddInventory from "../pages/AddInventory";

Enzyme.configure({ adapter: new Adapter() });
describe("Test AddInventory Component", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<AddInventory />);
  });

  it('Should have a div with class name "page"', () => {
    let div = wrapper.find("div.page");
    expect(div).toHaveLength(1);
  });

  it('Should have a h3 tag with text as "Add Items To Inventory"', () => {
    let h3 = wrapper.find("h3");
    expect(h3.text()).toEqual("Add Items To Inventory");
  });

  describe("Test First Segment", () => {
    let segment;
    beforeEach(() => {
      segment = wrapper.find("Segment");
    });
    it("Should have at one child Segment", () => {
      expect(segment).toHaveLength(1);
    });

    describe("Test Form", () => {
      let form;
      beforeEach(() => {
        form = segment.find("Form");
      });

      it("Segment should have a child Form", () => {
        expect(form).toHaveLength(1);
      });

      it('Form should have FormSelect with label "Inventory Source:"', () => {
        let formSelect = form.find("FormSelect");
        expect(formSelect.props().label).toEqual("Inventory Source:");
      });

      it("Form should have FormSelect with props size = small", () => {
        let formSelect = form.find("FormSelect");
        expect(formSelect.props().size).toEqual("small");
      });

      it("Form should have FormSelect with props options", () => {
        let formSelect = form.find("FormSelect");
        expect(Object.keys(formSelect.props())).toContain("options");
      });

      it('Form should have FormSelect with props placeholder = "Please select Inventory Source"', () => {
        let formSelect = form.find("FormSelect");
        expect(formSelect.props().placeholder).toEqual(
          "Please select Inventory Source"
        );
      });

      it('Form Select should have style props with {width: "400px"}', () => {
        let formSelect = form.find("FormSelect");
        let style = formSelect.props().style;
        expect(style).toMatchObject({ maxWidth: "400px" });
      });
    });
  });
});
