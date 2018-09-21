import React, { Component } from "react";
import {
  Segment,
  Dimmer,
  Loader,
  Form,
  Header,
  Button,
  Icon,
  Message
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class AddOrganization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      panNumber: "",
      gst: "",
      cin: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      pin: "",
      mainContactPersonName: "",
      mainContactPersonEmail: "",
      mainContactPersonPhone: "",
      alternateContactInfo: [
        { id: 1, name: "", email: "", phone: "" },
        { id: 2, name: "", email: "", phone: "" },
        { id: 3, name: "", email: "", phone: "" }
      ],
      isDisabled: true,
      isLoading: false,
      isSaving: false,
      error: "",
      errorList: [],
      successMessage: ""
    };

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangePan = this.handleChangePan.bind(this);
    this.handleChangeGst = this.handleChangeGst.bind(this);
    this.handleChangeCin = this.handleChangeCin.bind(this);
    this.handleChangeAddrLine1 = this.handleChangeAddrLine1.bind(this);
    this.handleChangeAddrLine2 = this.handleChangeAddrLine2.bind(this);
    this.handleChangeAddrLine3 = this.handleChangeAddrLine3.bind(this);
    this.handleChangeCity = this.handleChangeCity.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleChangePin = this.handleChangePin.bind(this);
    this.changeMainContactName = this.changeMainContactName.bind(this);
    this.changeAltContact = this.changeAltContact.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  // fetch organization details here
  async componentDidMount() {
    this.setState({ isLoading: true });
    try {
      const res = await fetchAPI("/organization/get_organization_details", {});
      const data = await res.json();
      if (data.id) {
        const {
          id,
          name,
          panNumber,
          gst,
          cin,
          addressLine1,
          addressLine2,
          addressLine3,
          city,
          state,
          pin,
          mainContactPersonName,
          mainContactPersonEmail,
          mainContactPersonPhone,
          alternateContactInfo
        } = data;
        this.setState({
          id,
          name,
          panNumber,
          gst,
          cin,
          addressLine1,
          addressLine2,
          addressLine3,
          city,
          state,
          pin,
          mainContactPersonName,
          mainContactPersonEmail,
          mainContactPersonPhone,
          alternateContactInfo
        });
        this.setState({ isLoading: false });
      }
    } catch (err) {
      console.error(err);
      this.setState({
        error: "Error!",
        errorList: "Error occurred while fetching data"
      });
      this.setState({ isLoading: false });
    }
  }

  // onchange handler for name field
  handleChangeName(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  // onchange handler for pan number field
  handleChangePan(e) {
    const panNumber = e.target.value.trim().toUpperCase();
    this.setState({ panNumber });
  }

  // onchange handler for gst field
  handleChangeGst(e) {
    const gst = e.target.value.trim().toUpperCase();
    this.setState({ gst });
  }

  // onchange handler for cin field
  handleChangeCin(e) {
    const cin = e.target.value;
    this.setState({ cin });
  }

  // onchange handlers
  handleChangeAddrLine1 = e => this.setState({ addressLine1: e.target.value });
  handleChangeAddrLine2 = e => this.setState({ addressLine2: e.target.value });
  handleChangeAddrLine3 = e => this.setState({ addressLine3: e.target.value });
  handleChangeCity = e => this.setState({ city: e.target.value });
  handleChangeState = e => this.setState({ state: e.target.value });
  changeMainContactName = e =>
    this.setState({ mainContactPersonName: e.target.value });
  changeMainContactEmail = e =>
    this.setState({ mainContactPersonEmail: e.target.value });
  changeMainContactPhone = e =>
    this.setState({ mainContactPersonPhone: e.target.value });

  // onchange handlers for pin field, does validate input as well
  handleChangePin(e) {
    // do not take any non number input
    // do not take input greater than 6 digits
    const value = e.target.value.trim();
    if (!isNaN(Number(value)) && value.length < 7) {
      this.setState({ pin: value });
    }
  }

  // onchange handler for alternate contacts
  changeAltContact(contactId, field, value) {
    let alternateContactInfo = this.state.alternateContactInfo.slice();
    alternateContactInfo.forEach(contact => {
      if (contact.id === contactId) {
        contact[field] = value;
      }
    });
    this.setState({ alternateContactInfo });
  }

  // onclick handler for Edit button
  onEdit() {
    this.setState({ isDisabled: false });
  }

  // validate field before saving
  validateBeforeSave() {
    let errorList = [];

    // check name as it is required field
    if (!this.state.name) {
      errorList.push("Name is Required.");
    }
    // check CIN as it is required field
    if (!this.state.cin) {
      errorList.push("CIN is Required.");
    }
    // check PAN as it is required field
    if (!this.state.panNumber) {
      errorList.push("PAN is Required.");
    }
    // check PAN as it is required field
    if (!this.state.panNumber) {
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
    const error =
      errorList.length > 0 ? "Please correct below errors before saving." : "";
    this.setState({ error, errorList });
    return error ? true : false;
  }

  // onclick handler for save button
  async onSave() {
    if (this.validateBeforeSave()) {
      return;
    }
    const {
      id,
      name,
      panNumber,
      gst,
      cin,
      addressLine1,
      addressLine2,
      addressLine3,
      city,
      state,
      pin,
      mainContactPersonName,
      mainContactPersonEmail,
      mainContactPersonPhone,
      alternateContactInfo
    } = this.state;
    this.setState({ isSaving: true });
    try {
      const res = await fetchAPI("/organization/save_organization", {
        id,
        name,
        panNumber,
        gst,
        cin,
        addressLine1,
        addressLine2,
        addressLine3,
        city,
        state,
        pin,
        mainContactPersonName,
        mainContactPersonEmail,
        mainContactPersonPhone,
        alternateContactInfo
      });
      const data = await res.json();
      const isSaving = false;
      if (data.success) {
        const error = false;
        const errorList = [];
        const successMessage = "Organization updated successfully!";
        this.setState({
          isSaving,
          error,
          errorList,
          successMessage,
          isDisabled: true
        });
      } else {
        const error = "Failed";
        const errorList = ["Couldn't update organization data"];
        const successMessage = "";
        this.setState({ isSaving, error, errorList, successMessage });
      }
    } catch (err) {
      console.error(err);
      const error = "Error!";
      const errorList = ["Error while saving data"];
      const isSaving = false;
      this.setState({ error, errorList, isSaving });
    }
  }

  // onclick handler for cancel button
  onCancel() {
    this.setState({ isDisabled: true });
  }

  // renders the Loader overlay
  renderLoader() {
    const { isLoading } = this.state;
    return (
      <Dimmer active={isLoading} inverted>
        <Loader>Fetching Organization...</Loader>
      </Dimmer>
    );
  }

  // renders the whole form segment
  renderFormSegment() {
    const { isDisabled } = this.state;
    return (
      <Segment>
        <Form>
          <Form.Input
            fluid
            required
            label="Name"
            placeholder="Name"
            disabled={isDisabled}
            value={this.state.name || ""}
            onChange={this.handleChangeName}
          />
          <Form.Input
            fluid
            required
            label="CIN"
            placeholder="CIN"
            disabled={isDisabled}
            value={this.state.cin || ""}
            onChange={this.handleChangeCin}
          />
          <Form.Input
            fluid
            required
            label="PAN"
            placeholder="PAN Number"
            disabled={isDisabled}
            value={this.state.panNumber || ""}
            onChange={this.handleChangePan}
          />
          <Form.Input
            fluid
            required
            label="GST"
            placeholder="GST"
            disabled={isDisabled}
            value={this.state.gst || ""}
            onChange={this.handleChangeGst}
          />
          {this.renderAddressSegment()}
          {this.renderMainContactSegment()}
          {this.renderAlternateContactSegment()}
        </Form>
      </Segment>
    );
  }

  // renders the address segment
  renderAddressSegment() {
    const { isDisabled } = this.state;
    return (
      <Segment>
        <Header as="h4">Address</Header>
        <Form.Input
          fluid
          required
          label="Line 1"
          placeholder="Address Line 1"
          disabled={isDisabled}
          value={this.state.addressLine1 || ""}
          onChange={this.handleChangeAddrLine1}
        />
        <Form.Input
          fluid
          label="Line 2"
          placeholder="Address Line 2"
          disabled={isDisabled}
          value={this.state.addressLine2 || ""}
          onChange={this.handleChangeAddrLine2}
        />
        <Form.Input
          fluid
          label="Line 3"
          placeholder="Address Line 3"
          disabled={isDisabled}
          value={this.state.addressLine3 || ""}
          onChange={this.handleChangeAddrLine3}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            required
            label="City"
            placeholder="City"
            disabled={isDisabled}
            value={this.state.city || ""}
            onChange={this.handleChangeCity}
          />
          <Form.Input
            fluid
            required
            label="State"
            placeholder="State"
            disabled={isDisabled}
            value={this.state.state || ""}
            onChange={this.handleChangeState}
          />
          <Form.Input
            fluid
            required
            label="PIN"
            placeholder="PIN Number"
            disabled={isDisabled}
            value={this.state.pin || ""}
            onChange={this.handleChangePin}
          />
        </Form.Group>
      </Segment>
    );
  }

  // renders the main contact segment
  renderMainContactSegment() {
    const { isDisabled } = this.state;
    return (
      <Segment>
        <Header as="h4">Main Contact Person</Header>
        <Form.Input
          fluid
          label="Name"
          placeholder="Main Contact Person Name"
          disabled={isDisabled}
          value={this.state.mainContactPersonName || ""}
          onChange={this.changeMainContactName}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Email"
            placeholder="Main Contact Person Email"
            disabled={isDisabled}
            value={this.state.mainContactPersonEmail || ""}
            onChange={this.changeMainContactEmail}
          />
          <Form.Input
            fluid
            label="Phone"
            placeholder="Main Contact Person Phone"
            disabled={isDisabled}
            value={this.state.mainContactPersonPhone || ""}
            onChange={this.changeMainContactPhone}
          />
        </Form.Group>
      </Segment>
    );
  }

  // renders the alternate contact segment
  renderAlternateContactSegment() {
    const { isDisabled } = this.state;
    return (
      <Segment>
        <Header as="h4">Alternate Contact Information</Header>
        {this.state.alternateContactInfo.map(contact => (
          <Form.Group key={contact.id} widths="equal">
            <Form.Input
              fluid
              label="Name"
              placeholder="Alternate Contact Name"
              disabled={isDisabled}
              value={contact.name || ""}
              onChange={e =>
                this.changeAltContact(contact.id, "name", e.target.value)
              }
            />
            <Form.Input
              fluid
              label="Email"
              placeholder="Alternate Contact Email"
              disabled={isDisabled}
              value={contact.email || ""}
              onChange={e =>
                this.changeAltContact(contact.id, "email", e.target.value)
              }
            />
            <Form.Input
              fluid
              label="Phone"
              placeholder="Alternate Contact Phone"
              disabled={isDisabled}
              value={contact.phone || ""}
              onChange={e =>
                this.changeAltContact(contact.id, "phone", e.target.value)
              }
            />
          </Form.Group>
        ))}
      </Segment>
    );
  }

  // renders the button segment
  renderButtonSegment() {
    if (this.state.isDisabled) {
      return (
        <Segment>
          <Button primary onClick={this.onEdit}>
            <Icon name="edit" />
            Edit
          </Button>
        </Segment>
      );
    } else {
      return (
        <Segment>
          <Button
            color="green"
            loading={this.state.isSaving}
            disabled={this.state.isSaving}
            onClick={this.onSave}
          >
            <Icon name="save" />
            Save
          </Button>
          <Button
            color="red"
            loading={this.state.isSaving}
            disabled={this.state.isSaving}
            onClick={this.onCancel}
          >
            <Icon name="cancel" />
            Cancel
          </Button>
        </Segment>
      );
    }
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

  render() {
    const { isLoading } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={isLoading}>
          {this.renderLoader()}
          <Header as="h1">Organization</Header>
          {this.renderFormSegment()}
          {this.renderButtonSegment()}
          {this.renderErrorMessage()}
          {this.renderSuccessMessage()}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default AddOrganization;
