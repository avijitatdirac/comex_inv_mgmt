import React from "react";
import { Container, Checkbox, Label, Segment, Header, Dropdown, Divider, Table, Input, Select, Button, Icon, Form } from "semantic-ui-react";
import Challan from "../components/Challan"
import DatePicker from "react-datepicker";
import {notify} from '../Classes';

var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');

// branch options
const paymentOptions = [
	{ key: 'a', text: 'Monthly', value: 'Monthly' },
	{ key: 'b', text: 'Daily', value: 'Daily' },
	{ key: 'c', text: 'Lumpsum', value: 'Lumpsum' }
  ];

// displayes dynamic data for each cart item in table
function getDescription(obj) {

	var str="";
	obj.dynaData.forEach(element => {
		str = str +" / "+element.value
	});
	return `${str}`;
}

function getExtras(obj) {

	if(obj.extras!==undefined) {
		var extrasList="\n + ";
		
		obj.extras.forEach(extra => {
		extrasList = extrasList +"\n + "+extra.make
		});
		return `${extrasList}`;
	} else {
		return undefined
	}
}

// branch options
const branchOptions = [
	{ key: 'a', text: 'Pune', value: 'Pune' },
	{ key: 'b', text: 'Bangalore', value: 'Bangalore' },
	{ key: 'c', text: 'Kolkata', value: 'Kolkata' }
];

const taxOptions = [
	{ key: 'a', text: 'CGST/SGST', value: 'CGST/SGST' },
	{ key: 'b', text: 'IGST', value: 'IGST' }
];

// Challan type options
const challanTypeOptions = [
	{ key: 'a', text: 'Rental',  value: 'rental' },
	{ key: 'b', text: 'Damaged', value: 'damaged' },
	{ key: 'c', text: 'Standby', value: 'standby' },
	{ key: 'd', text: 'Demo', 	 value: 'demo' }
];

class GenerateChallan extends React.Component {

	constructor(props) {
		super(props);


		// if resume state is define in props then resume previous state
		if(this.props.resumeState!==undefined) {
			// console.log('resuming state', this.props.resumeState)
			// set state according to resumestate
			// this.state = JSON.parse(this.props.resumeState)
			var resumeState = JSON.parse(this.props.resumeState)

			// console.log('parsed state: ', resumeState)
			this.state = resumeState
		}
		// else do the default 
		else {		
			this.state = {
				selectedPaymentMode: 'Monthly',
				selectedTaxType:'CGST/SGST',
				selectedCustomerId: null,
				selectedLocationId: null,
				selectedChallanId: null,
				customerList: [],
				extraData: [],
				challanCartItems: this.props.cartItems,
				customerLocations: [],
				ueaNumber: '',
				po: '',
				poReference: '',
				cnNumber: '',
				deliveryPerson: '',
				comment: '',
				selectedBranch: '',
				netAmount:null,
				netGst:null,
				netTotalAmount:null,
				last_challan_number:'',


				// for dropdowns 
				customerOptions: [],
				locationOptions: [],
				challanOptions: [{key: '0', value: '0', text: 'N/A'}],

				selectedCustomerDetails: [],

				// date
				rentStartDate: moment(),
				printChallan: false,

				// contact selection
				selectedContactPerson: null,
				selectedContactNumber: null,
				selectedEmail: null,

				selectedChallanType: null,
			};
		}
	}


	// In component will mount get all the customer details
	componentWillMount() {


			// fetch all customer details from database
			fetch(`/get_customer`,
			{ method: 'GET' })
			.then(r => r.json())
			.then(data => {
				var cl=[]
				var co=[]
		
				// get all customer details
				data.customerDetails.forEach(customer => {

                    cl=cl.concat({	
							
						customerId: 		customer.Customer_Id,
						cName: 				customer.CName,
						updatedDate: 		customer.updated_date,
						createdDate: 		customer.created_date,
						previouslyKnownAs: 	customer.Previously_Known_As,
						panNo: 				customer.Pan_No,
						comments: 			customer.Comments,
					
					})
					if(customer.Previously_Known_As===null)
					{
					co=co.concat({	
						key: customer.Customer_Id, 
						value: customer.Customer_Id, 
						text: customer.CName
					})
				}
				else
				{
					co=co.concat({	
						key: customer.Customer_Id, 
						value: customer.Customer_Id, 
						text: customer.CName+"(Previously known as "+customer.Previously_Known_As+")"
					})
				}


				});

				this.setState({
					customerList:cl,
					customerOptions:co
				})

				// get all cusstomer location details
				data.locationDetails.forEach(location => {
					this.setState({
						customerLocations : this.state.customerLocations.concat({	
							cid:					location.CID,
							customerId: 			location.Customer_Id,
							address: 				location.Address,
							gstValue: 				location.GST_Value,
							contactPerson1: 		location.Contact_Person_1,
							contactNumber1: 		location.Contact_Number_1,
							email1: 				location.Email_1,
							contactPerson1Valid: 	location.Contact_Person_1_Valid,
							contactPerson2: 		location.Contact_Person_2,
							contactNumber2: 		location.Contact_Number_2,
							email2: 				location.Email_2,
							contactPerson2Valid: 	location.Contact_Person_2_Valid,
							contactPerson3: 		location.Contact_Person_3,
							contactNumber3: 		location.Contact_Number_3,
							email3: 				location.Email_3,
							contactPerson3Valid: 	location.Contact_Person_3_Valid,
							contactPerson4: 		location.Contact_Person_4,
							contactNumber4: 		location.Contact_Number_4,
							email4: 				location.Email_4,
							contactPerson4Valid: 	location.Contact_Person_4_Valid,
							isMain: 				location.Is_Main,
							isValid: 				location.Is_Valid,
							createdDate: 			location.created_date,
							updatedDate: 			location.updated_date,
							sez: 					location.SEZ,
							city: 					location.City,
							state: 					location.State,
							pincode: 				location.Pincode,
						})
					})
				});
			})
			.catch(err => console.log(err))
	}



	// iterates through all the cart items and returns the extra data contained in them, for display in challan
	getExtraData = (obj) => {

		var extraData=[];
		if(obj.extras!==undefined) {
			obj.extras.forEach(element => {
				extraData = extraData.concat({ id: element.assetId, text: element.make, value: element.make})
			});
		} 
		return extraData;
	}

// motivational code
// onChangeUnitPrice = (event, idx) => {
// 	var temp = this.state.challanCartItems;
// 	const newCartItems = temp.map((item, sidx) => {
// 		if (idx !== sidx) {
// 		  return item;
// 		} else {
// 		  return { ...item, unitPrice: event.target.value};
// 		}						  
// 	})
// 	this.setState({ challanCartItems: newCartItems });
// }

	// calculate total price 
	calculateTotal = () => {
		var total = 0
		this.state.challanCartItems.forEach(element => {
			total = Number(total) + Number(element.totalPrice!==undefined ? element.totalPrice : 0)
		});
		this.state.netTotalAmount=total;
		return `${total}`
	}

	// calculate total price 
	calculateTotalUnitPrice = () => {
		var total = 0
		this.state.challanCartItems.forEach(element => {
			total = Number(total) + Number(element.totalUnitPrice!==undefined ? element.totalUnitPrice : 0)
		});
		this.state.netAmount=total;
		//this.setState({netAmount:total})
		console.log('net amount='+total);
		return `${total}`
	}

	// calculate total price 
	calculateTotalGST = () => {
		var total = 0
		var l_gst=0
		this.state.challanCartItems.forEach(element => {
			l_gst = (Number(element.gst!==undefined ? element.gst : 0)*Number(element.totalUnitPrice!==undefined ? element.totalUnitPrice : 0))/100;
			total=total+l_gst;
			//total = (Number(total) + Number(element.gst!==undefined ? element.gst : 0)*Number(element.totalUnitPrice!==undefined ? element.totalUnitPrice : 0))/100;
			// *Number(element.totalUnitPrice!==undefined ? element.totalUnitPrice : 0)
			this.state.netGst=total;
		});
		return `${total}`
	}

	// calculate current price 
	calculateCurrentPrice = (obj) => {
		
		var now = moment()
		var currentDate = moment(now).year()
		var purchaseDate = moment(obj.purchaseDate).year()
		var purchaseMonth = moment(obj.purchaseDate).month()+1
		var r
		if(purchaseMonth>=5 && purchaseMonth<=9) 
			r = 40
		else 
			r = 20

		var n = currentDate - purchaseDate
		var p = obj.purchasePrice
		
		var a = p*(Math.pow((1-r/100),n))	
		if(!isNaN(a))
			return `${a.toFixed(2)}`
		else	
			return `${0}`
	}

	// // calculate total unit price  
	// calculateTotalUnitPrice = (idx) => {
	// 	var temp = this.state.challanCartItems
	// 	// console.log('start: ', this.state.rentStartDate, ' End: ', obj.rentEndDate, 'UP: ', obj.unitPrice)
	// 	const newCartItems = temp.map((item, sidx) => {
	// 		if (idx !== sidx) {
	// 			return item;
	// 		} else {
	// 			// console.log('start: ', this.state.rentStartDate, ' End: ', item.rentEndDate, 'UP: ', item.unitPrice)
	// 			// calculate interval
	// 			var days = item.rentEndDate.diff(this.state.rentStartDate, 'days') 
	// 			console.log('up: ',item.unitPrice, 'days: ', days, 'total: ', item.unitPrice * days)
	// 			return { ...item, totalUnitPrice: item.unitPrice * days};
	// 		}						  
	// 	})
	// 	this.setState({challanCartItems: newCartItems})
	// }
	

	saveAsDraft = () => {
        var challanType = 'order'

        var challanDescription = null

        // build challan descriptions
        challanDescription = this.state.selectedCustomerDetails.cName+": "
        this.state.challanCartItems.forEach(element => {
            challanDescription += element.make+"/ "
        });

        var challanDetails = JSON.stringify(this.state)
        
        let cartAssetIds = [];
        
        this.props.cartItems.forEach(element => {
            cartAssetIds = cartAssetIds.concat(element.assetId)
        });

        // console.log('draft id: ', this.props.selectedDraftId)
        if(this.props.selectedDraftId!==undefined) {
            
            // modify the selected challan draft in database
            fetch(`/modify_challan_draft?id=${this.props.selectedDraftId}&challan_type=${challanType}&challan_description=${challanDescription}`,
            {   method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challan_details: challanDetails
                })
            })
            .then(r => r.json()) 
            .then(data => {
                if(data.isSuccess) {
					
					notify.success('Updated Draft');
					window.location = '/challanDraft'                        
				} 
				else {
					
					notify.error('failed to update draft')
                }
            })
            .catch(err => {
                console.log(err)
                notify.error('could not save. Error: ')
            })
        
        } else {
            // insert the challan draft in database
            fetch(`/insert_challan_draft?challan_type=${challanType}&challan_description=${challanDescription}`,
            {   method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    challan_details: challanDetails
                })
            })
            .then(r => r.json()) 
            .then(data => {
                if(data.isSuccess) {
                    
                    // let the status of the assets be 0 (out of stock), because they are booked
                    fetch(`/change_inventory_status?data=${JSON.stringify(cartAssetIds)}`,
                    { method: 'GET' })
                    .then(r => r.json()) 
                    .then(data => {
                        if(data.isSuccess) {							
							notify.success('Saved as Draft')
							window.location = '/challanDraft'                        }
                    })
                    .catch(err => console.log(err))
                } else {
                    notify.error('save failure')
                }
            })
            .catch(err => {
                console.log(err)
                notify.error('could not save. Error: ',err)
            })
        }
        
    }

	// cancel draft
	cancelDraft = () => {
		let cartAssetIds = [];
		
		this.state.challanCartItems.forEach(element => {
			cartAssetIds = cartAssetIds.concat(element.assetId)
		});
		// delete the draft from draft table
		fetch(`/delete_challan_details?challan_id=${this.props.selectedDraftId}`,
			{ 	method: 'GET'})
			.then(r => r.json()) 
			.then(data => {
				if(data.isSuccess) {
					
					// let the status of the assets be back to 1 (in stock), because booking is cancelled
					// console.log(`/reset_inventory_status?data=${JSON.stringify(cartAssetIds)}`)
					fetch(`/reset_inventory_status?data=${JSON.stringify(cartAssetIds)}`,
					{ method: 'GET' })
					.then(r => r.json()) 
					.then(data => {
						if(data.isSuccess) {
							notify.success('Draft Deleted')
							window.location = '/displayAssets'
						}
					})
					.catch(err => console.log(err))
				} else {
					notify.error('failed to delete')
				}
			})
			.catch(err => {
				console.log(err)
				notify.error('could not save. Error: ',err)
			})
		// update asset table
	}
	
	// submit challan
	submitChallan = () => {

		// asset config table
		// order master table and order details
		// remove from challan draft
		var cartAssetIds = []
		this.state.challanCartItems.forEach(element => {
			cartAssetIds = cartAssetIds.concat(element.assetId)
		});

		let jsonChallanCartItems = JSON.stringify(this.state.challanCartItems)
		
		let jsonCartItems = JSON.stringify(cartAssetIds)
		// 1. insert into order master and details
		let cartAssetDetails = [];
		// get all needed info from assets present in cart
		this.state.challanCartItems.forEach(element => {
			
			cartAssetDetails = cartAssetDetails.concat({
				
				assetId: element.assetId,
				rentalBeginDate: this.state.rentStartDate,
				rentalEndDate:	element.rentEndDate,
				dailyUnitPrice: element.unitPrice,
				currentProcurementPrice: this.calculateCurrentPrice(element),
				totalUnitPrice:	element.totalUnitPrice,
				gstValue: element.gst, 
				totalValue: element.totalPrice, 
				status: element.status,
			})
		});
		// all the details that will be sent to api, includes cart asset details as array
		let requestData = {
			orderDate: this.state.rentStartDate,
			customerId:	this.state.selectedCustomerId,
			totalAmount: this.calculateTotal(),
			customerLocationId: this.state.selectedLocationId,
			parentChallanId:	this.state.selectedChallanId,
			ueaNumber: this.state.ueaNumber,
			po:	this.state.po,
			poReference: this.state.poReference,
			cnNumber: this.state.cnNumber,
			deliveryPersonName: this.state.deliveryPerson, 
			comment: this.state.comment,
			cartAssetDetails: cartAssetDetails,
		}
		
		// convert request to json string
		let jsonRequestData = JSON.stringify(requestData)

		// console.log('request data = ', jsonRequestData)

		// if status is damaged set status to 3 in db
		if(this.state.selectedChallanType === 'damaged') {
			// if its draft page submission		
			if(this.props.selectedDraftId !== undefined) {
				// 3. delete from challan draft
				// delete the draft from draft table
				fetch(`/delete_challan_details?challan_id=${this.props.selectedDraftId}`,
				{ 	method: 'GET'})
				.then(r => r.json()) 
				.then(data => {
					if(data.isSuccess) {
						notify.error('Submitted Draft')
						this.setState({ printChallan: true })
					}
				})
			}
			// else if its order page submission
			else {
				// 3. inventory status in asset table
				fetch(`/change_inventory_status_to_on_repair?data=${jsonCartItems}`,
				{ method: 'GET' })
				.then(r => r.json()) 
				.then(data => {
					if(data.isSuccess) {
						notify.success('Submitted Direct')
						this.setState({ printChallan: true })
					}
				})	
			}
		} 
		// else set status to 0 in db
		else {
			// create an order entry in the order table
		fetch(`/order_create?data=${jsonRequestData}`,
		{ method: 'POST' })
		.then(result => result.json()) 
		.then(data => {
			if(data.isSuccess) {
				 console.log('order insertion success')
				// 2. insert into asset config
				fetch(`/change_config_table_on_add?data=${jsonChallanCartItems}`,
				{ method: 'POST' })
				.then(r => r.json()) 
				.then(data => {
					if(data.isSuccess) {
						 console.log('config table success')
						// if its draft page submission		
						if(this.props.selectedDraftId !== undefined) {
							// 3. delete from challan draft
							// delete the draft from draft table
							fetch(`/delete_challan_details?challan_id=${this.props.selectedDraftId}`,
							{ 	method: 'GET'})
							.then(r => r.json()) 
							.then(data => {
								if(data.isSuccess) {
									notify.success('submitted draft')
									this.setState({ printChallan: true })
									//this.setState({last_challan_number: data.last_challan_number})
									//console.log("data.last_challan_number ="+data.last_challan_number)
								}
							})
						}
						// else if its order page submission
						else {
							// 3. inventory status in asset table
							fetch(`/change_inventory_status?data=${jsonCartItems}`,
							{ method: 'GET' })
							.then(r => r.json()) 
							.then(data => {
								if(data.isSuccess) {
									notify.success('submitted after change_inventory_status')
									this.setState({ printChallan: true })
									console.log('last_challan_number ='+JSON.stringify(data.last_challan_number[0].last_challan))
									this.setState({last_challan_number:data.last_challan_number[0].last_challan})
								}
							})	
						}				
					}   
				})
				.catch(err => console.log(err))

			} else {
				// console.log('order insertion failure')
			}
		})
		.catch(err => console.log(err))

		}
		
	}

	onChangePaymentMode= (evt, data) => { 
		this.setState({selectedPaymentMode: data.value})
		//this.onChangeUnitPrice(evt);
	}

	onChangeTaxType= (evt, data) => this.setState({selectedTaxType: data.value});

	// Input on change handlers

	// rental period change handler
	onRentalPeriodChange = (evt) => {
		var period = (Number(evt.target.value) >= 0 ? evt.target.value : 0) 
		this.setState({ rentalPeriod: period })
	}
	
	
	// populates customer location dropdown after a cusomer is chosen
	populateLocationDropdown = (event, data) => {

		var locationOptions = []
		var customerId = data.value
		this.state.customerLocations.forEach(location => {
			
			// location mathes the customer id and is valid address
			if(location.customerId === customerId && location.isValid ===1 ) {
				
				locationOptions = locationOptions.concat([{	
					key: location.cid, 
					value: location.cid, 
					text: location.address+', '+location.city+', '+location.state
				}])
				
			}
		});
		this.setState({	locationOptions, selectedLocationId: null })

		var challanOptions = [{key: '0', value: '0', text: 'N/A'}]
		// get challans of this customer
		fetch(`/get_challan?customer_id=${customerId}`,
		{ method: 'GET' })
		.then(r => r.json())
		.then(data => {
			if(data.isSuccess) {
				// console.log(customerId, 'data = ', data)
				data.results.forEach(data => {
					challanOptions = challanOptions.concat({			
						key: data.challan_number, 
						value: data.challan_number, 
						text: data.challan_number			
					})
				});
				this.setState({ challanOptions })
			} else {
				console.log('failure')
			}
			
		})
		.catch(err => console.log(err))
		// console.log('challans: ', challanOptions)
	}

	// when user selects a location get the location details
	onLocationSelected = (event, data) => {

		var selectedLocationId = data.value
		var {selectedCustomerId} = this.state

		var cName
		var panNo
		var address 
		var gstValue
		var contactNumber1
		var contactNumber2
		var contactPerson
		var email1
		var email2
		var city
		var state
		var sez
		var pincode
		var cid,customerId,address,gstValue,contactPerson1,contactNumber1,email1,contactPerson1Valid,contactPerson2,contactNumber2,email2,contactPerson2Valid,contactPerson3,contactNumber3,email3,contactPerson3Valid,contactPerson4,contactNumber4,email4,contactPerson4Valid,isMain,isValid,createdDate,updatedDate,sez,city,state,pincode

		// get customer 
		this.state.customerList.forEach(customer => {
			
			if(customer.customerId === selectedCustomerId) {
				cName = customer.cName
				panNo = customer.panNo
			}
		});

		// // get address details
		this.state.customerLocations.forEach(location => {
			
			if(location.cid === selectedLocationId) {
		
				cid = location.cid
				customerId = location.customerId
				address = location.address
				gstValue = location.gstValue
				contactPerson1 = location.contactPerson1
				contactNumber1 = location.contactNumber1
				email1 = location.email1
				contactPerson1Valid = location.contactPerson1Valid
				contactPerson2 = location.contactPerson2
				contactNumber2 = location.contactNumber2
				email2 = location.email2
				contactPerson2Valid = location.contactPerson2Valid
				contactPerson3 = location.contactPerson3
				contactNumber3 = location.contactNumber3
				email3 = location.email3
				contactPerson3Valid = location.contactPerson3Valid
				contactPerson4 = location.contactPerson4
				contactNumber4 = location.contactNumber4
				email4 = location.email4
				contactPerson4Valid = location.contactPerson4Valid
				isMain = location.isMain
				isValid = location.isValid
				createdDate = location.createdDate
				updatedDate = location.updatedDate
				sez = location.sez
				city = location.city
				state = location.state
				pincode = location.pincode
			}
		});
		
		// set details of selected customer
		this.setState({	selectedCustomerDetails: {
				cName,
				panNo,
				cid,
				customerId,
				address,
				gstValue,
				contactPerson1,
				contactNumber1,
				email1,
				contactPerson1Valid,
				contactPerson2,
				contactNumber2,
				email2,
				contactPerson2Valid,
				contactPerson3,
				contactNumber3,
				email3,
				contactPerson3Valid,
				contactPerson4,
				contactNumber4,
				email4,
				contactPerson4Valid,
				isMain,
				isValid,
				createdDate,
				updatedDate,
				sez,
				city,
				state,
				pincode
			} 
		})
	}

	// unit price on change handler
	onChangeUnitPrice = (idx) => (event) => {
		var temp = this.state.challanCartItems;
		var unitPrice = event.target.value
		var rentStartDate = ((this.state.rentStartDate !== undefined) ? moment(this.state.rentStartDate) : moment())
		const newCartItems = temp.map((item, sidx) => {
			if (idx !== sidx) {
			  return item;
			} else {
				var gst = item.gst!==undefined ? item.gst : 0; 
				
				var rentEndDate = ((item.rentEndDate !== undefined) ? moment(item.rentEndDate) : moment())
				
				var multiplier = this.state.selectedPaymentMode ==='Daily' ? (rentEndDate.diff(rentStartDate, 'days')):1;

				//var days = rentEndDate.diff(rentStartDate, 'days')
					
				var totalUnitPrice = unitPrice * multiplier
				var total = Number(totalUnitPrice)+Number(totalUnitPrice)*Number(gst)/100
				return { ...item, unitPrice: unitPrice, totalUnitPrice: totalUnitPrice, totalPrice: total};
			}						  
		})
		this.setState({ challanCartItems: newCartItems });		
	}

	// gst on change handler
	onChangeGst = (idx) => (event) => {
		var temp = this.state.challanCartItems;
		const newCartItems = temp.map((item, sidx) => {
			if (idx !== sidx) {
			  return item;
			} else {
			  var totalUnitPrice = item.totalUnitPrice!==undefined ? item.totalUnitPrice : 0;
			  var taxType = this.state.selectedTaxType; 
			  var l_gst = Number(event.target.value)*Number(totalUnitPrice)/100
			  var total = Number(totalUnitPrice) + Number(event.target.value)*Number(totalUnitPrice)/100
			  return { ...item, gst: event.target.value, totalPrice: total};
			}						  
		})
		this.setState({ challanCartItems: newCartItems });
	}

	// end rent date on change handler
	onChangeRentEndDate = (idx) => (date) => {

		var temp = this.state.challanCartItems		
		var rentEndDate = (date !== undefined) ? moment(date) : moment()
	
		var rentStartDate = ((this.state.rentStartDate !== undefined) ? moment(this.state.rentStartDate) : moment())
       
		const newCartItems = temp.map((item, sidx) => {
			if (idx !== sidx) {
			  	return item;
			} else {
				
				var gst = ((item.gst !== undefined) ? item.gst : 0)
				var days = rentEndDate.diff(rentStartDate, 'days')
				
				var totalUnitPrice = (item.unitPrice!==undefined ? item.unitPrice:0) * days
			  	var total = Number(totalUnitPrice) + Number(gst)*Number(totalUnitPrice)/100
			  	return { ...item, rentEndDate: rentEndDate, totalUnitPrice: totalUnitPrice, totalPrice: total};
			}						  
		})
		this.setState({ challanCartItems: newCartItems });		
		
	}
	
	// other details onchange handlers
	ueaNumberOnChangeHandler 		= (event) => this.setState({ ueaNumber: event.target.value })
	poOnChangeHandler 				= (event) => this.setState({ po: event.target.value })
	poReferenceOnChangeHandler 		= (event) => this.setState({ poReference: event.target.value })
	cnNumberOnChangeHandler 		= (event) => this.setState({ cnNumber: event.target.value })
	deliveryPersonOnChangeHandler	= (event) => this.setState({ deliveryPerson: event.target.value })
	onChangeComment 				= (event) => this.setState({ comment: event.target.value });
	onChangeBranch 					= (evt, data) => this.setState({selectedBranch: data.value});

	onChangeRentStartDate = (date)  => {

		// console.log('date = ', date)
		var temp = this.state.challanCartItems		

		var rentStartDate = ((date !== undefined) ? moment(date) : moment())
		
		const newCartItems = temp.map((item) => {

			var rentEndDate = ((item.rentEndDate !== undefined) ? moment(item.rentEndDate) : moment())
	
			var gst = ((item.gst !== undefined) ? item.gst : 0)
			// console.log(rentStartDate, rentEndDate)
			var days = rentEndDate.diff(rentStartDate, 'days')
			
			var totalUnitPrice = (item.unitPrice!==undefined ? item.unitPrice:0) * days

			var total = Number(totalUnitPrice) + Number(gst)*Number(totalUnitPrice)/100

			return { ...item, totalUnitPrice: totalUnitPrice, totalPrice: total};
		})
		this.setState({ challanCartItems: newCartItems, rentStartDate: moment(date) });		
		
	} 
	// renders the challan page
	render() {
		if(this.state.printChallan) {
			return(
				<Challan
					// props list 
					customer 		= {this.state.selectedCustomerDetails}
					currentDate 	= {moment(this.state.rentStartDate).format("DD/MM/YYYY")}
					orderPo 		= { this.state.po+'. '+this.state.poReference}
					messenger 		= {this.state.deliveryPerson}
					locations 		= {this.state.customerLocations}
					locationId 		= {this.state.selectedLocationId}
					cartItems 		= {this.state.challanCartItems}
					cin 			= {this.state.cnNumber}
					customerId 		= {this.state.selectedCustomerId}
					contactPerson 	= {this.state.selectedContactPerson}
					challanType 	= {this.state.selectedChallanType}
					netAmount		= {this.state.netAmount}
					netGst			= {this.state.netGst}
					netTotalAmount	= {this.state.netTotalAmount}
					ewayBill		= {this.state.ueaNumber}
					challan_number	= {this.state.last_challan_number}
				/> 
			)
		}
		else {
			return [
				<Header size="large" color="blue">
					Generate Delivery Challan
				</Header>,
				<Segment>

					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginRight: "15px" }}>Challan Types: </div>
						<Dropdown 
							selection
							value={this.state.selectedChallanType}
							onChange={(e, data) => {
									this.setState({ selectedChallanType: data.value })
							}}
							placeholder="Select a Challan Type"
							options={challanTypeOptions}
						/>
						</div>
						<br />
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginRight: "15px" }}>Customer: </div>
						<Dropdown
							icon='search'
							fluid 
							search
							selection
							value={this.state.selectedCustomerId}
							onChange={
								
								(e, data) => {
									this.populateLocationDropdown(e, data)
									this.setState({ selectedCustomerId: data.value })
								} 
							}
							placeholder="Select a Customer"
							options={this.state.customerOptions}
						/>
					</div>
					<br/>
					{this.state.selectedCustomerId ? 			
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginRight: "15px", marginLeft: "10px", marginTop: "10px" }}>Location: </div>
						
							<Dropdown
								fluid
								selection
	
								value={this.state.selectedLocationId}
								onChange={(e, data) => {
									this.onLocationSelected(e, data)
									this.setState({ selectedLocationId: data.value })
								}}
								placeholder="Select an Address"
								options={this.state.locationOptions}
							/>
							
					</div>
					: 
					undefined
					}
					<br />
					{this.state.selectedCustomerId ?
					<div style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginRight: "15px", marginLeft: "10px", marginTop: "10px" }}>Parent Challan No.: </div>
						 
							<Dropdown
								fluid 
								selection
								search
								placeholder="N/A"
								value={this.state.selectedChallanId}
								onChange={(e, data) => {
									this.setState({ selectedChallanId: data.value })
								}}
								options={this.state.challanOptions}
							/>
					</div>
					: 
					undefined
					}
					<br/>
					{this.renderCustomerTable()}
					<Divider />
					<br />
					<Form>
						<Form.Group>

							{/*<Form.Input label="Rent Start Date">
								<DatePicker  dateFormat="DD/MM/YYYY" 
								onChange={this.onChangeRentStartDate}
								selected={moment(this.state.rentStartDate)} 							
								/>
							</Form.Input> 
	
							{/* <Form.Select
								onChange={this.onChangeBranch}
								value={this.state.selectedBranch}
								size="small"
								label="Branch"
								style={{ maxWidth: "400px" }}
								placeholder="Select Branch"
								options={branchOptions} 
							/> */}

						</Form.Group>
					</Form>
					<div style={{ width: '100%', overflowX: 'auto', overflowY: 'hidden',marginBottom:'10px' }}>
					    {this.renderItemTable()}
					 </div>  
					<Form>
						<Form.Group>
						<Form.Input label='E-Way Number' placeholder='Enter E-Way Number' width={6}
							value={this.state.ueaNumber} 
							onChange={this.ueaNumberOnChangeHandler} />
						<Form.Input label='PO' placeholder='Enter PO' width={4} 
							value={this.state.po}
							onChange={this.poOnChangeHandler} />
						<Form.Input label='PO Reference' placeholder='Enter PO Reference' width={6}
							value={this.state.poReference} 
							onChange={this.poReferenceOnChangeHandler} />
						</Form.Group>
						<Form.Group>
						<Form.Input label='CIN Number' placeholder='Enter CN number' width={4}
							value={this.state.cnNumber}  
							onChange={this.cnNumberOnChangeHandler} />
						<Form.Input label='Delivery Person Name' placeholder='Delivery Person Name' width={12}
							value={this.state.deliveryPerson}  
							onChange={this.deliveryPersonOnChangeHandler} />
						</Form.Group>
						<Form.Group>
							<Form.TextArea label="Comment"
							value={this.state.comment}
							onChange={this.onChangeComment} 
							width={16} placeholder='Enter Comment' style={{ minHeight: 100 }} />
						</Form.Group>
					</Form>
					<div
						style={{
							textAlign: "center",
							marginTop: "50px",
							marginBottom: "50px"
						}}
					>
						{(this.state.selectedCustomerId!==null && this.state.selectedLocationId!==null && this.state.selectedChallanType!==null
						?
						<Button color="blue" onClick={this.submitChallan}>
							<Icon name="save" /> Submit  <Icon name="calendar alternate outline" /> 
						</Button>
							:
							undefined
						)}
						{(this.state.selectedCustomerId!==null && this.state.selectedLocationId!==null && this.state.selectedChallanType!==null
						?
						<Button color="blue" onClick={this.saveAsDraft}>
							<Icon name="save" /> Save As Draft
						</Button>
							:
							undefined
						)}
						{(this.props.selectedDraftId!== undefined ?
							<Button color="blue" onClick={this.cancelDraft}>
							<Icon name="cancel" /> Cancel Draft
							</Button>: undefined	
						)}
					</div>
				</Segment>
			];
		}
	}
	// render item table
	renderItemTable = () => (

		<Segment>
      	<Label as='a' color='blue' ribbon>Purchased Items</Label>
		<Table color="blue" celled>
			<Table.Header>
				<Table.HeaderCell>No</Table.HeaderCell>
				<Table.HeaderCell>Item make</Table.HeaderCell>
				<Table.HeaderCell>Serial No</Table.HeaderCell>
				<Table.HeaderCell>Item Info</Table.HeaderCell>
				<Table.HeaderCell>Current Price</Table.HeaderCell>
				<Table.HeaderCell>Rend End Date</Table.HeaderCell>
				<Table.HeaderCell>Payment Mode*</Table.HeaderCell>
				<Table.HeaderCell>Price*</Table.HeaderCell>
				{/* <Table.HeaderCell>Total Unit price</Table.HeaderCell> */}
				<Table.HeaderCell>Tax Type</Table.HeaderCell>
				<Table.HeaderCell>Tax %</Table.HeaderCell>
				<Table.HeaderCell>Total Price with tax</Table.HeaderCell>
			</Table.Header>
			<Table.Body>
				{this.state.challanCartItems.map((obj, idx) => (
					<Table.Row key={obj.id}>
						<Table.Cell>{idx + 1}</Table.Cell>
						<Table.Cell>{obj.make}
						</Table.Cell>
						<Table.Cell>{obj.serialNo}</Table.Cell>
						<Table.Cell>
						{getDescription(obj)}

						{this.getExtraData(obj).map( edata => (
							<p><Icon name="plus square outline"/>{edata.text}</p>
						))}
						
						</Table.Cell>
						<Table.Cell>{this.calculateCurrentPrice(obj)}</Table.Cell>
						<Table.Cell>
						
						 <Form.Input > 
							<DatePicker className="ui input"  dateFormat="DD/MM/YYYY" 
								selected={moment(obj.rentEndDate)}
								onChange={this.onChangeRentEndDate(idx)}
								size="small"
								style={{ maxWidth: "200px" ,border:'1px' }}
							/>
							
						 </Form.Input>
						
						</Table.Cell>
						<Table.Cell>
							<Form.Select
								onChange={this.onChangePaymentMode}
								value={this.state.selectedPaymentMode}
								size="small"
								style={{ maxWidth: "200px" }}
								placeholder="Select Payment Mode"
								selectedValue={this.state.selectedPaymentMode}
								options={paymentOptions} />
						</Table.Cell>
						<Table.Cell><Input value={obj.unitPrice} onChange={this.onChangeUnitPrice(idx)}/></Table.Cell>
						{/* <Table.Cell>{obj.totalUnitPrice}</Table.Cell> */}
						<Table.Cell>
							<Form.Select
								onChange={this.onChangeTaxType}
								value={this.state.selectedTaxType}
								size="small"
								style={{ maxWidth: "100px" }}
								placeholder="Select Tax Type"
								selectedValue={this.state.selectedTaxType}
								options={taxOptions} />
						</Table.Cell>
						<Table.Cell><Input value={obj.gst} onChange={this.onChangeGst(idx)} small/></Table.Cell>
						<Table.Cell> { '   '}{(obj.totalPrice!==undefined ? <div>₹{obj.totalPrice}</div> : <div>₹0</div>)} {'   '}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer celled>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				{/* <Table.HeaderCell></Table.HeaderCell> */}
				{/* <Table.HeaderCell></Table.HeaderCell> */}
				<Table.HeaderCell>Total Price</Table.HeaderCell>
				<Table.HeaderCell>₹{this.calculateTotalUnitPrice()}</Table.HeaderCell>
				<Table.HeaderCell></Table.HeaderCell>
				<Table.HeaderCell>₹{this.calculateTotalGST()}</Table.HeaderCell>
				<Table.HeaderCell>₹{this.calculateTotal()}</Table.HeaderCell>
			</Table.Footer>
		</Table>
		</Segment>
	)

	// chk
	// renders customer table
	renderCustomerTable = () => {
		if(this.state.selectedLocationId){
			var customer = this.state.selectedCustomerDetails
			
			return(
				<div className="page">
				<Segment>
      			<Label as='a' color='orange' ribbon>Customer details</Label>
				<Table color="teal" striped>
					<Table.Body>
						<Table.Row>
							<Table.Cell>Name</Table.Cell>
							<Table.Cell>{customer.cName}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>PAN number</Table.Cell>
							<Table.Cell>{customer.panNo}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Address</Table.Cell>
							<Table.Cell>{customer.address}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>GST Number</Table.Cell>
							<Table.Cell>{customer.gstValue}</Table.Cell>
						</Table.Row>

						<Table.Row>
							<Table.Cell>City</Table.Cell>
							<Table.Cell>{customer.city}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>State</Table.Cell>
							<Table.Cell>{customer.state}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>S.E.Z</Table.Cell>
							<Table.Cell>{customer.sez === 1 ? `Yes` : `No`}</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Pincode</Table.Cell>
							<Table.Cell>{customer.pincode}</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
				<Header size="h5">Select a Contact From the Options</Header>
				<Table basic celled selectable unstackable>
					<Table.Header>
						<Table.HeaderCell>Contact Person</Table.HeaderCell>
						<Table.HeaderCell>Contact Number</Table.HeaderCell>
						<Table.HeaderCell>Email</Table.HeaderCell>
					</Table.Header>
					<Table.Body>
						{customer.contactPerson1Valid ? 
							<Table.Row 
							style={{ cursor: "pointer" }}
							onClick={()=>{
								this.setState({ 
										selectedContactPerson: customer.contactPerson1,
										selectedContactNumber: customer.contactNumber1,
										selectedEmail: customer.email1, 
								} 
							)}}
							>
							{this.state.selectedContactPerson === customer.contactPerson1 ?
								<Table.Cell>
								<Label ribbon color="teal">{customer.contactPerson1}</Label>
								</Table.Cell>
								:
								<Table.Cell>{customer.contactPerson1}</Table.Cell>
							}
							<Table.Cell>{customer.contactNumber1}</Table.Cell>
							<Table.Cell>{customer.email1}</Table.Cell>
							</Table.Row>
							:undefined 	
						}
						

						{customer.contactPerson2Valid ?
							<Table.Row
							style={{ cursor: "pointer" }}
							onClick={()=>{
								this.setState({ 
										selectedContactPerson: customer.contactPerson2,
										selectedContactNumber: customer.contactNumber2,
										selectedEmail: customer.email2, 
								} 
								)}}
							>
								{this.state.selectedContactPerson === customer.contactPerson2 ?
									<Table.Cell>
									<Label ribbon color="teal">{customer.contactPerson2}</Label>
									</Table.Cell>
									:
									<Table.Cell>{customer.contactPerson2}</Table.Cell>
								}
								<Table.Cell>{customer.contactNumber2}</Table.Cell>
								<Table.Cell>{customer.email2}</Table.Cell>
							</Table.Row>
							: undefined
						}


						{customer.contactPerson3Valid ?
							<Table.Row
								style={{ cursor: "pointer" }}
								onClick={()=>{
									this.setState({ 
											selectedContactPerson: customer.contactPerson3,
											selectedContactNumber: customer.contactNumber3,
											selectedEmail: customer.email3, 
									} 
								)}}
							>
								{this.state.selectedContactPerson === customer.contactPerson3 ?
									<Table.Cell>
									<Label ribbon color="teal">{customer.contactPerson3}</Label>
									</Table.Cell>
									:
									<Table.Cell>{customer.contactPerson3}</Table.Cell>
								}
								<Table.Cell>{customer.contactNumber3}</Table.Cell>
								<Table.Cell>{customer.email3}</Table.Cell>
							</Table.Row>
							: undefined
						}

						{customer.contactPerson4Valid ?
							<Table.Row
								style={{ cursor: "pointer" }}
								onClick={()=>{
									this.setState({ 
											selectedContactPerson: customer.contactPerson4,
											selectedContactNumber: customer.contactNumber4,
											selectedEmail: customer.email4, 
									} 
								)}}
							>
								{this.state.selectedContactPerson === customer.contactPerson4 ?
									<Table.Cell>
									<Label ribbon color="teal">{customer.contactPerson4}</Label>
									</Table.Cell>
									:
									<Table.Cell>{customer.contactPerson4}</Table.Cell>
								}
								<Table.Cell>{customer.contactNumber4}</Table.Cell>
								<Table.Cell>{customer.email4}</Table.Cell>
							</Table.Row>
							: undefined
						}
					</Table.Body>
				</Table>
				</Segment>
				</div>
			)
		}
	} 
}


export default GenerateChallan;
