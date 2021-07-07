import React, { Component } from "react";
import {
  Dimmer,
  Segment,
  Message,
  Loader,
  Form,
  Button,
  Icon
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

class UserDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      branchId: "",
      roleId: "",
      userStatus: 1,
      reasonForDeactivation: "",
      userRoles: [],
      branchOptions: [],
      dimmerActive: false,
      isError: false,
      message: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleChangeBranch = this.handleChangeBranch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deactivateUser = this.deactivateUser.bind(this);
    this.activateUser = this.activateUser.bind(this);
  }

  //   fetch the list of user roles and branches when component mounts
  componentDidMount() {
    this.fetchUserRoles();
    this.fetchBranchNames();
    const { email } = this.props.match.params;
    if (!email) return;
    this.fetchUserDetails(email);
  }

  // fetch user details
  async fetchUserDetails(email_address) {
    try {
      this.setState({ dimmerActive: true });
      const endpoint = "/user/get_user_details";
      const res = await fetchAPI(endpoint, { email_address });
      const data = await res.json();
      if (data.userDetails) {
        const firstName = data.userDetails.first_name;
        const lastName = data.userDetails.last_name;
        const email = email_address;
        const branchId = data.userDetails.branch_id;
        const roleId = data.userDetails.role_id;
        const userStatus = data.userDetails.user_status;
        const reasonForDeactivation = data.userDetails.reason_for_deactivation;
        this.setState({
          firstName,
          lastName,
          email,
          branchId,
          roleId,
          userStatus,
          reasonForDeactivation
        });
        this.setState({ dimmerActive: false });
      }
    } catch (err) {
      console.error(err);
      this.setState({ dimmerActive: false });
    }
  }

  //   fetches the list of user roles
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
  // fetches the list of branch names
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

  //   onchange handler for form input fields
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  //   onchange handler for role dropdown
  handleChangeRole(e, data) {
    const roleId = data.value;
    this.setState({ roleId });
  }

  // onchange handler for branch dropdown
  handleChangeBranch(e, data) {
    const branchId = data.value;
    this.setState({ branchId });
  }

  async handleSubmit(e) {
    e.preventDefault();
    let isError = false;
    let message = "";
    if (!this.state.firstName) {
      isError = true;
      message = "First Name is required.";
      this.setState({ isError, message });
      return;
    }
    if (!this.state.lastName) {
      isError = true;
      message = "Last Name is required.";
      this.setState({ isError, message });
      return;
    }
    if (!this.state.roleId) {
      isError = true;
      message = "Role is required.";
      this.setState({ isError, message });
      return;
    }
    if (!this.state.branchId) {
      isError = true;
      message = "Branch is required.";
      this.setState({ isError, message });
      return;
    }

    this.setState({ isSaving: true });
    const params = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email_address: this.state.email,
      role_id: this.state.roleId,
      branch_id: this.state.branchId,
      user_status: this.state.userStatus,
      reason_for_deactivation: this.state.reasonForDeactivation
    };
    const endpoint = "/user/update_user_details";
    this.setState({ isSaving: true });
    try {
      const res = await fetchAPI(endpoint, params);
      const data = await res.json();
      let isError = false;
      let message = "";
      if (data.success) {
        message = "Successfully updated";
      } else {
        isError = true;
        message = "Error while saving!";
      }
      this.setState({ isError, message, isSaving: false });
    } catch (err) {
      console.error(err);
      this.setState({
        isSaving: false,
        isError: true,
        message: "An error occurred!"
      });
    }
  }

  async deactivateUser(e) {
    e.preventDefault();
    //   check if reason for deactivation is filled
    if (!this.state.reasonForDeactivation) {
      const message = "Please enter reason for deactivation.";
      const isError = true;
      this.setState({ message, isError });
      return;
    }

    this.setState({ isSaving: true });
    const params = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email_address: this.state.email,
      role_id: this.state.roleId,
      branch_id: this.state.branchId,
      user_status: 0,
      reason_for_deactivation: this.state.reasonForDeactivation
    };
    const endpoint = "/user/update_user_details";
    try {
      const res = await fetchAPI(endpoint, params);
      const data = await res.json();
      let isError = false;
      let message = "";
      if (data.success) {
        message = "Successfully updated";
        this.setState({ userStatus: 0 });
      } else {
        isError = true;
        message = "Error while saving!";
      }
      this.setState({ isError, message, isSaving: false });
    } catch (err) {
      console.error(err);
      this.setState({
        isSaving: false,
        isError: true,
        message: "An error occurred!"
      });
    }
  }

  async activateUser(e) {
    e.preventDefault();

    this.setState({ isSaving: true });
    const params = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email_address: this.state.email,
      role_id: this.state.roleId,
      branch_id: this.state.branchId,
      user_status: 1,
      reason_for_deactivation: ""
    };
    const endpoint = "/user/update_user_details";
    try {
      const res = await fetchAPI(endpoint, params);
      const data = await res.json();
      let isError = false;
      let message = "";
      if (data.success) {
        message = "Successfully updated";
        this.setState({ userStatus: 1, reasonForDeactivation: "" });
      } else {
        isError = true;
        message = "Error while saving!";
      }
      this.setState({ isError, message, isSaving: false });
    } catch (err) {
      console.error(err);
      this.setState({
        isSaving: false,
        isError: true,
        message: "An error occurred!"
      });
    }
  }

  //   main render function
  render() {
    const { dimmerActive } = this.state;
    const isDisabled = this.state.userStatus !== 1;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Fetching User Details ...</Loader>
          </Dimmer>
          <h1>User Details</h1>
          <Segment>
            <Form>
              <Form.Field className="ui required field">
                <label>First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  disabled={isDisabled}
                  value={this.state.firstName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  disabled={isDisabled}
                  value={this.state.lastName}
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Email</label>
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  value={this.state.email}
                  disabled={true}
                />
              </Form.Field>
              <Form.Select
                className="required"
                onChange={this.handleChangeRole}
                value={this.state.roleId}
                size="small"
                label="Role"
                placeholder="Select Role"
                name="role"
                disabled={isDisabled}
                options={this.state.userRoles}
              />
              <Form.Select
                className="required"
                onChange={this.handleChangeBranch}
                value={this.state.branchId}
                name="branch"
                size="small"
                label="Branch"
                disabled={isDisabled}
                placeholder="Select Branch"
                options={this.state.branchOptions}
              />
              <Form.Field className="ui field">
                <label>Reason For Deactivation</label>
                <input
                  id="reasonForDeactivation"
                  name="reasonForDeactivation"
                  placeholder="Enter reason for deactivation"
                  disabled={isDisabled}
                  value={this.state.reasonForDeactivation}
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
            <Button
              style={{ marginTop: "15px" }}
              color="blue"
              loading={this.state.isSaving}
              onClick={
                this.state.userStatus ? this.handleSubmit : this.activateUser
              }
            >
              <Icon name="save" />
              {this.state.userStatus ? "Update" : "Activate"}
            </Button>
            {this.state.userStatus ? (
              <Button
                color="red"
                onClick={this.deactivateUser}
                loading={this.state.isSaving}
              >
                <Icon name="times" />
                Deactivate
              </Button>
            ) : (
              false
            )}
          </Segment>
          {this.state.isError && this.state.message ? (
            <Message icon negative>
              <Icon name="times" color="red" />
              <Message.Content>
                <Message.Header>Error</Message.Header>
                {this.state.message}
              </Message.Content>
            </Message>
          ) : (
            false
          )}
          {!this.state.isError && this.state.message ? (
            <Message
              icon="thumbs up outline"
              success
              header="Success"
              content={this.state.message}
            />
          ) : (
            false
          )}
        </Dimmer.Dimmable>
      </div>
    );
  }
}

export default UserDetails;
