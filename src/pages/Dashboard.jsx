import React, { Component } from "react";
import {
  Container,
  Statistic,
  Segment,
  Table,
  Label,
  Icon,
  Button,
  Header,
  Grid,
  Dimmer,
  Loader,
  Card
} from "semantic-ui-react";
import { notify } from "../Classes";
import moment from "moment";
import { fetchAPI } from "../utility";

const componentRender = {
  MAIN: 0,
  IN_STOCK_DTLS: 1,
  OUT_STOCK_DTLS: 2,
  DAMAGED_STOCK_DTLS: 3,
  CUSTOMER_ORDER_DTLS: 4
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      damaged: [],
      inStock: [],
      outStock: [],
      allAssetTypes: [],
      currentComponent: componentRender.MAIN,
      assetOutOfStockDetails: [],
      assetInStockDetails: [],
      assetDamagedStockDetails: [],
      renderCustomerDetails: false,

      selectedCustomerOrderDetails: [],
      selectedAssetTypeName: null,
      selectedAssetDetails: [],
      selectedAssetConfig: [],
      selectedAssetChildren: [],
      selectedAssetParents: [],

      // customer details section
      allCustomers: [],
      selectedCustomerDetails: "",
      allCustomerLocationDetails: "",
      // dimmer
      dimmerActive: false,
      configSegmentDimmerActive: false
    };
  }

  // get instock items according to type_id
  getInStock = idx => {
    let count = 0;
    for (let i = 0; i < this.state.inStock.length; i++) {
      if (this.state.inStock[i].id === this.state.allAssetTypes[idx].id) {
        count = this.state.inStock[i].in_stock;
        break;
      }
    }
    return Number(count);
  };

  // get out of stock items according to type_id
  getOutStock = idx => {
    let count = 0;
    for (let i = 0; i < this.state.outStock.length; i++) {
      if (this.state.outStock[i].id === this.state.allAssetTypes[idx].id) {
        count = this.state.outStock[i].out_of_stock;
        break;
      }
    }
    return Number(count);
  };

  // get damaged items according to type_id
  getDamaged = idx => {
    let count = 0;
    for (let i = 0; i < this.state.damaged.length; i++) {
      if (this.state.damaged[i].id === this.state.allAssetTypes[idx].id) {
        count = this.state.damaged[i].damaged;
        break;
      }
    }
    return Number(count);
  };

  // get child asset serial no
  getChild = id => {
    var children = this.state.selectedAssetChildren;
    var childSerial = "-";
    for (let i = 0; i < children.length; i++) {
      if (id === children[i].id) {
        childSerial = children[i].serial_no;
        break;
      }
    }
    return `${childSerial}`;
  };

  // get parent asset serial no
  getParent = id => {
    var parents = this.state.selectedAssetParents;
    var parentSerial = "-";
    for (let i = 0; i < parents.length; i++) {
      if (id === parents[i].id) {
        parentSerial = parents[i].serial_no;
        break;
      }
    }
    return `${parentSerial}`;
  };

  componentWillMount = () => {
    // --- Fetch asset details

    this.setState({ dimmerActive: true });
    // get all available asset types
    fetchAPI("/asset/get_asset")
      .then(r => r.json())
      .then(data => {
        this.setState({ allAssetTypes: data.results });
      })
      .catch(err => console.log(err));

    // get count of all the assets that are in and out of stock
    fetchAPI("/asset/get_asset_status_count")
      .then(r => r.json())
      .then(data => {
        // save damaged, inStock, and outStock elements
        this.setState({
          damaged: data.damaged,
          inStock: data.in_stock,
          outStock: data.out_of_stock,
          dimmerActive: false
        });
      })
      .catch(err => {
        this.setState({ dimmerActive: false });
        console.log(err);
      });

    // --- Fetch customer details
    this.setState({ dimmerActive: true });
    // get all the customers
    fetchAPI("/cust/get_customer", {})
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          console.log("data = ", data);
          if (data.customerDetails !== undefined)
            // result set is not empty
            this.setState({
              allCustomers: data.customerDetails,
              allCustomerLocationDetails: data.locationDetails
            });
          // result set is empty
          else
            this.setState({
              allCustomers: [],
              locationDetails: []
            });
        } else {
          console.log("failed to get customer");
        }
      })
      .catch(err => {
        this.setState({ dimmerActive: false });
        console.log(err);
      });
  };

  // when customer row is clicked, display all his/her order history
  loadCustomerOrderHistory = customerId => {
    // console.log('ID = ', customerId)
    this.setState({
      currentComponent: componentRender.CUSTOMER_ORDER_DTLS,
      dimmerActive: true
    });

    // API CALL: get all the order details of the customer
    fetchAPI("/order/get_customer_order_details", { customer_id: customerId })
      .then(result => result.json())
      .then(data => {
        if (data.isSuccess) {
          this.setState(
            {
              selectedCustomerOrderDetails: data.results
            },
            this.setState({ dimmerActive: false })
          );
        } else {
          notify.error("cannot access data");
          this.setState({ dimmerActive: false });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
      });
  };
  // onClick Handlers
  outStockCellOnClick = idx => {
    this.setState({
      currentComponent: componentRender.OUT_STOCK_DTLS,
      dimmerActive: true
    });
    // API CALL: get the details of all the assets of this asset type along with their customer (when rented)
    fetchAPI("/asset/get_asset_type_customer_name", {
      asset_type_id: this.state.allAssetTypes[idx].id
    })
      .then(result => result.json())
      .then(data => {
        if (data.isSuccess) {
          this.setState(
            {
              assetOutOfStockDetails: data.results
            },
            this.setState({ dimmerActive: false })
          );
        } else {
          notify.error("cannot access data");
          this.setState({ dimmerActive: false });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
      });
  };

  // displays all in stock assets
  inStockCellOnClick = idx => {
    // log clicked row details
    this.setState({
      currentComponent: componentRender.IN_STOCK_DTLS,
      dimmerActive: true
    });

    // API CALL: get the details of all the assets of this asset type
    let url = "/asset/in_damaged_stock";
    let data = { id: this.state.allAssetTypes[idx].id, status: 1 };
    fetchAPI(url, data)
      .then(result => result.json())
      .then(data => {
        if (data.isSuccess) {
          this.setState(
            {
              assetInStockDetails: data.results
            },
            this.setState({ dimmerActive: false })
          );
        } else {
          notify.error("cannot access data");
          this.setState({ dimmerActive: false });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
      });
  };

  // displays all damaged assets
  damagedStockCellOnClick = idx => {
    // log clicked row details
    // console.log(idx+' clicked '+this.state.allAssetTypes[idx].id+' '+this.state.allAssetTypes[idx].type_name+' - '+this.state.allAssetTypes[idx].id)

    this.setState({
      currentComponent: componentRender.DAMAGED_STOCK_DTLS,
      dimmerActive: true
    });

    // API CALL: get the details of all the assets of this asset type
    let url = "/asset/in_damaged_stock";
    let data = { id: this.state.allAssetTypes[idx].id, status: 2 };
    fetchAPI(url, data)
      .then(result => result.json())
      .then(data => {
        // console.log(data.results)
        if (data.isSuccess) {
          this.setState(
            {
              assetDamagedStockDetails: data.results
            },
            this.setState({ dimmerActive: false })
          );
        } else {
          notify.error("cannot access data");
          this.setState({ dimmerActive: false });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ dimmerActive: false });
      });
  };

  // when an asset type is selected fetch all the assets of that type
  assetTypeOnClick = selectedAssetTypeName => {
    this.setState(state => ({
      configSegmentDimmerActive: true,
      selectedAssetTypeName
    }));
    // fetch by name and get the attributes

    fetchAPI("/asset/get_all_values", { type_name: selectedAssetTypeName })
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          this.setState({
            selectedAssetDetails: data.static,
            configSegmentDimmerActive: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ configSegmentDimmerActive: false });
      });
  };

  // when an asset is selected show all its config details
  assetOnClick = selectedAssetId => {
    this.setState({ selectedAssetId, configSegmentDimmerActive: true });
    console.log(selectedAssetId);

    // fetch the config details of the selected asset
    fetch(`/get_all_asset_config_by_id?id=${selectedAssetId}`, {
      method: "GET"
    })
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          this.setState({
            selectedAssetConfig: data.asset_config,
            selectedAssetChildren: data.asset_config_child,
            selectedAssetParents: data.asset_config_parent,
            configSegmentDimmerActive: false
          });
        } else {
          this.setState({
            configSegmentDimmerActive: false
          });
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({ configSegmentDimmerActive: false });
      });
  };
  // displays all damaged assets

  // main page render
  render() {
    const { dimmerActive } = this.state;

    // render asset details table (contains asset in and out of stock as well as damaged
    switch (this.state.currentComponent) {
      case componentRender.MAIN:
        // const square = { width: 175, height: 175 }
        // Main screen of dashboard
        // console.log('rendering main')
        return (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {/* <Button basic onClick={()=>console.log(this.state) }>State</Button> */}
            <Header size="large" color="orange" textAlign="center">
              <Icon name="bar graph" color="orange" />Dashboard
            </Header>
            {/* <Segment circular >
                        <Header as='h2'>
                            Sale!
                            <Header.Subheader>
                            $10.99
                            </Header.Subheader>
                        </Header>
                        </Segment> */}

            {/* <div className=""> */}

            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  <div
                    style={{
                      width: "100%",
                      height: "280px",
                      overflowX: "auto",
                      overflowY: "scroll"
                    }}
                  >
                    {this.renderAssetStatusTable()}
                  </div>
                </Grid.Column>
                <Grid.Column>
                  <div
                    style={{
                      width: "100%",
                      height: "285px",
                      overflowX: "auto",
                      overflowY: "scroll"
                    }}
                  >
                    {this.renderConfigSegment()}
                  </div>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <div
                    style={{
                      width: "100%",
                      height: "400px",
                      overflowX: "auto",
                      overflowY: "scroll"
                    }}
                  >
                    {this.renderCustomerDetails()}
                  </div>
                </Grid.Column>
                <Grid.Column>
                  {this.renderSelectedCustomerDetails()}
                </Grid.Column>
              </Grid.Row>
            </Grid>
            {/* </div> */}
          </Dimmer.Dimmable>
        );
      // break;

      case componentRender.OUT_STOCK_DTLS:
        // console.log('rendering out of stock')
        return (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Header size="large" color="violet" textAlign="center">
              <Icon name="bar graph" color="violet" />Out Stock Details
            </Header>

            <div
              className="page"
              style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
            >
              {this.renderOutStockAssetTable()}
            </div>
          </Dimmer.Dimmable>
        );
      // break;
      case componentRender.IN_STOCK_DTLS:
        // console.log('rendering in stock')
        return (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Header size="large" color="green" textAlign="center">
              <Icon name="bar graph" color="green" />In Stock Details
            </Header>
            <div
              style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
            >
              {this.renderInStockAssetTable()}
            </div>
          </Dimmer.Dimmable>
        );
      // break;

      case componentRender.DAMAGED_STOCK_DTLS:
        // console.log('rendering in stock')
        return (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Header size="large" color="red" textAlign="center">
              <Icon name="bar graph" color="red" />Damaged Stock Details
            </Header>
            <div
              style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
            >
              {this.renderDamagedStockAssetTable()}
            </div>
          </Dimmer.Dimmable>
        );
      // break;
      case componentRender.CUSTOMER_ORDER_DTLS:
        return (
          <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Header size="large" color="red" textAlign="center">
              <Icon name="bar graph" color="Teal" />Customer Order Details
            </Header>
            <div
              style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}
            >
              {this.renderCustomerOrderDetailTable()}
            </div>
          </Dimmer.Dimmable>
        );
      // break;
      default:
        break;
    }
  }

  // customer details
  renderCustomerDetails() {
    return (
      <Segment>
        <Label as="a" color="olive" ribbon>
          <Icon name="user circle" />Customer Details
        </Label>

        <Header size="large" color="grey">
          <Icon name="user circle" />
          {/* <Icon name="bar graph" color="red"/>Damaged Stock Details */}
          Total Customers: {this.state.allCustomers.length}
        </Header>
        <Table color="olive" celled selectable unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Customer Name</Table.HeaderCell>
              <Table.HeaderCell>Previous Names</Table.HeaderCell>
              {/* <Table.HeaderCell>Adderss</Table.HeaderCell> */}
              <Table.HeaderCell>PAN No.</Table.HeaderCell>
              {/* <Table.HeaderCell></Table.HeaderCell> */}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.allCustomers.map(obj => {
              return (
                <Table.Row
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    this.setState({
                      selectedCustomerDetails: obj
                    });
                  }}
                >
                  {this.state.selectedCustomerDetails.Customer_Id ===
                  obj.Customer_Id ? (
                    <Table.Cell>
                      <Label ribbon color="olive">
                        {obj.CName}
                      </Label>
                    </Table.Cell>
                  ) : (
                    <Table.Cell>{obj.CName}</Table.Cell>
                  )}
                  <Table.Cell>{obj.Previously_Known_As}</Table.Cell>
                  <Table.Cell>{obj.Pan_No}</Table.Cell>
                  {/* <Table.Cell><Icon name="history"/><Icon name="sticky note"/></Table.Cell> */}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
  renderSelectedCustomerDetails() {
    if (this.state.selectedCustomerDetails)
      return [
        <div>
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>,
        <Card>
          <Card.Content>
            <Card.Header>
              {this.state.selectedCustomerDetails.CName}
            </Card.Header>
            <Card.Meta>
              {this.state.selectedCustomerDetails.previously_known_as}
            </Card.Meta>
            <Card.Description>
              <strong>Customer ID: </strong>{" "}
              {this.state.selectedCustomerDetails.Customer_Id}
            </Card.Description>
            <Card.Description>
              <strong>Name: </strong> {this.state.selectedCustomerDetails.CName}
            </Card.Description>
            <Card.Description>
              <strong>Previous Alias: </strong>{" "}
              {this.state.selectedCustomerDetails.Previously_Known_As}
            </Card.Description>
            <Card.Description>
              <strong>PAN: </strong> {this.state.selectedCustomerDetails.Pan_No}
            </Card.Description>
          </Card.Content>

          <Card.Content extra>
            <Card.Description>
              <strong>Comments: </strong>{" "}
              {this.state.selectedCustomerDetails.Comments}
            </Card.Description>
            <br />
            <div className="ui two buttons">
              <Button
                basic
                color="green"
                onClick={this.loadCustomerOrderHistory.bind(
                  this,
                  this.state.selectedCustomerDetails.Customer_Id
                )}
              >
                Order History
              </Button>
              <Button
                basic
                color="red"
                onClick={() => this.setState({ selectedCustomerDetails: "" })}
              >
                Close
              </Button>
            </div>
          </Card.Content>
        </Card>
      ];
    else return undefined;
  }

  // asset status table render
  renderAssetStatusTable() {
    // intialize row variables
    let inStock = 0;
    let outStock = 0;
    let damaged = 0;
    let total = 0;

    // summation variables
    let totalInStock = 0;
    let totalOutStock = 0;
    let totalDamaged = 0;
    let totalOfTotal = 0;

    return (
      <Segment>
        <Label as="a" color="orange" ribbon>
          <Icon name="shopping basket" />Asset Summery
        </Label>
        <Table color="orange" celled unstackable definition striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
                <Icon name="tv" color="grey" /> Asset-Type
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="download" color="green" /> In stock
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="upload" color="purple" /> Out of Stock
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="ban" color="red" /> Damaged
              </Table.HeaderCell>
              <Table.HeaderCell>
                <Icon name="plus" color="orange" /> Total
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.allAssetTypes.map((asset, idx) => {
              // get the values of row data
              inStock = this.getInStock(idx);
              outStock = this.getOutStock(idx);
              damaged = this.getDamaged(idx);
              total =
                this.getInStock(idx) +
                this.getOutStock(idx) +
                this.getDamaged(idx);
              // set summation variables
              totalInStock += inStock;
              totalOutStock += outStock;
              totalDamaged += damaged;
              totalOfTotal += total;

              return (
                <Table.Row key={asset.id} style={{ cursor: "pointer" }}>
                  <Table.Cell>
                    <Icon name="triangle right" color="grey" />
                    {asset.type_name}
                  </Table.Cell>
                  {inStock > 0 ? (
                    <Table.Cell
                      selectable
                      onClick={this.inStockCellOnClick.bind(this, idx, asset)}
                    >
                      <a>{inStock}</a>
                    </Table.Cell>
                  ) : (
                    <Table.Cell disabled>{inStock}</Table.Cell>
                  )}
                  {/* <Table.Cell selectable={outStock>0}><a>{outStock}</a></Table.Cell> */}
                  {/* rendering problem when cell is selectable */}
                  {outStock > 0 ? (
                    <Table.Cell
                      selectable
                      onClick={this.outStockCellOnClick.bind(this, idx, asset)}
                    >
                      <a>{outStock}</a>
                    </Table.Cell>
                  ) : (
                    <Table.Cell disabled>{outStock}</Table.Cell>
                  )}
                  {damaged > 0 ? (
                    <Table.Cell
                      selectable
                      onClick={this.damagedStockCellOnClick.bind(
                        this,
                        idx,
                        asset
                      )}
                    >
                      <a>{damaged}</a>
                    </Table.Cell>
                  ) : (
                    <Table.Cell disabled>{damaged}</Table.Cell>
                  )}
                  <Table.Cell>{total}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell>
                <Icon name="instock" />
                <strong>TOTAL</strong>
                <Icon name="chevron right" />
              </Table.HeaderCell>
              <Table.HeaderCell>{totalInStock}</Table.HeaderCell>
              <Table.HeaderCell>{totalOutStock}</Table.HeaderCell>
              <Table.HeaderCell>{totalDamaged}</Table.HeaderCell>
              <Table.HeaderCell>{totalOfTotal}</Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <Statistic.Group>
          <Statistic>
            <Statistic.Value>{totalInStock}</Statistic.Value>
            <Statistic.Label>In Stock</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{totalOutStock}</Statistic.Value>
            <Statistic.Label>Out of Stock</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{totalDamaged}</Statistic.Value>
            <Statistic.Label>Damaged</Statistic.Label>
          </Statistic>
          <Statistic>
            <Statistic.Value>{totalOfTotal}</Statistic.Value>
            <Statistic.Label>Total</Statistic.Label>
          </Statistic>
        </Statistic.Group>
      </Segment>
    );
  }

  // outstock asset status table render
  renderOutStockAssetTable() {
    return (
      <Segment>
        <Label as="a" color="violet" ribbon>
          <Icon name="upload" />Assets Out of Stock
        </Label>
        <Table color="violet" celled unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Asset Name</Table.HeaderCell>
              <Table.HeaderCell>Serial No.</Table.HeaderCell>
              <Table.HeaderCell>Customer Name</Table.HeaderCell>
              <Table.HeaderCell>Address</Table.HeaderCell>
              <Table.HeaderCell>City</Table.HeaderCell>
              <Table.HeaderCell>State</Table.HeaderCell>
              <Table.HeaderCell>PIN Code</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.assetOutOfStockDetails.map(obj => {
              console.log("data", obj);
              return (
                <Table.Row>
                  <Table.Cell>{obj.make}</Table.Cell>
                  <Table.Cell>{obj.serial_no}</Table.Cell>
                  <Table.Cell>{obj.CName}</Table.Cell>
                  <Table.Cell>{obj.Address}</Table.Cell>
                  <Table.Cell>{obj.City}</Table.Cell>
                  <Table.Cell>{obj.State}</Table.Cell>
                  <Table.Cell>{obj.Pincode}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          color="blue"
          onClick={() => {
            this.setState({ currentComponent: componentRender.MAIN });
          }}
        >
          <Icon name="undo" />Back
        </Button>
      </Segment>
    );
  }

  // outstock asset status table render
  renderInStockAssetTable() {
    return (
      <Segment>
        <Label as="a" color="green" ribbon>
          <Icon name="download" />Assets In Stock
        </Label>
        <Table color="green" celled unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Asset Name</Table.HeaderCell>
              <Table.HeaderCell>Warranty End Date</Table.HeaderCell>
              <Table.HeaderCell>Part Code</Table.HeaderCell>
              <Table.HeaderCell>Procurement Date</Table.HeaderCell>
              <Table.HeaderCell>Purchase Date</Table.HeaderCell>
              <Table.HeaderCell>Purchase Price</Table.HeaderCell>
              <Table.HeaderCell>Serial No</Table.HeaderCell>
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Comments</Table.HeaderCell>
              <Table.HeaderCell>Transfer Order No.</Table.HeaderCell>
              <Table.HeaderCell>Transfer Order Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.assetInStockDetails.map(obj => {
              // console.log(obj)
              return (
                <Table.Row>
                  <Table.Cell>{obj.make}</Table.Cell>
                  {moment(obj.warranty_end_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.warranty_end_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.part_code}</Table.Cell>
                  {moment(obj.procurement_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.procurement_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss") !==
                  "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss")}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.purchase_price}</Table.Cell>
                  <Table.Cell>{obj.serial_no}</Table.Cell>
                  <Table.Cell>{obj.branch}</Table.Cell>
                  <Table.Cell>{obj.comments}</Table.Cell>
                  <Table.Cell>{obj.transfer_order_no}</Table.Cell>
                  {moment(obj.transfer_order_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.transfer_order_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          color="blue"
          onClick={() => {
            this.setState({ currentComponent: componentRender.MAIN });
          }}
        >
          <Icon name="undo" />Back
        </Button>
      </Segment>
    );
  }
  // outstock asset status table render
  renderDamagedStockAssetTable() {
    return (
      <Segment>
        <Label as="a" color="red" ribbon>
          <Icon name="ban" />Damaged assets
        </Label>
        <Table color="red" celled unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Asset Name</Table.HeaderCell>
              <Table.HeaderCell>Warranty End Date</Table.HeaderCell>
              <Table.HeaderCell>Part Code</Table.HeaderCell>
              <Table.HeaderCell>Procurement Date</Table.HeaderCell>
              <Table.HeaderCell>Purchase Date</Table.HeaderCell>
              <Table.HeaderCell>Purchase Price</Table.HeaderCell>
              <Table.HeaderCell>Serial No</Table.HeaderCell>
              <Table.HeaderCell>Branch</Table.HeaderCell>
              <Table.HeaderCell>Comments</Table.HeaderCell>
              <Table.HeaderCell>Transfer Order No.</Table.HeaderCell>
              <Table.HeaderCell>Transfer Order Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.assetDamagedStockDetails.map(obj => {
              // console.log(obj)
              return (
                <Table.Row>
                  <Table.Cell>{obj.make}</Table.Cell>
                  {moment(obj.warranty_end_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.warranty_end_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.part_code}</Table.Cell>
                  {moment(obj.procurement_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.procurement_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss") !==
                  "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss")}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.purchase_price}</Table.Cell>
                  <Table.Cell>{obj.serial_no}</Table.Cell>
                  <Table.Cell>{obj.branch}</Table.Cell>
                  <Table.Cell>{obj.comments}</Table.Cell>
                  <Table.Cell>{obj.transfer_order_no}</Table.Cell>
                  {moment(obj.transfer_order_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.transfer_order_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          color="blue"
          onClick={() => {
            this.setState({ currentComponent: componentRender.MAIN });
          }}
        >
          <Icon name="undo" />Back
        </Button>
      </Segment>
    );
  }

  // the segment that shows the config staus of all the assets chk
  renderConfigSegment = () => {
    var dimmerActive = this.state.configSegmentDimmerActive;
    return (
      <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
        <Dimmer active={dimmerActive} inverted>
          <Loader>Loading</Loader>
        </Dimmer>
        {/* <Segment> */}
        <Label as="a" color="violet" ribbon>
          <Icon name="wrench" />Config Details
        </Label>
        <br />
        <br />
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column width={4}>
              <Table celled unstackable selectable>
                <Table.Header>
                  <Table.HeaderCell>Asset Type</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                  {this.state.allAssetTypes.map(asset => (
                    <Table.Row
                      style={{ cursor: "pointer" }}
                      onClick={this.assetTypeOnClick.bind(
                        this,
                        asset.type_name
                      )}
                      active={
                        this.state.selectedAssetTypeName === asset.type_name
                      }
                    >
                      <Table.Cell>​​{asset.type_name}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Grid.Column>
            <Grid.Column width={12}>
              {this.state.selectedAssetTypeName ? (
                <Table celled unstackable selectable>
                  <Table.Header>
                    <Table.HeaderCell>Make</Table.HeaderCell>
                    <Table.HeaderCell>SI No.</Table.HeaderCell>
                    <Table.HeaderCell>Comment</Table.HeaderCell>
                    <Table.HeaderCell>Branch</Table.HeaderCell>
                  </Table.Header>
                  <Table.Body>
                    {this.state.selectedAssetDetails.map(asset => (
                      <Table.Row
                        style={{ cursor: "pointer" }}
                        onClick={this.assetOnClick.bind(this, asset.id)}
                        active={asset.id === this.state.selectedAssetId}
                      >
                        <Table.Cell>​​{asset.make}</Table.Cell>
                        <Table.Cell>​​{asset.serial_no}</Table.Cell>
                        <Table.Cell>​​{asset.comments}</Table.Cell>
                        <Table.Cell>​​{asset.branch}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                undefined
              )}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            {this.state.selectedAssetId &&
            this.state.selectedAssetConfig.length > 0 ? (
              <Table celled unstackable striped selectable>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>​​ID</Table.HeaderCell>
                    <Table.HeaderCell>​​Serial No</Table.HeaderCell>
                    <Table.HeaderCell>​​Make</Table.HeaderCell>
                    <Table.HeaderCell>​​Child Asset SI No.</Table.HeaderCell>
                    <Table.HeaderCell>​​Parent Asset SI No.</Table.HeaderCell>
                    <Table.HeaderCell>​​Status</Table.HeaderCell>
                    <Table.HeaderCell>​​Config Date</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.selectedAssetConfig.map(asset => (
                    <Table.Row>
                      <Table.Cell>​​{asset.id}</Table.Cell>
                      <Table.Cell>​​{asset.serial_no}</Table.Cell>
                      <Table.Cell>​​{asset.make}</Table.Cell>
                      <Table.Cell>​​{this.getChild(asset.id)}</Table.Cell>
                      <Table.Cell>​​{this.getParent(asset.id)}</Table.Cell>
                      {asset.status === 1 ? (
                        <Table.Cell>​​{"Currently Configured"}</Table.Cell>
                      ) : (
                        <Table.Cell>​​{"Previously Configured"}</Table.Cell>
                      )}
                      {moment(asset.create_timestamp).format(
                        "YYYY-MM-DD HH:mm:ss"
                      ) !== "Invalid date" ? (
                        <Table.Cell>
                          ​​{moment(asset.create_timestamp).format(
                            "YYYY-MM-DD HH:mm:ss"
                          )}
                        </Table.Cell>
                      ) : (
                        <Table.Cell />
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            ) : (
              <Container textAlign="center">
                {this.state.selectedAssetId &&
                this.state.selectedAssetConfig.length === 0 ? (
                  <Header color="grey" size="small">
                    No Config Data available
                  </Header>
                ) : (
                  undefined
                )}
              </Container>
            )}
          </Grid.Row>
        </Grid>
        {/* </Segment> */}
      </Dimmer.Dimmable>
    );
  };

  // display customer order details in a table
  renderCustomerOrderDetailTable = () => {
    return (
      <div>
        <Label as="a" color="brown" ribbon>
          <Icon name="history" />Order Details
        </Label>

        <Table color="brown" celled unstackable striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell> Make</Table.HeaderCell>
              <Table.HeaderCell> ​​​Oid</Table.HeaderCell>
              <Table.HeaderCell> ​​​Order date</Table.HeaderCell>
              <Table.HeaderCell> ​​​Parent challan id</Table.HeaderCell>
              <Table.HeaderCell> ​​​Part code</Table.HeaderCell>
              <Table.HeaderCell> ​​Po</Table.HeaderCell>
              <Table.HeaderCell> ​​Po reference</Table.HeaderCell>
              <Table.HeaderCell> ​​​Procurement date</Table.HeaderCell>
              <Table.HeaderCell> ​​​Purchase date</Table.HeaderCell>
              <Table.HeaderCell> ​​​Purchase price</Table.HeaderCell>
              <Table.HeaderCell> ​​​Rental begin date</Table.HeaderCell>
              <Table.HeaderCell> ​​​Rental end date</Table.HeaderCell>
              <Table.HeaderCell> ​​Serial no</Table.HeaderCell>
              <Table.HeaderCell> Supplier</Table.HeaderCell>
              <Table.HeaderCell> Total amount</Table.HeaderCell>
              <Table.HeaderCell> Total unit price</Table.HeaderCell>
              <Table.HeaderCell> Total value</Table.HeaderCell>
              <Table.HeaderCell> Transfer order no</Table.HeaderCell>
              <Table.HeaderCell> Type name</Table.HeaderCell>
              <Table.HeaderCell> Eway number</Table.HeaderCell>
              <Table.HeaderCell> Warranty end date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.selectedCustomerOrderDetails.map(obj => {
              // console.log(obj)
              return (
                <Table.Row>
                  <Table.Cell>{obj.make}</Table.Cell>
                  <Table.Cell>{obj.oid}</Table.Cell>
                  {moment(obj.order_date).format("YYYY-MM-DD HH:mm:ss") !==
                  "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.order_date).format("YYYY-MM-DD HH:mm:ss")}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.parent_challan_id}</Table.Cell>
                  <Table.Cell>{obj.part_code}</Table.Cell>
                  <Table.Cell>{obj.po}</Table.Cell>
                  <Table.Cell>{obj.po_reference}</Table.Cell>
                  {moment(obj.procurement_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.procurement_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss") !==
                  "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.purchase_date).format("YYYY-MM-DD HH:mm:ss")}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.purchase_price}</Table.Cell>
                  {moment(obj.rental_begin_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.rental_begin_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  {moment(obj.rental_end_date).format("YYYY-MM-DD HH:mm:ss") !==
                  "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.rental_end_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                  <Table.Cell>{obj.serial_no}</Table.Cell>
                  <Table.Cell>{obj.supplier}</Table.Cell>
                  <Table.Cell>{obj.total_amount}</Table.Cell>
                  <Table.Cell>{obj.total_unit_price}</Table.Cell>
                  <Table.Cell>{obj.total_value}</Table.Cell>
                  <Table.Cell>{obj.transfer_order_no}</Table.Cell>
                  <Table.Cell>{obj.type_name}</Table.Cell>
                  <Table.Cell>{obj.uea_number}</Table.Cell>
                  {moment(obj.warranty_end_date).format(
                    "YYYY-MM-DD HH:mm:ss"
                  ) !== "Invalid date" ? (
                    <Table.Cell>
                      {moment(obj.warranty_end_date).format(
                        "YYYY-MM-DD HH:mm:ss"
                      )}
                    </Table.Cell>
                  ) : (
                    <Table.Cell />
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Button
          color="blue"
          onClick={() => {
            this.setState({ currentComponent: componentRender.MAIN });
          }}
        >
          <Icon name="undo" />Back
        </Button>
      </div>
    );
  };
}

// {
//   /* <Table.Footer fullWidth>
// <Table.Row>
//   <Table.HeaderCell />
//   <Table.HeaderCell colSpan='4'>
//     <Button floated='right' icon labelPosition='left' primary size='small'>
//       <Icon name='user' /> Add User
//     </Button>
//     <Button size='small'>Approve</Button>
//     <Button disabled size='small'>Approve All</Button>
//   </Table.HeaderCell>
// </Table.Row>
// </Table.Footer> */
// }
export default Dashboard;
