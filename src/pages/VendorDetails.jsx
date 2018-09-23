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
  Message
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class VendorDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      name: "",
      pan: "",
      gst: "",
      cin: "",
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      city: "",
      state: "",
      pin: "",
      mainContactName: "",
      mainContactEmail: "",
      mainContactPhone: "",
      alternateContactInfo: [],
      error: "",
      errorList: [],
      successMessage: "",
      isSaving: false,
      isLoading: false
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
    this.changeAltContact = this.changeAltContact.bind(this);
    this.addAlternateContact = this.addAlternateContact.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  // fetch vendor details
  async fetchVendorDetails(vendorId) {
    this.setState({ isLoading: true });
    try {
      const res = await fetchAPI("/vendor/get_vendor_details", {
        id: vendorId
      });
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

  // fetch vendor details only if vendorId is present in params
  // NOTE: this component can be loaded in two path
  // one for creating new vendor, other for modifying existing vendor
  componentDidMount() {
    const vendorId = this.props.match.params.vendorId;
    if (vendorId) {
      this.fetchVendorDetails(vendorId);
    }
  }

  // onchange handler for name field
  handleChangeName(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  // onchange handler for pan number field
  handleChangePan(e) {
    const pan = e.target.value.trim().toUpperCase();
    this.setState({ pan });
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

  // onchange handler for alternative contact information fields
  changeAltContact(contactId, field, value) {
    let alternateContactInfo = this.state.alternateContactInfo.slice();
    alternateContactInfo.forEach(contact => {
      if (contact.id === contactId) {
        contact[field] = value;
      }
    });
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
    // check CIN as it is required field
    if (!this.state.cin) {
      errorList.push("CIN is Required.");
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
    const error =
      errorList.length > 0 ? "Please correct below errors before saving." : "";
    this.setState({ error, errorList });
    return error ? true : false;
  }

  // onclick handler for save button
  async onSave() {
    // exit if there is validation error
    if (this.validateBeforeSave()) {
      return;
    }

    const {
      id,
      name,
      pan,
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
    const payload = {
      id,
      name,
      pan,
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
    };
    const url = id ? "/vendor/update_vendor" : "/vendor/insert_vendor";

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
            this.fetchVendorDetails(__id);
            this.props.history.push(`/vendor-details/${__id}`);
          }
        );
      } else {
        this.setState({
          isSaving: false,
          error: "Error while saving!",
          errorList: [],
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
          <Form.Input
            fluid
            required
            label="CIN"
            placeholder="CIN"
            value={this.state.cin || ""}
            onChange={this.handleChangeCin}
          />
          <Form.Input
            fluid
            required
            label="PAN"
            placeholder="PAN Number"
            value={this.state.pan || ""}
            onChange={this.handleChangePan}
          />
          <Form.Input
            fluid
            required
            label="GST"
            placeholder="GST"
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
    return (
      <Segment>
        <Header as="h4">Address</Header>
        <Form.Input
          fluid
          required
          label="Line 1"
          placeholder="Address Line 1"
          value={this.state.addressLine1 || ""}
          onChange={this.handleChangeAddrLine1}
        />
        <Form.Input
          fluid
          label="Line 2"
          placeholder="Address Line 2"
          value={this.state.addressLine2 || ""}
          onChange={this.handleChangeAddrLine2}
        />
        <Form.Input
          fluid
          label="Line 3"
          placeholder="Address Line 3"
          value={this.state.addressLine3 || ""}
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
          value={this.state.mainContactPersonName || ""}
          onChange={this.changeMainContactName}
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            label="Email"
            placeholder="Main Contact Person Email"
            value={this.state.mainContactPersonEmail || ""}
            onChange={this.changeMainContactEmail}
          />
          <Form.Input
            fluid
            label="Phone"
            placeholder="Main Contact Person Phone"
            value={this.state.mainContactPersonPhone || ""}
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
    return (
      <Button
        positive
        loading={this.state.isSaving}
        disabled={this.state.isSaving}
        onClick={this.onSave}
      >
        <Icon name="save" />
        Save Vendor Details
      </Button>
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
        <Loader>Fetching Vendor Details...</Loader>
      </Dimmer>
    );
  }

  //   main render function of the component
  render() {
    const { isLoading } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={isLoading}>
          {this.renderLoader()}
          <Header as="h1">Vendor Details</Header>
          {this.renderFormSegment()}
          {this.renderButtonSegment()}
          {this.renderErrorMessage()}
          {this.renderSuccessMessage()}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default VendorDetails;
