import React, { Component } from "react";
import {
  Form,
  Icon,
  Button,
  Segment,
  Dimmer,
  Loader,
  Message,
  Header,
  TransitionablePortal
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
      userRoles: [],
      branchOptions: [],
      dimmerActive: false,
      isError: false,
      message: "",
      isPortalOpen: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleChangeBranch = this.handleChangeBranch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentDidMount() {
    this.fetchUserRoles();
    this.fetchBranchNames();
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

  async saveUserData() {
    this.setState({ dimmerActive: true, isError: false, message: "" });
    try {
      const params = {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email_address: this.state.email,
        password: this.state.password,
        role_id: this.state.roleId,
        branch_id: this.state.branchId
      };
      const endpoint = "/user/insert_user_details";
      const res = await fetchAPI(endpoint, params);
      const data = await res.json();
      if (data.success) {
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

  // onclick handler for submit buttom
  async handleSubmit(e) {
    e.preventDefault();
    // skip database saving part if any of the field has an error
    if (!this.validateFields()) return;

    // skip saving if allow movement flag validation fails
    try {
      const params = {
        role_id: this.state.roleId,
        branch_id: this.state.branchId
      };
      const res = await fetchAPI("/user/check_allow_movement_for_role", params);
      const data = await res.json();
      if (!data.success) {
        this.setState({ isPortalOpen: true });
        return;
      }
    } catch (err) {
      console.error(err);
      return;
    }

    // save user details if all validation passed
    this.saveUserData();
  }

  // onclick handler for Continue button on the portal
  onContinue(e) {
    e.preventDefault();
    this.setState({ isPortalOpen: false });
    this.saveUserData();
  }

  // onclick handler for Cancel button on the portal
  onCancel(e) {
    e.preventDefault();
    this.setState({ isPortalOpen: false });
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
                options={this.state.userRoles}
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
            {this.renderPortal()}
            <Button
              style={{ marginTop: "15px" }}
              color="blue"
              onClick={this.handleSubmit}
            >
              <Icon name="save" />
              Submit
            </Button>
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

  renderPortal() {
    const styles = {
      left: "20%",
      position: "fixed",
      top: "50%",
      zIndex: "1000",
      width: "60vw",
      paddingBottom: "30px"
    };
    const messageStyle = {
      fontSize: "16px",
      fontStyle: "italic",
      color: "#ff5454"
    };
    const btnStyle = { marginTop: "10px", marginRight: "10px" };
    return (
      <TransitionablePortal open={this.state.isPortalOpen}>
        <Segment style={styles} inverted>
          <Header>Attention!</Header>
          <p style={messageStyle}>
            Movement of Items is not allowed for this branch.
          </p>
          <p style={messageStyle}>Do you want to continue?</p>
          <Button positive style={btnStyle} onClick={this.onContinue}>
            Continue
          </Button>
          <Button negative onClick={this.onCancel}>
            Cancel
          </Button>
        </Segment>
      </TransitionablePortal>
    );
  }
}

export default AddUsers;
