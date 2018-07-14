import React from 'react';
import Tab, { Container, Grid, Label, Segment, Header, Divider, Table, Button, Icon } from 'semantic-ui-react';

import ReactToPrint from 'react-to-print';
import PropTypes from 'prop-types';
var moment = require('moment');

class ComponentToPrint extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {
		//     cartItems: this.props.cartItems,
		//     customer: this.props.customer
		// }
		console.log('props are: ', this.props);
	}

	// get the main location isMain = 1
	getMainLocation = () => {
		console.log('finding main...');
		var ans = '';
		this.props.locations.forEach(location => {
			// console.log('addr', location.address, 'main', location.isMain, 'cid', location.customerId, 'sel', this.props.customerId)
			if (location.isMain === 1 && location.customerId === this.props.customerId) {
				// console.log('main: ',location.address, location.isMain)
				ans = location.address + ', ' + location.city + ', ' + location.state + ', ' + location.pincode;
			}
		});
		return `${ans}`;
	};
	render() {
		return (
			<div name="page">
				<Container textAlign="center">
					<Header as="h5">DELIVERY CHALLAN</Header>

					<Grid columns={2} celled>
						<Grid.Row>
							<Grid.Column>Challan No: {this.props.challan_number}</Grid.Column>
							<Grid.Column>Date: {this.props.currentDate}</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Header as="h3">COMPUTER EXCHANGE PVT.LTD</Header>
								<Container textAlign="left">
									<p>#102, First Floor, May Fair Court, Nachiket Park, Dr. Pai Marg,</p>
									<p>Baner, Pune 411 045</p>
									<p>Web: www.computerexchangeindia.com</p>
									<p>Dial: +91-20-65200269/ 09830951013</p>
									<p>CIN: {this.props.cin}</p>
									<p>GSTN: GSTN</p>
									<p>PAN: PAN</p>
								</Container>
							</Grid.Column>
							<Grid.Column>
								<Container textAlign="left">
									<p>
										<strong>M/S</strong>
									</p>
									<p>
										<strong>{this.props.customer.cName}</strong>
									</p>
									<p>CIN: {this.props.cin}</p>
									<p>GST: Customer GST</p>
									<p>{this.getMainLocation()}</p>
									<p>
										<strong>Delivery at</strong>
									</p>
									<p>
										{this.props.customer.address}, {this.props.customer.city},{' '}
									</p>
									<p>
										{this.props.customer.state}, {this.props.customer.pincode}
									</p>
								</Container>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column width={4}>
								<Table singleLine>
									<Table.Header>
										<Table.Row>
											<Table.HeaderCell>
												<strong>Order PO#</strong>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<strong>Contact Person</strong>
											</Table.HeaderCell>
											<Table.HeaderCell>
												<strong>Messenger</strong>
											</Table.HeaderCell>
										</Table.Row>
									</Table.Header>
									<Table.Body>
										<Table.Row>
											<Table.Cell>{this.props.orderPo}</Table.Cell>
											<Table.Cell>{this.props.contactPerson}</Table.Cell>
											<Table.Cell>{this.props.messenger}</Table.Cell>
										</Table.Row>
									</Table.Body>
								</Table>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row columns={1}>
							<Grid.Column>
								<Container textAlign="center">
									Please receive the goods in good condition and return the challans duly signed
								</Container>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>{this.assetListTable()}</Grid.Row>
						<Grid.Row>
							<Grid.Column width={4}>
								<p>
									<strong>E-Way Bill:</strong> {this.props.ewayBill}
								</p>
							</Grid.Column>
							<Grid.Column width={12}>
								<p>
									<strong>Remarks:</strong>
								</p>
								<p>Sending on rental basis</p>
							</Grid.Column>
						</Grid.Row>
						<Grid.Row>
							<Grid.Column>
								<Grid>
									<Grid.Row>
										<Grid.Column>
											<Container textAlign="left">
												We Have received the goods in good condition.
											</Container>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column width={10}>
											<Container textAlign="left">Customer Signature</Container>
										</Grid.Column>

										<Grid.Column width={6}>
											<Container textAlign="center">Date</Container>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
							<Grid.Column>
								<Grid>
									<Grid.Row>
										<Grid.Column>
											<Container textAlign="center">for COMPUTER EXCHANGE PVT.LTD.</Container>
										</Grid.Column>
									</Grid.Row>
									<Grid.Row>
										<Grid.Column>
											<Container textAlign="center">Authorised Signature</Container>
										</Grid.Column>
									</Grid.Row>
								</Grid>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</div>
		);
	}
	// renders the list of assets
	assetListTable = () => (
		<Table basic celled>
			<Table.Header>
				<Table.HeaderCell>Qty</Table.HeaderCell>
				<Table.HeaderCell>Serial No</Table.HeaderCell>
				<Table.HeaderCell>HSN Code</Table.HeaderCell>
				<Table.HeaderCell>Part Code</Table.HeaderCell>
				<Table.HeaderCell>Description of goods</Table.HeaderCell>
				<Table.HeaderCell>Unit Price</Table.HeaderCell>
				<Table.HeaderCell>GST</Table.HeaderCell>
				<Table.HeaderCell>Total Amount</Table.HeaderCell>
			</Table.Header>
			<Table.Body>
				{this.props.cartItems.map(item => (
					<Table.Row>
						<Table.Cell>1</Table.Cell>
						<Table.Cell>{item.serialNo}</Table.Cell>
						<Table.Cell>{item.hsnCode}</Table.Cell>
						<Table.Cell>{item.partCode}</Table.Cell>
						<Table.Cell>
							{item.make}
							{item.dynaData.map(detail => `${'/' + detail.value}`)}
						</Table.Cell>
						<Table.Cell>{item.totalUnitPrice}</Table.Cell>
						<Table.Cell>{(item.gst*item.totalUnitPrice)/100}</Table.Cell>
						<Table.Cell>{item.totalPrice}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer>
				<Table.HeaderCell>Total Qty:{this.props.cartItems.length}</Table.HeaderCell>
				<Table.HeaderCell />
				<Table.HeaderCell />
				<Table.HeaderCell />
				<Table.HeaderCell>Net Amount</Table.HeaderCell>
				<Table.HeaderCell>{this.props.netAmount}</Table.HeaderCell>
				<Table.HeaderCell>{this.props.netGst}</Table.HeaderCell>
				<Table.HeaderCell>{this.props.netTotalAmount}</Table.HeaderCell>
			</Table.Footer>
		</Table>
	);
}

class Challan extends React.Component {
	render() {
		return (
			<div className="page">
				<ComponentToPrint
					ref={el => (this.componentRef = el)}
					customer={this.props.customer}
					currentDate={this.props.currentDate}
					orderPo={this.props.orderPo}
					messenger={this.props.messenger}
					locations={this.props.locations}
					locationId={this.props.locationId}
					cartItems={this.props.cartItems}
					customerId={this.props.customerId}
					contactPerson={this.props.contactPerson}
					cin={this.props.cin}
					netAmount={this.props.netAmount}
					netGst={this.props.netGst}
					netTotalAmount={this.props.netTotalAmount}
					ewayBill={this.props.ewayBill}
					challan_number={this.props.challan_number}
				/>
				<ReactToPrint
					trigger={() => (
						<Button>
							<Icon name="print" />Print
						</Button>
					)}
					content={() => this.componentRef}
				/>
			</div>
		);
	}
}

export default Challan;
