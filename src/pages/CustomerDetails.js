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
  Table,
  Message
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class CustomerDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSaving: false,
      hasParentCustomer: false,
      parentCustomerList: [],
      parentCustomerId: -1,
      name: "",
      pan: "",
      cin: "",
      gst: "",
      gstRegistered: true,
      isSez: false,
      allowMovementOfItems: false,
      addrLine1: "",
      addrLine2: "",
      addrLine3: "",
      city: "",
      state: "",
      pin: "",
      contacts: [],
      error: "",
      errorList: []
    };

    this.changeHasParentCustomer = this.changeHasParentCustomer.bind(this);
    this.changeParentCustomer = this.changeParentCustomer.bind(this);
    this.changeField = this.changeField.bind(this);
    this.changeGstRegistered = this.changeGstRegistered.bind(this);
    this.changeSEZ = this.changeSEZ.bind(this);
    this.addContact = this.addContact.bind(this);
    this.changeMainContact = this.changeMainContact.bind(this);
    this.changeContactField = this.changeContactField.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
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

  changeHasParentCustomer(e, { checked }) {
    this.setState({ hasParentCustomer: checked });
  }

  changeParentCustomer(e, { value }) {
    this.setState({ parentCustomerId: value });
  }

  changeGstRegistered(e, { checked }) {
    const gst = checked ? "" : "UNREGISTERED";
    this.setState({ gstRegistered: checked, gst });
  }

  changeSEZ(e, { checked }) {
    this.setState({ isSez: checked });
  }

  changeField = fieldName => (event, { value }) => {
    if (fieldName === "pan" || fieldName === "cin" || fieldName === "gst") {
      if (!/^[A-Za-z0-9]*$/.test(value)) {
        return;
      }
      value = value.toUpperCase();
    }

    if (fieldName === "pan" && value.length > 10) {
      return;
    }

    if (fieldName === "cin" && value.length > 21) {
      return;
    }

    if (fieldName === "gst" && value.length > 15) {
      return;
    }

    if (fieldName === "pin" && !/^[0-9]{0,6}$/.test(value)) {
      return;
    }

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
      isActive: 1,
      operation: "INSERT",
      isMainContact: contacts.length > 0 ? 0 : 1
    });
    this.setState({ contacts });
  }

  // onChange callback for Main Contact Radio button
  changeMainContact = contactId => event => {
    this.setState(prevState => {
      const contacts = this.state.contacts.slice(0);
      for (const contact of contacts) {
        if (contact.id === contactId) {
          contact.isMainContact = 1;
        } else {
          contact.isMainContact = 0;
        }
      }
      return { contacts };
    });
  };

  // onChange callback for contact fields
  // if fieldName = isActive and contactId > 0 then toggle isActive value
  // otherwise delete from the list
  // fieldName != isActive the update the value accordingly
  changeContactField = (contactId, fieldName) => event => {
    const contacts = this.state.contacts.slice();
    if (fieldName === "isActive") {
      if (contactId > 0) {
        for (const contact of contacts) {
          if (contact.id === contactId) {
            contact.isActive = contact.isActive ? 0 : 1;
          }
        }
        this.setState({ contacts });
      } else {
        const otherContacts = contacts.filter(
          contact => contact.id !== contactId
        );
        this.setState({ contacts: otherContacts });
      }
    } else {
      const value = event.target.value;
      for (const contact of contacts) {
        if (contact.id === contactId) {
          contact[fieldName] = value;
        }
      }
      this.setState({ contacts });
    }
  };

  // validate field before saving
  validateBeforeSave() {
    let errorList = [];

    if (this.state.hasParentCustomer && !(this.state.parentCustomerId > 0)) {
      errorList.push("Parent Customer is Required.");
    }

    // check name as it is required field
    if (!this.state.name) {
      errorList.push("Name is Required.");
    }
    // check PAN as it is required field
    if (!this.state.pan) {
      errorList.push("PAN is Required.");
    }
    // check GST as it is required field
    if (!this.state.gst) {
      errorList.push("GST is Required.");
    }
    // check AddressLine1 as it is required field
    if (!this.state.addressLine1) {
      errorList.push("Address Line 1 is Required.");
    }
    // check city as it is required field
    if (!this.state.city) {
      errorList.push("City is Required.");
    }
    // check state as it is required field
    if (!this.state.state) {
      errorList.push("State is Required.");
    }
    // check pin as it is required field
    if (!this.state.pin) {
      errorList.push("PIN is Required.");
    }

    let hasMainContact = false;
    for (const contact of this.state.contacts) {
      if (contact.isMainContact === 1) {
        hasMainContact = true;
      }
    }
    if (!hasMainContact) {
      errorList.push("Main Contact is required");
    }

    const error =
      errorList.length > 0 ? "Please correct below errors before saving ☟" : "";
    this.setState({ error, errorList });
    return error ? true : false;
  }

  async onSave() {
    console.log("onSave");
    // exit if there is validation error
    if (this.validateBeforeSave()) {
      return;
    }
  }

  async onDelete() {
    console.log("onDelete");
  }

  renderParentCustomerDropDown() {
    return (
      <Form>
        <Form.Group inline>
          <Form.Field>
            <label>Has a Parent Customer?</label>
          </Form.Field>
          <Radio
            toggle
            checked={this.state.hasParentCustomer}
            onChange={this.changeHasParentCustomer}
          />
          {this.state.hasParentCustomer && (
            <React.Fragment>
              <Form.Field required style={{ marginLeft: "10px" }}>
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
            </React.Fragment>
          )}
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
              <Radio
                toggle
                checked={this.state.gstRegistered}
                onChange={this.changeGstRegistered}
              />
            </Form.Field>
            <Form.Input
              label="GSTIN"
              required
              value={this.state.gst}
              disabled={!this.state.gstRegistered}
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
          <Form.Group inline>
            <label>Is it a SEZ?</label>
            <Form.Field>
              <Radio
                toggle
                checked={this.state.isSez}
                onChange={this.changeSEZ}
              />
            </Form.Field>
          </Form.Group>
        </Form>
      </Segment>
    );
  }

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
              <Table.HeaderCell>Role</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "50px" }} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.contacts.map(contact => (
              <Table.Row
                key={contact.id}
                positive={contact.isMainContact === 1}
                warning={contact.isActive === 0}
              >
                <Table.Cell>
                  {contact.isMainContact ? (
                    <Icon color="green" name="checkmark" size="large" />
                  ) : contact.isActive === 1 ? (
                    <Radio
                      toggle
                      onChange={this.changeMainContact(contact.id)}
                    />
                  ) : (
                    ""
                  )}
                </Table.Cell>
                <Table.Cell>
                  {contact.isActive === 1 ? (
                    <Form.Input
                      fluid
                      placeholder="Contact Name"
                      value={contact.name || ""}
                      onChange={this.changeContactField(contact.id, "name")}
                    />
                  ) : (
                    contact.name
                  )}
                </Table.Cell>
                <Table.Cell>
                  {contact.isActive === 1 ? (
                    <Form.Input
                      fluid
                      placeholder="Contact Email"
                      value={contact.email || ""}
                      onChange={this.changeContactField(contact.id, "email")}
                    />
                  ) : (
                    contact.email
                  )}
                </Table.Cell>
                <Table.Cell>
                  {contact.isActive === 1 ? (
                    <Form.Input
                      fluid
                      placeholder="Contact Phone"
                      value={contact.phone || ""}
                      onChange={this.changeContactField(contact.id, "phone")}
                    />
                  ) : (
                    contact.phone
                  )}
                </Table.Cell>
                <Table.Cell>
                  {contact.isActive === 1 ? (
                    <Form.Input
                      fluid
                      placeholder="Contact Phone"
                      value={contact.role || ""}
                      onChange={this.changeContactField(contact.id, "role")}
                    />
                  ) : (
                    contact.role
                  )}
                </Table.Cell>
                <Table.Cell textAlign="right">
                  {contact.isMainContact ? (
                    ""
                  ) : (
                    <Icon
                      name={contact.isActive ? "trash" : "undo alternate"}
                      color={contact.isActive ? "red" : "green"}
                      link
                      onClick={this.changeContactField(contact.id, "isActive")}
                    />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan={6}>
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
      <React.Fragment>
        <Button
          positive
          loading={this.state.isSaving}
          disabled={this.state.isSaving}
          onClick={this.onSave}
        >
          <Icon name="save" />
          Save Customer Details
        </Button>
        <Button
          negative
          loading={this.state.isSaving}
          disabled={this.state.isSaving}
          onClick={this.onDelete}
        >
          <Icon name="delete" />
          Delect Customer
        </Button>
      </React.Fragment>
    );
  }

  // renders the error message section
  renderErrorMessage() {
    if (!this.state.error) {
      return false;
    }
    return (
      <Message error header={this.state.error} list={this.state.errorList} />
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
          <Divider />
          {this.renderNameSection()}
          {this.renderAddressSegment()}
          {this.renderContactSegment()}
          {this.renderButtonSegment()}
        </Segment>
        {this.renderErrorMessage()}
      </div>
    );
  }
}

export default CustomerDetails;
