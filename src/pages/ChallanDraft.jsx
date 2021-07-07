import React, { Component } from "react";
import { Segment, Table } from "semantic-ui-react";
import GenerateChallan from "./GenerateChallan";
import { fetchAPI } from "../utility";

class ChallanDraft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      challanList: [], // list of all available challan
      selectedChallanDetails: [], // details (data) of the challan that is selected
      renderChallan: false, // boolean variable that decides whether to display selected challan
      selectedChallanId: null // id of the selected draft challan
    };
  }

  // start up of component
  componentWillMount = () => {
    // temporary variable that holds all challan items
    var challans = [];
    // retrieve all challan drafts
    fetchAPI("/challan/get_challan_drafts", {})
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          // itearte and collect each challans on the list and
          data.results.forEach(element => {
            challans = challans.concat([
              {
                id: element.id,
                challanType: element.challan_type,
                challanDescription: element.challan_description,
                createTimestamp: element.create_timestamp,
                updateTimestamp: element.update_timestamp
              }
            ]);
          });

          // save challan items to state
          this.setState({ challanList: challans });
        }
      })
      .catch(err => console.log(err));
  };
  // ******** ON CHANGE METHODS ********
  // ******** ACTION METHODS ***********

  // loads the selectd challans to resume fill up
  loadChallan = selectedChallanId => {
    // console.log('selected id: ',selectedChallanId)
    // call api to get the challan details

    fetchAPI("/challan/get_challan_details", { challan_id: selectedChallanId })
      .then(r => r.json())
      .then(data => {
        if (data.isSuccess) {
          // save challan details
          this.setState({
            selectedChallanDetails: data.results[0].challan_details,
            renderChallan: true,
            selectedChallanId: selectedChallanId
          });
        }
      })
      .catch(err => console.log(err));

    // set the variable to start rendering the challan
  };
  // ******** RENDER METHODS ***********
  // Main render method for the page
  render() {
    if (this.state.renderChallan)
      return (
        <Segment>
          <GenerateChallan
            cartItems={[]}
            resumeState={this.state.selectedChallanDetails}
            selectedDraftId={this.state.selectedChallanId}
          />
        </Segment>
      );
    else
      return (
        <Segment>
          <h1>Challan Drafts</h1>
          {this.renderDraftListTable()}
          {/* <Button basic onClick={() => console.log('state: ', this.state)}>
                            <Icon name="tv" /> State
                        </Button> */}
        </Segment>
      );
  }

  // the table that shows the list of all challans that are saved as draft
  renderDraftListTable = () => (
    <Table color="teal" celled unstackable striped selectable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Challan Type</Table.HeaderCell>
          <Table.HeaderCell>Challan Description</Table.HeaderCell>
          <Table.HeaderCell>Create Timestamp</Table.HeaderCell>
          <Table.HeaderCell>Update Timestamp</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {this.state.challanList.map(obj => (
          <Table.Row
            key={obj.id}
            style={{ cursor: "pointer" }}
            onClick={this.loadChallan.bind(this, obj.id)}
          >
            <Table.Cell>{obj.id}</Table.Cell>
            <Table.Cell>{obj.challanType}</Table.Cell>
            <Table.Cell>{obj.challanDescription}</Table.Cell>
            <Table.Cell>{obj.createTimestamp}</Table.Cell>
            <Table.Cell>{obj.updateTimestamp}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default ChallanDraft;
