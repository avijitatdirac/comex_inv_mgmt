import React, { Component } from "react";
import {
  Divider,
  Button,
  Form,
  Icon,
  Header,
  Segment,
  Label
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class AddAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerList: [],
      selectedCustomerId: "",
      PincodeError: false,
      formSubmitSuccess: false,
      addressError: false,
      gstError: false,
      contactPersonError: false,
      contactNumberError: false,
      emailError: false,

      customerAddress: [
        {
          id: null,
          Address: "",
          City: "",
          State: "",
          Pincode: "",
          GSTValue: "",
          ContactPerson1: "",
          ContactNumber1: "",
          Email1: "",
          ContactPerson2: "",
          ContactNumber2: "",
          Email2: "",
          ContactPerson3: "",
          ContactNumber3: "",
          Email3: "",
          ContactPerson4: "",
          ContactNumber4: "",
          Email4: "",
          SEZ: false,
          isMain: false
        }
      ]
    };
  }

  componentWillMount() {
    // fetch all customer details from database
    fetchAPI("/cust/get_customer", {})
      .then(r => r.json())
      .then(data => {
        console.log(data);
        var clist = [];
        data.customerDetails.forEach(customer => {
          if (customer.Previously_Known_As === null) {
            clist = clist.concat({
              key: customer.Customer_Id,
              value: customer.Customer_Id,
              text: customer.CName
            });
          } else {
            clist = clist.concat({
              key: customer.Customer_Id,
              value: customer.Customer_Id,
              text:
                customer.CName +
                "(Previously known as " +
                customer.Previously_Known_As +
                ")"
            });
          }
        });

        this.setState({
          customerList: clist
        });
      })
      .catch(err => console.log(err));
  }

  handleCustomerAddressChange = idx => evt => {
    const newAddress = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Address: evt.target.value };
    });
    this.setState({ customerAddress: newAddress });
  };

  handleCustomerCityChange = idx => evt => {
    const newCity = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, City: evt.target.value };
    });
    this.setState({ customerAddress: newCity });
  };

  handleCustomerStateChange = idx => evt => {
    const newState = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, State: evt.target.value };
    });
    this.setState({ customerAddress: newState });
  };

  handleCustomerPincodeChange = idx => evt => {
    const newPincode = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Pincode: evt.target.value };
    });
    this.setState({ customerAddress: newPincode });
  };

  handleCustomerGSTChange = idx => evt => {
    const newGST = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, GSTValue: evt.target.value };
    });
    this.setState({ customerAddress: newGST });
  };

  handleCustomerContactPersonNameChange1 = idx => evt => {
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson1: evt.target.value };
    });
    this.setState({ customerAddress: ContactPerson });
  };

  handleCustomerContactChange1 = idx => evt => {
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber1: evt.target.value };
    });
    this.setState({ customerAddress: Contact });
  };

  handleCustomerEmailChange1 = idx => evt => {
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email1: evt.target.value };
    });
    this.setState({ customerAddress: Email });
  };

  handleCustomerContactPersonNameChange2 = idx => evt => {
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson2: evt.target.value };
    });
    this.setState({ customerAddress: ContactPerson });
  };

  handleCustomerContactChange2 = idx => evt => {
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber2: evt.target.value };
    });
    this.setState({ customerAddress: Contact });
  };

  handleCustomerEmailChange2 = idx => evt => {
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email2: evt.target.value };
    });
    this.setState({ customerAddress: Email });
  };

  handleCustomerContactPersonNameChange3 = idx => evt => {
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson3: evt.target.value };
    });
    this.setState({ customerAddress: ContactPerson });
  };

  handleCustomerContactChange3 = idx => evt => {
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber3: evt.target.value };
    });
    this.setState({ customerAddress: Contact });
  };

  handleCustomerEmailChange3 = idx => evt => {
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email3: evt.target.value };
    });
    this.setState({ customerAddress: Email });
  };

  handleCustomerContactPersonNameChange4 = idx => evt => {
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson4: evt.target.value };
    });
    this.setState({ customerAddress: ContactPerson });
  };

  handleCustomerContactChange4 = idx => evt => {
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber4: evt.target.value };
    });
    this.setState({ customerAddress: Contact });
  };

  handleCustomerEmailChange4 = idx => evt => {
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email4: evt.target.value };
    });
    this.setState({ customerAddress: Email });
  };

  onMainAddressChange = idx => evt => {
    const AddressChange = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, isMain: evt.target.checked };
    });
    this.setState({ customerAddress: AddressChange });
  };

  onSEZChange = idx => evt => {
    const newAttribute = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, SEZ: evt.target.checked };
    });
    this.setState({ customerAddress: newAttribute });
  };

  handleAddressRemove = idx => () => {
    //console.log(idx)
    if (this.state.customerAddress.length !== 1) {
      this.setState({
        customerAddress: this.state.customerAddress.filter(
          (s, sidx) => idx !== sidx
        )
      });
    }
  };

  handleAddressAdd = idx => () => {
    //  console.log("hello")
    var aerror, perror, gerror, cperror, cnerror, eerror;
    if (
      this.state.customerAddress[idx].Address === "" ||
      this.state.customerAddress[idx].Pincode.length !== 6 ||
      !/^\d+$/.test(this.state.customerAddress[idx].Pincode) ||
      this.state.customerAddress[idx].GSTValue === "" ||
      this.state.customerAddress[idx].ContactPerson1 === "" ||
      !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[idx].ContactPerson1) ||
      (this.state.customerAddress[idx].ContactNumber1.length !== 8 &&
        this.state.customerAddress[idx].ContactNumber1.length !== 10) ||
      !/^\d+$/.test(this.state.customerAddress[idx].ContactNumber1) ||
      this.state.customerAddress[idx].Email1 === "" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.state.customerAddress[idx].Email1
      )
    ) {
      if (this.state.customerAddress[idx].Address === "")
        // alert("Please Enter valid Address")
        aerror = true;
      if (
        this.state.customerAddress[idx].Pincode.length !== 6 ||
        !/^\d+$/.test(this.state.customerAddress[idx].Pincode)
      )
        perror = true;
      if (this.state.customerAddress[idx].GSTValue === "")
        //alert("Please Enter valid GST Address")
        gerror = true;
      if (
        this.state.customerAddress[idx].ContactPerson1 === "" ||
        !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[idx].ContactPerson1)
      )
        //alert("Please Enter valid name")
        cperror = true;
      if (
        (this.state.customerAddress[idx].ContactNumber1.length !== 8 &&
          this.state.customerAddress[idx].ContactNumber1.length !== 10) ||
        !/^\d+$/.test(this.state.customerAddress[idx].ContactNumber1)
      )
        //alert("Please Enter a valid Main Contact Number")
        cnerror = true;
      if (
        this.state.customerAddress[idx].Email1 === "" ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          this.state.customerAddress[idx].Email1
        )
      )
        //alert("Please Enter a valid Main Email")
        eerror = true;
    }
    //   else
    //   {
    //   this.setState({
    //     customerAddress: this.state.customerAddress.concat([{
    //       Address:"",
    //       GSTValue:"",
    //       ContactPerson:"",
    //       ContactNumber:"",
    //       AltContactNumber:"",
    //       Email:"",
    //       AltEmail:"",
    //       SEZ:"",
    //       isMain:false,
    //     }])
    //   });
    // }
    this.setState(
      {
        addressError: aerror,
        PincodeError: perror,
        gstError: gerror,
        contactPersonError: cperror,
        contactNumberError: cnerror,
        emailError: eerror
      },
      this.setAddForm
    );
  };

  setAddForm = () => {
    if (
      !this.state.addressError &&
      !this.state.gstError &&
      !this.state.contactPersonError &&
      !this.state.contactNumberError &&
      !this.state.emailError &&
      !this.state.PincodeError
    ) {
      this.setState({
        customerAddress: this.state.customerAddress.concat([
          {
            Address: "",
            City: "",
            State: "",
            Pincode: "",
            GSTValue: "",
            ContactPerson1: "",
            ContactNumber1: "",
            Email1: "",
            ContactPerson2: "",
            ContactNumber2: "",
            Email2: "",
            ContactPerson3: "",
            ContactNumber3: "",
            Email3: "",
            ContactPerson4: "",
            ContactNumber4: "",
            Email4: "",
            SEZ: false,
            isMain: false
          }
        ])
      });
    }
  };

  handleCustomerSubmission = () => {
    var l = this.state.customerAddress.length - 1;
    if (
      this.state.customerAddress[l].Address === "" ||
      this.state.customerAddress[l].Pincode.length !== 6 ||
      !/^\d+$/.test(this.state.customerAddress[l].Pincode) ||
      this.state.customerAddress[l].GSTValue === "" ||
      this.state.customerAddress[l].ContactPerson1 === "" ||
      !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[l].ContactPerson1) ||
      (this.state.customerAddress[l].ContactNumber1.length !== 8 &&
        this.state.customerAddress[l].ContactNumber1.length !== 10) ||
      !/^\d+$/.test(this.state.customerAddress[l].ContactNumber1) ||
      this.state.customerAddress[l].Email1 === "" ||
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
        this.state.customerAddress[l].Email1
      )
    )
      notify.error(
        "Please Enter relevant Address Data. Press 'Add More' to Check where the Problem is"
      );
    else {
      var submitSuccess = true;
      this.setState(
        {
          formSubmitSuccess: submitSuccess,
          customerAddress: this.state.customerAddress
        },
        this.commitCustomer
      );
    }
  };

  commitCustomer = () => {
    //console.log(JSON.stringify(this.state))
    fetchAPI("/cust/insert_customer_address", {
      customerId: this.state.selectedCustomerId,
      address: this.state.customerAddress
    })
      .then(r => r.json())
      .then(data => {})
      .catch(err => console.log(err));
  };

  renderCustomerAddressForm() {
    var addressrender,
      gstrender,
      pincoderender,
      contactpersonrender,
      contactnumberrender,
      emailrender;
    if (this.state.addressError) {
      addressrender = (
        <div className="ui red pointing basic label">
          Please enter a valid Address
        </div>
      );
    } else addressrender = undefined;

    if (this.state.PincodeError) {
      pincoderender = (
        <div className="ui red left pointing basic label">
          Please enter a valid pincode
        </div>
      );
    } else pincoderender = undefined;

    if (this.state.gstError) {
      gstrender = (
        <div className="ui red pointing basic label">
          Please enter a valid GST or enter NA
        </div>
      );
    } else gstrender = undefined;

    if (this.state.contactNumberError) {
      contactnumberrender = (
        <div className="ui red left pointing basic label">
          Please enter a valid Contact Number
        </div>
      );
    } else contactnumberrender = undefined;

    if (this.state.contactPersonError) {
      contactpersonrender = (
        <div className="ui red left pointing basic label">
          Please enter a valid Contact Person Name
        </div>
      );
    } else contactpersonrender = undefined;

    if (this.state.emailError) {
      emailrender = (
        <div className="ui red left pointing basic label">
          Please enter a valid Email
        </div>
      );
    } else emailrender = undefined;
    //console.log(this.state)
    return (
      <div>
        {this.state.customerAddress.map((attribute, idx) => {
          return (
            <Form>
              <Form.TextArea
                label={`Address #${idx + 1}`}
                value={attribute.Address}
                placeholder="Enter Address"
                onChange={this.handleCustomerAddressChange(idx)}
              />
              {idx === this.state.customerAddress.length - 1
                ? addressrender
                : undefined}
              <Form.Group>
                <Form.Input
                  label="City"
                  value={attribute.City}
                  placeholder="Enter City"
                  onChange={this.handleCustomerCityChange(idx)}
                />
                <Form.Input
                  label="State"
                  value={attribute.State}
                  placeholder="Enter State"
                  onChange={this.handleCustomerStateChange(idx)}
                />
                <Form.Input
                  label="Pincode"
                  value={attribute.Pincode}
                  icon="star"
                  placeholder="Enter Pincode"
                  onChange={this.handleCustomerPincodeChange(idx)}
                />
                {idx === this.state.customerAddress.length - 1
                  ? pincoderender
                  : undefined}
              </Form.Group>
              <Form.Group inline>
                <Form.Input
                  type="Checkbox"
                  label="Main Address"
                  defaultChecked="true"
                  checked={attribute.isMain}
                  onChange={this.onMainAddressChange(idx)}
                />
                <Form.Input
                  type="Checkbox"
                  label="SEZ"
                  defaultChecked="true"
                  checked={attribute.SEZ}
                  onChange={this.onSEZChange(idx)}
                />
              </Form.Group>
              <Divider />
              <Form.Input
                label="GST"
                value={attribute.GSTValue}
                placeholder="GST"
                width={10}
                onChange={this.handleCustomerGSTChange(idx)}
              />
              {idx === this.state.customerAddress.length - 1
                ? gstrender
                : undefined}
              <Form.Group>
                <Form.Input
                  icon="star"
                  color="red"
                  value={attribute.ContactPerson1}
                  fluid
                  label="Main Contact Person"
                  width={10}
                  placeholder="Enter Contact Person"
                  onChange={this.handleCustomerContactPersonNameChange1(idx)}
                />
                {idx === this.state.customerAddress.length - 1
                  ? contactpersonrender
                  : undefined}
                <Form.Input
                  label="Main Contact Number"
                  value={attribute.ContactNumber1}
                  icon="star"
                  placeholder="Enter Contact Number"
                  onChange={this.handleCustomerContactChange1(idx)}
                />
                {idx === this.state.customerAddress.length - 1
                  ? contactnumberrender
                  : undefined}
                <Form.Input
                  label="Main Email"
                  icon="star"
                  value={attribute.Email1}
                  placeholder="Enter Email"
                  onChange={this.handleCustomerEmailChange1(idx)}
                />
                {idx === this.state.customerAddress.length - 1
                  ? emailrender
                  : undefined}
              </Form.Group>
              <Divider />
              <Header>Alternate Contact Information</Header>
              <Form.Group>
                <Form.Input
                  value={attribute.ContactPerson2}
                  fluid
                  label="Contact Person"
                  width={10}
                  placeholder="Enter Contact Person"
                  onChange={this.handleCustomerContactPersonNameChange2(idx)}
                />
                <Form.Input
                  label="Contact Number"
                  value={attribute.ContactNumber2}
                  placeholder="Enter Contact Number"
                  onChange={this.handleCustomerContactChange2(idx)}
                />
                <Form.Input
                  label="Email"
                  value={attribute.Email2}
                  placeholder="Enter Email"
                  onChange={this.handleCustomerEmailChange2(idx)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={attribute.ContactPerson3}
                  fluid
                  label="Contact Person"
                  width={10}
                  placeholder="Enter Contact Person"
                  onChange={this.handleCustomerContactPersonNameChange3(idx)}
                />
                <Form.Input
                  label="Contact Number"
                  value={attribute.ContactNumber3}
                  placeholder="Enter Contact Number"
                  onChange={this.handleCustomerContactChange3(idx)}
                />
                <Form.Input
                  label="Email"
                  value={attribute.Email3}
                  placeholder="Enter Email"
                  onChange={this.handleCustomerEmailChange3(idx)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Input
                  value={attribute.ContactPerson4}
                  fluid
                  label="Contact Person"
                  width={10}
                  placeholder="Enter Contact Person"
                  onChange={this.handleCustomerContactPersonNameChange4(idx)}
                />
                <Form.Input
                  label="Contact Number"
                  value={attribute.ContactNumber4}
                  placeholder="Enter Contact Number"
                  onChange={this.handleCustomerContactChange4(idx)}
                />
                <Form.Input
                  label="Email"
                  value={attribute.Email4}
                  placeholder="Enter Email"
                  onChange={this.handleCustomerEmailChange4(idx)}
                />
              </Form.Group>
              <Form.Group>
                <Button onClick={this.handleAddressRemove(idx)}>
                  <Icon name="minus square outline" />Remove
                </Button>
                {idx === this.state.customerAddress.length - 1 ? (
                  <Button onClick={this.handleAddressAdd(idx)}>
                    <Icon name="plus" />Add More
                  </Button>
                ) : (
                  undefined
                )}
              </Form.Group>
            </Form>
          );
        })}
        <center>
          <Button
            width="100px"
            color="green"
            onClick={this.handleCustomerSubmission}
            icon="add user"
            label="Add Customer"
          />
        </center>
      </div>
    );
  }

  render() {
    //console.log(this.state.selectedCustomerId)
    var formsubmit = undefined;
    if (
      this.state.formSubmitSuccess &&
      !this.state.addressError &&
      !this.state.PincodeError &&
      !this.state.gstError &&
      !this.state.contactNumberError &&
      !this.state.contactPersonError &&
      !this.state.emailError
    ) {
      formsubmit = (
        <div class="ui success message">
          <div class="content">
            <div class="header">Success!!!</div>
            <p>Address details have been entered.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="page">
        <Segment>
          <Label as="a" color="violet">
            <Icon name="user" />Select Customer
          </Label>
          <br />
          <Form.Dropdown
            style={{ maxWidth: "600px" }}
            fluid
            icon="search"
            search
            selection
            value={this.state.selectedCustomerId}
            onChange={(e, data) =>
              this.setState({ selectedCustomerId: data.value })
            }
            placeholder="Select a Customer"
            options={this.state.customerList}
          />
        </Segment>
        <Segment>
          <div>
            {this.state.selectedCustomerId !== ""
              ? this.renderCustomerAddressForm()
              : undefined}
          </div>
          <Divider />
          <div>{formsubmit}</div>
        </Segment>
      </div>
    );
  }
}
export default AddAddress;
