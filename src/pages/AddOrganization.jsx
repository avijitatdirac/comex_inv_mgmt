import React, { Component } from "react";
import {
  Label,
  Icon,
  Button,
  Segment,
  Dimmer,
  Loader,
  Input,
  Message
} from "semantic-ui-react";
import { fetchAPI } from "../utility";

export default class AddOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      address: "",
      isDisabled: true,
      message: ""
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  async fetchOrganization() {
    const res = await fetchAPI("/organization/get_organization_name", {});
    const data = await res.json();
    const { id, name, address } = data;
    this.setState({ id, name, address });
    if (!id) {
      this.setState({ isDisabled: false });
    }
  }

  componentDidMount() {
    this.fetchOrganization();
  }

  handleEdit(e) {
    e.preventDefault();
    this.setState({ isDisabled: false });
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ dimmerActive: true, message: "" });
    const id = this.state.id || 1;
    const name = this.state.name;
    const address = this.state.address;
    try {
      const res = await fetchAPI("/organization/save_organization", {
        id,
        name,
        address
      });
      const data = await res.json();
      if (data.message === "success") {
        this.setState({
          dimmerActive: false,
          message: "Successfully Saved",
          isDisabled: true
        });
        this.fetchOrganization();
      } else {
        this.setState({ dimmerActive: false, message: "Error while saving" });
      }
    } catch (err) {
      console.error(err);
      this.setState({ dimmerActive: false });
    }
  }

  render() {
    const { dimmerActive, isDisabled } = this.state;
    return (
      <div className="page">
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
          <Dimmer active={dimmerActive} inverted>
            <Loader>Saving Organization</Loader>
          </Dimmer>
          <h1>Organization</h1>
          <Segment>
            <Label>Organization ID</Label>
            <Input fluid disabled={true} value={this.state.id} />
            <br />
            <Label>
              <Icon name="users" size="large" />Name&nbsp;&nbsp;&nbsp;
            </Label>
            <Input
              fluid
              disabled={isDisabled}
              placeholder="Please enter organization name"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
            />
            <br />
            <Label>
              <Icon name="address book" size="large" />Address&nbsp;&nbsp;&nbsp;
            </Label>
            <Input
              fluid
              disabled={isDisabled}
              placeholder="Please enter organization address"
              value={this.state.address}
              onChange={e => this.setState({ address: e.target.value })}
            />
            <br />

            {!this.state.isDisabled ? (
              <Button
                style={{ marginTop: "5px" }}
                color="blue"
                onClick={this.handleSubmit}
              >
                <Icon name="save" />Submit
              </Button>
            ) : (
              <Button
                style={{ marginTop: "5px" }}
                color="blue"
                onClick={this.handleEdit}
              >
                <Icon name="edit" />Edit
              </Button>
            )}
          </Segment>
          {this.state.message ? (
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
