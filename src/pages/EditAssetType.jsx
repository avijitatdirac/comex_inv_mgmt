import React from "react";
import {
  Input,
  Dropdown,
  Header,
  Divider,
  Table,
  Segment,
  Form,
  Button,
  Icon,
  Label,
  Message
} from "semantic-ui-react";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";
import "react-datepicker/dist/react-datepicker.css";

export default class EditAssetType extends React.Component {
  // constructor
  constructor(props) {
    super(props);

    this.state = {
      submitSuccess: false,
      submitFailure: false,
      selectedAssetType: null,
      assetTypes: [],
      assetTypeAttributes: [],
      newAssetTypeAttributes: [
        {
          // id: null,
          name: "",
          isMandatory: true,
          isModifiable: true,
          isPrintable: true
        }
      ]
    };
  }

  // database operations
  componentWillMount = () => {
    // Fetch asset type names
    fetchAPI("/asset/get_asset", {})
      .then(r => r.json())
      .then(data => {
        // parsing json data (need to verify later)
        var i;
        var s = JSON.stringify(data, null, 2);
        var r = JSON.parse(s);
        for (i = 0; i < r.results.length; i++) {
          // append to state.assetTypes
          this.setState({
            assetTypes: this.state.assetTypes.concat([
              {
                key: r.results[i].id,
                id: r.results[i].id,
                text: r.results[i].type_name,
                value: r.results[i].type_name
              }
            ])
          });
        }

        // console.log(this.state.assetTypes)
      })
      .catch(err => console.log(err));
  };

  // onChangeHandlers

  handleAttributeNameChange = idx => evt => {
    const newAttribute = this.state.newAssetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return {
          ...attribute,
          // id: idx,
          name: evt.target.value
        };
      }
    );
    this.setState({ newAssetTypeAttributes: newAttribute });
  };
  handleRemoveAttribute = idx => () => {
    if (this.state.newAssetTypeAttributes.length !== 1)
      this.setState({
        newAssetTypeAttributes: this.state.newAssetTypeAttributes.filter(
          (s, sidx) => idx !== sidx
        )
      });
  };

  onAttributeCheckBox1Change = idx => evt => {
    const newAttribute = this.state.newAssetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, isMandatory: evt.target.checked };
      }
    );
    this.setState({ newAssetTypeAttributes: newAttribute });
  };

  onAttributeCheckBox2Change = idx => evt => {
    const newAttribute = this.state.newAssetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, isModifiable: evt.target.checked };
      }
    );
    this.setState({ newAssetTypeAttributes: newAttribute });
  };
  onAttributeCheckBox3Change = idx => evt => {
    const newAttribute = this.state.newAssetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, isPrintable: evt.target.checked };
      }
    );
    this.setState({ newAssetTypeAttributes: newAttribute });
  };

  // when attribute value changes
  onAttributeValueChange = idx => evt => {
    const newAttribute = this.state.assetTypeAttributes.map(
      (attribute, sidx) => {
        if (idx !== sidx) return attribute;
        return { ...attribute, name: evt.target.value };
      }
    );
    this.setState({ assetTypeAttributes: newAttribute });
  };
  handleAddAttribute = idx => () => {
    if (this.state.newAssetTypeAttributes[idx].name === "") {
      notify.error("Please enter valid attribute name");
    } else {
      this.setState({
        newAssetTypeAttributes: this.state.newAssetTypeAttributes.concat([
          { name: "", isMandatory: true, isModifiable: true, isPrintable: true }
        ])
      });
    }
  };

  onSelectAssetType = (event, data) => {
    // fetch by name and get the attributes
    this.setState({
      selectedAssetType: data.value
    });
    fetchAPI("/asset/get_asset_type", { type_name: data.value })
      .then(r => r.json())
      .then(data => {
        // parsing json data (need to verify later)
        var i;
        var s = JSON.stringify(data, null, 2);
        console.log(s);
        var r = JSON.parse(s);
        this.setState({
          assetTypeAttributes: []
        });

        for (i = 0; i < r.results.length; i++) {
          // append to state.assetTypes
          this.setState({
            assetTypeAttributes: this.state.assetTypeAttributes.concat([
              {
                id: r.results[i].id,
                value: "",
                name: r.results[i].attr_name,
                isModifiable: r.results[i].is_modifiable,
                isMandatory: r.results[i].is_mandatory,
                isPrintable: r.results[i].is_printable
              }
            ])
          });
        }
      })
      .catch(err => console.log(err));
  };

  DynamicAttributesForm = () => {
    var totalIdx = 0;
    return (
      <Segment color="">
        <Label as="a" color="red" ribbon>
          Dynamic attributes
        </Label>
        <br />
        <br />`
        <Table celled color="red">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Attribute number</Table.HeaderCell>
              <Table.HeaderCell>Attribute value</Table.HeaderCell>
              <Table.HeaderCell>Modifiable?</Table.HeaderCell>
              <Table.HeaderCell>Mandatory?</Table.HeaderCell>
              <Table.HeaderCell>Printable?</Table.HeaderCell>
              <Table.HeaderCell>Remove</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {this.state.assetTypeAttributes.map((attribute, idx) => (
              <Table.Row>
                <Table.Cell>
                  <strong>Attribute #{(totalIdx = idx + 1)}</strong>
                </Table.Cell>
                <Table.Cell>
                  <Icon name="lock" color="grey" />
                  <Label
                  // value={attribute.name}

                  // onChange={this.onAttributeValueChange(idx)}
                  >
                    {attribute.name}
                  </Label>
                </Table.Cell>
                <Table.Cell>
                  {/* <Form.Input  value={attribute.isModifiable} readOnly/> */}
                  <Input
                    type="Checkbox"
                    defaultChecked={attribute.isModifiable}
                    readOnly
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="Checkbox"
                    defaultChecked={attribute.isMandatory}
                    readOnly
                  />
                </Table.Cell>
                <Table.Cell>
                  <Input
                    type="Checkbox"
                    defaultChecked={attribute.isPrintable}
                    readOnly
                  />
                </Table.Cell>
                <Table.Cell />
                <Table.Cell />
              </Table.Row>
            ))}
            {/* new attributes */}
            {this.state.newAssetTypeAttributes.map((attribute, idx) => {
              return (
                <Table.Row>
                  <Table.Cell>
                    <strong>Attribute #{++totalIdx}</strong>
                  </Table.Cell>
                  <Table.Cell>
                    <Icon name="unlock" color="green" />
                    <Input
                      value={attribute.name}
                      onChange={this.handleAttributeNameChange(idx)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      type="Checkbox"
                      defaultChecked="true"
                      onChange={this.onAttributeCheckBox1Change(idx)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      type="Checkbox"
                      defaultChecked="true"
                      onChange={this.onAttributeCheckBox2Change(idx)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Input
                      type="Checkbox"
                      defaultChecked="true"
                      onChange={this.onAttributeCheckBox3Change(idx)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Icon
                      name="minus square outline"
                      style={{ cursor: "pointer" }}
                      onClick={this.handleRemoveAttribute(idx)}
                    />
                  </Table.Cell>
                  {idx === this.state.newAssetTypeAttributes.length - 1 ? (
                    <Table.Cell>
                      <Button basic onClick={this.handleAddAttribute(idx)}>
                        <Icon name="plus" />Add More
                      </Button>
                    </Table.Cell>
                  ) : (
                    undefined
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Segment>
    );
  };

  // button click handlers
  onAssetSubmit = () => {
    // initialize submit success/failure conditions
    this.setState({ submitSuccess: false, submitFailure: false });
    console.log("query request: ");
    // var request = `/modify_asset_type?type_name=${
    //   this.state.selectedAssetType
    // }&attributes=${JSON.stringify(this.state.newAssetTypeAttributes)}`;
    // console.log(request);
    // fetch(
    //   `/modify_asset_type?type_name=${
    //     this.state.selectedAssetType
    //   }&attributes=${JSON.stringify(
    //     this.state.newAssetTypeAttributes,
    //     null,
    //     2
    //   )}`,
    //   { method: "POST" }
    // )
    fetchAPI("/asset/modify_asset_type", {
      type_name: this.state.selectedAssetType,
      attributes: this.state.newAssetTypeAttributes
    })
      .then(r => r.json())
      .then(data => {
        console.log("response: ", data);
        if (data.isSuccess) {
          notify.success("success");
          this.setState({ submitSuccess: true, submitFailure: false });
          this.props.history.push("/");
        } else {
          notify.error("failure");
          this.setState({ submitFailure: true, submitSuccess: false });
        }
      });
  };

  // Render method
  render() {
    return (
      <div className="page">
        <Header size="large" color="red" textAlign="center">
          <Icon name="setting" color="red" />Edit Asset Type
        </Header>
        <Segment color="">
          <Form>
            <Dropdown
              icon="search"
              fluid
              search
              selection
              value={this.state.selectedCustomerId}
              onChange={this.onSelectAssetType}
              placeholder="Select an asset type"
              options={this.state.assetTypes}
            />
            <Divider />
            {this.state.submitSuccess ? (
              <Message
                success
                header="Success!"
                content="Your asset has been submitted."
              />
            ) : this.state.submitFailure ? (
              <Message
                error
                header="Failure!"
                content="Could not submit asset."
              />
            ) : (
              undefined
            )}

            {/* Dynamic attributes form */}
            {this.state.selectedAssetType ? (
              <this.DynamicAttributesForm />
            ) : (
              undefined
            )}
            {/* <Button color="" onClick={()=>{console.log(this.state.newAssetTypeAttributes)}}><Icon name="tv" />Display state</Button> */}
            <Button
              color="blue"
              onClick={() => {
                this.props.history.push("/");
              }}
            >
              <Icon name="home" />Home
            </Button>
            <Button color="blue" onClick={this.onAssetSubmit}>
              <Icon name="save" />Save
            </Button>
            <Button
              color="blue"
              onClick={() => {
                this.setState({
                  newAssetTypeAttributes: [
                    {
                      name: "",
                      isMandatory: true,
                      isModifiable: true
                    }
                  ]
                });
              }}
            >
              <Icon name="trash" />Reset
            </Button>
          </Form>
        </Segment>
      </div>
    );
  }
}
