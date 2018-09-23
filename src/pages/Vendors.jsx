import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Loader,
  Table,
  Button,
  Icon
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class Vendors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendors: [],
      isLoading: false
    };

    this.addVendor = this.addVendor.bind(this);
    this.openVendor = this.openVendor.bind(this);
  }

  async fetchVendors() {
    try {
      this.setState({ isLoading: true });
      const res = await fetchAPI("/vendor/get_vendors", {});
      if (res.status !== 200) {
        throw new Error("API Error, error code:", res.status);
      }
      const data = await res.json();
      const { vendors } = data;
      this.setState({ vendors, isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.fetchVendors();
  }

  addVendor() {
    this.props.history.push("/vendor-details");
  }

  openVendor(vendor) {
    const { id } = vendor;
    const url = `/vendor-details/${id}`;
    this.props.history.push(url);
  }

  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Sl No</Table.HeaderCell>
          <Table.HeaderCell>Vendor Name</Table.HeaderCell>
          <Table.HeaderCell>PAN</Table.HeaderCell>
          <Table.HeaderCell>GST</Table.HeaderCell>
          <Table.HeaderCell>CIN</Table.HeaderCell>
          <Table.HeaderCell>City</Table.HeaderCell>
          <Table.HeaderCell>Main Contact Name</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableBody() {
    return (
      <Table.Body>
        {this.state.vendors.map((v, i) => {
          return this.renderRow(v, i);
        })}
      </Table.Body>
    );
  }

  renderRow(vendor, idx) {
    return (
      <Table.Row key={vendor.id} onClick={() => this.openVendor(vendor)}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{vendor.name}</Table.Cell>
        <Table.Cell>{vendor.pan}</Table.Cell>
        <Table.Cell>{vendor.gst}</Table.Cell>
        <Table.Cell>{vendor.cin}</Table.Cell>
        <Table.Cell>{vendor.city}</Table.Cell>
        <Table.Cell>{vendor.mainContactPersonName}</Table.Cell>
      </Table.Row>
    );
  }

  renderTableFooter() {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={8}>
            <Button
              floated="left"
              icon
              labelPosition="left"
              primary
              size="small"
              onClick={this.addVendor}
            >
              <Icon name="user" /> Add New Vendor
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  render() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Dimmer.Dimmable
          as={Segment}
          dimmed={this.state.dimmerActive}
          color="green"
        >
          <Dimmer active={this.state.isLoading} inverted>
            <Loader>Fetching Vendonrs...</Loader>
          </Dimmer>
          <h1>Vendors</h1>
          <Table celled color="blue" verticalAlign="middle" selectable>
            {this.renderTableHeader()}
            {this.renderTableBody()}
            {this.renderTableFooter()}
          </Table>
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default Vendors;
