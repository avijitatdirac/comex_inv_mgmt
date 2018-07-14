import React from "react";
import Moment from "react-moment"
import DatePicker from "react-datepicker";
import { Divider, Table, Segment, Form, FormGroup, Button, Icon, Label, Container, Message, TextArea } from "semantic-ui-react";

var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');

// branch options
const branchOptions = [
  { key: 'a', text: 'Pune', value: 'Pune' },
  { key: 'b', text: 'Bangalore', value: 'Bangalore' },
  { key: 'c', text: 'Kolkata', value: 'Kolkata' }
];

export default class AddAsset extends React.Component {
  
  // constructor
  constructor(props) {
    super(props);

    this.state = {
      // branch chk
      selectedBranch: 'Select a branch',

      submitSuccess: false,
      submitFailure: false,
      selectedAssetType: null,
      assetTypes: []
      ,
      assetTypeAttributes: [
      ],
      serialNo: '',
      serialNos: [],        
      purchaseDate: moment(),
      transferOrderDate:moment(),
      purchasePrice: '',      
      supplier: '',
      warehouseLocation: '',      
      showroom: '',
      procurementDate: moment(),      
      status: '1',
      partCode: '', 
      supplierInvoiceNo: '',
      supplierInvoiceDate: moment(),
      make: '',
      warrantyEndDate: moment(),      
      comment: '',
      transferOrder: '',
      hsnCode:'',

      strPurchaseDate: moment(new Date()).format("DD/MM/YYYY"),
      strProcurementDate: moment(new Date()).format("DD/MM/YYYY"),
      strwarrantyEndDate: moment(new Date()).format("DD/MM/YYYY"),
      strTransferOrderDate:moment(new Date()).format("DD/MM/YYYY"),
      strSupplierInvoiceDate: moment(new Date()).format("DD/MM/YYYY")
    };
  }

  // database operations
  componentWillMount = () => {

    // Fetch asset type names
    fetch(`/get_asset`,
        { method: 'GET' })
        .then(r => r.json()) 
        .then(data => {

          // parsing json data (need to verify later)
          var i;
          var s = JSON.stringify(data, null, 2);
          var r = JSON.parse(s);
          for( i=0; i<r.results.length; i++) {
            // append to state.assetTypes  
            this.setState({
              assetTypes: this.state.assetTypes.concat([{ key: r.results[i].id, id: r.results[i].id, text: r.results[i].type_name, value: r.results[i].type_name }])
            });
          }
         
          // console.log(this.state.assetTypes)
        })
        .catch(err => console.log(err))
        
  }


  // DATE PICKER
  onChangePurchaseDate = (date) => {
    var fDate =  moment(new Date()).format("DD/MM/YYYY");
    this.setState({
      purchaseDate: date,
      strPurchaseDate: fDate 
    });
  }

  onChangeTransferDate = (date) => {
    var fDate =  moment(date).format("DD/MM/YYYY");
    this.setState({
      transferOrderDate: date,
      strTransferOrderDate: fDate 
    });
  }

  onChangeProcurementDate = (date) => {
    var fDate =  moment(date).format("DD/MM/YYYY");
    this.setState({
      procurementDate: date,
      strProcurementDate: fDate 
    });
  }

  onChangewarrantyEndDate = (date) => {
    var fDate =  moment(date).format("DD/MM/YYYY");
    this.setState({
      warrantyEndDate: date,
      strwarrantyEndDate: fDate 
    });
  }
  
  onChangeSupplierInvoiceDate = (date) => {
    var fDate =  moment(date).format("DD/MM/YYYY");
    this.setState({
      supplierInvoiceDate: date,
      strSupplierInvoiceDate: fDate 
    });
  }
  // onChangeHandlers


  onChangeBranch = (evt, data) => this.setState({selectedBranch: data.value});

  onSelectAssetType = (event, data) => {
  
    // fetch by name and get the attributes
    this.setState({
      selectedAssetType: data.value
    })
    fetch(`/get_asset_type?type_name=${data.value}`,
    { method: 'GET' })
    .then(r => r.json()) 
    .then(data => {
    
      // parsing json data (need to verify later)
      var i;
      var s = JSON.stringify(data, null, 2);
      var r = JSON.parse(s);
      this.setState({
        assetTypeAttributes: []
      })

      for( i=0; i<r.results.length; i++) {
        // append to state.assetTypes  
        this.setState({
          assetTypeAttributes: this.state.assetTypeAttributes.concat([{
             id: r.results[i].id, value: "", name: r.results[i].attr_name 
          }])
        });
      }
    })
    .catch(err => console.log(err))
  };

  onChangeserialNo = (event)          => this.setState({ serialNo: event.target.value });
  onChangePurchasePrice = (event)     => this.setState({ purchasePrice: event.target.value });
  onChangeSupplier = (event)          => this.setState({ supplier: event.target.value });
  onChangeWarehouseLocation = (event) => this.setState({ warehouseLocation: event.target.value });
  onChangeStatus = (event)            => this.setState({ status: event.target.value });
  onChangePartCode = (event)          => this.setState({ partCode: event.target.value });
  onChangeMake = (event)              => this.setState({ make: event.target.value });
  onChangeSupplierInvoiceNo = (event) => this.setState({ supplierInvoiceNo: event.target.value });
  onChangeHsnCode=(event)             => this.setState({ hsnCode: event.target.value });

  onChangeTransferOrder = (event)     => this.setState({ transferOrder: event.target.value });
  onChangeComment = (event)     => this.setState({ comment: event.target.value });


  // when attribute value changes
  onAttributeValueChange = (idx) => (evt) => {
    
    const newAttribute = this.state.assetTypeAttributes.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, value: evt.target.value,};
    });
    this.setState({ assetTypeAttributes: newAttribute });
  }

  // Renders
  // Form for static attributes
  StaticAttributesForm = () => (
    <Segment color="green">
    <Form>
      <br /><br />
      {/* <Form.Group> */}
        {this.renderSerialNos()}
      {/* </Form.Group> chk*/}
      <Divider />
      <Form.Group>
      <Form.Select
                onChange={this.onChangeBranch}
                value={this.state.selectedBranch}
                size="small"
                label="Branch"
                style={{ maxWidth: "400px" }}
                placeholder="Select Branch"
                options={branchOptions} />
        <Form.Input label='Purchase Date.'>
          <DatePicker dateFormat="DD/MM/YYYY" selected={this.state.purchaseDate} onChange={this.onChangePurchaseDate } />
        </Form.Input>
        <Form.Input label='Transfer Order Date.'>
          <DatePicker dateFormat="DD/MM/YYYY"  selected={this.state.transferOrderDate} onChange={this.onChangeTransferDate}/>
        </Form.Input>
        <Form.Input onChange = {this.onChangePurchasePrice} label='Purchase Price' placeholder='Enter Purchase Price' width={4} />
        <Form.Input onChange = {this.onChangeHsnCode} label='HSN Code' placeholder='HSN Code' width={6} />
      </Form.Group>
      <Form.Group>
        <Form.Input onChange = {this.onChangeWarehouseLocation} label='Warehouse Location' placeholder='Warehouse Location' width={14} />
      </Form.Group>
      <Form.Group>
        <Form.Input label='Procurement Date' placeholder='Procurement Date'>
          <DatePicker dateFormat="DD/MM/YYYY"  selected={this.state.procurementDate} onChange={this.onChangeProcurementDate}/>
        </Form.Input>
        <Form.Input onChange = {this.onChangePartCode} label='Part Code' placeholder='Part Code' width={8} />
      </Form.Group>
      <Form.Group>
        <Form.Input onChange = {this.onChangeMake} label='Make' placeholder='Make' width={10}/>
        <Form.Input label='Warranty end date'>
          <DatePicker dateFormat="DD/MM/YYYY"   selected={this.state.warrantyEndDate} onChange={this.onChangewarrantyEndDate}/>
        </Form.Input>
        {/* <Form>
        <Form.Input label="Upgrade Warranty">
        <Button small base icon labelPosition='right' 
             onClick = {() => {this.props.history.push('/upgradeWarranty')}}>
             <Icon name='linkify' />
             Upgrade  
        </Button>
        </Form.Input>
        </Form> */}
      </Form.Group>
      <Form.Group>
        <Form.Input onChange = {this.onChangeSupplier} label='Supplier' placeholder='Supplier' width={6} />
        <Form.Input onChange = {this.onChangeSupplierInvoiceNo} label='Supplier invoice no.' placeholder='Supplier invoice no.' width={6}/>
        <Form.Input label="Supplier invoice date">
          <DatePicker dateFormat="DD/MM/YYYY"  selected={this.state.supplierInvoiceDate}  onChange={this.onChangeSupplierInvoiceDate}/>
        </Form.Input>
      </Form.Group>
      <Form.Group>
        <Form.Input onChange = {this.onChangeTransferOrder} width={14} label='Transfer order' placeholder='Transfer order number' />
      </Form.Group>
      <Form.Group>
        <Form.TextArea label="Comment" onChange={this.onChangeComment} width={14} placeholder='Comment' style={{ minHeight: 100 }} />
      </Form.Group>

    </Form>
    </Segment>
  )


  DynamicAttributesForm = () => (
    <Segment color="red">
      <Label as='a' color='red' ribbon>Dynamic attributes</Label>
      <br /><br />`
        <Form>
            {this.state.assetTypeAttributes.map((attribute, idx) => (
              <FormGroup>
                <Form.Input width={4}><Label>{attribute.name}</Label></Form.Input>
                <Form.Input
                  width={14}
                  type="text"
                  placeholder={`Enter ${attribute.name}`}
                  onChange={this.onAttributeValueChange(idx)}
                /> 
              </FormGroup>
            ))}
        </Form>
    </Segment>
  )


  /**
   * render the serial no section in UI
   * @return {[type]} [JSX element]
   */
  renderSerialNos() {
    return (
      <div>
        <Form.Input
          icon='tags'
          iconPosition='left'
          label="Serial Number(s) (Press 'Enter' after entering)"
          value={this.state.enteredSerialNo}
          onChange={(e, data) => this.updateState('enteredSerialNo', data.value)}
          onKeyUp={this.addSerialNo}
          placeholder="Please enter comma separated Serial Numbers"
        />
        <div className="field" style={{ display: 'flex' }}>
          <Label>
            <label>Quantity:</label>
            <label style={{ marginLeft: '5px' }}>{this.state.serialNos.length}</label>
          </Label>
        </div>
        <div>
          {this.state.serialNos.map((val, idx) => (
            <Label key={idx} style={{ margin: '2px' }} color="green">
              {val}
              <Icon name="delete" onClick={this.removeSerialNo.bind(this, idx)} />
            </Label>
          ))}
        </div>
      </div>
    );
  }

  // button click handlers
  onAssetSubmit = () => {
    
    // initialize submit success/failure conditions
    this.setState({submitSuccess: false, submitFailure: false})

    // loop through each serialno entered to send api call for each of the quantities entered
    this.state.serialNos.forEach(serialNo => {
    
    // send the asset data to api for each serial no
    var insertString 
      = "/insert_asset_value?type_name="+this.state.selectedAssetType
      +"&static="+JSON.stringify({
        serialNo:               serialNo,
        purchaseDate:           this.state.strPurchaseDate,
        transferOrderDate:      this.state.strTransferOrderDate,
        purchasePrice:          this.state.purchasePrice,
        supplier:               this.state.supplier,
        warehouseLocation:      this.state.warehouseLocation,
        showroom:               this.state.showroom,
        procurementDate:        this.state.strProcurementDate,
        status:                 this.state.status,
        partCode:               this.state.partCode,
        supplierInvoiceNo:      this.state.supplierInvoiceNo,
        supplierInvoiceDate:    this.state.supplierInvoiceDate,
        make:                   this.state.make,
        warrantyEndDate:        this.state.strwarrantyEndDate,
        comment:                this.state.comment,
        transferOrder:          this.state.transferOrder,
        branch:                 this.state.selectedBranch,
        hsnCode:                this.state.hsnCode,
      })
      +"&dynamic="+JSON.stringify(this.state.assetTypeAttributes);

      console.log('submit = ', insertString)
    
    // save asset in db
    fetch( insertString, { method: 'POST' })
    .then(r => r.json()) 
    .then(data => {
      console.log(data)
      if(data.isSuccess) {
        // say operation succeeded, no failure
        this.setState({submitSuccess: true, submitFailure: false})
      } else {
        // say operation failure no success
        this.setState({submitSuccess: false, submitFailure: true})
        // stop further insertions
        return;
      }
    })
    .catch(err => console.log(err))
  });

  }

  

  /**
   * onKeuUp callback, when key === Enter it inserts the serial nos to the array in the state
   * @param {[type]} e [synthetic event]
   */
  addSerialNo = e => {
    if (e.keyCode === 13) {
      let slNo = this.state.enteredSerialNo;
      let values = slNo.split(',');
      values.forEach(value => {
        let val = value.trim();
        if (val) {
          this.updateStateNestedArray('serialNos', null, val);
        }
      });
      this.updateState('enteredSerialNo', '');
    }
  };

  

  /**
   * removes a serial nos from the list when cross icon is clicked in serial no tags
   * @param  {[type]} idx [index which is going to be removed]
   * @return {[type]}     [undefined]
   */
  removeSerialNo = idx => this.updateStateNestedArray('serialNos', idx);

  

  /**
   * [helper function to update state]
   * NOTE: this function only updates top level properties,
   * and will not be able to update any nested properties
   * @param  {[type]} key   [the key in the state which needs to be updated]
   * @param  {[type]} value [corresponding value which will be updated in the state]
   * @return {[type]}       [undefined]
   */
  updateState = (key, value) => {
    if (key) {
      this.setState({ [key]: value });
    }
  };

  

  /**
   * helper function update state for nested arrays
   * @param  {[type]} key   [key name in the state which is an array]
   * @param  {[type]} idx   [index within the array to be updated,
   *                         when ommitted a new value inserted to the array]
   * @param  {[type]} value [value to be updated]
   * @return {[type]}       [undefined]
   */
  updateStateNestedArray = (key, idx, value) => {

    if (!key) {
      return;
    }
    this.setState((state, props) => {
      let arr = [...state[key]];
      if (idx && value) {
        arr[idx] = value;
      } else if (idx||idx===0 && !value) {
        arr.splice(idx, 1);
      } else {
        arr.push(value);
      }
      state[key] = arr;
      return state;
    });
  };



  // Render method
  render() {
    return (
      <div className="page">
        
        <Container color="blue" textAlign='center'>
          <h1>Add new Asset</h1>
        </Container>
        <Segment color="blue">
          <Form>
            <Form.Group widths="equal">
              <Form.Select
                onChange={this.onSelectAssetType}
                label="Select Asset Type:"
                size="small"
                style={{ maxWidth: "400px" }}
                options={this.state.assetTypes}
                placeholder="Plese select asset type" />
                
                <Button color="blue" icon labelPosition='right' 
                 onClick = {() => {this.props.history.push('/AddAssetType')}}>
                  <Icon name='plus circle' />
                    Add new Asset type  
                </Button>
            </Form.Group>
            <Divider />
            {/* Static attributes form */}
            <this.StaticAttributesForm />
            <Divider />
            {/* Dynamic attributes form */}
            {(this.state.selectedAssetType) ?  <this.DynamicAttributesForm /> : undefined}
            <Form.Button color="blue" onClick={this.onAssetSubmit}><Icon name="save" />Save Asset</Form.Button>
            
          </Form>
          {(this.state.submitSuccess) ? <Message success header='Success!' content='Your asset has been submitted.'/> : 
        (this.state.submitFailure) ? <Message error header='Failure!' content='Could not submit asset.'/> : undefined}
        </Segment>
        {/* <Button color="red" onClick={()=>{console.log(this.state)}}><Icon name="tv" />Display state</Button> */}

      </div>
    );
  }
}
