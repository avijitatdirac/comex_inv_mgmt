import React, { Component } from "react";
import {
  Segment,
  Header,
  Divider,
  Form,
  Radio,
  Button,
  Icon,
  Table
} from "semantic-ui-react";
import { sortBy } from "lodash";
import { fetchAPI } from "../utility";

const CUSTOMER_ORG_TYPE = "CUSTOMER";

class Customers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchBy: "name",
      searchByValue: "",
      allCustomers: [],
      allCustomersUnfiltered: [],
      loading: false,
      sortColumn: "",
      sortDirection: "ascending"
    };

    this.changeSearchBy = this.changeSearchBy.bind(this);
    this.changeSearchByValue = this.changeSearchByValue.bind(this);
    this.onAddCustomer = this.onAddCustomer.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.onSelectCustomer = this.onSelectCustomer.bind(this);
  }

  componentDidMount() {
    this.fetchAllCustomers();
  }

  async fetchAllCustomers() {
    const url = "/organizations/get_all_organizations";
    const orgType = CUSTOMER_ORG_TYPE;
    this.setState({ loading: true });
    try {
      const res = await fetchAPI(url, { orgType });
      const { data } = await res.json();
      this.setState({ allCustomers: data, allCustomersUnfiltered: data });
    } catch (err) {
      console.error(err);
      this.setState({ loading: false });
    }
  }

  handleSort = column => event => {
    const { sortColumn, sortDirection } = this.state;
    const allCustomers = this.state.allCustomers.slice();
    if (sortColumn !== column) {
      this.setState({
        sortColumn: column,
        sortDirection: "ascending",
        allCustomers: sortBy(allCustomers, [column])
      });
      return;
    }
    this.setState({
      allCustomers: allCustomers.reverse(),
      sortDirection: sortDirection === "ascending" ? "descending" : "ascending"
    });
  };

  onSelectCustomer(customerId) {
    const path = `/customer-details/${customerId}`;
    this.props.history.push(path);
  }

  getSearchByFieldName() {
    const { searchBy } = this.state;
    switch (searchBy) {
      case "name":
        return "Name";
      case "cin":
        return "CIN";
      case "pan":
        return "PAN";
      case "gst":
        return "GST";
      case "city":
        return "City";
      case "pin":
        return "PIN";
      default:
        return "Name";
    }
  }

  changeSearchBy(e, { value }) {
    this.setState({ searchBy: value }, this.searchCustomers);
  }

  changeSearchByValue(e) {
    const value = e.target.value;
    this.setState({ searchByValue: value }, this.searchCustomers);
  }

  searchCustomers() {
    const { searchBy, searchByValue } = this.state;
    const allCustomersUnfiltered = this.state.allCustomersUnfiltered.slice();
    const allCustomers = allCustomersUnfiltered.filter(
      customer =>
        (customer[searchBy] + "").toLowerCase().indexOf(searchByValue) >= 0
    );
    this.setState({ allCustomers });
  }

  onAddCustomer() {
    this.props.history.push("/customer-details");
  }

  renderSearchByForm() {
    return (
      <Segment color="teal">
        <Form>
          <Form.Group inline>
            <Form.Field>
              <Icon name="filter" />
              <label>Filter By:</label>
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
                label="PAN"
                name="searchBy"
                value="pan"
                checked={this.state.searchBy === "pan"}
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
            <Form.Field>
              <Radio
                label="City"
                name="searchBy"
                value="city"
                checked={this.state.searchBy === "city"}
                onChange={this.changeSearchBy}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="PIN"
                name="searchBy"
                value="pin"
                checked={this.state.searchBy === "pin"}
                onChange={this.changeSearchBy}
              />
            </Form.Field>
          </Form.Group>
          <Form.Group>
            <Form.Field width="10">
              <input
                value={this.state.searchByValue}
                placeholder={`Search By ${this.getSearchByFieldName()}`}
                onChange={this.changeSearchByValue}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  renderAddButton() {
    return (
      <Button
        positive
        style={{ position: "absolute", right: "10px", top: "10px" }}
        onClick={this.onAddCustomer}
      >
        <Icon name="add user" /> Add New Customer
      </Button>
    );
  }

  renderCustomerTable() {
    const { sortColumn, sortDirection } = this.state;
    return (
      <Table color="yellow" verticalAlign="middle" celled sortable selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={sortColumn === "name" ? sortDirection : null}
              onClick={this.handleSort("name")}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === "cin" ? sortDirection : null}
              onClick={this.handleSort("cin")}
            >
              CIN
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === "pan" ? sortDirection : null}
              onClick={this.handleSort("pan")}
            >
              PAN
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === "gst" ? sortDirection : null}
              onClick={this.handleSort("gst")}
            >
              GST
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === "city" ? sortDirection : null}
              onClick={this.handleSort("city")}
            >
              City
            </Table.HeaderCell>
            <Table.HeaderCell
              sorted={sortColumn === "pin" ? sortDirection : null}
              onClick={this.handleSort("pin")}
            >
              PIN
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.allCustomers.map(customer => (
            <Table.Row
              key={customer.id}
              onClick={() => this.onSelectCustomer(customer.id)}
            >
              <Table.Cell>{customer.name}</Table.Cell>
              <Table.Cell>{customer.cin}</Table.Cell>
              <Table.Cell>{customer.pan}</Table.Cell>
              <Table.Cell>{customer.gst}</Table.Cell>
              <Table.Cell>{customer.city}</Table.Cell>
              <Table.Cell>{customer.pin}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }

  render() {
    return (
      <Segment color="blue">
        <Header as="h1" textAlign="center" color="orange">
          Manage Customer
        </Header>
        {this.renderAddButton()}
        <Divider />
        {this.renderSearchByForm()}
        <Divider />
        <span style={{ color: "#f00", fontSize: "10px", fontStyle: "italic" }}>
          *Click column header to sort
        </span>
        {this.renderCustomerTable()}
      </Segment>
    );
  }
}

export default Customers;
