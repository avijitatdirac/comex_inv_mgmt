import React, { Component } from "react";
import {
  Radio,
  Dimmer,
  Loader,
  Dropdown,
  Divider,
  Button,
  Form,
  Table,
  Icon,
  Header,
  Segment,
  Label,
  Input,
  Checkbox,
  Message
} from "semantic-ui-react";
import moment from "moment";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class ReturnAssets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      damageComments: "",
      returnedAssetState: false,
      modifiedAssetState: false,
      damagedAssetState: false,
      acceptRepairedAssetState: true,
      customerList: [],
      customerDetails: [],
      selectedCustomerId: "",
      customerId: "",
      customerName: "",
      previousName: "",
      contactNumber: "",
      email: "",
      customerAddress: "",
      filterSerialNumber: "",
      challannumber: "",
      selectedcheckboxasset: [
        {
          id: "",
          status: "",
          comments: ""
        }
      ],
      selectedCategory: "",
      categoryOptions: [],
      damageButtonRender: true,
      modifiedButtonRender: true,
      damageId: "",
      damageSerialNumber: "",
      damageMake: "",
      damageStatus: "",
      configTableID: "",
      assetList: [],
      selectedAssetId: "",
      assetDetails: [],
      assetID: "",
      assetSerialNumber: "",
      assetChildSerialNumber: "",
      assetConfigDate: "",
      selectedDamageId: "",
      damageDetails: [],
      damageList: [],
      tableHeaders: [
        "Returned Proper",
        "Returned Damaged",
        "Serial Number",
        "Asset",
        "Asset Id",
        "Asset Type ",
        "Order Date",
        "Return Date",
        "Unit Cost",
        "Comments"
      ],
      CustomerInfotableHeaders: [
        "Name",
        "Previous Name",
        "Contact Number",
        "Email",
        "Address"
      ],
      tableData: [
        {
          name: "",
          prevname: "",
          contactno: "",
          email: "",
          address: "",
          serialnumber: "",
          asset: "",
          assetid: "",
          assettype: "",
          orderdate: "",
          returndate: "",
          unitcost: "",
          comments: "",
          orderid: ""
        }
      ],
      tableDataInitial: [
        {
          name: "",
          prevname: "",
          contactno: "",
          email: "",
          address: "",
          serialnumber: "",
          asset: "",
          assetid: "",
          assettype: "",
          orderdate: "",
          returndate: "",
          unitcost: "",
          comments: "",
          orderid: ""
        }
      ],
      modifiedTableHeaders: [
        "Asset ID",
        "Serial Number",
        "Config Date",
        "Added To",
        "Action"
      ],
      damagedTableHeaders: ["Asset ID", "Serial Number", "Make", "Action"],
      // dimmer
      dimmerActive: false,
      customerAddressDetails: [],
      selectedorderids: [],

      repairedAssetSerialNo: "",
      repairedAssetList: [],
      acceptRepairedAssets: [],
      isSaving: false,
      addToInventorySuccessMessage: ""
    };
  }

  componentDidMount() {
    // fetch all customer details from database
    // fetch all customer details from database
    fetchAPI("/cust/get_customer", {})
      .then(r => r.json())
      .then(data => {
        //console.log(data)
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

    fetchAPI("/asset/get_asset", {})
      .then(r => r.json())
      .then(data => {
        // parsing json data (need to verify later)
        var i;
        var s = JSON.stringify(data, null, 2);
        var r = JSON.parse(s);
        for (i = 0; i < r.results.length; i++) {
          this.setState({
            categoryOptions: this.state.categoryOptions.concat([
              {
                key: r.results[i].id,
                id: r.results[i].id,
                text: r.results[i].type_name,
                value: r.results[i].type_name
              }
            ])
          });
        }
      })
      .catch(err => console.log(err));
  }

  callDamagedData = () => {
    fetchAPI("/asset/damaged_assets", {})
      .then(r => r.json())
      .then(data => {
        console.log("all damaged data");
        console.log(data);

        data.results.forEach(damage => {
          this.setState({
            damageList: this.state.damageList.concat({
              key: damage.id,
              value: damage.serial_no,
              text: damage.serial_no
            }),
            damageDetails: this.state.damageDetails.concat({
              id: damage.id,
              serialnumber: damage.serial_no,
              make: damage.make,
              status: damage.status
            })
          });
        });
      })
      .catch(err => console.log(err));
  };

  callModifiedData = () => {
    fetchAPI("/config/get_asset_config", {})
      .then(r => r.json())
      .then(data => {
        //console.log('all assets')
        //console.log(data)

        for (var i = 0; i < data.asset_config_id.length; i++) {
          this.setState({
            assetList: this.state.assetList.concat({
              key: data.asset_config_id[i].asset_id,
              value: data.asset_config_id[i].serial_no,
              text: data.asset_config_id[i].serial_no
            }),
            assetDetails: this.state.assetDetails.concat({
              id: data.asset_config_id[i].id,
              assetid: data.asset_config_id[i].asset_id,
              asset: data.asset_config_id[i].serial_no,
              childasset: data.asset_config_child[i].serial_no,
              configdate: data.asset_config_id[i].update_timestamp
            })
          });
        }
      })
      .catch(err => console.log(err));
  };

  populateCustomerData = () => {
    //console.log(this.state.customerDetails)
    var pname;
    this.state.customerDetails.forEach(customer => {
      if (customer.Customer_Id === this.state.selectedCustomerId) {
        if (customer.Previously_Known_As === null) pname = "";
        else pname = customer.Previously_Known_As;
        this.setState(
          {
            customerName: customer.CName,
            previousName: pname
          },
          this.getAllData
        );
        return;
      }
    });
  };

  populateAssetData = id => {
    this.state.assetDetails.forEach(asset => {
      if (asset.asset === this.state.selectedAssetId) {
        this.setState(
          {
            configTableID: asset.id,
            assetID: asset.assetid,
            assetSerialNumber: asset.asset,
            assetChildSerialNumber: asset.childasset,
            assetConfigDate: moment(asset.configdate).format(
              "YYYY-MM-DD HH:mm:ss"
            )
          },
          console.log(this.state.assetID + " " + this.state.assetSerialNumber)
        );
      }
    });
  };

  populateDamageData = id => {
    this.state.damageDetails.forEach(damage => {
      if (damage.serialnumber === this.state.selectedDamageId) {
        this.setState(
          {
            damageId: damage.id,
            damageSerialNumber: damage.serialnumber,
            damageMake: damage.make,
            damageStatus: damage.status
          },
          console.log(
            this.state.damageId +
              " " +
              this.state.damageSerialNumber +
              " " +
              this.state.damageStatus
          )
        );
      }
    });
  };

  getAllData = () => {
    this.setState({ dimmerActive: true });
    console.log(this.state.selectedCustomerId + " " + this.state.customerName);

    fetchAPI("/order/get_customer_order_details", {
      customer_id: this.state.selectedCustomerId
    })
      .then(r => r.json())
      .then(data => {
        // parsing json data
        //console.log(data)
        this.setState({
          tableData: [],
          tableDataInitial: [],
          dimmerActive: false
        });
        var dynadata = data.results;
        // console.log(dynadata)
        for (var i = 0; i < dynadata.length; i++) {
          let madate = "";
          let purdate = "";
          if (
            dynadata[i].order_date === "0000-00-00 00:00:00" ||
            dynadata[i].rental_end_date === "0000-00-00 00:00:00"
          ) {
            if (dynadata[i].order_date === "0000-00-00 00:00:00") madate = "";
            if (dynadata[i].rental_end_date === "0000-00-00 00:00:00")
              purdate = "";
          } else {
            madate = moment(dynadata[i].order_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            purdate = moment(dynadata[i].rental_end_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }

          this.setState({
            tableData: this.state.tableData.concat([
              {
                contactno: dynadata[i].Contact_Number_1,
                email: dynadata[i].Email_1,
                address: dynadata[i].Address,
                serialnumber: dynadata[i].serial_no,
                asset: dynadata[i].make,
                assetid: dynadata[i].asset_id,
                assettype: dynadata[i].type_name,
                orderdate: madate,
                returndate: purdate,
                unitcost: dynadata[i].total_unit_price,
                orderid: dynadata[i].oid,
                unique: `${
                  dynadata[i].ID
                }-${i}` /** appending the index within the unque value to make it more unique, solves the radio button malfunction bug */
              }
            ]),
            tableDataInitial: this.state.tableDataInitial.concat([
              {
                contactno: dynadata[i].Contact_Number_1,
                email: dynadata[i].Email_1,
                address: dynadata[i].Address,
                serialnumber: dynadata[i].serial_no,
                asset: dynadata[i].make,
                assetid: dynadata[i].asset_id,
                assettype: dynadata[i].type_name,
                orderdate: madate,
                returndate: purdate,
                unitcost: dynadata[i].total_unit_price,
                orderid: dynadata[i].oid
              }
            ])
          });
        }
      })
      .catch(err => {
        this.setState({ dimmerActive: false });
        console.log(err);
      });
  };

  removeConfigState = () => {
    //console.log(this.state.configTableID)
    fetchAPI("/asset/change_config_status", { id: this.state.configTableID })
      .then(r => r.json())
      .then(data => {
        this.setState(
          {
            modifiedButtonRender: false,
            assetList: [],
            assetDetails: []
          },
          this.callModifiedData
        );
      })
      .catch(err => console.log(err));
  };

  sendForRepair = () => {
    // console.log(this.state.damageId)
    fetchAPI("/asset/send_for_repair", {
      id: this.state.damageId,
      comments: this.state.damageComments
    })
      .then(r => r.json())
      .then(data => {
        this.setState(
          {
            damageButtonRender: false,
            damageList: [],
            damageDetails: [],
            damageComments: ""
          },
          this.callDamagedData
        );
      })
      .catch(err => console.log(err));
  };

  returnFromRepair = () => {
    // console.log(this.state.damageId)
    fetchAPI("/asset/return_from_repair", { id: this.state.damageId })
      .then(r => r.json())
      .then(data => {
        this.setState(
          {
            damageButtonRender: false,
            damageList: [],
            damageDetails: []
          },
          this.callDamagedData
        );
      })
      .catch(err => console.log(err));
  };

  renderAssetTable() {
    return (
      <div>
        <Label as="a" color="violet">
          <Icon name="pin" />Asset Modification Details
        </Label>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.modifiedTableHeaders.map(label => (
                <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{this.state.assetID}</Table.Cell>
              <Table.Cell>{this.state.assetSerialNumber}</Table.Cell>
              <Table.Cell>{this.state.assetConfigDate}</Table.Cell>
              <Table.Cell>{this.state.assetChildSerialNumber}</Table.Cell>
              <Table.Cell>
                {this.state.modifiedButtonRender ? (
                  <Button
                    width="100px"
                    color="red"
                    label="Remove"
                    onClick={this.removeConfigState}
                  >
                    <Icon name="remove circle" />
                  </Button>
                ) : (
                  undefined
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  renderDamageTable() {
    return (
      <div>
        <Label as="a" color="violet">
          <Icon name="pin" />Send For Repair
        </Label>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.damagedTableHeaders.map(label => (
                <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>{this.state.damageId}</Table.Cell>
              <Table.Cell>{this.state.damageSerialNumber}</Table.Cell>
              <Table.Cell>{this.state.damageMake}</Table.Cell>
              <Table.Cell>
                {this.state.damageButtonRender ? (
                  this.state.damageStatus !== "3" ? (
                    <Button
                      width="100px"
                      color="green"
                      label="Mark as Damaged"
                      onClick={this.sendForRepair}
                    >
                      <Icon name="send" />
                    </Button>
                  ) : (
                    <Button
                      width="100px"
                      color="green"
                      label="Return from Repair"
                      onClick={this.returnFromRepair}
                    >
                      <Icon name="send" />
                    </Button>
                  )
                ) : (
                  undefined
                )}
              </Table.Cell>
              <Table.Cell>
                {this.state.damageStatus !== "3" ? (
                  <Form.Input
                    label="Comments"
                    value={this.state.damageComments}
                    onChange={this.commentsChange}
                  />
                ) : (
                  undefined
                )}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    );
  }

  commentsChange = event =>
    this.setState({ damageComments: event.target.value });

  renderTable() {
    var { dimmerActive } = this.state;
    return (
      <div>
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          <Label as="a" color="violet">
            <Icon name="pin" />Ordered Items
          </Label>
          <Table color="teal" striped>
            <Table.Header>
              <Table.Row key="tableHeaders">
                {this.state.tableHeaders.map(label => (
                  <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.tableData.map((obj, idx) => (
                <Table.Row key={obj.unique} style={{ cursor: "pointer" }}>
                  <Table.Cell key={idx + "thisCell"}>
                    {/*<FormRadio style={{backgroundColor:'white'}}
                        onClick={this.checkedAssetsProper.bind(this,obj.assetid,obj)}/>*/}

                    <Form.Field>
                      <Radio
                        key={obj.unique + "this"}
                        label=""
                        name={obj.unique}
                        value={obj.unique + "this"}
                        checked={this.state[obj.unique] === obj.unique + "this"}
                        onChange={this.handleChange}
                        onClick={this.checkedAssetsProper.bind(
                          this,
                          obj.assetid,
                          obj
                        )}
                      />
                    </Form.Field>
                  </Table.Cell>
                  <Table.Cell key={obj.unique + "thatChel"}>
                    {/*<FormRadio style={{backgroundColor:'white'}}
                            onClick={this.checkedAssetsDamaged.bind(this,obj.assetid,obj)}/>*/}

                    {
                      <Form.Field>
                        <Radio
                          key={obj.unique + "that"}
                          label=""
                          name={obj.unique}
                          value={obj.unique + "that"}
                          checked={
                            this.state[obj.unique] === obj.unique + "that"
                          }
                          onChange={this.handleChange}
                          onClick={this.checkedAssetsDamaged.bind(
                            this,
                            obj.assetid,
                            obj
                          )}
                        />
                      </Form.Field>
                    }
                  </Table.Cell>
                  <Table.Cell key={obj.serialnumber}>
                    {obj.serialnumber}
                  </Table.Cell>
                  <Table.Cell key={obj.asset}>{obj.asset}</Table.Cell>
                  <Table.Cell key={obj.assetid}>{obj.assetid}</Table.Cell>
                  <Table.Cell key={obj.assettype}>{obj.assettype}</Table.Cell>
                  <Table.Cell key={obj.orderdate}>{obj.orderdate}</Table.Cell>
                  <Table.Cell key={obj.returndate}>{obj.returndate}</Table.Cell>
                  <Table.Cell key={obj.unitcost}>{obj.unitcost}</Table.Cell>
                  <Table.Cell>
                    <Form.Input
                      value={obj.comments}
                      onChange={this.changeComments.bind(
                        this,
                        obj.assetid,
                        obj
                      )}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <div>
            <center>
              <Button
                width="100px"
                color="blue"
                onClick={this.spliceNullCheck}
                label="Return"
              >
                <Icon name="add circle" />
              </Button>
            </center>
          </div>
        </Dimmer.Dimmable>
      </div>
    );
  }

  CustomerInfoTable() {
    var { dimmerActive } = this.state;
    return (
      <div>
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Loading</Loader>
          </Dimmer>
          <Label as="a" color="violet">
            <Icon name="user" />Customer Information
          </Label>
          <Table color="teal" striped>
            <Table.Header>
              <Table.Row>
                {this.state.CustomerInfotableHeaders.map(label => (
                  <Table.HeaderCell key={label + "custInfo"}>
                    {label}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.tableData[0] && (
                <Table.Row
                  key={this.state.tableData[0].assetid + "custInfo"}
                  style={{ cursor: "pointer" }}
                >
                  <Table.Cell>{this.state.customerName}</Table.Cell>
                  <Table.Cell>{this.state.previousName}</Table.Cell>
                  <Table.Cell>{this.state.tableData[0].contactno}</Table.Cell>
                  <Table.Cell>{this.state.tableData[0].email}</Table.Cell>
                  <Table.Cell>{this.state.tableData[0].address}</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Dimmer.Dimmable>
      </div>
    );
  }

  changeComments = (id, obj, event) => {
    var arr = this.state.tableDataInitial;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].assetid === id) {
        arr[i].comments = event.target.value;
      }
    }
    this.setState({ tableDataInitial: arr });
  };

  spliceNullCheck = () => {
    var arr = [];
    var count = 0;
    for (var i = 1; i < this.state.selectedcheckboxasset.length; i++) {
      arr[count] = this.state.selectedcheckboxasset[i];
      count = count + 1;
    }
    this.setState({ selectedcheckboxasset: arr }, this.commentsSet);
  };

  commentsSet = () => {
    var arrchk = this.state.selectedcheckboxasset;
    var arrtbl = this.state.tableDataInitial;
    var arrod = [];
    var count = 0;
    for (var i = 0; i < arrtbl.length; i++) {
      for (var j = 0; j < arrchk.length; j++) {
        if (arrtbl[i].assetid === arrchk[j].id) {
          arrod[count] = arrtbl[i].orderid;
          count = count + 1;
          if (arrtbl[i].comments) arrchk[j].comments = arrtbl[i].comments;
          else arrchk[j].comments = "";
        }
      }
    }
    this.setState(
      {
        selectedcheckboxasset: arrchk,
        selectedorderids: arrod
      },
      this.submitData
    );
  };

  submitData = () => {
    fetchAPI("/asset/change_status_on_return", {
      data: this.state.selectedcheckboxasset,
      oid: this.state.selectedorderids
    })
      .then(r => r.json())
      .then(data => {
        notify.success("Data Submitted");
      })
      .catch(err => console.log(err));
  };

  checkedAssetsProper = (id, obj) => {
    var counter = 0;
    var arr = this.state.selectedcheckboxasset;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        counter = 1;
        arr.splice(i, 1);
        break;
      }
    }
    if (counter === 0) {
      this.setState({
        selectedcheckboxasset: this.state.selectedcheckboxasset.concat([
          {
            id: id,
            status: "1"
          }
        ])
      });
    } else {
      this.setState({ selectedcheckboxasset: arr });
    }
  };

  handleChange = (e, { name, value }) => {
    console.log("e", name);
    //console.log('v',value;);
    this.setState({ [name]: value });
  };

  checkedAssetsDamaged = (id, obj) => {
    var counter = 0;
    var arr = this.state.selectedcheckboxasset;
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        counter = 1;
        arr.splice(i, 1);
        break;
      }
    }
    if (counter === 0) {
      this.setState({
        selectedcheckboxasset: this.state.selectedcheckboxasset.concat([
          {
            id: id,
            status: "2"
          }
        ])
      });
    } else {
      this.setState({ selectedcheckboxasset: arr });
    }
  };

  showReturnedAssetPage() {
    //console.log(this.state.customerId)
    return (
      <Segment>
        <div style={{}}>
          <label>Select Customer:</label>
          <Dropdown
            icon="search"
            fluid
            search
            selection
            value={this.state.selectedCustomerId}
            onChange={(e, data) =>
              this.setState(
                { selectedCustomerId: data.value },
                this.populateCustomerData
              )
            }
            placeholder="Select a Customer"
            options={this.state.customerList}
          />
        </div>
        {this.SerialFilterForm()}
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            overflowY: "hidden",
            marginBottom: "10px"
          }}
        >
          {this.state.selectedCustomerId !== ""
            ? this.CustomerInfoTable()
            : undefined}
        </div>
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          {this.state.selectedCustomerId !== ""
            ? this.renderTable()
            : undefined}
        </div>
      </Segment>
    );
  }

  showModifiedAssetPage() {
    return (
      <Segment>
        <div style={{}}>
          <label>Select Asset Serial Number:</label>
          <Dropdown
            icon="search"
            fluid
            search
            selection
            value={this.state.selectedAssetId}
            onChange={(e, data) =>
              this.setState(
                { selectedAssetId: data.value, modifiedButtonRender: true },
                this.populateAssetData
              )
            }
            placeholder="Enter Serial Number"
            options={this.state.assetList}
          />

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              marginBottom: "10px"
            }}
          >
            {this.state.assetID ? this.CustomerInfoTable() : undefined}
          </div>

          <div
            style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
          >
            {this.state.assetID ? this.renderAssetTable() : undefined}
          </div>
        </div>
      </Segment>
    );
  }

  showDamagedAssetPage() {
    return (
      <Segment>
        <div style={{}}>
          <label>Select Asset Serial Number:</label>
          <Dropdown
            icon="search"
            fluid
            search
            selection
            value={this.state.selectedDamageId}
            onChange={(e, data) =>
              this.setState(
                { selectedDamageId: data.value, damageButtonRender: true },
                this.populateDamageData
              )
            }
            placeholder="Enter Serial Number"
            options={this.state.damageList}
          />

          <div
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              marginBottom: "10px"
            }}
          >
            {this.state.damageId ? this.CustomerInfoTable() : undefined}
          </div>
          <div
            style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
          >
            {this.state.damageId ? this.renderDamageTable() : undefined}
          </div>
        </div>
      </Segment>
    );
  }

  selectedAssetType = (event, d) => {
    //console.log(this.state.selectedCategory)
    var value = d.value;
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj => obj.assettype.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.setState({ tableData });
  };

  renderCategoryDropdown() {
    return (
      <div className="field">
        <label>Category:</label>
        <Form key="renderCategoryDropdown">
          <Form.Group widths="equal">
            <Form.Select
              onChange={(e, data) =>
                this.setState(
                  { selectedCategory: data.value },
                  this.selectedAssetType(e, data)
                )
              }
              value={this.state.selectedCategory}
              size="small"
              style={{ maxWidth: "400px" }}
              placeholder="Select Category"
              options={this.state.categoryOptions}
            />
          </Form.Group>
        </Form>
      </div>
    );
  }

  SerialFilterForm = () => (
    <Segment>
      <Header as="h5">
        <Icon name="filter" />
        <Header.Content>Filter By Serial Number:</Header.Content>
      </Header>
      <Form key="SerialFilterForm">
        <Form.Input
          label="Serial Number"
          type="text"
          style={{ maxWidth: "400px" }}
          placeholder="Filter by Serial Number"
          onChange={this.onChangeSerialFilter}
        />
        <Divider />
        {this.renderCategoryDropdown()}
      </Form>
    </Segment>
  );
  onChangeChallanNumber = event =>
    this.setState({ challannumber: event.target.value }, this.getAllData);
  onChangeSerialFilter = event =>
    this.setState(
      { filterSerialNumber: event.target.value },
      this.filterResult
    );

  filterResult = () => {
    //console.log(this.state.tableData)
    var value = this.state.filterSerialNumber;
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj => obj.serialnumber.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.setState({ tableData });
  };

  async searchRepairedAssetOnEnter(e) {
    if (e.keyCode !== 13) {
      return;
    }

    const { repairedAssetSerialNo } = this.state;
    if (!repairedAssetSerialNo) {
      return;
    }

    this.setState({ addToInventorySuccessMessage: "" });
    try {
      const res = await fetchAPI("/asset/search_by_serial_no", {
        serial_nos: repairedAssetSerialNo
      });
      const data = await res.json();
      if (data.assets) {
        this.setState({
          repairedAssetList: data.assets,
          acceptRepairedAssets: []
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  onChangeAcceptRepairedAsset(e, data) {
    const { assetId, checked } = data;
    let acceptRepairedAssets = this.state.acceptRepairedAssets.slice();
    if (checked) {
      acceptRepairedAssets.push(assetId);
    } else {
      const idx = acceptRepairedAssets.indexOf(assetId);
      if (idx >= 0) {
        acceptRepairedAssets.splice(idx, 1);
      }
    }
    this.setState({ acceptRepairedAssets });
  }

  async onAddToInventory() {
    try {
      this.setState({ isSaving: true });
      const res = await fetchAPI("/asset/reset_inventory_status", {
        data: this.state.acceptRepairedAssets
      });
      const data = await res.json();
      if (data.isSuccess) {
        const addToInventorySuccessMessage =
          "Selected Components are successfully added to inventory.";
        const isSaving = false;
        const acceptRepairedAssets = [];
        this.setState({
          isSaving,
          acceptRepairedAssets,
          addToInventorySuccessMessage
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({ isSaving: false });
    }
  }

  showAcceptRepairedAssetPage() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Segment>
          <Header as="h5">
            <Icon name="search" />
            <Header.Content>Search By Serial Number:</Header.Content>
          </Header>
          <Input
            placeholder="Enter comma separated serial nos"
            fluid
            focus
            icon="search"
            value={this.state.repairedAssetSerialNo}
            onChange={e =>
              this.setState({ repairedAssetSerialNo: e.target.value })
            }
            onKeyUp={this.searchRepairedAssetOnEnter.bind(this)}
          />
          <br />
          <Divider />
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Serial No</Table.HeaderCell>
                <Table.HeaderCell>Category</Table.HeaderCell>
                <Table.HeaderCell>Make</Table.HeaderCell>
                <Table.HeaderCell>Part Code</Table.HeaderCell>
                <Table.HeaderCell>HSN Code</Table.HeaderCell>
                <Table.HeaderCell>Branch</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.repairedAssetList.map(asset => (
                <Table.Row key={asset.asset_id}>
                  <Table.Cell>
                    <Checkbox
                      assetId={asset.asset_id}
                      checked={
                        this.state.acceptRepairedAssets.indexOf(
                          asset.asset_id
                        ) >= 0
                      }
                      onChange={this.onChangeAcceptRepairedAsset.bind(this)}
                    />
                  </Table.Cell>
                  <Table.Cell>{asset.serial_no}</Table.Cell>
                  <Table.Cell>{asset.type_name}</Table.Cell>
                  <Table.Cell>{asset.make}</Table.Cell>
                  <Table.Cell>{asset.part_code}</Table.Cell>
                  <Table.Cell>{asset.hsn_code}</Table.Cell>
                  <Table.Cell>{asset.branch}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan={7}>
                  <Button
                    floated="left"
                    icon
                    labelPosition="left"
                    primary
                    size="small"
                    disabled={this.state.acceptRepairedAssets.length === 0}
                    onClick={this.onAddToInventory.bind(this)}
                  >
                    <Icon name="add circle" /> Add To Inventory
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
          {this.state.addToInventorySuccessMessage ? (
            <Message
              positive
              content={this.state.addToInventorySuccessMessage}
            />
          ) : (
            false
          )}
        </Segment>
      </div>
    );
  }

  onClickButtonGroup(btn) {
    const returnedAssetState = btn === 1 ? true : false;
    const modifiedAssetState = btn === 2 ? true : false;
    const damagedAssetState = btn === 3 ? true : false;
    const acceptRepairedAssetState = btn === 4 ? true : false;
    this.setState({
      returnedAssetState,
      modifiedAssetState,
      damagedAssetState,
      acceptRepairedAssetState
    });

    if (btn === 2) {
      this.callModifiedData();
    }

    if (btn === 3) {
      this.callDamagedData();
    }
  }

  renderButtonGroup() {
    return (
      <Button.Group attached="top">
        <Button color="green" onClick={() => this.onClickButtonGroup(1)}>
          <Icon name="configure" />Manage Returned Assets
        </Button>
        <Button color="blue" onClick={() => this.onClickButtonGroup(2)}>
          <Icon name="plug" />Manage Modified Components
        </Button>
        <Button color="teal" onClick={() => this.onClickButtonGroup(3)}>
          <Icon name="broken chain" />Manage Damaged Components
        </Button>
        <Button color="olive" onClick={() => this.onClickButtonGroup(4)}>
          <Icon name="podcast" />Accept Repaired Component
        </Button>
      </Button.Group>
    );
  }

  renderMainSegment() {
    if (this.state.returnedAssetState) {
      return this.showReturnedAssetPage();
    }

    if (this.state.returnedAssetState) {
      return this.showReturnedAssetPage();
    }

    if (this.state.modifiedAssetState) {
      return this.showModifiedAssetPage();
    }

    if (this.state.damagedAssetState) {
      return this.showDamagedAssetPage();
    }

    if (this.state.acceptRepairedAssetState) {
      return this.showAcceptRepairedAssetPage();
    }
  }

  render() {
    //console.log(this.state)
    return (
      <div>
        {this.renderButtonGroup()}
        <Segment attached>{this.renderMainSegment()}</Segment>
      </div>
    );
  }
}
export default ReturnAssets;
