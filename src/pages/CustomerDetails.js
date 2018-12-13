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
  Message,
  Dimmer,
  Loader
} from "semantic-ui-react";
import { findIndex } from "lodash";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class CustomerDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orgType: "CUSTOMER",
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
    this.onAddBranch = this.onAddBranch.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount");
    this.fetchParentCustomerList();
    this.fetchCustomerDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate");
    if (
      prevProps.match.params.customerId !==
        this.props.match.params.customerId &&
      this.props.location.parentId &&
      this.props.location.isChildBranch
    ) {
      console.log("componentDidUpdate, setState");
      const id = null;
      const hasParentCustomer = true;
      const parentCustomerId = Number(this.props.location.parentId);
      const { name, pan, cin, gst, gstRegistered } = prevState;
      const isSez = false;
      const addrLine1 = "";
      const addrLine2 = "";
      const addrLine3 = "";
      const city = "";
      const state = "";
      const pin = "";
      const contacts = [];
      const error = "";
      const errorList = [];
      this.setState({
        id,
        hasParentCustomer,
        parentCustomerId,
        name,
        pan,
        cin,
        gst,
        gstRegistered,
        addrLine1,
        addrLine2,
        addrLine3,
        city,
        state,
        pin,
        isSez,
        contacts,
        error,
        errorList
      });
    } else if (
      this.props.match.params.customerId &&
      this.props.match.params.customerId !== prevProps.match.params.customerId
    ) {
      this.fetchCustomerDetails();
    }
  }

  async fetchParentCustomerList() {
    const url = "/organizations/get_all_parents";
    const parentCustomerList = [];
    parentCustomerList.push({
      key: -1,
      value: -1,
      text: "Select...",
      pan: "",
      cin: "",
      gst: ""
    });
    try {
      const res = await fetchAPI(url, {});
      const { data } = await res.json();
      if (data && data.length > 0) {
        for (const d of data) {
          parentCustomerList.push({
            key: d.id,
            value: d.id,
            text: d.name,
            pan: d.pan,
            cin: d.cin,
            gst: d.gst
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
    this.setState({ parentCustomerList });
  }

  async fetchCustomerDetails() {
    const customerId = this.props.match.params.customerId;
    if (!customerId) {
      return;
    }
    this.setState({ loading: true });
    try {
      const url = `/organizations/get_organization_details`;
      const res = await fetchAPI(url, { id: customerId });
      const { data } = await res.json();
      this.setState({
        ...data,
        hasParentCustomer: data.parentCustomerId > 0,
        gstRegistered: data.gstRegistered ? true : false,
        isSez: data.isSez ? true : false
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({ loading: false });
    }
  }

  changeHasParentCustomer(e, { checked }) {
    this.setState({ hasParentCustomer: checked });
  }

  changeParentCustomer(e, { value }) {
    const parentCustomerId = value;
    const idx = findIndex(this.state.parentCustomerList, { key: value });
    if (idx > -1 && parentCustomerId > -1) {
      const { pan, gst, cin, text } = this.state.parentCustomerList[idx];
      this.setState({ pan, cin, gst, name: text });
    }
    this.setState({ parentCustomerId });
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

    if (this.state.cin && this.state.cin.length < 21) {
      errorList.push("CIN should be of 21 digits");
    }

    // check PAN as it is required field
    if (!this.state.pan) {
      errorList.push("PAN is Required.");
    }
    if (this.state.pan && this.state.pan.length < 10) {
      errorList.push("PAN should be of 10 digits");
    }
    // check GST as it is required field
    if (this.state.gstRegistered && !this.state.gst) {
      errorList.push("GST is Required.");
    }
    if (
      this.state.gstRegistered &&
      this.state.gst &&
      this.state.gst.length < 15
    ) {
      errorList.push("GST should be of 15 digits");
    }
    // check AddressLine1 as it is required field
    if (!this.state.addrLine1) {
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
    if (this.state.pin && this.state.pin.length < 6) {
      errorList.push("PIN should be of 6 digits");
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

    const url = "/organizations/save_organizations";
    this.setState({ isSaving: true });
    try {
      const res = await fetchAPI(url, { ...this.state });
      const { success, id } = await res.json();
      if (success) {
        const pathname = "/customer-details/" + id;
        this.props.history.push(pathname);
      } else {
        notify.error("An error occurred");
      }
      this.setState({ isSaving: false });
      notify.success("Successfully updated");
    } catch (err) {
      console.error(err);
      this.setState({ isSaving: false });
      notify.error("An error occurred!");
    }
  }

  onAddBranch() {
    const pathname = "/customer-details";
    const parentId = this.props.match.params.customerId;
    const isChildBranch = true;
    this.props.history.push({ pathname, parentId, isChildBranch });
  }

  async onDelete() {
    console.log("onDelete");

    const url = "/organizations/delete_organization";
    const customerId = this.props.match.params.customerId;
    if (!customerId) {
      return;
    }
    try {
      this.setState({ isSaving: true });
      const countRes = await fetchAPI("/organizations/get_child_count", {
        id: customerId
      });
      const { count } = await countRes.json();
      if (count > 0) {
        console.log({ count });
        const isSaving = false;
        const error = "Error!";
        const errorList = [
          "Cannot delete customer with one or more branch present."
        ];
        this.setState({ error, errorList, isSaving });
        return;
      }

      const res = await fetchAPI(url, { id: customerId });
      const { success } = await res.json();
      if (success) {
        notify.success("Customer successfully deleted");
        this.props.history.push("/customers");
      } else {
        notify.error("An error occurred while saving");
      }
    } catch (err) {
      console.error(err);
      notify.error("An error occurred while saving");
    } finally {
      this.setState({ isSaving: false });
    }
  }

  disableParentCustomerSelection() {
    return (
      (this.props.match.params.customerId &&
        Number(this.props.match.params.customerId) > 0) ||
      this.props.location.isChildBranch
    );
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
            disabled={this.disableParentCustomerSelection()}
            checked={this.state.hasParentCustomer}
            onChange={this.changeHasParentCustomer}
          />
          {this.state.hasParentCustomer && (
            <React.Fragment>
              <Form.Field required style={{ marginLeft: "10px" }}>
                <label>Parent Customer:</label>
              </Form.Field>
              <Form.Field>
                <Dropdown
                  search
                  selection
                  disabled={this.disableParentCustomerSelection()}
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
              disabled={this.state.parentCustomerId > 0}
              value={this.state.pan}
              placeholder="Customer PAN"
              onChange={this.changeField("pan")}
            />
            <Form.Input
              label="CIN"
              value={this.state.cin}
              disabled={this.state.parentCustomerId > 0}
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
                      placeholder="Contact Role"
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
        {this.props.match.params.customerId &&
          this.state.parentCustomerId === -1 && (
            <Button
              primary
              loading={this.state.isSaving}
              disabled={this.state.isSaving}
              onClick={this.onAddBranch}
            >
              <Icon name="add" />
              Add New Branch
            </Button>
          )}
        {this.props.match.params.customerId && (
          <Button
            negative
            loading={this.state.isSaving}
            disabled={this.state.isSaving}
            onClick={this.onDelete}
          >
            <Icon name="delete" />
            Delect Customer
          </Button>
        )}
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

  // renders the Loader overlay
  renderLoader() {
    const { loading } = this.state;
    return (
      <Dimmer active={loading} inverted>
        <Loader>Fetching Customer Details...</Loader>
      </Dimmer>
    );
  }

  render() {
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={this.state.loading}>
          {this.renderLoader()}

          <Header as="h1" textAlign="center" color="orange">
            {this.props.match.params.customerId
              ? "Customer Details"
              : "Add New Customer"}
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
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default CustomerDetails;
