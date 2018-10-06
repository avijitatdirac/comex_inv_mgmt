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

class Branch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      branches: [],
      isLoading: false
    };

    this.addBranch = this.addBranch.bind(this);
    this.openBranch = this.openBranch.bind(this);
  }

  // fetch branch list
  async fetchBranches() {
    try {
      this.setState({ isLoading: true });
      const res = await fetchAPI("/branch/get_branches", {});
      if (res.status !== 200) {
        throw new Error("API Error, error code:", res.status);
      }
      const data = await res.json();
      const { branches } = data;
      this.setState({ branches, isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  // fetch branch list when component mounts
  componentDidMount() {
    this.fetchBranches();
  }

  // onclick handler for Add New Branch button
  addBranch() {
    this.props.history.push("/branch-details");
  }

  // onclick handler for row click
  openBranch(branch) {
    const { id } = branch;
    const url = `/branch-details/${id}`;
    this.props.history.push(url);
  }

  // renders the table headers
  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Sl No</Table.HeaderCell>
          <Table.HeaderCell>Branch Name</Table.HeaderCell>
          <Table.HeaderCell>City</Table.HeaderCell>
          <Table.HeaderCell>Allow Movement Of Items</Table.HeaderCell>
          <Table.HeaderCell>Main Contact Name</Table.HeaderCell>
          <Table.HeaderCell>Main Contact Phone</Table.HeaderCell>
          <Table.HeaderCell>Main Contact Email</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  // renders the table body
  renderTableBody() {
    return (
      <Table.Body>
        {this.state.branches.map((br, i) => {
          return this.renderRow(br, i);
        })}
      </Table.Body>
    );
  }

  // renders the row in the table
  renderRow(branch, idx) {
    return (
      <Table.Row key={branch.id} onClick={() => this.openBranch(branch)}>
        <Table.Cell>{idx + 1}</Table.Cell>
        <Table.Cell>{branch.name}</Table.Cell>
        <Table.Cell>{branch.city}</Table.Cell>
        <Table.Cell>
          {branch.allow_movement_of_items === 1 ? "Yes" : "No"}
        </Table.Cell>
        <Table.Cell>{branch.main_contact_name}</Table.Cell>
        <Table.Cell>{branch.main_contact_phone}</Table.Cell>
        <Table.Cell>{branch.main_contact_email}</Table.Cell>
      </Table.Row>
    );
  }

  // renders the table footer portion
  renderTableFooter() {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={7}>
            <Button
              floated="left"
              icon
              labelPosition="left"
              primary
              size="small"
              onClick={this.addBranch}
            >
              <Icon name="add" /> Add New Branch
            </Button>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  // main render function of the component
  render() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Dimmer.Dimmable
          as={Segment}
          dimmed={this.state.isLoading}
          color="green"
        >
          <Dimmer active={this.state.isLoading} inverted>
            <Loader>Fetching Branches...</Loader>
          </Dimmer>
          <h1>Branches</h1>
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

export default Branch;
