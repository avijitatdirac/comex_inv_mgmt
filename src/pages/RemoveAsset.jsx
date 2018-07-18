import React, { Component } from "react";
import {
  TextArea,
  Dimmer,
  Loader,
  Container,
  Divider,
  Button,
  Form,
  Table,
  Icon,
  Header,
  Segment,
  Label
} from "semantic-ui-react";
import moment from "moment";
import { fetchAPI } from "../utility";

const branchOptions = [
  { key: "a", text: "Pune", value: "Pune" },
  { key: "b", text: "Bangalore", value: "Bangalore" },
  { key: "c", text: "Kolkata", value: "Kolkata" }
];

class RemoveAsset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dimmerActiveRm: false,
      isDamaged: true,
      filterSerialNumber: "",
      rmSelectedAssetType: "",
      make: "",
      serialnumber: "",
      status: "",
      selectedCategory: "Please select Asset Type",
      categoryOptions: [],
      assetTypeAttributes: [],
      selectedItemId: null,
      selectedItemsCount: 0,

      // for modal window
      isOpenModal: false,

      selectedBranch: [],
      rmSelectedBranch: [],

      // selected irem from table
      selectedItem: "",
      attrid: "",
      attrvalue: "",
      // names of all dynamic attributes
      dynaHeaders: [],

      //all selected table assets
      selectedasset: [],
      rmassetTypeAttributes: [],

      removestate: false,
      // names of all static table attribures
      tableHeaders: [
        "Asset ID",
        "Make",
        "Warranty End Date",
        "Serial No",
        "Purchase Date",
        "Purchase Price",
        "Procurement Date",
        "Status",
        "Part Code",
        "Branch",
        "Transfer Order No",
        "Transfer Order Date"
      ],

      // temporary array to hold table data (used for filter)
      tableDataInitial: [
        {
          assetId: "",
          make: "",
          makeDate: "",
          serialNo: "",
          purchaseDate: "",
          purchasePrice: "",
          procurementDate: "",
          status: "",
          partCode: "",
          inventorySource: "",
          transferOrderNo: "",
          transferOrderDate: "",
          dynaData: []
        }
      ],
      // array that holds all the data of the table
      tableData: [
        {
          assetId: "",
          make: "",
          makeDate: "",
          serialNo: "",
          purchaseDate: "",
          purchasePrice: "",
          procurementDate: "",
          status: "",
          partCode: "",
          inventorySource: "",
          transferOrderNo: "",
          transferOrderDate: "",
          dynaData: []
        }
      ],
      // dimmer
      dimmerActive: false,
      comment: ""
    }; // end of this.state
  } // end of constructor

  // database operations
  componentWillMount = () => {
    fetchAPI("/asset/get_asset", {})
      .then(r => r.json())
      .then(data => {
        // parsing json data
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
  };

  // render main page
  render() {
    const { dimmerActive } = this.state;
    return (
      <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
        <Dimmer active={dimmerActive} inverted>
          <Loader>Loading</Loader>
        </Dimmer>
        <div>
          {!this.state.isCheckedOut
            ? this.renderDisplayAsset()
            : this.renderCheckout()}
        </div>
      </Dimmer.Dimmable>
    );
  }

  renderDisplayAsset = () => {
    return (
      <div>
        <Container color="blue" textAlign="center">
          <h1>Remove Asset</h1>
          <br />
        </Container>
        <div style={{ display: "flex" }}>{this.renderCategoryDropdown()}</div>
        <br />
        <Divider />
        <Form>
          <div>
            {!this.state.isOpenModal &&
            this.state.selectedCategory !== "Please select Asset Type"
              ? this.DynamicAttributesForm()
              : undefined}
          </div>
        </Form>
        <Divider />
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          {this.state.isOpenModal
            ? this.state.removestate
              ? this.modalRemove()
              : this.renderModal()
            : this.renderTable()}
        </div>
        <div>{this.renderDisplayPageButton()}</div>
      </div>
    );
  };

  renderDisplayPageButton() {
    return (
      <Button
        primary
        style={{ margin: "10px" }}
        onClick={() => this.props.history.push("/displayAssets")}
        color="blue"
      >
        <Icon name="wrench" />
        Order Page
      </Button>
    );
  }

  onSelectAssetType = (event, data) => {
    this.setState(state => ({
      selectedCategory: data.value,
      dimmerActive: true
    }));

    // fetch by name and get the attributes
    fetchAPI("/asset/get_all_modifiable_values", { type_name: data.value })
      .then(r => r.json())
      .then(data => {
        // parsing json data
        this.setState({
          assetTypeAttributes: [],
          tableHeaders: [
            "Asset ID",
            "Make",
            "Warranty End Date",
            "Serial No",
            "Purchase Date",
            "Purchase Price",
            "Procurement Date",
            "Status",
            "Part Code",
            "Branch",
            "Transfer Order No",
            "Transfer Order Date"
          ],

          tableData: [],
          tableDataInitial: []
        });

        var i;
        var dyna = JSON.stringify(data.dyna, null, 2);
        var stat = JSON.stringify(data.static, null, 2);
        var dynar = JSON.parse(dyna);
        var staticr = JSON.parse(stat);
        var statlen = staticr.length;
        var dynalen = dynar.length;

        this.setState({ dynaHeaders: [] });
        for (i = 0; i < dynalen / statlen; i++) {
          // append to state.assetTypes
          this.setState({
            assetTypeAttributes: this.state.assetTypeAttributes.concat([
              {
                name: dynar[i].attr_name
              }
            ]),
            tableHeaders: this.state.tableHeaders.concat([dynar[i].attr_name]),
            dynaHeaders: this.state.dynaHeaders.concat([dynar[i].attr_name])
          });
        }

        var dynaAttribCount = dynalen / statlen;
        var j;

        for (i = 0; i < statlen; i++) {
          var darray = [];
          for (j = 0; j < dynaAttribCount; j++) {
            darray[j] = {
              name: dynar[i * dynaAttribCount + j].attr_name,
              value: dynar[i * dynaAttribCount + j].attribute_value,
              attribute_id: dynar[i * dynaAttribCount + j].attribute_id
            };
          }
          let madate = "";
          let purdate = "";
          let procdate = "";
          let todate = "";

          if (
            staticr[i].warranty_end_date === "0000-00-00 00:00:00" ||
            staticr[i].purchase_date === "0000-00-00 00:00:00" ||
            staticr[i].procurement_date === "0000-00-00 00:00:00" ||
            staticr[i].transfer_order_date === "0000-00-00 00:00:00"
          ) {
            if (staticr[i].warranty_end_date === "0000-00-00 00:00:00")
              madate = "";
            if (staticr[i].purchase_date === "0000-00-00 00:00:00")
              purdate = "";
            if (staticr[i].procurement_date === "0000-00-00 00:00:00")
              procdate = "";
            if (staticr[i].transfer_order_date === "0000-00-00 00:00:00")
              todate = "";
          } else {
            madate = moment(staticr[i].warranty_end_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            purdate = moment(staticr[i].purchase_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            procdate = moment(staticr[i].procurement_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
            todate = moment(staticr[i].transfer_order_date).format(
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          this.setState({
            tableData: this.state.tableData.concat([
              {
                assetId: staticr[i].id,
                assetTypeId: staticr[i].asset_type_id,
                make: staticr[i].make,
                warrantyEndDate: madate,
                serialNo: staticr[i].serial_no,
                purchaseDate: purdate,
                purchasePrice: staticr[i].purchase_price,
                procurementDate: procdate,
                status: staticr[i].status,
                partCode: staticr[i].part_code,
                branch: staticr[i].branch,
                transferOrderNo: staticr[i].transfer_order_no,
                transferOrderDate: todate,
                dynaData: darray
              }
            ]),
            tableDataInitial: this.state.tableDataInitial.concat([
              {
                assetId: staticr[i].id,
                assetTypeId: staticr[i].asset_type_id,
                make: staticr[i].make,
                warrantyEndDate: madate,
                serialNo: staticr[i].serial_no,
                purchaseDate: purdate,
                purchasePrice: staticr[i].purchase_price,
                procurementDate: procdate,
                status: staticr[i].status,
                partCode: staticr[i].part_code,
                branch: staticr[i].branch,
                transferOrderNo: staticr[i].transfer_order_no,
                transferOrderDate: todate,
                dynaData: darray
              }
            ])
          });
        }
        this.setState({ dimmerActive: false });
      })
      .catch(err => console.log(err));
  };

  /**
   * renders the category selection dropdown
   */
  renderCategoryDropdown() {
    return (
      <div className="field">
        <label>Category:</label>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              onChange={this.onSelectAssetType}
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

  // when attribute value changes
  onAttributeValueChange = idx => evt => {
    const newAttribute = this.state.rmassetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, value: evt.target.value };
      }
    );
    this.setState({ rmassetTypeAttributes: newAttribute });
  };

  onChangeBranch = (evt, data) =>
    this.setState({ selectedBranch: data.value }, this.filterBranch);
  rmOnChangeBranch = (evt, data) =>
    this.setState({ rmSelectedBranch: data.value });

  DynamicAttributesForm = () => (
    <Segment>
      <Form>
        <Form.Select
          onChange={this.onChangeBranch}
          value={this.state.selectedBranch}
          size="small"
          label="Choose Branch to Display Asset From: "
          style={{ maxWidth: "400px" }}
          placeholder="Select Branch"
          options={branchOptions}
        />
      </Form>
      <Divider />
      <Header as="h5">
        <Icon name="filter" />
        <Header.Content>Filter By Serial Number:</Header.Content>
      </Header>
      <Form>
        <Form.Input
          width={4}
          label="Serial Number"
          type="text"
          placeholder="Filter by Serial Number"
          onChange={this.onChangeSerialFilter}
        />
      </Form>
    </Segment>
  );
  onChangeSerialFilter = event =>
    this.setState(
      { filterSerialNumber: event.target.value },
      this.filterResult
    );

  /**
   * renders the Inventory table depending on the selected category
   */
  renderTable() {
    if (this.state.selectedCategory !== "Please select Asset Type") {
      return (
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.tableHeaders.map(label => (
                <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {this.state.tableData.map(obj => (
              <Table.Row
                key={obj.assetId}
                style={{ cursor: "pointer" }}
                onClick={this.openModal.bind(this, obj.assetId, obj)}
              >
                <Table.Cell>{obj.assetId}</Table.Cell>
                <Table.Cell>{obj.make}</Table.Cell>
                <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                <Table.Cell>{obj.serialNo}</Table.Cell>
                <Table.Cell>{obj.purchaseDate}</Table.Cell>
                <Table.Cell>{obj.purchasePrice}</Table.Cell>
                <Table.Cell>{obj.procurementDate}</Table.Cell>
                {obj.status === "1" ? (
                  <Table.Cell>{"In Stock"}</Table.Cell>
                ) : (
                  <Table.Cell>{"Out of Stock/Damaged"}</Table.Cell>
                )}
                <Table.Cell>{obj.partCode}</Table.Cell>
                <Table.Cell>{obj.branch}</Table.Cell>
                <Table.Cell>{obj.transferOrderNo}</Table.Cell>
                <Table.Cell>{obj.transferOrderDate}</Table.Cell>
                {/* inflate the dynamic data here */}

                {obj.dynaData.map(obj2 => (
                  <Table.Cell>{obj2.value}</Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      );
    } else {
      return false;
    }
  }

  renderAddInventoryButton() {
    return (
      <Button
        primary
        style={{ margin: "10px" }}
        onClick={() => this.props.history.push("/addAsset")}
      >
        Add Items To Inventory
      </Button>
    );
  }
  setModalClose = () => {
    this.setState({ isOpenModal: false });
  };
  setmRemoveClose = () => {
    this.setState({
      removestate: false,
      isOpenModal: false,
      selectedCategory: "Please select Asset Type",
      rmassetTypeAttributes: []
    });
  };

  rmOnSelectAssetType = (event, data) => {
    // // fetch by name and get the attributes
    this.setState({
      rmSelectedAssetType: data.value
    });
    fetchAPI("/asset/get_asset_type", { type_name: data.value })
      .then(r => r.json())
      .then(data => {
        // parsing json data
        var i;
        var s = JSON.stringify(data, null, 2);
        var r = JSON.parse(s);
        this.setState({
          rmassetTypeAttributes: []
        });

        for (i = 0; i < r.results.length; i++) {
          // append to state.assetTypes
          this.setState({
            rmassetTypeAttributes: this.state.rmassetTypeAttributes.concat([
              {
                id: r.results[i].id,
                value: "",
                name: r.results[i].attr_name
              }
            ])
          });
        }
      })
      .catch(err => console.log(err));
  };

  attributeDetailsNullDimmer = () => {
    this.setState(
      {
        dimmerActiveRm: true
      },
      this.attributeDetailsNull
    );
  };

  attributeDetailsNull = () => {
    var dmgStatus;
    if (this.state.isDamaged === true) dmgStatus = 2;
    else dmgStatus = 1;
    this.setState(
      {
        status: dmgStatus
      },
      this.attributeDetailsSubmit
    );
  };

  attributeDetailsSubmit = () => {
    fetchAPI("/assest/remove_asset_value", {
      asset_id: this.state.selectedasset.assetId,
      attribute_id: this.state.attrid,
      attribute_value: this.state.attrvalue
    })
      .then(r => r.json())
      .then(data => {})
      .catch(err => console.log(err));

    let url = "/asset/insert_asset_value";
    let type_name = this.state.rmSelectedAssetType;
    let staticAttr = {
      serialNo: this.state.serialnumber,
      purchaseDate: "",
      transferOrderDate: "",
      purchasePrice: "",
      supplier: "",
      warehouseLocation: "",
      showroom: "",
      procurementDate: "",
      status: this.state.status,
      partCode: "",
      supplierInvoiceNo: "",
      supplierInvoiceDate: "",
      make: this.state.make,
      warrantyEndDate: "",
      comment: this.state.comment,
      transferOrder: "",
      branch: this.state.rmSelectedBranch
    };
    let dynamic = this.state.rmassetTypeAttributes;

    // save asset in db
    fetchAPI(url, { type_name, static: staticAttr, dynamic })
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          fetchAPI("/config/change_config_table_on_delete", {
            asset_id: this.state.selectedasset.assetId,
            serial_no: this.state.serialnumber
          })
            .then(r => r.json())
            .then(data => {
              this.setState({
                dimmerActiveRm: false
              });
            })
            .catch(err => {
              console.log(err);
              this.setState({ dimmerActiveRm: false });
            });
        }
      })
      .catch(err => console.log(err));
  };

  onChangeMake = event => this.setState({ make: event.target.value });
  onChangeSerialNumber = event =>
    this.setState({ serialnumber: event.target.value });
  onChangeComment = event => this.setState({ comment: event.target.value });
  onDamagedChange = event => this.setState({ isDamaged: event.target.checked });

  modalRemove() {
    const { dimmerActiveRm } = this.state;
    return (
      <div className="page">
        <Segment>
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActiveRm}>
            <Dimmer active={dimmerActiveRm} inverted>
              <Loader>Submitting Data</Loader>
            </Dimmer>
            <Label as="a" color="violet" ribbon>
              <Icon name="shopping basket" />Adding as New Asset
            </Label>
            <br />
            <br />
            <Form.Select
              placeholder="Select Category"
              options={this.state.categoryOptions}
              onChange={this.rmOnSelectAssetType}
            />
            <br />
            <Table color="teal" striped>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Component Type</Table.HeaderCell>
                  <Table.HeaderCell>Component Details</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>Enter Serial Number</Table.Cell>
                  <Table.Cell>
                    <Form.Input
                      width={14}
                      type="text"
                      placeholder="Enter Serial Number"
                      onChange={this.onChangeSerialNumber}
                    />
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Enter Make</Table.Cell>
                  <Table.Cell>
                    <Form.Input
                      width={14}
                      type="text"
                      placeholder="Enter Make"
                      onChange={this.onChangeMake}
                    />
                  </Table.Cell>
                  <Table.Row>
                    <Table.Cell>Enter Branch</Table.Cell>
                    <Table.Cell>
                      <Form.Select
                        onChange={this.rmOnChangeBranch}
                        value={this.state.rmSelectedBranch}
                        size="small"
                        style={{ maxWidth: "400px" }}
                        placeholder="Select Branch"
                        options={branchOptions}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Is Damaged</Table.Cell>
                  <Table.Cell>
                    <Form.Input
                      type="Checkbox"
                      defaultChecked="true"
                      checked={this.state.isDamaged}
                      onChange={this.onDamagedChange}
                    />
                  </Table.Cell>
                </Table.Row>
                {this.state.rmassetTypeAttributes.map((attribute, idx) => (
                  <Table.Row>
                    <Table.Cell>{attribute.name}</Table.Cell>
                    <Table.Cell>
                      <Form.Input
                        width={14}
                        type="text"
                        placeholder={`Enter ${attribute.name}`}
                        onChange={this.onAttributeValueChange(idx)}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Cell>Enter Comments</Table.Cell>
                  <Table.Cell>
                    <TextArea
                      onChange={this.onChangeComment}
                      width={20}
                      placeholder="Comment"
                      style={{ minHeight: 100 }}
                    />
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell>
                    <Button onClick={this.setmRemoveClose} color="blue">
                      <Icon name="undo" />Back
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    {this.state.serialnumber !== "" &&
                    this.state.make !== "" &&
                    this.state.rmSelectedAssetType !== "" ? (
                      <Button
                        onClick={this.attributeDetailsNullDimmer}
                        color="blue"
                      >
                        <Icon name="save" />Submit
                      </Button>
                    ) : (
                      undefined
                    )}
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </Dimmer.Dimmable>
        </Segment>
      </div>
    );
  }

  mRemove = obj => {
    console.log(obj.value);
    this.setState({
      removestate: true,
      attrid: obj.attribute_id,
      attrvalue: obj.value
    });
  };

  // DynamicAttributesChange = () => (

  //     <Segment>
  //         <Table striped>
  //             <Table.Row columns={4}>
  //                 {this.state.selectedasset.dynaData.map(obj => (
  //                     <Grid.Column>
  //                         <div>
  //                             <Label>{obj.name} {obj.value}</Label>
  //                             {
  //                                 (obj.value.indexOf('removed') === -1 && obj.value !=="")
  //                                     ?
  //                                     <Button onClick={this.mRemove.bind(this, obj)}><Icon name="trash outline" />Remove</Button>
  //                                     :
  //                                     undefined
  //                             }
  //                         </div>
  //                     </Grid.Column>
  //                 ))}
  //             </Table.Row>
  //         </Table>
  //     </Segment>
  // )
  DynamicAttributesChange = () => (
    <div className="page">
      <Segment>
        <Label as="a" color="purple" ribbon>
          <Icon name="cogs" />Available Components
        </Label>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Component Type</Table.HeaderCell>
              <Table.HeaderCell>Component Details</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.selectedasset.dynaData.map(obj => (
              <Table.Row key={obj.assetId} style={{ cursor: "pointer" }}>
                <Table.Cell>{obj.name}</Table.Cell>
                <Table.Cell>{obj.value}</Table.Cell>
                <Table.Cell>
                  {obj.value.indexOf("removed") === -1 && obj.value !== "" ? (
                    <Icon
                      name="remove circle outline"
                      color="green"
                      onClick={this.mRemove.bind(this, obj)}
                    />
                  ) : (
                    <Icon name="radio" color="red" />
                  )}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Segment>
    </div>
  );

  renderModal() {
    //console.log(this.state.selectedasset)
    return (
      <Form>
        {this.DynamicAttributesChange()}
        <div>
          <Button onClick={this.setModalClose} color="blue">
            <Icon name="undo" />Back
          </Button>
        </div>
      </Form>
    );
  }

  /**
   * onChange callback for Select Category Dropdown
   */
  changeCategory = (evt, data) => {
    this.setState(state => ({ selectedCategory: data.value }));
  };

  /**
   * onClick callback for table row, opens the modal when clicked on any row
   */
  openModal = (id, obj) => {
    //console.log(obj)
    this.setState({
      selectedasset: obj,
      isOpenModal: true
    });
  };

  /**
   * onClose callback for Modal popup which is opened on click of any row in the table
   */
  onModalClose = () =>
    this.setState({
      isOpenModal: false
    });

  filterResult = () => {
    console.log(this.state.tableData);
    var value = this.state.filterSerialNumber;
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj => obj.serialNo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.setState({ tableData });
  };

  filterBranch = () => {
    //console.log(this.state.tableData)
    var value = this.state.selectedBranch;
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj => obj.branch.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.setState({ tableData });
  };

  /**
   * [helper function to update state]
   * NOTE: this function only updates top level properties,
   * and will not be able to update any nested properties
   * @param {[type]} key [the key in the state which needs to be updated]
   * @param {[type]} value [corresponding value which will be updated in the state]
   * @return {[type]} [undefined]
   */
  updateState = (key, value) => {
    if (key) {
      this.setState({ [key]: value });
    }
  };
  generateChallan = () => this.props.history.push("/generateChallan");
}

export default RemoveAsset;
