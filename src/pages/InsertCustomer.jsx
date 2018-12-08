import React, { Component } from "react";
import {
  Form,
  Icon,
  Button,
  Segment,
  Divider,
  Header,
  Dropdown,
  Radio,
  Table
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class InsertCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      parentCustomerList: [],
      parentCustomerId: -1,
      name: "",
      pan: "",
      cin: "",
      gst: "UNREGISTERED",
      gstRegistered: false,
      isSez: false,
      allowMovementOfItems: false,
      addrLine1: "",
      addrLine2: "",
      addrLine3: "",
      city: "",
      state: "",
      pin: "",
      contacts: []
    };

    this.changeParentCustomer = this.changeParentCustomer.bind(this);
    this.changeField = this.changeField.bind(this);
    this.addContact = this.addContact.bind(this);
    this.changeMainContact = this.changeMainContact.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    this.fetchParentCustomerList();
  }

  fetchParentCustomerList() {
    console.log("fetchParentCustomerList");
    const parentCustomerList = [];
    parentCustomerList.push({
      key: -1,
      value: -1,
      text: "Select..."
    });
    this.setState({ parentCustomerList });
  }

  changeParentCustomer(e, { value }) {
    this.setState({ parentCustomerId: value });
  }

  changeField = fieldName => (event, { value }) => {
    this.setState({ [fieldName]: value });
  };

  // add new contact information row
  addContact(e) {
    e.preventDefault();
    const contacts = this.state.contacts.slice();
    contacts.push({
      id: (contacts.length + 1) * -1,
      name: "",
      email: "",
      phone: "",
      is_active: 1,
      operation: "INSERT",
      is_main_contact: 0
    });
    this.setState({ contacts });
  }

  // onChange callback for Main Contact Radio button
  changeMainContact = contactId => event => {
    this.setState(prevState => {
      const contacts = this.state.contacts.slice(0);
      for (const contact of contacts) {
        if (contact.id === contactId) {
          contact.is_main_contact = 1;
        } else {
          contact.is_main_contact = 0;
        }
      }
      return { contacts };
    });
  };

  onSave() {
    console.log("onSave");
  }

  renderParentCustomerDropDown() {
    return (
      <Form>
        <Form.Group inline>
          <Form.Field>
            <label>Choose Parent Customer:</label>
          </Form.Field>
          <Form.Field>
            <Dropdown
              search
              selection
              value={this.state.parentCustomerId}
              onChange={this.changeParentCustomer}
              options={this.state.parentCustomerList}
              placeholder="Select Parent Customer"
            />
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }

  renderNameSection() {
    return (
      <Segment>
        <Form>
          <Form.Field>
            <Form.Input
              label="Name"
              required
              value={this.state.name}
              placeholder="Customer Name"
              onChange={this.changeField("name")}
            />
          </Form.Field>
          <Form.Group widths="equal">
            <Form.Input
              label="PAN"
              required
              value={this.state.pan}
              placeholder="Customer PAN"
              onChange={this.changeField("pan")}
            />
            <Form.Input
              label="CIN"
              value={this.state.cin}
              placeholder="Customer CIN"
              onChange={this.changeField("cin")}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Field>
              <label>GST Registered?</label>
            </Form.Field>
            <Form.Field>
              <Radio toggle />
            </Form.Field>
            <Form.Input
              label="GSTIN"
              required
              value={this.state.gst}
              placeholder="Customer GST"
              onChange={this.changeField("gst")}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }

  // renders the address segment
  renderAddressSegment() {
    return (
      <Segment>
        <Header as="h4">Address</Header>
        <Form>
          <Form.Input
            fluid
            required
            label="Line 1"
            placeholder="Address Line 1"
            value={this.state.addrLine1}
            onChange={this.changeField("addrLine1")}
          />
          <Form.Input
            fluid
            label="Line 2"
            placeholder="Address Line 2"
            value={this.state.addrLine2}
            onChange={this.changeField("addrLine2")}
          />
          <Form.Input
            fluid
            label="Line 3"
            placeholder="Address Line 3"
            value={this.state.addrLine3}
            onChange={this.changeField("addrLine3")}
          />
          <Form.Group widths="equal">
            <Form.Input
              fluid
              required
              label="City"
              placeholder="City"
              value={this.state.city}
              onChange={this.changeField("city")}
            />
            <Form.Input
              fluid
              required
              label="State"
              placeholder="State"
              value={this.state.state}
              onChange={this.changeField("state")}
            />
            <Form.Input
              fluid
              required
              label="PIN"
              placeholder="PIN Number"
              value={this.state.pin}
              onChange={this.changeField("pin")}
            />
          </Form.Group>
        </Form>
      </Segment>
    );
  }
  changeAltContact = () => {};

  // renders contact information segment
  renderContactSegment() {
    return (
      <Segment>
        <Header as="h4">Contact Information</Header>
        <Table celled color="blue" verticalAlign="middle">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell style={{ width: "120px" }}>
                Main Contact
              </Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "50px" }} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.contacts.map(contact => (
              <Table.Row
                key={contact.id}
                positive={contact.is_main_contact === 1}
              >
                <Table.Cell>
                  {contact.is_main_contact ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : (
                    <Radio
                      toggle
                      onChange={this.changeMainContact(contact.id)}
                    />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Form.Input
                    fluid
                    placeholder="Contact Name"
                    value={contact.name || ""}
                    onChange={e => {
                      e.preventDefault();
                      this.changeAltContact(contact.id, "name", e.target.value);
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Form.Input
                    fluid
                    placeholder="Alternate Contact Name"
                    value={contact.email || ""}
                    onChange={e => {
                      e.preventDefault();
                      this.changeAltContact(
                        contact.id,
                        "email",
                        e.target.value
                      );
                    }}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Form.Input
                    fluid
                    placeholder="Alternate Contact Phone"
                    value={contact.phone || ""}
                    onChange={e => {
                      e.preventDefault();
                      this.changeAltContact(
                        contact.id,
                        "phone",
                        e.target.value
                      );
                    }}
                  />
                </Table.Cell>
                <Table.Cell textAlign="right">
                  <Icon
                    name="trash"
                    color="red"
                    link
                    onClick={e => {
                      e.preventDefault();
                      this.changeAltContact(contact.id, "is_active", 0);
                    }}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan={5}>
                <Icon
                  name="add user"
                  link
                  bordered
                  size="large"
                  color="blue"
                  title="Add New Contact"
                  onClick={this.addContact}
                />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Segment>
    );
  }

  // renders the button segment
  renderButtonSegment() {
    return (
      <Button
        positive
        loading={this.state.isSaving}
        disabled={this.state.isSaving}
        onClick={this.onSave}
      >
        <Icon name="save" />
        Save Customer Details
      </Button>
    );
  }

  render() {
    return (
      <div>
        <Header as="h1" textAlign="center" color="orange">
          Add New Customer
        </Header>
        <Segment color="teal">
          {this.renderParentCustomerDropDown()}
          {this.renderNameSection()}
          {this.renderAddressSegment()}
          {this.renderContactSegment()}
          {this.renderButtonSegment()}
        </Segment>
      </div>
    );
  }
}

export default InsertCustomer;
