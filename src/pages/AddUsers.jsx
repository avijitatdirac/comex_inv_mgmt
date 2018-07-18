import React, { Component } from "react";
import { Form, Icon, Button, Segment, Dimmer, Loader } from "semantic-ui-react";
import { fetchAPI } from "../utility";
const branchOptions = [
  { key: "a", text: "Pune", value: "Pune" },
  { key: "b", text: "Bangalore", value: "Bangalore" },
  { key: "c", text: "Kolkata", value: "Kolkata" }
];

export default class AddUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      Phone: "",
      branch: "",
      submitted: false,
      dimmerActive: false,
      customerRoles: [],
      role: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount() {
    fetchAPI("/cust/get_customer_roles", {})
      .then(r => r.json())
      .then(data => {
        console.log(data);
        var rolelist = [];
        data.customerRoles.forEach(role => {
          rolelist = rolelist.concat({
            key: role.customer_role_id,
            value: role.customer_role_name,
            text: role.customer_role_name
          });
        });
        this.setState({
          customerRoles: rolelist,
          visibleRol1: true
        });
      })
      .catch(err => console.log(err));
  }

  handleChange(e) {
    const { name, value } = e.target;
    console.log("event", e.target);
    this.setState({ [name]: value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
  }
  onChangeBranch = (evt, data) => this.setState({ branch: data.value });
  onChangeRole = (evt, data) => this.setState({ role: data.value });
  render() {
    const { dimmerActive, branch, customerRoles, role } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Submitting Data</Loader>
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
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Last Name</label>
                <input
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Email</label>
                <input
                  id="email"
                  name="email"
                  placeholder="Email"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field className="ui required field">
                <label>Password</label>
                <input
                  id="password"
                  name="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </Form.Field>

              <Form.Select
                onChange={this.onChangeRole}
                value={role}
                size="small"
                label="Role"
                placeholder="Select Branch"
                name="role"
                options={customerRoles}
              />
              <Form.Select
                onChange={this.onChangeBranch}
                value={branch}
                name="branch"
                size="small"
                label="Branch"
                placeholder="Select Branch"
                options={branchOptions}
              />
            </Form>
            <Button
              style={{ "margin-top": "5px" }}
              color="blue"
              onClick={this.handleSubmit}
            >
              <Icon name="save" />Submit
            </Button>
          </Segment>
        </Dimmer.Dimmable>
      </div>
    );
  }
}
