import React, { Component } from "react";
import {
  Container,
  Dropdown,
  Divider,
  Button,
  Form,
  Table,
  Icon,
  Header,
  Segment
} from "semantic-ui-react";
import moment from "moment";
import { fetchAPI } from "../utility";

const branchOptions = [
  { key: "a", text: "Pune", value: "Pune" },
  { key: "b", text: "Bangalore", value: "Bangalore" },
  { key: "c", text: "Kolkata", value: "Kolkata" }
];

class AssetAddition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedAssetSerialNo: "",
      assetList: [],
      assetHeaders: [
        "Asset ID",
        "Make",
        "Warranty End Date",
        "Serial No",
        "Purchase Date",
        "Purchase Price",
        "Procurement Date",
        "Part Code",
        "Branch",
        "Transfer Order No",
        "Transfer Order Date"
      ],
      assetTypeAttributes: [],
      selectedBranch: "",
      filterSerialNumber: "",
      staticDetails: [],
      assetDetails: [],
      assetId: "",
      make: "",
      warrantyEndData: "",
      serialNo: "",
      purchaseDate: "",
      purchasePrice: "",
      procurementDate: "",
      partCode: "",
      branch: "",
      transferOrderNo: "",
      transferOrderDate: "",
      assetTableDetails: [],
      categoryOptions: [],
      selectedCategory: "Please select Asset Type",
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
      tempTableHeaders: [],
      tempTableData: [],

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
      customerAssetData: [],

      dimmerActive: false,
      selectedCustomerId: "",
      customerList: []
    };
  }

  componentWillMount() {
    fetchAPI("/cust/get_customer", {})
      .then(r => r.json())
      .then(data => {
        //console.log(data)
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

    fetchAPI("/order/get_customer_assets_for_addassetpage", {})
      .then(r => r.json())
      .then(data => {
        //console.log(data)
        var arr = [];

        data.results.forEach(customer => {
          arr = arr.concat(customer);
        });
        this.setState({
          customerAssetData: arr
        });
      });

    fetchAPI("/asset/get_out_of_stock_assets", {})
      .then(r => r.json())
      .then(data => {
        //console.log(data)
        //var alist=[]
        var adlist = [];
        var sdetails = [];

        // var staticlen = data.static.length;
        // var dynalen = data.dynamic.length;
        data.static.forEach(obj => {
          // alist=alist.concat({
          //     key: obj.id,
          //     value: obj.id,
          //     text: obj.serial_no
          // })
          sdetails = sdetails.concat(obj);
        });
        data.dynamic.forEach(dy => {
          adlist = adlist.concat(dy);
        });

        this.setState({
          //assetList:alist,
          assetDetails: adlist,
          staticDetails: sdetails
        });
      })
      .catch(err => console.log(err));

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
  }

  populateAssetList = () => {
    console.log(this.state.customerAssetData);
    var arr = [];
    // var cn = 0;
    this.state.customerAssetData.forEach(obj => {
      if (obj.customer_id === this.state.selectedCustomerId) {
        //console.log(obj.asset_id)
        arr = arr.concat({
          key: obj.asset_id,
          value: obj.asset_id,
          text: obj.serial_no
        });
      }
    });
    this.setState({
      assetList: arr
    });
    console.log(arr);
  };

  populateAssetData = () => {
    var arr = [];
    var aid, m, wed, sn, pd, pp, prd, pc, b, ton, tod;
    var td = [];
    var ad = [];

    this.state.staticDetails.forEach(asset => {
      if (asset.id === this.state.selectedAssetSerialNo) {
        aid = asset.id;
        m = asset.make;
        wed = asset.warranty_end_date;
        sn = asset.serial_no;
        pd = asset.purchase_date;
        pp = asset.purchase_price;
        prd = asset.procurement_date;
        pc = asset.part_code;
        b = asset.branch;
        ton = asset.transfer_order_no;
        tod = asset.transfer_order_date;
      }
    });

    this.state.assetDetails.forEach(asset => {
      if (asset.asset_id === this.state.selectedAssetSerialNo) {
        arr = arr.concat({
          name: asset.attr_name,
          value: asset.attribute_value
        });
      }
    });

    for (var i = 0; i < arr.length; i++) {
      td = td.concat([arr[i].name]);
      ad = ad.concat([arr[i].value]);
    }

    let madate = "";
    let purdate = "";
    let procdate = "";
    let todate = "";

    if (
      wed === "0000-00-00 00:00:00" ||
      pd === "0000-00-00 00:00:00" ||
      prd === "0000-00-00 00:00:00" ||
      tod === "0000-00-00 00:00:00"
    ) {
      if (wed === "0000-00-00 00:00:00") madate = "";
      if (pd === "0000-00-00 00:00:00") purdate = "";
      if (prd === "0000-00-00 00:00:00") procdate = "";
      if (tod === "0000-00-00 00:00:00") todate = "";
    } else {
      madate = moment(wed).format("YYYY-MM-DD HH:mm:ss");
      purdate = moment(pd).format("YYYY-MM-DD HH:mm:ss");
      procdate = moment(prd).format("YYYY-MM-DD HH:mm:ss");
      todate = moment(tod).format("YYYY-MM-DD HH:mm:ss");
    }

    this.setState({
      assetId: aid,
      make: m,
      warrantyEndData: madate,
      serialNo: sn,
      purchaseDate: purdate,
      purchasePrice: pp,
      procurementDate: procdate,
      partCode: pc,
      branch: b,
      transferOrderNo: ton,
      transferOrderDate: todate,
      assetHeaders: this.state.assetHeaders.concat(td),
      assetTableDetails: ad
    });
  };

  renderTable() {
    return (
      <div>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.assetHeaders.map(label => (
                <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Cell>{this.state.assetId}</Table.Cell>
            <Table.Cell>{this.state.make}</Table.Cell>
            <Table.Cell>{this.state.warrantyEndData}</Table.Cell>
            <Table.Cell>{this.state.serialNo}</Table.Cell>
            <Table.Cell>{this.state.purchaseDate}</Table.Cell>
            <Table.Cell>{this.state.purchasePrice}</Table.Cell>
            <Table.Cell>{this.state.procurementDate}</Table.Cell>
            <Table.Cell>{this.state.partCode}</Table.Cell>
            <Table.Cell>{this.state.branch}</Table.Cell>
            <Table.Cell>{this.state.transferOrderNo}</Table.Cell>
            <Table.Cell>{this.state.transferOrderDate}</Table.Cell>
            {/* inflate the dynamic data here */}

            {this.state.assetTableDetails.map(obj => (
              <Table.Cell>{obj}</Table.Cell>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }

  onSelectAssetType = (event, data) => {
    // fetch by name and get the attributes

    fetchAPI("/asset/get_all_values", {
      type_name: this.state.selectedCategory
    })
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

  renderCategoryDropdown() {
    return (
      <div className="field">
        <label>Category:</label>
        <Form>
          <Form.Group widths="equal">
            <Form.Select
              onChange={(e, data) =>
                this.setState(
                  {
                    selectedCategory: data.value
                  },
                  this.onSelectAssetType
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
  onChangeBranch = (evt, data) =>
    this.setState({ selectedBranch: data.value }, this.filterBranch);

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

  saveTable = (id, obj) => {
    //console.log(obj)
    this.setState({
      tempTableHeaders: this.state.tableHeaders,
      tempTableData: [
        {
          assetId: obj.assetId,
          assetTypeId: obj.assetTypeId,
          make: obj.make,
          warrantyEndDate: obj.warrantyEndDate,
          serialNo: obj.serialNo,
          purchaseDate: obj.purchaseDate,
          purchasePrice: obj.purchasePrice,
          procurementDate: obj.procurementDate,
          status: obj.status,
          partCode: obj.partCode,
          branch: obj.branch,
          transferOrderNo: obj.transferOrderNo,
          trasnferOrderDate: obj.transferOrderDate,
          dynaData: obj.dynaData
        }
      ]
    });
  };

  chooseRenderTable() {
    return (
      <div>
        <Table color="teal" striped>
          <Table.Header>
            <Table.Row>
              {this.state.tempTableHeaders.map(label => (
                <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.tempTableData.map(obj => (
              <Table.Row key={obj.assetId} style={{ cursor: "pointer" }}>
                <Table.Cell>{obj.assetId}</Table.Cell>
                <Table.Cell>{obj.make}</Table.Cell>
                <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                <Table.Cell>{obj.serialNo}</Table.Cell>
                <Table.Cell>{obj.purchaseDate}</Table.Cell>
                <Table.Cell>{obj.purchasePrice}</Table.Cell>
                <Table.Cell>{obj.procurementDate}</Table.Cell>
                <Table.Cell>{"In Stock"}</Table.Cell>
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
        <div>
          <center>
            <Button
              width="100px"
              color="blue"
              icon="configure"
              label="Modify"
              onClick={this.submitData}
            />
          </center>
        </div>
      </div>
    );
  }

  submitData = () => {
    // console.log(this.state.tempTableData[0].assetId)
    fetchAPI("/config/change_config_table", {
      asset_id: this.state.tempTableData[0].assetId,
      child_asset_id: this.state.assetId
    })
      .then(r => r.json())
      .then(data => {})
      .catch(err => console.log(err));
  };

  modifyRenderTable() {
    if (this.state.selectedCategory !== "Please select Asset Type") {
      return (
        <div>
          <Table color="teal" striped>
            <Table.Header>
              <Table.Row>
                {this.state.tableHeaders.map(label => (
                  <Table.HeaderCell key={label}>{label}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.tableData.map(obj => {
                if (obj.status === "1") {
                  return (
                    <Table.Row
                      key={obj.assetId}
                      style={{ cursor: "pointer" }}
                      onClick={this.saveTable.bind(this, obj.assetId, obj)}
                    >
                      <Table.Cell>{obj.assetId}</Table.Cell>
                      <Table.Cell>{obj.make}</Table.Cell>
                      <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                      <Table.Cell>{obj.serialNo}</Table.Cell>
                      <Table.Cell>{obj.purchaseDate}</Table.Cell>
                      <Table.Cell>{obj.purchasePrice}</Table.Cell>
                      <Table.Cell>{obj.procurementDate}</Table.Cell>
                      <Table.Cell>{"In Stock"}</Table.Cell>
                      <Table.Cell>{obj.partCode}</Table.Cell>
                      <Table.Cell>{obj.branch}</Table.Cell>
                      <Table.Cell>{obj.transferOrderNo}</Table.Cell>
                      <Table.Cell>{obj.transferOrderDate}</Table.Cell>
                      {/* inflate the dynamic data here */}

                      {obj.dynaData.map(obj2 => (
                        <Table.Cell>{obj2.value}</Table.Cell>
                      ))}
                    </Table.Row>
                  );
                } else {
                  return (
                    <Table.Row
                      key={obj.assetId}
                      style={{ cursor: "pointer" }}
                      onClick={this.saveTable.bind(this, obj.assetId, obj)}
                    >
                      <Table.Cell>{obj.assetId}</Table.Cell>
                      <Table.Cell>{obj.make}</Table.Cell>
                      <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                      <Table.Cell>{obj.serialNo}</Table.Cell>
                      <Table.Cell>{obj.purchaseDate}</Table.Cell>
                      <Table.Cell>{obj.purchasePrice}</Table.Cell>
                      <Table.Cell>{obj.procurementDate}</Table.Cell>
                      <Table.Cell>{"Out of Stock/Damaged"}</Table.Cell>
                      <Table.Cell>{obj.partCode}</Table.Cell>
                      <Table.Cell>{obj.branch}</Table.Cell>
                      <Table.Cell>{obj.transferOrderNo}</Table.Cell>
                      <Table.Cell>{obj.transferOrderDate}</Table.Cell>
                      {/* inflate the dynamic data here */}

                      {obj.dynaData.map(obj2 => (
                        <Table.Cell>{obj2.value}</Table.Cell>
                      ))}
                    </Table.Row>
                  );
                }
              })}
            </Table.Body>
          </Table>
        </div>
      );
    } else {
      return false;
    }
  }

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

  render() {
    //console.log(this.state.tempTableData)

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
                this.populateAssetList
              )
            }
            placeholder="Select a Customer"
            options={this.state.customerList}
          />
        </div>
        <Divider />
        <Dropdown
          style={{ maxWidth: "600px" }}
          fluid
          icon="search"
          search
          selection
          value={this.state.selectedAssetSerialNo}
          onChange={(e, data) =>
            this.setState(
              {
                selectedAssetSerialNo: data.value,
                assetHeaders: [
                  "Asset ID",
                  "Make",
                  "Warranty End Date",
                  "Serial No",
                  "Purchase Date",
                  "Purchase Price",
                  "Procurement Date",
                  "Part Code",
                  "Branch",
                  "Transfer Order No",
                  "Transfer Order Date"
                ]
              },
              this.populateAssetData
            )
          }
          placeholder="Enter Serial Number"
          options={this.state.assetList}
        />
        <br />
        <Divider />
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          {this.renderTable()}
        </div>
        <Divider />
        <Container color="blue" textAlign="center">
          <h1>Modify Asset With</h1>
          <br />
        </Container>
        <div style={{ display: "flex" }}>{this.renderCategoryDropdown()}</div>
        <br />
        <Divider />

        <div>
          {this.state.selectedCategory !== "Please select Asset Type"
            ? this.DynamicAttributesForm()
            : undefined}
        </div>
        <Divider />
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          {this.modifyRenderTable()}
        </div>
        <Divider />
        <Container color="blue" textAlign="center">
          <h1>Chosen Asset:</h1>
          <br />
        </Container>
        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
          {this.chooseRenderTable()}
        </div>
        <Divider />
        <div>{this.renderDisplayPageButton()}</div>
      </Segment>
    );
  }
}
export default AssetAddition;
