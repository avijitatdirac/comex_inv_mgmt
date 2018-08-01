import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Table,
  Loader,
  Button,
  Divider,
  Input
} from "semantic-ui-react";
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
  }

  async fetchBranches() {
    try {
      this.setState({ isLoading: true });
      const res = await fetchAPI("/branch/get_branch_names", {});
      const data = await res.json();
      if (data.branchNames) {
        this.setState({ allBranches: data.branchNames });
      }
      this.setState({ isLoading: false });
    } catch (err) {
      console.error(err);
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.fetchBranches();
  }

  addNewBranch() {
    this.setState({ isAddButtonClicked: true });
  }

  onChangeNewBranch(e) {
    const newBranch = e.target.value;
    this.setState({ newBranch });
  }

  onCancel() {
    this.setState({ newBranch: "", isAddButtonClicked: false });
  }

  async onSave() {
    console.log("on save");
    if (!this.state.newBranch) {
      return;
    }
    try {
      this.setState({ isSaving: true });
      const res = await fetchAPI("/branch/save_new_branch", {
        new_branch: this.state.newBranch
      });
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

  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell style={{ width: "100px" }}>Sl No</Table.HeaderCell>
          <Table.HeaderCell>Branch Name</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableBody() {
    return (
      <Table.Body>
        {this.state.allBranches.map((branch, idx) => (
          <Table.Row key={branch.id}>
            <Table.Cell>{idx + 1}</Table.Cell>
            <Table.Cell>{branch.name}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    );
  }

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
          <Table celled color="blue" verticalAlign="middle">
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
