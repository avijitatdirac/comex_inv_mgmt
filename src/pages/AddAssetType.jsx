import React from "react";

import { Segment, Form, FormGroup, Button, Icon, Divider, Label, Checkbox } from "semantic-ui-react";
import { Input, Table, TableHeader, TableRow,Dimmer,Loader } from "semantic-ui-react";
import VariableWidthForm from "../components/AddAssetTypeForm/VariableWidthForm"
import {notify} from '../Classes';

export default class AddAssetType extends React.Component {
  
  // Constructor
  constructor(props) {
    super(props);

    // state description
    this.state = {
      assetTypeName: '',
      dimmerActive:false,
      isAssetTypeSubmitted: false,
      attributeCount: 1,
      assetTypeNameError:false,
      assetTypeAttributes: [{
        id: null,
        name: '',
        isMandatory: true,
        isModifiable: true,
        isPrintable:true,}],
    };
  }

  // button click handlers
  handleAssetNameSubmit = () => {
    // loggin data
    
    var errorassettype;
    var aname;
    if(!this.state.assetTypeName || this.state.assetTypeName==='')
    {
      errorassettype=true
    }
    else
    {
      var str=this.state.assetTypeName.toLowerCase()
      aname=str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      errorassettype=false
    }

    // on success execute this
    this.setState({
      assetTypeName: aname,
      isAssetTypeSubmitted: true,
      assetTypeNameError: errorassettype },this.commitassettypename);
  }


  commitassettypename = () => {
    // handle asset type db insertion in handleAttributeSubmit function
    if(!this.state.assetTypeNameError)
    {
      console.log(this.state.assetTypeName)
    }
    else
    {
      notify.error("Please enter an asset type to proceed further !!!")
      this.setState({
        isAssetTypeSubmitted: false,
      })
    }
  }
  handleAttributeDimmer = () =>
  {
    this.setState({
      dimmerActive:true
    },this.handleAttributeSubmit)
  }

  handleAttributeSubmit = () => {
    
    var l=this.state.assetTypeAttributes.length-1;
    if(this.state.assetTypeAttributes[l].name==='')
    {
      notify.error("Please enter valid attribute name")
    }
    else
    {
      fetch(`/insert_asset_type?type_name=${this.state.assetTypeName}&attributes=${JSON.stringify(this.state.assetTypeAttributes, null, 2)}`,
      {method:'POST'})
      .then(r => r.json())
      .then(data => {
        this.setState({
          dimmerActive:false
        })
        if (data.is_Error) {
          notify.error("Asset Type already exists !!!")
        }
      })
    }
  }


  handleAddAttribute = (idx) => () => {
    if(this.state.assetTypeAttributes[idx].name === '')
    {
      notify.error("Please enter valid attribute name")
    }
    else
    {
    this.setState({
      assetTypeAttributes: this.state.assetTypeAttributes.concat([{ name: '', isMandatory: true, isModifiable: true, }])
    });
  }
}

  handleRemoveAttribute = (idx) => () => {
    if(this.state.assetTypeAttributes.length!==1)
      this.setState({
        assetTypeAttributes: this.state.assetTypeAttributes.filter((s, sidx) => idx !== sidx)
      })
  }

  // input onchange listners
  onChangeAssetTypeName = (event) => {

    var str=event.target.value
    var aname=str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

    this.setState({assetTypeName: aname});
  }

  handleAttributeNameChange = (idx) => (evt) => {
    
    const newAttribute = this.state.assetTypeAttributes.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, name: evt.target.value,};
    });
    this.setState({ assetTypeAttributes: newAttribute });
  }

  onAttributeCheckBox1Change = (idx) => (evt) => {

    const newAttribute = this.state.assetTypeAttributes.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, isMandatory: evt.target.checked };
    });
    this.setState({ assetTypeAttributes: newAttribute });
  }
  
  onAttributeCheckBox2Change = (idx) => (evt) => {
    const newAttribute = this.state.assetTypeAttributes.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, isModifiable: evt.target.checked };
    });
    this.setState({ assetTypeAttributes: newAttribute });
  }
  onAttributeCheckBox3Change = (idx) => (evt) => {
    const newAttribute = this.state.assetTypeAttributes.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, isPrintable: evt.target.checked };
    });
    this.setState({ assetTypeAttributes: newAttribute });
  }

  // render functions
  renderAssetTypeAttributesForm() {

    return (
      <div>
        <Divider />
        <h5>Enter Attributes of Asset-type {this.state.assetTypeName}</h5>
        <Table color="teal" striped>
            <Table.Header>
              <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Modifiable</Table.HeaderCell>
                  <Table.HeaderCell>Mandatory</Table.HeaderCell>
                  <Table.HeaderCell>Printable</Table.HeaderCell>
                  <Table.HeaderCell>Remove</Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
            {this.state.assetTypeAttributes.map((attribute, idx) => {return(
              
              <Table.Row>
                <Table.Cell>
                <Input
                  type="text"
                  width={16}
                  placeholder={`Attribute #${idx + 1} name`}
                  value={attribute.name}
                  onChange={this.handleAttributeNameChange(idx)}
                />
                </Table.Cell>
                <Table.Cell>
                <Input type="Checkbox" defaultChecked="true" onChange={this.onAttributeCheckBox1Change(idx)}/>
                </Table.Cell>
                <Table.Cell>
                <Input type="Checkbox" defaultChecked="true" onChange={this.onAttributeCheckBox2Change(idx)}/>
                </Table.Cell>
                <Table.Cell>
                <Input type="Checkbox" defaultChecked="true" onChange={this.onAttributeCheckBox3Change(idx)}/>
                </Table.Cell>
                <Table.Cell>
                <Icon name="minus square outline" style={{ cursor: "pointer" }} onClick={this.handleRemoveAttribute(idx)}/>
                </Table.Cell>
              {(idx===this.state.assetTypeAttributes.length-1) ?  
                <Table.Cell><Button basic onClick={this.handleAddAttribute(idx)}><Icon name="plus" />Add More</Button></Table.Cell> 
                : undefined}
              </Table.Row>
            )})}
            </Table.Body>
            <Table.Footer>
              <Table.Cell>
            <Form.Button onClick={this.handleAttributeDimmer} color="blue"><Icon name="save"/>Submit</Form.Button>
            </Table.Cell>
            </Table.Footer>
        </Table>
      </div>
    );
  }

  render() {
    const { dimmerActive } = this.state
    return (
      <div className="page">
      	<Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
        <Dimmer active={dimmerActive} inverted>
				  <Loader>Submitting Data</Loader>
				</Dimmer>
        <h1>Add New Asset Type</h1>
        <Segment>
        <Form>
            <Form.Input label="Asset-type name:" placeholder='Enter New Asset-type name' width={10}  onChange={this.onChangeAssetTypeName}/>
            {!this.state.isAssetTypeSubmitted ?<Form.Button onClick={this.handleAssetNameSubmit} basic><Icon name="tv"/>Create</Form.Button> : undefined}
        </Form>
          {this.state.isAssetTypeSubmitted && !this.state.assetTypeNameError  ? this.renderAssetTypeAttributesForm() : undefined}
        </Segment>
        </Dimmer.Dimmable>
      </div>
    );
  }
}
