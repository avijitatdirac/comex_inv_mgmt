import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Table,
  Loader,
  Button,
  Divider,
  Input,
  Icon
} from "semantic-ui-react";
import { findIndex } from "lodash";
import { fetchAPI } from "../utility";

class Branch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allBranches: [],
      newBranch: "",
      isLoading: false,
      isAddButtonClicked: false,
      isSaving: false
    };

    this.addNewBranch = this.addNewBranch.bind(this);
    this.onChangeNewBranch = this.onChangeNewBranch.bind(this);
    this.onSave = this.onSave.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onRowClick = this.onRowClick.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.updateBranch = this.updateBranch.bind(this);
    this.changeBranchName = this.changeBranchName.bind(this);
  }

  /**
   * calls API endpoint to fetch list of branches
   */
  async fetchBranches() {
    try {
      this.setState({ isLoading: true });
      const res = await fetchAPI("/branch/get_branches", {});
      const data = await res.json();
      if (data.branches) {
        data.branches.forEach(br => {
          br.edit = false;
          br.saving = false;
        });
        this.setState({ allBranches: data.branches });
      }
      this.setState({ isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  // call the API to fetch branch list
  componentDidMount() {
    this.fetchBranches();
  }

  // onclick handler for Add New Branch button
  addNewBranch() {
    this.setState({ isAddButtonClicked: true });
  }

  // onchange handler for  Add new branch text field
  onChangeNewBranch(e) {
    const newBranch = e.target.value;
    this.setState({ newBranch });
  }

  // onchange handler for branch name field in edit mode
  changeBranchName(id, value) {
    const allBranches = this.state.allBranches.slice();
    const idx = findIndex(allBranches, { id });
    if (idx < 0) return;
    allBranches[idx].name = value;
    this.setState({ allBranches });
  }

  // onclick handler for cancel button
  onCancel() {
    this.setState({ newBranch: "", isAddButtonClicked: false });
  }

  // onclick handler for save button for add new branch
  async onSave() {
    if (!this.state.newBranch) {
      return;
    }
    try {
      this.setState({ isSaving: true });
      const name = this.state.newBranch;
      const res = await fetchAPI("/branch/insert_branch", { name });
      const data = await res.json();
      this.setState({
        newBranch: "",
        allBranches: data.branches,
        isSaving: false
      });
    } catch (err) {
      this.setState({ isSaving: false });
      console.error(err);
    }
  }

  // onclick handler for table row
  onRowClick(e) {
    e.stopPropagation();
    const { param } = e.target.dataset;
    // exit when param is undefined
    if (!param) return;
    const allBranches = this.state.allBranches.slice();
    const idx = findIndex(allBranches, { id: Number(param) });
    if (idx < 0) return;
    allBranches[idx].edit = true;
    this.setState({ allBranches });
  }

  // onclick handler of the delete icon
  async onDelete(e) {
    e.stopPropagation();
    const { param } = e.target.dataset;
    // exit when param is undefined
    if (!param) return;
    const allBranches = this.state.allBranches.slice();
    const idx = findIndex(allBranches, { id: Number(param) });
    if (idx < 0) return;
    allBranches[idx].saving = true;
    this.setState({ allBranches });
    try {
      const payload = { id: Number(param) };
      const res = await fetchAPI("/branch/delete_branch", payload);
      const data = await res.json();
      if (data.success) {
        allBranches[idx].saving = false;
        allBranches[idx].is_active = 0;
        this.setState({ allBranches });
      }
    } catch (err) {
      console.error(err);
      allBranches[idx].saving = false;
      this.setState({ allBranches });
    }
  }

  // onclick handler of the update icon
  async updateBranch(e) {
    e.stopPropagation();
    const { param } = e.target.dataset;
    // exit when param is undefined

    if (!param) return;
    const allBranches = this.state.allBranches.slice();
    const idx = findIndex(allBranches, { id: Number(param) });
    const name = allBranches[idx].name;
    const id = allBranches[idx].id;
    const payload = { id, name };
    if (!name) return;
    allBranches[idx].saving = true;
    this.setState({ allBranches });
    try {
      const res = await fetchAPI("/branch/update_branch", payload);
      const data = await res.json();
      if (data.success) {
        allBranches[idx].saving = false;
        allBranches[idx].edit = false;
        this.setState({ allBranches });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // renders table header
  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ width: "100px" }}>Sl No</Table.HeaderCell>
          <Table.HeaderCell>Branch Name</Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
    );
  }

  // renders table body
  renderTableBody() {
    return (
      <Table.Body>
        {this.state.allBranches
          .filter(br => br.is_active === 1)
          .map((branch, idx) => this.renderTableRow(branch, idx))}
      </Table.Body>
    );
  }

  // renders table rows
  renderTableRow(branch, idx) {
    return (
      <Table.Row key={branch.id} onClick={this.onRowClick}>
        <Table.Cell data-param={branch.id}>{idx + 1}</Table.Cell>
        <Table.Cell data-param={branch.id}>
          {branch.edit ? (
            <Input
              focus
              placeholder="Branch Name"
              value={branch.name}
              onChange={(e, d) => {
                e.stopPropagation();
                this.changeBranchName(branch.id, d.value);
              }}
            />
          ) : (
            branch.name
          )}
        </Table.Cell>
        <Table.Cell>{this.renderRowIcon(branch)}</Table.Cell>
      </Table.Row>
    );
  }

  // renders icon inside table row
  renderRowIcon(branch) {
    if (branch.saving) {
      return <Icon name="sync" />;
    }

    if (branch.edit) {
      return (
        <Icon
          name="check"
          size="large"
          link
          color="green"
          data-param={branch.id}
          onClick={this.updateBranch}
        />
      );
    }

    return (
      <Icon
        name="trash"
        link
        color="red"
        data-param={branch.id}
        onClick={this.onDelete}
      />
    );
  }

  // renders Add New Branch button section
  renderAddNewBranchSection() {
    if (!this.state.isAddButtonClicked) {
      return (
        <Button primary onClick={this.addNewBranch}>
          Add New Branch
        </Button>
      );
    }
    return (
      <div>
        <Input
          placeholder="Please enter new branch name"
          size="small"
          style={{ width: "250px", marginRight: "10px" }}
          value={this.state.newBranch}
          onChange={this.onChangeNewBranch}
        />
        {this.state.isSaving ? (
          "Saving, Please wait..."
        ) : (
          <Button
            positive
            onClick={this.onSave}
            disabled={!this.state.newBranch}
          >
            Save
          </Button>
        )}
        <Button negative onClick={this.onCancel} disabled={this.state.isSaving}>
          Cancel
        </Button>
      </div>
    );
  }

  // main render function
  render() {
    return (
      <div style={{ minHeight: "100vh" }}>
        <Dimmer.Dimmable
          as={Segment}
          dimmed={this.state.isLoading}
          color="green"
        >
          <Dimmer active={this.state.isLoading} inverted>
            <Loader>Fetching Data</Loader>
          </Dimmer>
          <h1>Branches</h1>
          <Table celled color="blue" verticalAlign="middle" selectable>
            {this.renderTableHeader()}
            {this.renderTableBody()}
          </Table>
          <br />
          <Divider />
          {this.renderAddNewBranchSection()}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default Branch;
