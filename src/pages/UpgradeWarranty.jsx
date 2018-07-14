import React, { Component } from "react";
import Moment from "react-moment"
import { TextArea, Dimmer, Loader, Container, Image, Checkbox, Dropdown, Divider, Button, Form, Table, Modal, Input, Icon, Step, Header, Sidebar, Segment, FormGroup, Label, Grid, GridColumn, Card } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import {notify} from '../Classes';
require('react-datepicker/dist/react-datepicker.css');


var moment = require('moment')

class UpgradeWarranty extends Component {

    constructor(props) {
        super(props);
    
        this.state = {
            assetList:[],
            assetDetails:[],
            selectedAssetSerialNo:'',
            selectedAssetWarrantyDate:'',
            newAssetWarrantyDate:'',
            showDate:moment()
        }
    }

    componentWillMount()
    {
        fetch(`/get_all_asset`,
		{ method: 'GET' })
		.then(r => r.json())
		.then(data => {
            console.log(data)
            var alist=[]
            var dlist=[]

            data.results.forEach(obj => {
                alist=alist.concat({	
                    key: obj.id, 
                    value: obj.id, 
                    text: obj.serial_no						
                })
               dlist=dlist.concat(obj)
            })
            this.setState({
                assetList:alist,
                assetDetails:dlist
            })
            
            
		})
        .catch(err => console.log(err))
    }

    populateData = () =>
    {
        var adate
        this.state.assetDetails.forEach(asset => {
            if(asset.id === this.state.selectedAssetSerialNo) {
   
                adate=asset.warranty_end_date
            
            }
        })
        if(adate==='0000-00-00 00:00:00')
        {
            var madate=''
        }
        else
        {
        var madate=moment(adate).format("YYYY-MM-DD")
        }

        this.setState({
            selectedAssetWarrantyDate:madate
        })

    }

    onChangeWarrantyDate = (date) => {
        var fDate =  moment(date).format("YYYY-MM-DD HH:mm:ss");
        this.setState({
          newAssetWarrantyDate: fDate,
          showDate:date
        });
      }

      submitData = () =>
      {
          if(this.state.selectedAssetSerialNo!=='')
          {
        fetch(`/update_warranty?asset_id=${this.state.selectedAssetSerialNo}&warranty_date=${this.state.newAssetWarrantyDate}`,
        { method: 'POST' })
        .then(r => r.json())
        .then(data => {

        })
        .catch(err => console.log(err))
    }
    else
    {
        notify.error("Please Enter Valid Serial Number To Upgrade")
    }

      }

    render()
    {
        console.log(this.state.newAssetWarrantyDate+" "+this.state.selectedAssetSerialNo)
        return(
            <Segment>
            <Form.Dropdown
                        style={{ maxWidth: "600px" }}
                        fluid
						icon='search'
						search
                        selection
						  value={this.state.selectedAssetSerialNo}
						 onChange={(e, data) =>
                             this.setState({ selectedAssetSerialNo: data.value,},
                                this.populateData
                             )
						 }
						placeholder="Enter Serial Number"
						options={this.state.assetList}
					/>
                    <br/>
                    <Divider/>
                    <Form.Group>
                    <Input label="Warranty Date" value={this.state.selectedAssetWarrantyDate} readOnly/>   
                    </Form.Group>
                    <br/>
                    <Form>
                <Form.Input label="Choose Upgraded Warranty Date">
                    <DatePicker  dateFormat="DD/MM/YYYY" selected={this.state.showDate} onChange={this.onChangeWarrantyDate} />
                </Form.Input>
                </Form>
                <div>
					<center><Button width="100px" color="blue"  icon="configure" label="Upgrade" onClick={this.submitData} /></center>
				</div>
                    </Segment>
                        )
                    }

}
export default UpgradeWarranty;
