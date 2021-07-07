import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Loader,
  Table,
  Checkbox,
  Button,
  Icon,
  Input
} from "semantic-ui-react";
import { findIndex } from "lodash";
import { fetchAPI } from "../utility";

class Roles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dimmerActive: false,
      allPrivileges: [],
      allRoles: [],
      isSaving: false
    };

    this.changeRoleName = this.changeRoleName.bind(this);
    this.addRole = this.addRole.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.changeCheckedStatus = this.changeCheckedStatus.bind(this);
  }

  async fetchData() {
    this.setState({ dimmerActive: true });
    try {
      const privRes = await fetchAPI("/roles/get_all_privileges", {});
      const roleRes = await fetchAPI("/roles/get_all_roles_privileges", {});
      const privData = await privRes.json();
      const roleData = await roleRes.json();
      this.reArrangeData(roleData.data, privData.data);
      this.setState({ allPrivileges: privData.data, dimmerActive: false });
    } catch (err) {
      console.error(err);
      this.setState({ dimmerActive: false });
    }
  }

  reArrangeData(data, allPrivileges) {
    let allRoles = [];
    data.forEach(role => {
      let ind = findIndex(allRoles, { role_id: role.role_id });
      if (ind < 0) {
        let privileges = {};
        allPrivileges.forEach(priv => (privileges[priv.privilege_id] = false));
        allRoles.push({
          role_id: role.role_id,
          role_name: role.role_name,
          privileges
        });
        ind = allRoles.length - 1;
      }
      allRoles[ind].privileges[role.privilege_id] = true;
    });
    this.setState({ allRoles });
  }

  componentDidMount() {
    this.fetchData();
  }

  addRole() {
    let allRoles = this.state.allRoles.slice();
    let privileges = {};
    this.state.allPrivileges.forEach(
      priv => (privileges[priv.privilege_id] = false)
    );
    allRoles.push({
      role_id: -1 * (allRoles.length + 1),
      role_name: "",
      privileges
    });
    this.setState({ allRoles });
  }

  saveChanges() {
    console.log("save changes");
    this.setState({ isSaving: true });
    fetchAPI("/roles/save_roles", { roles: this.state.allRoles })
      .then(r => {
        this.setState({ isSaving: false });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isSaving: false });
      });
  }

  changeCheckedStatus(roleId, privilegeId) {
    // console.log({ roleId, privilegeId });
    let allRoles = this.state.allRoles.slice();
    const idx = findIndex(allRoles, { role_id: roleId });
    const status = allRoles[idx].privileges[privilegeId];
    allRoles[idx].privileges[privilegeId] = !status;
    this.setState({ allRoles });
  }

  changeRoleName(roleId, value) {
    let allRoles = this.state.allRoles.slice();
    const idx = findIndex(allRoles, { role_id: roleId });
    allRoles[idx].role_name = value;
    this.setState({ allRoles });
  }

  renderTableHeader() {
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell rowSpan={2}>Role Name</Table.HeaderCell>
          <Table.HeaderCell
            colSpan={this.state.allPrivileges.length}
            style={{ textAlign: "center" }}
          >
            Privileges
          </Table.HeaderCell>
        </Table.Row>
        <Table.Row>
          {this.state.allPrivileges.map(priv => (
            <Table.HeaderCell
              key={priv.privilege_id}
              style={{ borderLeft: "1px solid rgba(34,36,38,.1)" }}
            >
              {priv.privilege_name}
            </Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
    );
  }

  renderTableBody() {
    return (
      <Table.Body>
        {this.state.allRoles.map(role => this.renderTableRow(role))}
      </Table.Body>
    );
  }

  renderTableRow(role) {
    return (
      <Table.Row key={role.role_id}>
        <Table.Cell>{this.renderRoleName(role)}</Table.Cell>
        {this.state.allPrivileges.map(priv =>
          this.renderCheckBoxes(role, priv)
        )}
      </Table.Row>
    );
  }

  renderRoleName(role) {
    if (role.role_id < 0) {
      return (
        <Input
          placeholder="Please enter role name"
          onChange={e => this.changeRoleName(role.role_id, e.target.value)}
        />
      );
    } else {
      return role.role_name;
    }
  }

  renderCheckBoxes(role, priv) {
    return (
      <Table.Cell key={priv.privilege_id} style={{ textAlign: "center" }}>
        <Checkbox
          toggle
          onChange={() =>
            this.changeCheckedStatus(role.role_id, priv.privilege_id)
          }
          checked={role.privileges[priv.privilege_id] || false}
        />
      </Table.Cell>
    );
  }

  renderTableFooter() {
    return (
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell colSpan={this.state.allPrivileges.length + 1}>
            <Button
              floated="right"
              icon
              labelPosition="left"
              primary
              size="small"
              onClick={this.addRole}
            >
              <Icon name="user" /> Add Role
            </Button>
            {this.state.isSaving ? (
              <Button
                floated="right"
                icon
                labelPosition="right"
                positive
                style={{ minWidth: "150px" }}
                size="small"
              >
                <Loader active inline inverted size="tiny" />
              </Button>
            ) : (
              <Button
                positive
                floated="right"
                icon
                labelPosition="left"
                size="small"
                onClick={this.saveChanges}
              >
                <Icon name="save" /> Save Changes
              </Button>
            )}
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
          <Dimmer active={this.state.dimmerActive} inverted>
            <Loader>Fetching Data</Loader>
          </Dimmer>
          <h1>Roles and Privileges</h1>
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

export default Roles;
