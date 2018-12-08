import React, { Component } from "react";
import {
  Dimmer,
  Loader,
  Divider,
  Button,
  Form,
  Table,
  Icon,
  Segment,
  Label
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";
class ManageCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customerList: [],
      dimmerActive: false,
      customerDetails: [],
      customerAddressDetails: [],
      tableAddressDetails: [],
      selectedCustomerId: "",
      customerName: "",
      customerPanNumber: "",
      customerCinNumber: "",
      previousName: "",
      comments: "",
      tableHeaders: [
        "Address",
        "City",
        "State",
        "Pincode",
        "GST Value",
        "Main Contact Person",
        "Main Contact Number",
        "Main Email",
        "Valid Contact Person",
        "Contact Person",
        "Contact Number",
        "Email",
        "Valid Contact Person",
        "Contact Person",
        "Contact Number",
        "Email",
        "Valid Contact Person",
        "Contact Person",
        "Contact Number",
        "Email",
        "Valid Contact Person",
        "Main Address",
        "Valid Address",
        "SEZ"
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
        var cdetails = [];
        var cadetails = [];
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
          cdetails = cdetails.concat(customer);
        });
        data.locationDetails.forEach(location => {
          cadetails = cadetails.concat(location);
        });
        this.setState({
          customerList: clist,
          customerDetails: cdetails,
          customerAddressDetails: cadetails
        });
      })
      .catch(err => console.log(err));
  }

  getAllData = () => {
    //console.log('in get all data')
    var arr = [];

    this.state.customerAddressDetails.forEach(customer => {
      if (customer.Customer_Id === this.state.selectedCustomerId) {
        arr = arr.concat({
          Address: customer.Address,
          City: customer.City,
          Contact_Number_1: customer.Contact_Number_1,
          Contact_Person_1: customer.Contact_Person_1,
          Customer_Id: customer.Customer_Id,
          Email_1: customer.Email_1,
          Contact_Person_1_Valid: customer.Contact_Person_1_Valid,
          Contact_Person_2: customer.Contact_Person_2,
          Contact_Number_2: customer.Contact_Number_2,
          Email_2: customer.Email_2,
          Contact_Person_2_Valid: customer.Contact_Person_2_Valid,
          Contact_Person_3: customer.Contact_Person_3,
          Contact_Number_3: customer.Contact_Number_3,
          Email_3: customer.Email_3,
          Contact_Person_3_Valid: customer.Contact_Person_3_Valid,
          Contact_Person_4: customer.Contact_Person_4,
          Contact_Number_4: customer.Contact_Number_4,
          Email_4: customer.Email_4,
          Contact_Person_4_Valid: customer.Contact_Person_4_Valid,
          GST_Value: customer.GST_Value,
          Is_Main: customer.Is_Main,
          Is_Valid: customer.Is_Valid,
          Pincode: customer.Pincode,
          SEZ: customer.SEZ,
          State: customer.State,
          CID: customer.CID
        });
      }
    });
    // for(var i=0;i<this.state.customerAddressDetails.length;i++)
    // {
    //     if(this.state.customerAddressDetails[i].Customer_Id === this.state.selectedCustomerId) {
    //         arr[i]=this.state.customerAddressDetails[i]
    //     }
    // }
    this.setState({
      tableAddressDetails: arr
    });
  };

  populateCustomerData = () => {
    //console.log('populating')
    var pname;
    this.state.customerDetails.forEach(customer => {
      if (customer.Customer_Id === this.state.selectedCustomerId) {
        if (customer.Previously_Known_As === null) pname = "";
        else pname = customer.Previously_Known_As;
        this.setState(
          {
            customerName: customer.CName,
            customerPanNumber: customer.Pan_No,
            customerCinNumber: customer.CIN,
            previousName: pname,
            comments: customer.Comments
          },
          this.getAllData
        );
        return;
      }
    });
  };

  nameChange = event => this.setState({ customerName: event.target.value });
  commentsChange = event => this.setState({ comments: event.target.value });
  panChange = event => this.setState({ customerPanNumber: event.target.value });
  prevNameChange = event => this.setState({ previousName: event.target.value });

  changeGST = idx => evt => {
    const GSTChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, GST_Value: evt.target.value };
    });
    this.setState({ tableAddressDetails: GSTChange });
  };

  changeContactPerson1 = idx => evt => {
    const ContactPersonChange = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Contact_Person_1: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: ContactPersonChange });
  };

  changeNum1 = idx => evt => {
    const Num1Change = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Contact_Number_1: evt.target.value };
    });
    this.setState({ tableAddressDetails: Num1Change });
  };

  changeEmail1 = idx => evt => {
    const Email1Change = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Email_1: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: Email1Change });
  };

  changeContactPerson2 = idx => evt => {
    const ContactPersonChange = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Contact_Person_2: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: ContactPersonChange });
  };

  changeNum2 = idx => evt => {
    const Num1Change = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Contact_Number_2: evt.target.value };
    });
    this.setState({ tableAddressDetails: Num1Change });
  };

  changeEmail2 = idx => evt => {
    const Email1Change = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Email_2: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: Email1Change });
  };

  changeContactPerson3 = idx => evt => {
    const ContactPersonChange = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Contact_Person_3: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: ContactPersonChange });
  };

  changeNum3 = idx => evt => {
    const Num1Change = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Contact_Number_3: evt.target.value };
    });
    this.setState({ tableAddressDetails: Num1Change });
  };

  changeEmail3 = idx => evt => {
    const Email1Change = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Email_3: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: Email1Change });
  };

  changeContactPerson4 = idx => evt => {
    const ContactPersonChange = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Contact_Person_4: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: ContactPersonChange });
  };

  changeNum4 = idx => evt => {
    const Num1Change = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Contact_Number_4: evt.target.value };
    });
    this.setState({ tableAddressDetails: Num1Change });
  };

  changeEmail4 = idx => evt => {
    const Email1Change = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, id: idx, Email_4: evt.target.value };
      }
    );
    this.setState({ tableAddressDetails: Email1Change });
  };

  changeContactPersonValid1 = idx => evt => {
    //console.log("Event ",evt.target.value)

    const MainChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, Contact_Person_1_Valid: evt.target.checked };
    });
    this.setState({ tableAddressDetails: MainChange });
  };

  changeContactPersonValid2 = idx => evt => {
    //console.log("Event ",evt.target.value)

    const MainChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, Contact_Person_2_Valid: evt.target.checked };
    });
    this.setState({ tableAddressDetails: MainChange });
  };

  changeContactPersonValid3 = idx => evt => {
    //console.log("Event ",evt.target.value)

    const MainChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, Contact_Person_3_Valid: evt.target.checked };
    });
    this.setState({ tableAddressDetails: MainChange });
  };

  changeContactPersonValid4 = idx => evt => {
    //console.log("Event ",evt.target.value)

    const MainChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, Contact_Person_4_Valid: evt.target.checked };
    });
    this.setState({ tableAddressDetails: MainChange });
  };

  changeIsMain = idx => evt => {
    //console.log("Event ",evt.target.value)

    const MainChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, Is_Main: evt.target.checked };
    });
    this.setState({ tableAddressDetails: MainChange });
  };

  changeIsValid = idx => evt => {
    const ValidChange = this.state.tableAddressDetails.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, Is_Valid: evt.target.checked };
      }
    );
    this.setState({ tableAddressDetails: ValidChange });
  };

  changeSEZ = idx => evt => {
    const SEZChange = this.state.tableAddressDetails.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, SEZ: evt.target.checked };
    });
    this.setState({ tableAddressDetails: SEZChange });
  };
  editCustomerDimmer = () => {
    this.setState(
      {
        dimmerActive: true
      },
      this.editCustomer
    );
  };
  editCustomer = () => {
    fetchAPI("/cust/modify_customer", {
      customerId: this.state.selectedCustomerId,
      customer_name: this.state.customerName,
      comments: " ," + this.state.comment,
      address: this.state.tableAddressDetails
    })
      .then(r => r.json())
      .then(data => {
        notify.success("Customer data successfully !");
        this.setState({
          dimmerActive: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
        notify.error("Error on updating Customer !");
      });
  };

  renderCustomerTable() {
    let i = 1;
    return (
      <div>
        <Label as="a" color="violet">
          <Icon name="pin" />Customer Address Details
        </Label>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.tableHeaders.map(label => (
                <Table.HeaderCell key={label + "hh"}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.tableAddressDetails.map((obj, idx) => {
              // console.log(obj)
              i++;
              if (obj.Customer_Id === this.state.selectedCustomerId) {
                return (
                  <Table.Row
                    key={obj.Customer_Id + "pointer" + i}
                    style={{ cursor: "pointer" }}
                  >
                    <Table.Cell>
                      <Form.Input value={obj.Address} readOnly />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input value={obj.City} readOnly />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input value={obj.State} readOnly />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input value={obj.Pincode} readOnly />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.GST_Value}
                        onChange={this.changeGST(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Person_1}
                        onChange={this.changeContactPerson1(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Number_1}
                        onChange={this.changeNum1(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Email_1}
                        onChange={this.changeEmail1(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Contact_Person_1_Valid}
                          onChange={this.changeContactPersonValid1(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Person_2}
                        onChange={this.changeContactPerson2(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Number_2}
                        onChange={this.changeNum2(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Email_2}
                        onChange={this.changeEmail2(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Contact_Person_2_Valid}
                          onChange={this.changeContactPersonValid2(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Person_3}
                        onChange={this.changeContactPerson3(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Number_3}
                        onChange={this.changeNum3(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Email_3}
                        onChange={this.changeEmail3(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Contact_Person_3_Valid}
                          onChange={this.changeContactPersonValid3(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Person_4}
                        onChange={this.changeContactPerson4(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Contact_Number_4}
                        onChange={this.changeNum4(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        value={obj.Email_4}
                        onChange={this.changeEmail4(idx)}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Contact_Person_4_Valid}
                          onChange={this.changeContactPersonValid4(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Is_Main}
                          onChange={this.changeIsMain(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.Is_Valid}
                          onChange={this.changeIsValid(idx)}
                        />
                      }
                    </Table.Cell>
                    <Table.Cell>
                      {
                        <Form.Input
                          type="Checkbox"
                          checked={obj.SEZ}
                          onChange={this.changeSEZ(idx)}
                        />
                      }
                    </Table.Cell>
                  </Table.Row>
                );
              } else {
                return false;
              }
            })}
          </Table.Body>
        </Table>
        <Button
          style={{ "margin-bottom": "8px" }}
          color="blue"
          onClick={this.editCustomerDimmer}
        >
          <Icon name="save" />Update
        </Button>
      </div>
    );
  }

  render() {
    const { dimmerActive } = this.state;
    return (
      <Segment>
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Submitting Data</Loader>
          </Dimmer>
          <div style={{}}>
            <Label as="a" color="violet">
              <Icon name="user" />Select Customer
            </Label>
            <Form>
              <Form.Group widths="equal">
                <br />
                <Form.Dropdown
                  style={{ maxWidth: "600px" }}
                  fluid
                  icon="search"
                  search
                  selection
                  value={this.state.selectedCustomerId}
                  onChange={(e, data) =>
                    this.setState(
                      {
                        selectedCustomerId: data.value,
                        tableAddressDetails: []
                      },
                      this.populateCustomerData
                    )
                  }
                  placeholder="Select a Customer"
                  options={this.state.customerList}
                />
                <Form.Button
                  color="blue"
                  icon
                  labelPosition="right"
                  onClick={() => {
                    this.props.history.push("/addAddress");
                  }}
                >
                  <Icon name="plus circle" />
                  Add New Address
                </Form.Button>
              </Form.Group>
            </Form>
          </div>
          <Divider />
          <div>
            <Label as="a" color="violet">
              <Icon name="user" />Customer Details
            </Label>
            <Form>
              <Form.Group>
                <Form.Input
                  label="Name"
                  value={this.state.customerName}
                  onChange={this.nameChange}
                />
                <Form.Input
                  label="Pan Number"
                  value={this.state.customerPanNumber}
                  readOnly
                />
                <Form.Input
                  label="Customer CIN"
                  value={this.state.customerCinNumber}
                  readOnly
                />
                <Form.Input
                  label="Previous Name"
                  value={this.state.previousName}
                  readOnly
                />
                <Form.Input label="Comments" onChange={this.commentsChange} />
              </Form.Group>
            </Form>
          </div>
          <div
            style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
          >
            {this.state.selectedCustomerId
              ? this.renderCustomerTable()
              : undefined}
          </div>
        </Dimmer.Dimmable>
      </Segment>
    );
  }
}
export default ManageCustomer;
