import React, { Component } from "react";
import {
  Segment,
  Header,
  Divider,
  Form,
  Radio,
  Button,
  Icon
} from "semantic-ui-react";

class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBy: "name",
      searchByValue: ""
    };

    this.changeSearchBy = this.changeSearchBy.bind(this);
    this.changeSearchByValue = this.changeSearchByValue.bind(this);
    this.onAddCustomer = this.onAddCustomer.bind(this);
    this.onSearch = this.onSearch.bind(this);
  }

  changeSearchBy(e, { value }) {
    this.setState({ searchBy: value });
  }

  changeSearchByValue(e) {
    const value = e.target.value;
    this.setState({ searchByValue: value });
  }

  onSearch() {
    console.log("onSearch");
  }

  onAddCustomer() {
    console.log("onAddCustomer");
    this.props.history.push("/customer-details");
  }

  renderSearchByForm() {
    return (
      <Segment color="teal">
        <Form>
          <Form.Group inline>
            <Form.Field>
              <label>Search By:</label>
            </Form.Field>
            <Form.Field>
              <Radio
                label="Name"
                name="searchBy"
                value="name"
                checked={this.state.searchBy === "name"}
                onChange={this.changeSearchBy}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="CIN"
                name="searchBy"
                value="cin"
                checked={this.state.searchBy === "cin"}
                onChange={this.changeSearchBy}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="GST"
                name="searchBy"
                value="gst"
                checked={this.state.searchBy === "gst"}
                onChange={this.changeSearchBy}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width="10">
              <input
                value={this.state.searchByValue}
                placeholder={`Search By ${
                  this.state.searchBy === "name"
                    ? "Name"
                    : this.state.searchBy === "cin"
                    ? "CIN"
                    : "GST"
                }`}
                onChange={this.changeSearchByValue}
              />
            </Form.Field>
            <Button type="submit" primary onClick={this.onSearch}>
              Search
            </Button>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  renderAddButton() {
    return (
      <Button color="google plus" onClick={this.onAddCustomer}>
        <Icon name="add user" /> Add New Customer
      </Button>
    );
  }

  render() {
    return (
      <Segment color="blue">
        <Header as="h3" textAlign="center">
          Manage Customer
        </Header>
        <Divider />
        {this.renderSearchByForm()}
        {this.renderAddButton()}
      </Segment>
    );
  }
}

export default Customers;
