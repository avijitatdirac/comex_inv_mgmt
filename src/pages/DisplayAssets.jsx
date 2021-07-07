import React, { Component } from "react";
import moment from "moment";
import AssetCard from "../components/DisplayAssetComponents/AssetCard";
import GenerateChallan from "./GenerateChallan";
import {
  Loader,
  Dimmer,
  Container,
  Checkbox,
  Divider,
  Button,
  Form,
  Table,
  Icon,
  Header,
  Sidebar,
  Segment,
  Grid,
  Card
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";

class DisplayAssets extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedCategory: "",
      categoryOptions: [],
      assetTypeAttributes: [],
      selectedItemId: null,
      selectedItemsCount: 0,
      hsnCode: "",

      // for modal window
      isOpenModal: false,
      isSidebarOpen: false,
      cartItems: [],

      // selected irem from table
      selectedItem: "",

      // names of all dynamic attributes
      dynaHeaders: [],

      filterSerialNumber: "",

      //all selected table checkbox assets
      selectedcheckboxasset: [
        {
          id: "",
          data: ""
        }
      ],

      branchOptions: [],
      selectedBranch: "",

      // names of all static table attribures
      tableHeaders: [
        "Choice",
        "Make",
        "Warranty End Date",
        "Serial No",
        "Purchase Date",
        "Purchase Price",
        "Procurement Date",
        "Status",
        "Part Code",
        "Transfer Order No",
        "Transfer Order Date"
      ],

      // temporary array to hold table data (used for filter)
      tableDataInitial: [
        {
          assetId: "",
          make: "",
          assetTypeId: "",
          warrantyEndDate: "",
          serialNo: "",
          purchaseDate: "",
          purchasePrice: "",
          procurementDate: "",
          status: "",
          partCode: "",
          branch: "",
          transferOrderNo: "",
          transferOrderDate: "",
          dynaData: [],
          hsnCode: ""
        }
      ],

      tableData: [
        {
          assetId: "",
          make: "",
          assetTypeId: "",
          warrantyEndDate: "",
          serialNo: "",
          purchaseDate: "",
          purchasePrice: "",
          procurementDate: "",
          status: "",
          partCode: "",
          branch: "",
          transferOrderNo: "",
          transferOrderDate: "",
          dynaData: [],
          hsnCode: ""
        }
      ],
      // display item
      // user wants to check out
      isCheckedOut: false,
      // assetId selected for assembly
      selItem: null,
      // whether to render assembly page
      isCheckedOutAssembly: false,
      // checkbox in assembly
      assemblyCheckedAssets: [],
      // for generating challan
      isChallanGenerated: false,
      // dimmer
      dimmerActive: false
    }; // end of this.state
  } // end of constructor

  async fetchBranches() {
    try {
      const res = await fetchAPI("/branch/get_branch_names", {});
      const data = await res.json();
      let branchOptions = [];
      data.branchNames.forEach(branch => {
        branchOptions.push({
          key: branch.id,
          value: branch.id,
          text: branch.name
        });
      });
      this.setState({ branchOptions });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchUsersLocation() {
    try {
      const res = await fetchAPI("/user/get_user_location", {});
      const data = await res.json();
      const selectedBranch = data.branch_id;
      this.setState({ selectedBranch });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchAssets() {
    try {
      const res = await fetchAPI("/asset/get_asset", {});
      const data = await res.json();
      // console.log(data);
      // const p = JSON.parse(data);
      let categoryOptions = [];
      data.results.forEach(r => {
        categoryOptions.push({
          key: r.id,
          id: r.id,
          text: r.type_name,
          value: r.type_name
        });
      });
      this.setState({ categoryOptions });
    } catch (err) {
      console.error(err);
    }
  }

  componentDidMount = () => {
    this.fetchBranches();
    this.fetchUsersLocation();
    this.fetchAssets();
  };

  // render main page
  render() {
    const { dimmerActive } = this.state;
    return (
      <div>
        {!this.state.isCheckedOut ? (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {this.renderDisplayAsset()}
          </Dimmer.Dimmable>
        ) : (
          <div>
            {!this.state.isChallanGenerated
              ? this.renderCheckout()
              : this.renderChallan()}
          </div>
        )}
      </div>
    );
  }

  // render display page (_displays the asset tables)
  renderDisplayAsset = () => {
    return (
      <div className="homepage">
        <Container color="blue" textAlign="center">
          <h1>List of Assets</h1>
        </Container>
        <Sidebar.Pushable>
          <Sidebar
            as={Segment}
            animation="overlay"
            direction="right"
            width="wide"
            visible={this.state.isSidebarOpen}
            vertical
            inverted
          >
            <div>
              {this.renderSidebarHeader()}
              <Divider />
              {this.renderSidebarBody()}
            </div>
          </Sidebar>
          <Sidebar.Pusher>
            <div style={{ display: "flex" }}>
              {this.renderCategoryDropdown()}
              {this.renderCartButton()}
            </div>
            <Divider />
            <div>
              {this.state.selectedCategory !== "Please select Asset Type" ? (
                this.DynamicAttributesForm()
              ) : (
                <div>
                  <br />
                  <br />
                </div>
              )}
            </div>
            <Divider />
            <div
              style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
            >
              {this.state.selectedCategory !== "Please select Asset Type" ? (
                <div>{this.renderTable()}</div>
              ) : (
                <div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              )}
            </div>
            <Form>
              <Form.Group>
                {this.renderAddInventoryButton()}
                {this.renderAssetAdditionButton()}
              </Form.Group>
            </Form>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  };

  // renders Header of side bar
  renderSidebarHeader() {
    return (
      <div style={{ display: "flex" }}>
        <Icon
          name="close"
          size="large"
          style={{ cursor: "pointer", marginLeft: "5px", marginRight: "29px" }}
          onClick={this.closeSidebar}
        />
        <Header
          size="large"
          inverted
          style={{ margin: 0, flex: 1, textAlign: "center" }}
        >
          Cart Items
        </Header>
        <div
          style={{
            width: "30px",
            height: "30px",
            backgroundColor: "red",
            color: "#fff",
            borderRadius: "15px",
            textAlign: "center",
            lineHeight: "30px",
            marginRight: "10px"
          }}
        >
          {this.state.cartItems.length}
        </div>
      </div>
    );
  }

  // renders body of the sidebar
  renderSidebarBody() {
    return (
      <div>
        {this.state.cartItems.map((obj, idx) => (
          <div
            key={obj.id}
            style={{
              display: "flex",
              padding: "0 10px",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "15px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.3)"
            }}
          >
            <Icon
              name="desktop"
              size="large"
              style={{ "margin-right": "29px", marginRight: "29px" }}
            />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0 }}>{`${obj.make}`}</h3>
              <ul style={{ margin: 0 }}>
                <Grid columns={2} divided>
                  <Grid.Column>
                    {obj.dynaData.map(obj => (
                      <Grid.Row>
                        <li>{obj.name}</li>
                      </Grid.Row>
                    ))}
                  </Grid.Column>
                  <Grid.Column>
                    {obj.dynaData.map(obj => {
                      if (obj.value !== "")
                        return <Grid.Row>{obj.value}</Grid.Row>;
                      else return <Grid.Row>-</Grid.Row>;
                    })}
                  </Grid.Column>
                </Grid>
              </ul>
            </div>
            <br />
          </div>
        ))}
        <br />
        <div style={{ textAlign: "center" }}>
          <Button primary onClick={this.onCheckout}>
            <Icon name="add to cart" />
            Checkout
          </Button>
        </div>
      </div>
    );
  }

  onSelectAssetType = (event, data) => {
    this.setState(state => ({
      selectedCategory: data.value,
      dimmerActive: true
    }));
    // fetch by name and get the attributes
    fetchAPI("/asset/get_all_values", { type_name: data.value })
      .then(r => r.json())
      .then(data => {
        this.setState({
          assetTypeAttributes: [],
          tableHeaders: [
            "Choice",
            "Make",
            "Warranty End Date",
            "Serial No",
            "Purchase Date",
            "Purchase Price",
            "Procurement Date",
            "Status",
            "Part Code",
            "Transfer Order No",
            "Transfer Order Date"
          ],
          tableData: [],
          tableDataInitial: []
        });

        var jsn_hsnCode = JSON.stringify(data.hsnResult, null, 2);
        var hsnArr = JSON.parse(jsn_hsnCode);
        var hsnarr = hsnArr.length;
        for (let i = 0; i < hsnarr; i++) {
          this.setState({ hsnCode: hsnArr[i].hsnCode });
        }
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
            darray = darray.concat({
              name: dynar[i * dynaAttribCount + j].attr_name,
              value: dynar[i * dynaAttribCount + j].attribute_value
            });
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
            madate = moment(staticr[i].warranty_end_date).format("DD/MM/YYYY");
            purdate = moment(staticr[i].purchase_date).format("DD/MM/YYYY");
            procdate = moment(staticr[i].procurement_date).format("DD/MM/YYYY");
            todate = moment(staticr[i].transfer_order_date).format(
              "DD/MM/YYYY"
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
                dynaData: darray,
                hsnCode: this.state.hsnCode
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
                dynaData: darray,
                hsnCode: this.state.hsnCode
              }
            ])
          });
        }
        this.setState({ dimmerActive: false });
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
      });
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

  renderItemCount() {
    return (
      <span
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "10px",
          lineHeight: "20px",
          backgroundColor: "red",
          color: "#fff"
        }}
      >
        {this.state.cartItems.length}
      </span>
    );
  }
  // remove item from cart
  removeCartItem = rmId => {
    let arr = [...this.state.cartItems];
    arr.splice(rmId, 1);
    this.setState({
      cartItems: arr
    });
  };
  /**
   * renders the Cart button with Icon and Selected Items Count
   */
  renderCartButton() {
    return (
      <div style={{ marginLeft: "auto" }}>
        <Button
          content="Cart"
          icon="shopping cart"
          color="teal"
          onClick={this.openCart}
          label={{
            basic: true,
            color: "teal",
            content: this.renderItemCount()
          }}
          labelPosition="right"
        />
      </div>
    );
  }

  // when attribute value changes
  onAttributeValueChange = idx => evt => {
    const newAttribute = this.state.assetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, value: evt.target.value };
      }
    );
    this.setState({ assetTypeAttributes: newAttribute });
  };

  onChangeBranch = (evt, data) =>
    this.setState({ selectedBranch: data.value }, this.filterBranch);

  DynamicAttributesForm = () => (
    <Segment>
      <Form>
        <Form.Input
          label="HSN Code"
          value={this.state.hsnCode}
          style={{ maxWidth: "400px" }}
          readOnly
        />
        <Form.Select
          onChange={this.onChangeBranch}
          value={this.state.selectedBranch}
          size="small"
          label="Choose Branch to Display Asset From: "
          style={{ maxWidth: "400px" }}
          placeholder="Select Branch"
          options={this.state.branchOptions}
        />
      </Form>
      <Divider />
      <Form>
        <Form.Group>
          <Form.Input
            width={4}
            label="Filter by Serial Number"
            type="text"
            placeholder="Filter by Serial Number"
            onChange={this.onChangeSerialFilter}
            style={{ maxWidth: "400px" }}
            size="small"
          />
        </Form.Group>
      </Form>
      <Divider />
      <Header as="h5">
        <Icon name="filter" />
        <Header.Content>Filter By:</Header.Content>
      </Header>
      <Form>
        <Grid columns={7}>
          {this.state.assetTypeAttributes.map((attribute, idx) => (
            <Grid.Column key={idx}>
              <Form.Input
                label={attribute.name}
                type="text"
                placeholder={`Search ${attribute.name}`}
                onChange={(e, data) =>
                  this.filterResult(attribute.name, data.value, idx)
                }
              />
            </Grid.Column>
          ))}
        </Grid>
      </Form>
    </Segment>
  );

  onChangeSerialFilter = event =>
    this.setState(
      { filterSerialNumber: event.target.value },
      this.filterSerialResult
    );

  /**
   * renders the Inventory table depending on the selected category
   */
  renderTable() {
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
                    <Table.Row key={obj.assetId} style={{ cursor: "pointer" }}>
                      <Table.Cell>
                        {
                          <Checkbox
                            style={{ backgroundColor: "green" }}
                            onClick={this.checkedAssets.bind(
                              this,
                              obj.assetId,
                              obj
                            )}
                          />
                        }
                      </Table.Cell>
                      {/* <Table.Cell>{obj.assetId}</Table.Cell> */}
                      <Table.Cell>{obj.make}</Table.Cell>
                      <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                      <Table.Cell>{obj.serialNo}</Table.Cell>
                      <Table.Cell>{obj.purchaseDate}</Table.Cell>
                      <Table.Cell>{obj.purchasePrice}</Table.Cell>
                      <Table.Cell>{obj.procurementDate}</Table.Cell>
                      <Table.Cell>{"Available"}</Table.Cell>
                      <Table.Cell>{obj.partCode}</Table.Cell>
                      {/* <Table.Cell>{obj.branch}</Table.Cell> */}
                      <Table.Cell>{obj.transferOrderNo}</Table.Cell>
                      <Table.Cell>{obj.transferOrderDate}</Table.Cell>
                      {/* inflate the dynamic data here */}

                      {obj.dynaData.map((obj2, idx) => (
                        <Table.Cell key={idx}>{obj2.value}</Table.Cell>
                      ))}
                    </Table.Row>
                  );
                } else if (obj.status === "2") {
                  return (
                    <Table.Row
                      warning
                      key={obj.assetId}
                      style={{ cursor: "pointer" }}
                    >
                      <Table.Cell>
                        {
                          <Checkbox
                            style={{ backgroundColor: "green" }}
                            onClick={this.checkedAssets.bind(
                              this,
                              obj.assetId,
                              obj
                            )}
                          />
                        }
                      </Table.Cell>
                      {/* <Table.Cell>{obj.assetId}</Table.Cell> */}
                      <Table.Cell>{obj.make}</Table.Cell>
                      <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                      <Table.Cell>{obj.serialNo}</Table.Cell>
                      <Table.Cell>{obj.purchaseDate}</Table.Cell>
                      <Table.Cell>{obj.purchasePrice}</Table.Cell>
                      <Table.Cell>{obj.procurementDate}</Table.Cell>
                      <Table.Cell>
                        <Icon name="attention">Damaged</Icon>
                      </Table.Cell>
                      <Table.Cell>{obj.partCode}</Table.Cell>
                      {/* <Table.Cell>{obj.branch}</Table.Cell> */}
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
                    <Table.Row key={obj.assetId} disabled>
                      <Table.Cell>
                        <Icon color="red" name="cancel" />
                      </Table.Cell>
                      {/* <Table.Cell>{obj.assetId}</Table.Cell> */}
                      <Table.Cell>{obj.make}</Table.Cell>
                      <Table.Cell>{obj.warrantyEndDate}</Table.Cell>
                      <Table.Cell>{obj.serialNo}</Table.Cell>
                      <Table.Cell>{obj.purchaseDate}</Table.Cell>
                      <Table.Cell>{obj.purchasePrice}</Table.Cell>
                      <Table.Cell>{obj.procurementDate}</Table.Cell>
                      <Table.Cell>{"Unavailable"}</Table.Cell>
                      <Table.Cell>{obj.partCode}</Table.Cell>
                      {/* <Table.Cell>{obj.branch}</Table.Cell> */}
                      <Table.Cell>{obj.transferOrderNo}</Table.Cell>
                      <Table.Cell>{obj.transferOrderDate}</Table.Cell>
                      {/* inflate the dynamic data here */}
                      {obj.dynaData.map((obj2, idx) => (
                        <Table.Cell key={idx}>{obj2.value}</Table.Cell>
                      ))}
                    </Table.Row>
                  );
                }
              })}
            </Table.Body>
          </Table>
          <div>
            <center>
              <Button
                width="100px"
                color="blue"
                onClick={this.addCartData}
                icon="cart"
                label="Add"
              />
            </center>
          </div>
        </div>
      );
    } else {
      return false;
    }
  }

  addCartData = () => {
    var arr = this.state.selectedcheckboxasset;
    var cartarr = [];
    var c = 0;
    for (var i = 1; i < arr.length; i++) {
      cartarr[c] = arr[i].data;
      c = c + 1;
    }
    this.setState({ cartItems: cartarr });
    notify.successBottom("Item successfully added to your cart");
  };

  checkedAssets = (id, obj) => {
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
            data: obj
          }
        ])
      });
    } else {
      this.setState({ selectedcheckboxasset: arr });
    }
  };

  /**
   * renders the Add Items To Inventory button
   */
  renderAddInventoryButton() {
    return (
      <Button
        primary
        style={{ margin: "10px" }}
        onClick={() => this.props.history.push("/removeAsset")}
        color="blue"
      >
        <Icon name="wrench" />
        Remove Asset
      </Button>
    );
  }

  renderAssetAdditionButton() {
    return (
      <Button
        primary
        style={{ margin: "10px" }}
        onClick={() => this.props.history.push("/assetAddition")}
        color="blue"
      >
        <Icon name="wrench" />
        Add Asset
      </Button>
    );
  }

  /**
   * render checkout page (purchase overview and assembly)
   */
  toggleOpenAssembly = () => {
    this.setState({
      isCheckedOutAssembly: !this.state.isCheckedOutAssembly
    });
  };

  selectForAssembly = id => {
    if (this.state.isCheckedOutAssembly === true) {
      // go from component assembly to checkout
      this.setState({
        isCheckedOutAssembly: false,
        selItem: null
      });
    } else {
      // go from checkout to component assembly
      this.setState({
        isCheckedOutAssembly: true,
        selItem: id
      });
    }
  };

  // submit cart items to db
  submitCart = () => {
    let cartAssetIds = [];
    this.state.cartItems.forEach(element => {
      cartAssetIds = cartAssetIds.concat(element.assetId);
    });
    this.setState({ isChallanGenerated: true });
  };

  // when checkbox is clicked on assembly page add the item to assemblyCheckedAssets
  assemblyCheckOnClick = (idx, item) => {
    let exists = false;
    let loc = -1;
    let tempAssets = this.state.assemblyCheckedAssets;

    for (let i = 0; i < tempAssets.length; i++) {
      if (tempAssets[i].assetId === item.assetId) {
        exists = true;
        loc = i;
        break;
      }
    }
    if (exists) {
      tempAssets.splice(loc, 1);
    } else {
      tempAssets = tempAssets.concat(item);
    }
    this.setState({
      assemblyCheckedAssets: [...tempAssets]
    });

    const newCartItems = this.state.cartItems.map((item, sidx) => {
      if (idx !== sidx) {
        return item;
      }
      return { ...item, parentId: this.state.selItem };
    });
    this.setState({ cartItems: newCartItems });
  };

  renderChallan() {
    return (
      <GenerateChallan
        cartItems={this.state.cartItems}
        cartAssetIds={this.state.cartAssetIds}
      />
    );
  }

  renderCheckout() {
    console.log("checkout state cartitem:");
    console.log(this.state.cartItems);
    let isChecked = [];
    for (var i = 0; i < this.state.cartItems.length; i++) {
      isChecked[i] = false;
    }
    console.log(isChecked);

    if (!this.state.isCheckedOutAssembly) {
      // render checkout page
      return (
        <div>
          <Container color="blue" textAlign="center">
            <h1>Checkout</h1>
            <br />
          </Container>
          <Card.Group>
            {this.state.cartItems.map((item, idx) => {
              if (item.parentId === undefined) {
                return (
                  <AssetCard
                    item={item}
                    idx={idx}
                    selectForAssembly={this.selectForAssembly}
                    selItem={this.state.selItem}
                    toggleOpenAssembly={this.toggleOpenAssembly}
                    showButton={item.extras === undefined ? true : false}
                  />
                );
              } else {
                return undefined;
              }
            })}
            {console.log("sel: " + this.state.selItem)}
          </Card.Group>
          <br />
          <Button color="blue" onClick={this.submitCart}>
            <Icon name="save" />Submit
          </Button>
          <Button
            color="blue"
            onClick={() => {
              this.setState({ isCheckedOut: false, cartItems: [] });
            }}
          >
            <Icon name="undo" />Back
          </Button>
        </div>
      );
    } else {
      // render add compoents page
      // let tempCartItems = this.state.cartItems;
      console.log("cartt: ");
      console.log(this.state.cartItems);
      return (
        <div class="page">
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Header color="teal">Chosen asset</Header>
                <AssetCard
                  item={this.state.cartItems[this.state.selItem]}
                  idx={this.state.selItem}
                  selItem={this.state.selItem}
                  toggleOpenAssembly={this.toggleOpenAssembly}
                  showButton={false}
                />
              </Grid.Column>
              <Grid.Column>
                <Header color="teal">Available for assembly</Header>
                <div
                  style={{
                    width: "100%",
                    overflowX: "auto",
                    overflowY: "hidden"
                  }}
                >
                  <Table color="teal" striped>
                    <Table.Body>
                      {this.state.cartItems.map((item, idx) => {
                        if (
                          idx !== this.state.selItem &&
                          item.parentId === undefined
                        ) {
                          return (
                            <Table.Row
                              key={item.assetId}
                              onClick={this.assemblyCheckOnClick.bind(
                                this,
                                idx,
                                item
                              )}
                              style={{ cursor: "pointer" }}
                            >
                              <Table.Cell>{item.make}</Table.Cell>
                              <Table.Cell>
                                <strong>Serial no:</strong> {item.serialNo}
                              </Table.Cell>
                              {item.dynaData.map(obj => (
                                <Table.Cell>
                                  <strong>{obj.name}:</strong> {obj.value}
                                </Table.Cell>
                              ))}
                            </Table.Row>
                          );
                        } else {
                          return undefined;
                        }
                      })}
                    </Table.Body>
                  </Table>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Header color="teal">You have chosen</Header>
          <div
            style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
          >
            <Table color="teal" striped>
              <Table.Body>
                {this.state.assemblyCheckedAssets.map((item, idx) => (
                  <Table.Row>
                    <Table.Row key={item.assetId} style={{ cursor: "pointer" }}>
                      <Table.Cell>{item.make}</Table.Cell>
                      <Table.Cell>
                        <strong>Serial no:</strong> {item.serialNo}
                      </Table.Cell>
                      {item.dynaData.map(obj => (
                        <Table.Cell>
                          <strong>{obj.name}:</strong> {obj.value}
                        </Table.Cell>
                      ))}
                    </Table.Row>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          <br />
          <br />
          <Button onClick={this.selectForAssembly} color="blue">
            <Icon name="arrow left" />Back
          </Button>

          <Button
            onClick={() => {
              const newCartItems = this.state.cartItems.map((item, sidx) => {
                if (this.state.selItem !== sidx) {
                  return item;
                }
                return { ...item, extras: this.state.assemblyCheckedAssets };
              });
              this.setState(
                {
                  cartItems: newCartItems,
                  assemblyCheckedAssets: []
                },
                this.selectForAssembly
              );
            }}
            color="blue"
          >
            <Icon name="lock" />Commit
          </Button>
          <Button
            onClick={() => {
              var temp = this.state.cartItems;
              this.state.assemblyCheckedAssets.forEach((element, idx) => {
                const newCartItems = temp.map((item, sidx) => {
                  if (element.assetId !== item.assetId) {
                    return item;
                  } else {
                    return { ...item, parentId: undefined };
                  }
                });
                temp = newCartItems;
              });
              this.setState({ cartItems: temp, assemblyCheckedAssets: [] });
            }}
            color="blue"
          >
            <Icon name="trash outline" />Reset
          </Button>
        </div>
      );
    }
  }

  /**
   * onChange callback for Select Category Dropdown
   */
  changeCategory = (evt, data) => {
    this.setState(state => ({ selectedCategory: data.value }));
  };

  /**
   * onClick callback for Cart button
   */
  openCart = () => this.setState({ isSidebarOpen: true });

  /**
   * onClick callback for Cross icon in the sidebar
   */
  closeSidebar = () => {
    console.log("close sidebar");
    this.setState({ isSidebarOpen: false });
  };

  /**
   * User wants to checkout
   */
  onCheckout = () => {
    this.setState({ isCheckedOut: true });
  };

  filterSerialResult = () => {
    //console.log(this.state.tableData)
    var value = this.state.filterSerialNumber;
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj => obj.serialNo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
    this.setState({ tableData });
  };

  filterBranch = () => {
    if (!this.state.selectedBranch) {
      return;
    }
    if (this.state.branchOptions.length === 0) {
      return;
    }
    const branchName = this.state.branchOptions.filter(
      br => br.value === this.state.selectedBranch
    )[0].text;
    const tableData = this.state.tableDataInitial.filter(
      v => v.branch.toLowerCase() === branchName.toLowerCase()
    );
    this.setState({ tableData });
  };

  filterResult = (filterBy, value, num) => {
    let data = this.state.tableDataInitial.slice();
    let tableData = data.filter(
      obj =>
        obj.dynaData[num].value.toLowerCase().indexOf(value.toLowerCase()) !==
        -1
    );
    this.setState({ tableData });
  };

  /**
   * [helper function to update state]
   * NOTE: this function only updates top level properties,
   * and will not be able to update any nested properties
   * @param  {[type]} key   [the key in the state which needs to be updated]
   * @param  {[type]} value [corresponding value which will be updated in the state]
   * @return {[type]}       [undefined]
   */
  updateState = (key, value) => {
    if (key) {
      this.setState({ [key]: value });
    }
  };
  generateChallan = () => this.props.history.push("/generateChallan");
}

export default DisplayAssets;
