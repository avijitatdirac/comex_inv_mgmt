import React, { Component } from "react";
import { Divider, Button, Form, Input, Segment } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { notify } from "../Classes";
import { fetchAPI } from "../utility";
import "react-datepicker/dist/react-datepicker.css";

class UpgradeWarranty extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assetList: [],
      assetDetails: [],
      selectedAssetSerialNo: "",
      selectedAssetWarrantyDate: "",
      newAssetWarrantyDate: "",
      showDate: moment()
    };
  }

  componentWillMount() {
    fetchAPI("/asset/get_all_asset", {})
      .then(r => r.json())
      .then(data => {
        console.log(data);
        var alist = [];
        var dlist = [];

        data.results.forEach(obj => {
          alist = alist.concat({
            key: obj.id,
            value: obj.id,
            text: obj.serial_no
          });
          dlist = dlist.concat(obj);
        });
        this.setState({
          assetList: alist,
          assetDetails: dlist
        });
      })
      .catch(err => console.log(err));
  }

  populateData = () => {
    var adate;
    this.state.assetDetails.forEach(asset => {
      if (asset.id === this.state.selectedAssetSerialNo) {
        adate = asset.warranty_end_date;
      }
    });
    let madate = "";
    if (adate === "0000-00-00 00:00:00") {
      madate = "";
    } else {
      madate = moment(adate).format("YYYY-MM-DD");
    }

    this.setState({
      selectedAssetWarrantyDate: madate
    });
  };

  onChangeWarrantyDate = date => {
    var fDate = moment(date).format("YYYY-MM-DD HH:mm:ss");
    this.setState({
      newAssetWarrantyDate: fDate,
      showDate: date
    });
  };

  submitData = () => {
    if (this.state.selectedAssetSerialNo !== "") {
      fetchAPI("/asset/update_warranty", {
        asset_id: this.state.selectedAssetSerialNo,
        warranty_date: this.state.newAssetWarrantyDate
      })
        .then(r => r.json())
        .then(data => {})
        .catch(err => console.log(err));
    } else {
      notify.error("Please Enter Valid Serial Number To Upgrade");
    }
  };

  render() {
    console.log(
      this.state.newAssetWarrantyDate + " " + this.state.selectedAssetSerialNo
    );
    return (
      <Segment>
        <Form.Dropdown
          style={{ maxWidth: "600px" }}
          fluid
          icon="search"
          search
          selection
          value={this.state.selectedAssetSerialNo}
          onChange={(e, data) =>
            this.setState(
              { selectedAssetSerialNo: data.value },
              this.populateData
            )
          }
          placeholder="Enter Serial Number"
          options={this.state.assetList}
        />
        <br />
        <Divider />
        <Form.Group>
          <Input
            label="Warranty Date"
            value={this.state.selectedAssetWarrantyDate}
            readOnly
          />
        </Form.Group>
        <br />
        <Form>
          <Form.Input label="Choose Upgraded Warranty Date">
            <DatePicker
              dateFormat="DD/MM/YYYY"
              selected={this.state.showDate}
              onChange={this.onChangeWarrantyDate}
            />
          </Form.Input>
        </Form>
        <div>
          <center>
            <Button
              width="100px"
              color="blue"
              icon="configure"
              label="Upgrade"
              onClick={this.submitData}
            />
          </center>
        </div>
      </Segment>
    );
  }
}
export default UpgradeWarranty;
