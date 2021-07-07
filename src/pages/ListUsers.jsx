import React, { Component } from "react";
import {
  Form,
  Segment,
  Divider,
  Dimmer,
  Loader,
  Table
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class ListUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      branchId: "",
      roleId: "",
      dimmerActive: false,
      branchOptions: [],
      userRoles: [],
      userList: [],
      userListFiltered: []
    };
    this.filterByFirstName = this.filterByFirstName.bind(this);
    this.filterByLastName = this.filterByLastName.bind(this);
    this.filterByEmail = this.filterByEmail.bind(this);
    this.filterByRole = this.filterByRole.bind(this);
    this.filterByBranch = this.filterByBranch.bind(this);
    this.openUserDetails = this.openUserDetails.bind(this);
  }

  componentDidMount() {
    this.fetchUserRoles();
    this.fetchBranchNames();
    this.fetchUserList();
  }

  async fetchUserRoles() {
    try {
      const res = await fetchAPI("/roles/get_user_roles", {});
      const data = await res.json();
      const userRoles = data.roles.map(role => ({
        key: role.role_id,
        value: role.role_id,
        text: role.role_name
      }));
      this.setState({ userRoles });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchBranchNames() {
    try {
      const res = await fetchAPI("/branch/get_branch_names", {});
      const data = await res.json();
      const branchOptions = data.branchNames.map(branch => ({
        key: branch.id,
        text: branch.name,
        value: branch.id
      }));
      this.setState({ branchOptions });
    } catch (err) {
      console.error(err);
    }
  }

  async fetchUserList() {
    this.setState({ dimmerActive: true });
    try {
      const res = await fetchAPI("/user/get_user_list", {});
      const data = await res.json();
      this.setState({
        userList: data.userList,
        userListFiltered: data.userList,
        dimmerActive: false
      });
    } catch (err) {
      console.error(err);
    }
  }

  filterByFirstName(e) {
    const firstName = e.target.value;
    this.setState({ firstName });
    this.filterUserList("firstName", firstName);
  }

  filterByLastName(e) {
    const lastName = e.target.value;
    this.setState({ lastName });
    this.filterUserList("lastName", lastName);
  }

  filterByEmail(e) {
    const email = e.target.value;
    this.setState({ email });
    this.filterUserList("email", email);
  }

  filterByRole(e, data) {
    const roleId = data.value;
    this.setState({ roleId });
    this.filterUserList("role", roleId);
  }

  filterByBranch(e, data) {
    const branchId = data.value;
    this.setState({ branchId });
    this.filterUserList("branch", branchId);
  }

  filterUserList(field, value) {
    let userListFiltered = [...this.state.userList];
    if (field === "firstName") {
      userListFiltered = userListFiltered.filter(user =>
        user.first_name.includes(value)
      );
    }
    if (field === "lastName") {
      userListFiltered = userListFiltered.filter(user =>
        user.last_name.includes(value)
      );
    }
    if (field === "email") {
      userListFiltered = userListFiltered.filter(user =>
        user.email_address.includes(value)
      );
    }
    if (field === "role") {
      userListFiltered = userListFiltered.filter(
        user => user.role_id === value
      );
    }
    if (field === "branch") {
      userListFiltered = userListFiltered.filter(
        user => user.branch_id === value
      );
    }
    this.setState({ userListFiltered });
  }

  openUserDetails(e) {
    const { param } = e.target.dataset;
    this.props.history.push(`/userDetails/${param}`);
  }

  showRoleName(roleId) {
    const filtered = this.state.userRoles.filter(role => role.value === roleId);
    return filtered.length > 0 ? filtered[0].text : "";
  }

  showBranchName(branchId) {
    const filtered = this.state.branchOptions.filter(
      branch => branch.value === branchId
    );
    return filtered.length > 0 ? filtered[0].text : "";
  }

  render() {
    const { dimmerActive } = this.state;

    return (
      <div style={{ minHeight: "100vh" }}>
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Fetching Data</Loader>
          </Dimmer>
          <h1>Users List</h1>

          <Segment color="green">
            <Form>
              <Form.Group>
                <Form.Input
                  label="First Name"
                  placeholder={"First Name"}
                  value={this.state.firstName}
                  onChange={this.filterByFirstName}
                />
                <Form.Input
                  label="Last Name"
                  placeholder={"Last Name"}
                  value={this.state.lastName}
                  onChange={this.filterByLastName}
                />
                <Form.Input
                  label="Email"
                  placeholder={"Email"}
                  value={this.state.email}
                  onChange={this.filterByEmail}
                />
                <Form.Select
                  onChange={this.filterByRole}
                  value={this.state.roleId}
                  size="small"
                  label="Role"
                  placeholder="Select Role"
                  name="role"
                  options={this.state.userRoles}
                />
                <Form.Select
                  onChange={this.filterByBranch}
                  value={this.state.branchId}
                  name="branch"
                  size="small"
                  label="Branch"
                  placeholder="Select Branch"
                  options={this.state.branchOptions}
                />
              </Form.Group>
            </Form>
            <Divider />
            <Table striped color="blue" selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>First Name</Table.HeaderCell>
                  <Table.HeaderCell>Last Name</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                  <Table.HeaderCell>Role</Table.HeaderCell>
                  <Table.HeaderCell>Branch</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.state.userListFiltered.map(user => (
                  <Table.Row
                    key={user.email_address}
                    onClick={this.openUserDetails}
                    data-param={user.email_address}
                  >
                    <Table.Cell data-param={user.email_address}>
                      {user.first_name}
                    </Table.Cell>
                    <Table.Cell data-param={user.email_address}>
                      {user.last_name}
                    </Table.Cell>
                    <Table.Cell data-param={user.email_address}>
                      {user.email_address}
                    </Table.Cell>
                    <Table.Cell data-param={user.email_address}>
                      {this.showRoleName(user.role_id)}
                    </Table.Cell>
                    <Table.Cell data-param={user.email_address}>
                      {this.showBranchName(user.branch_id)}
                    </Table.Cell>
                    <Table.Cell data-param={user.email_address}>
                      {user.user_status ? "Active" : "Inactive"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default ListUsers;
