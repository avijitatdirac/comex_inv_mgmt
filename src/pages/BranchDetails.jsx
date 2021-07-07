import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Header,
  Loader,
  Form,
  Icon,
  Table,
  Button,
  Message,
  TransitionablePortal
} from "semantic-ui-react";
import { fetchAPI } from "../utility";
import { findIndex } from "lodash";

class BranchDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      allow_movement_of_items: 0,
      addr_line_1: "",
      addr_line_2: "",
      addr_line_3: "",
      city: "",
      state: "",
      pin: "",
      main_contact_name: "",
      main_contact_email: "",
      main_contact_phone: "",
      alternateContactInfo: [],
      error: "",
      errorList: [],
      successMessage: "",
      isSaving: false,
      isLoading: false,
      isPortalOpen: false
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.changeAllowMovementOfItems = this.changeAllowMovementOfItems.bind(
      this
    );
    this.handleChangeAddrLine1 = this.handleChangeAddrLine1.bind(this);
    this.handleChangeAddrLine2 = this.handleChangeAddrLine2.bind(this);
    this.handleChangeAddrLine3 = this.handleChangeAddrLine3.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleChangePin = this.handleChangePin.bind(this);
    this.changeAltContact = this.changeAltContact.bind(this);
    this.addAlternateContact = this.addAlternateContact.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onContinue = this.onContinue.bind(this);
  }

  // fetch branch details
  async fetchBranchDetails(branchId, silent = false) {
    if (!silent) {
      this.setState({ isLoading: true });
    }
    const param = { id: branchId };
    try {
      const res = await fetchAPI("/branch/get_branch_details", param);
      const data = await res.json();
      if (data.id) {
        this.setState({ ...data });
        this.setState({ isLoading: false });
      } else {
        throw new Error("Error while fetching");
      }
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  // fetch branch details only if branchId is present in params
  // NOTE: this component can be loaded in two path
  // one for creating new branch, other for modifying existing branch
  componentDidMount() {
    const branchId = this.props.match.params.branchId;
    if (branchId) {
      this.fetchBranchDetails(branchId);
    }
  }

  // onchange handler for name field
  handleChangeName(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  changeAllowMovementOfItems(e, data) {
    const allow_movement_of_items = data.checked ? 1 : 0;
    this.setState({ allow_movement_of_items });
  }

  // onchange handlers Address Line 1
  handleChangeAddrLine1 = e => this.setState({ addr_line_1: e.target.value });

  // onchange handlers Address Line 2
  handleChangeAddrLine2 = e => this.setState({ addr_line_2: e.target.value });

  // onchange handlers Address Line 3
  handleChangeAddrLine3 = e => this.setState({ addr_line_3: e.target.value });

  // onchange handlers city
  handleChangeCity = e => this.setState({ city: e.target.value });

  // onchange handlers State
  handleChangeState = e => this.setState({ state: e.target.value });

  // onchange handlers Main Contact Name
  changeMainContactName = e =>
    this.setState({ main_contact_name: e.target.value });

  // onchange handlers Main Contact Email
  changeMainContactEmail = e =>
    this.setState({ main_contact_email: e.target.value });

  // onchange handlers Main Contact phone
  changeMainContactPhone = e =>
    this.setState({ main_contact_phone: e.target.value });

  // onchange handlers for pin field, does validate input as well
  handleChangePin(e) {
    // do not take any non number input
    // do not take input greater than 6 digits
    const value = e.target.value.trim();
    if (!isNaN(Number(value)) && value.length < 7) {
      this.setState({ pin: value });
    }
  }

  // onchange handler for alternative contact information fields
  changeAltContact(contactId, field, value) {
    const alternateContactInfo = this.state.alternateContactInfo.slice();
    const idx = findIndex(alternateContactInfo, { id: contactId });
    if (idx > -1) {
      alternateContactInfo[idx][field] = value;
    }
    this.setState({ alternateContactInfo });
  }

  // add new alternate contact information row
  addAlternateContact(e) {
    e.preventDefault();
    let alternateContactInfo = this.state.alternateContactInfo.slice();
    alternateContactInfo.push({
      id: (alternateContactInfo.length + 1) * -1,
      name: "",
      email: "",
      phone: "",
      is_active: 1,
      operation: "INSERT"
    });
    this.setState({ alternateContactInfo });
  }

  // validate field before saving
  validateBeforeSave() {
    let errorList = [];

    // check name as it is required field
    if (!this.state.name) {
      errorList.push("Name is Required.");
    }
    // check AddressLine1 as it is required field
    if (!this.state.addr_line_1) {
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
    const error =
      errorList.length > 0
        ? "Please correct below errors before saving \u261F "
        : "";
    this.setState({ error, errorList });
    return error ? true : false;
  }

  // onclick handler for Cancel button on the portal
  onCancel(e) {
    e.preventDefault();
    this.setState({ isPortalOpen: false });
  }

  // onclick handler for Delete button
  onDelete(e) {
    e.preventDefault();
    this.setState({ isPortalOpen: true });
  }

  // onclick handler for Continue button in the popup portal
  async onContinue() {
    this.setState({ isPortalOpen: false });
    const { id } = this.state;
    // exit if branch id does not exist
    if (!id) return;

    try {
      this.setState({ error: "", errorList: [], isSaving: true });
      const res = await fetchAPI("/branch/delete_branch", { id });
      const data = await res.json();
      if (data.success) {
        this.props.history.push("/branch");
      } else {
        throw new Error("An Error occurred while deleting");
      }
    } catch (err) {
      console.error(err);
      this.setState({
        isSaving: false,
        error: "Ooops..",
        errorList: ["An error occurred."]
      });
    }
  }

  // onclick handler for save button
  async onSave() {
    // exit if there is validation error
    if (this.validateBeforeSave()) {
      return;
    }

    this.setState({ isSaving: true });
    const payload = { ...this.state };
    const url = this.state.id
      ? "/branch/update_branch"
      : "/branch/insert_branch";

    try {
      const res = await fetchAPI(url, payload);
      const data = await res.json();
      if (data.success) {
        const __id = data.id;
        this.setState(
          {
            isSaving: false,
            error: "",
            errorList: [],
            successMessage: "Saved Successfully!"
          },
          () => {
            this.fetchBranchDetails(__id, true);
            this.props.history.push(`/branch-details/${__id}`);
          }
        );
      } else {
        this.setState({
          isSaving: false,
          error: "Ooops..",
          errorList: ["An error occurred."],
          successMessage: ""
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isSaving: false });
    }
  }

  // renders the whole form segment
  renderFormSegment() {
    return (
      <Segment>
        <Form>
          <Form.Input
            fluid
            required
            label="Name"
            placeholder="Name"
            value={this.state.name || ""}
            onChange={this.handleChangeName}
          />
          <Segment>
            <Form.Field>
              <label>Allow Movement Of Items</label>
              <Form.Checkbox
                toggle
                checked={this.state.allow_movement_of_items === 1}
                onChange={this.changeAllowMovementOfItems}
              />
            </Form.Field>
          </Segment>
          {this.renderAddressSegment()}
          {this.renderMainContactSegment()}
          {this.renderAlternateContactSegment()}
        </Form>
      </Segment>
    );
  }

  // renders the address segment
  renderAddressSegment() {
    return (
      <Segment>
        <Header as="h4">Address</Header>
        <Form.Input
          fluid
          required
          label="Line 1"
          placeholder="Address Line 1"
          value={this.state.addr_line_1 || ""}
          onChange={this.handleChangeAddrLine1}
        />
        <Form.Input
          fluid
          label="Line 2"
          placeholder="Address Line 2"
          value={this.state.addr_line_2 || ""}
          onChange={this.handleChangeAddrLine2}
        />
        <Form.Input
          fluid
          label="Line 3"
          placeholder="Address Line 3"
          value={this.state.addr_line_3 || ""}
          onChange={this.handleChangeAddrLine3}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            required
            label="City"
            placeholder="City"
            value={this.state.city || ""}
            onChange={this.handleChangeCity}
          />
          <Form.Input
            fluid
            required
            label="State"
            placeholder="State"
            value={this.state.state || ""}
            onChange={this.handleChangeState}
          />
          <Form.Input
            fluid
            required
            label="PIN"
            placeholder="PIN Number"
            value={this.state.pin || ""}
            onChange={this.handleChangePin}
          />
        </Form.Group>
      </Segment>
    );
  }

  // renders the main contact segment
  renderMainContactSegment() {
    return (
      <Segment>
        <Header as="h4">Main Contact Person</Header>
        <Form.Input
          fluid
          label="Name"
          placeholder="Main Contact Person Name"
          value={this.state.main_contact_name || ""}
          onChange={this.changeMainContactName}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Email"
            placeholder="Main Contact Person Email"
            value={this.state.main_contact_email || ""}
            onChange={this.changeMainContactEmail}
          />
          <Form.Input
            fluid
            label="Phone"
            placeholder="Main Contact Person Phone"
            value={this.state.main_contact_phone || ""}
            onChange={this.changeMainContactPhone}
          />
        </Form.Group>
      </Segment>
    );
  }

  // renders alternate contact information segment
  renderAlternateContactSegment() {
    return (
      <Segment>
        <Header as="h4">Alternate Contact Information</Header>
        <Table celled color="blue" verticalAlign="middle">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Email</Table.HeaderCell>
              <Table.HeaderCell>Phone</Table.HeaderCell>
              <Table.HeaderCell style={{ width: "50px" }} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.alternateContactInfo
              .filter(contact => contact.is_active === 1)
              .map(contact => (
                <Table.Row key={contact.id}>
                  <Table.Cell>
                    <Form.Input
                      fluid
                      placeholder="Alternate Contact Name"
                      value={contact.name || ""}
                      onChange={e => {
                        e.preventDefault();
                        this.changeAltContact(
                          contact.id,
                          "name",
                          e.target.value
                        );
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
              <Table.HeaderCell colSpan={4}>
                <Icon
                  name="add user"
                  link
                  bordered
                  size="large"
                  color="blue"
                  title="Add New Contact"
                  onClick={this.addAlternateContact}
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
    const buttons = [];
    buttons.push(
      <Button
        key="save"
        positive
        loading={this.state.isSaving}
        disabled={this.state.isSaving || this.state.isPortalOpen}
        onClick={this.onSave}
      >
        <Icon name="save" />
        Save Branch Details
      </Button>
    );
    if (this.state.id) {
      buttons.push(
        <Button
          key="delete"
          negative
          loading={this.state.isSaving}
          disabled={this.state.isSaving || this.state.isPortalOpen}
          onClick={this.onDelete}
        >
          <Icon name="trash" />
          Delete Branch
        </Button>
      );
    }
    return buttons;
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

  // renders the success message section
  renderSuccessMessage() {
    if (!this.state.successMessage) {
      return false;
    }
    return <Message success header={this.state.successMessage} />;
  }

  // renders the Loader overlay
  renderLoader() {
    const { isLoading } = this.state;
    return (
      <Dimmer active={isLoading} inverted>
        <Loader>Fetching Branch Details...</Loader>
      </Dimmer>
    );
  }

  // render alert popup on Delete button
  renderPortal() {
    const styles = {
      left: "20%",
      position: "fixed",
      top: "40vh",
      zIndex: "1000",
      width: "60vw",
      paddingBottom: "30px"
    };
    const messageStyle = {
      fontSize: "16px",
      fontStyle: "italic",
      color: "#ff5454"
    };
    const btnStyle = { marginTop: "30px", marginRight: "10px" };
    return (
      <TransitionablePortal
        open={this.state.isPortalOpen}
        onClose={() => this.setState({ isPortalOpen: false })}
      >
        <Segment style={styles} inverted>
          <Header color="olive">Are you sure?</Header>
          <hr />
          <p style={messageStyle}>
            This branch will be deleted. Do you want to continue?
          </p>

          <Button positive style={btnStyle} onClick={this.onContinue}>
            Continue
          </Button>
          <Button negative onClick={this.onCancel}>
            Cancel
          </Button>
        </Segment>
      </TransitionablePortal>
    );
  }

  //   main render function of the component
  render() {
    const { isLoading } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={isLoading}>
          {this.renderLoader()}
          <Header as="h1">Branch Details</Header>
          {this.renderFormSegment()}
          {this.renderButtonSegment()}
          {this.renderErrorMessage()}
          {this.renderSuccessMessage()}
          {this.renderPortal()}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default BranchDetails;
