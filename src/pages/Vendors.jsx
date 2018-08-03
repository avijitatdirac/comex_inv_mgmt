import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Loader,
  Table,
  Button,
  Input,
  Icon
} from "semantic-ui-react";
import { findIndex } from "lodash";
import { fetchAPI } from "../utility";

class Vendors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vendors: [],
      isLoading: false,
      isSaving: false,
      rowsInEditMode: []
    };
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

  changeVendorField(vendor, field, value) {
    let vendors = this.state.vendors.slice();
    const idx = findIndex(this.state.vendors, { vendor_id: vendor.vendor_id });
    let obj = { ...vendors[idx] };
    obj[field] = value;
    vendors[idx] = obj;
    this.setState({ vendors });
  }

  onClickEdit(vendor) {
    let rowsInEditMode = this.state.rowsInEditMode.slice();
    rowsInEditMode.push(vendor.vendor_id);
    this.setState({ rowsInEditMode });
  }

  async onSave(vendor) {
    if (!vendor.vendor_name) {
      return;
    }
    try {
      const vendorId = vendor.vendor_id;
      if (vendorId > 0) {
        const res = await fetchAPI("/vendor/update_vendor", { ...vendor });
        if (res.status === 200) {
          this.changeEditMode(vendorId);
        }
      } else {
        const res = await fetchAPI("/vendor/insert_vendor", { ...vendor });
        const data = await res.json();
        if (data.vendor_id) {
          this.changeEditMode(vendorId);
          this.changeVendorField(vendor, "vendor_id", data.vendor_id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  changeEditMode(vendorId) {
    let rowsInEditMode = this.state.rowsInEditMode.slice();
    const idx = rowsInEditMode.indexOf(vendorId);
    if (idx >= 0) {
      rowsInEditMode.splice(idx, 1);
    }
    this.setState({ rowsInEditMode });
  }

  addVendor() {
    const id = (this.state.vendors.length + 1) * -1;
    const obj = {
      vendor_id: id,
      vendor_name: "",
      address: "",
      contact_no: ""
    };
    let vendors = this.state.vendors.slice();
    let rowsInEditMode = this.state.rowsInEditMode.slice();
    vendors.push(obj);
    rowsInEditMode.push(id);
    this.setState({ vendors, rowsInEditMode });
  }

  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Sl No</Table.HeaderCell>
          <Table.HeaderCell>Vendor Name</Table.HeaderCell>
          <Table.HeaderCell>Address</Table.HeaderCell>
          <Table.HeaderCell>Contact No</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableBody() {
    return (
      <Table.Body>
        {this.state.vendors.map((v, i) => {
          const idx = this.state.rowsInEditMode.indexOf(v.vendor_id);
          if (idx >= 0) {
            return this.renderRowEdit(v, i);
          } else {
            return this.renderRowReadOnly(v, i);
          }
        })}
      </Table.Body>
    );
  }

  renderRowReadOnly(vendor, idx) {
    return (
      <Table.Row key={vendor.vendor_id}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{vendor.vendor_name}</Table.Cell>
        <Table.Cell>{vendor.address}</Table.Cell>
        <Table.Cell>{vendor.contact_no}</Table.Cell>
        <Table.Cell>
          <Button primary onClick={() => this.onClickEdit(vendor)}>
            Edit
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderRowEdit(vendor, idx) {
    return (
      <Table.Row key={vendor.vendor_id}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>
          <Input
            placeholder="Enter Vendor name"
            value={vendor.vendor_name}
            onChange={e =>
              this.changeVendorField(vendor, "vendor_name", e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            placeholder="Enter Vendor address"
            value={vendor.address}
            onChange={e =>
              this.changeVendorField(vendor, "address", e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Input
            placeholder="Enter Vendor contact no"
            value={vendor.contact_no}
            onChange={e =>
              this.changeVendorField(vendor, "contact_no", e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Button positive onClick={() => this.onSave(vendor)}>
            Save
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  }

  renderTableFooter() {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={5}>
            <Button
              floated="left"
              icon
              labelPosition="left"
              primary
              size="small"
              onClick={this.addVendor.bind(this)}
            >
              <Icon name="user" /> Add Vendor
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
            <Loader>Fetching Data</Loader>
          </Dimmer>
          <h1>Vendors</h1>
          <Table celled color="blue" verticalAlign="middle">
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
