import React, { Component } from "react";
import {
  Form,
  Icon,
  Button,
  Segment,
  Dimmer,
  Loader,
  Message
} from "semantic-ui-react";
import { validation } from "../Classes";
import { fetchAPI } from "../utility";

class AddUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      branchId: "",
      roleId: "",
      customerRoles: [],
      branchOptions: [],
      dimmerActive: false,
      isError: false,
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleChangeBranch = this.handleChangeBranch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchCustRoles();
    this.fetchBranchNames();
  }

  async fetchCustRoles() {
    try {
      const res = await fetchAPI("/cust/get_customer_roles", {});
      const data = await res.json();
      const customerRoles = data.customerRoles.map(role => ({
        key: role.customer_role_id,
        value: role.customer_role_id,
        text: role.customer_role_name
      }));
      this.setState({ customerRoles });
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

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleChangeRole(e, data) {
    const roleId = data.value;
    this.setState({ roleId });
  }

  handleChangeBranch(e, data) {
    const branchId = data.value;
    this.setState({ branchId });
  }

  validateFields() {
    // check if first name is empty
    if (!this.state.firstName) {
      this.setState({ isError: true, message: "First Name is required" });
      return false;
    }
    // check if last name is empty
    if (!this.state.lastName) {
      this.setState({ isError: true, message: "Last Name is required" });
      return false;
    }
    // check is email is empty
    if (!this.state.email) {
      this.setState({
        isError: true,
        message: validation.messages().emailEmpty
      });
      return false;
    }
    // check if email is valid
    if (!validation.validEmail(this.state.email)) {
      this.setState({
        isError: true,
        message: validation.messages().notValidEmail
      });
      return false;
    }
    // check if password is empty
    if (!this.state.password) {
      this.setState({
        isError: true,
        message: validation.messages().passEmpty
      });
      return false;
    }
    // check if password length is correct
    if (!validation.passwordLenghtCheck(this.state.password)) {
      this.setState({
        isError: true,
        message: validation.messages().passwordLength
      });
      return false;
    }
    // check if role is empty
    if (!this.state.roleId) {
      this.setState({ isError: true, message: "Role is required" });
      return false;
    }
    // check if branch is empty
    if (!this.state.branchId) {
      this.setState({ isError: true, message: "Branch is required" });
      return false;
    }
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();
    // skip database saving part if any of the field has an error
    if (!this.validateFields()) {
      return;
    }
    this.setState({ dimmerActive: true, isError: false, message: "" });
    try {
      const res = await fetchAPI("/user/save_user_details", {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email_address: this.state.email,
        password: this.state.password,
        role_id: this.state.roleId || 0,
        branch_id: this.state.branchId || 0
      });
      const data = await res.json();
      if (data.message === "success") {
        console.log("user added");
        this.setState({
          dimmerActive: false,
          isError: false,
          message: validation.messages().addUserSuccess
        });
      } else {
        this.setState({
          dimmerActive: false,
          isError: true,
          message: validation.messages().addUserFail
        });
      }
    } catch (err) {
      console.error(err);
      this.setState({
        dimmerActive: false,
        isError: true,
        message: validation.messages().addUserFail
      });
    }
  }

  render() {
    const { dimmerActive } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Saving User</Loader>
          </Dimmer>
          <h1>Add New User</h1>
          <Segment>
            <Form>
              <Form.Field className="ui required field">
                <label>First Name</label>
                <input
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
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
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Password</label>
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
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
                options={this.state.customerRoles}
              />
              <Form.Select
                className="required"
                onChange={this.handleChangeBranch}
                value={this.state.branchId}
                name="branch"
                size="small"
                label="Branch"
                placeholder="Select Branch"
                options={this.state.branchOptions}
              />
            </Form>
            <Button
              style={{ marginTop: "15px" }}
              color="blue"
              onClick={this.handleSubmit}
            >
              <Icon name="save" />Submit
            </Button>
          </Segment>
          {this.state.isError && this.state.message ? (
            <Message
              icon="times"
              error
              header="Error"
              content={this.state.message}
            />
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

export default AddUsers;
