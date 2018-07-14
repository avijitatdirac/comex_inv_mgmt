import React, { Component } from 'react'
import { Form, Icon, Button,Segment,Divider,Input,Header,Transition } from 'semantic-ui-react'
import {notify} from '../Classes';
class InsertCustomer extends Component
{

    constructor(props) {
        super(props);
    
        this.state = {
            CName:"",
            PanNumber:"",
            Comments:"",
            Cin:"",
            customerRoles:[],
            visibleRol1:false,
            CNameError: false,
            PincodeError: false,
            PanNumberError:false,
            formSubmitSuccess:false,
            addressError:false,
            gstError:false,
            contactPersonError:false,
            contactNumberError:false,
            emailError:false,
            roleError:false,
            cinError:false,

            customerAddress : [{
            id:null,
            Address:"",
            City:"",
            State:"",
            Pincode:"",
            GSTValue:"",
            ContactPerson1:"",
            ContactNumber1:"",
            Email1:"",
            ContactRole1:"",
            ContactPerson2:"",
            ContactNumber2:"",
            Email2:"",
            ContactRole2:"",
            ContactPerson3:"",
            ContactNumber3:"",
            Email3:"",
            ContactRole3:"",
            ContactPerson4:"",
            ContactNumber4:"",
            Email4:"",
            ContactRole4:"",
            SEZ:false,
            isMain:false,
            }]

        }
        // preserve the initial state in a new object
        this.baseState = this.state
    }

    componentWillMount()
    {
      fetch(`/get_customer_roles`,{ method: 'GET' })
      .then(r => r.json())
      .then(data => {
              console.log(data)
              var rolelist= new Array()
                  data.customerRoles.forEach(role => {
                    rolelist=rolelist.concat({	
                      key: role.customer_role_id, 
                      value: role.customer_role_name, 
                      text: role.customer_role_name						
                              })                    
                    })               
              this.setState({
                  customerRoles:rolelist,
                  visibleRol1:true
              })
      })
          .catch(err => console.log(err))
      }

    


  onChangeName = (event)          => this.setState({ CName: event.target.value });
  onChangeCity = (event)          => this.setState({ City: event.target.value });
  onChangeState = (event)          => this.setState({ State: event.target.value });
  onChangePincode = (event)          => this.setState({ Pincode: event.target.value });
  onChangePanNumber = (event)          => this.setState({ PanNumber: event.target.value });
  onChangeComments = (event)          => this.setState({ Comments: event.target.value });
  onChangeCin = (event)          => this.setState({ Cin: event.target.value });

  handleCustomerSubmission = () => 
  {
    var aerror,perror,gerror,cperror,cnerror,eerror
    var l=this.state.customerAddress.length-1;
    if(this.state.customerAddress[l].Address === '' ||
    this.state.customerAddress[l].Pincode.length!==6 || !/^\d+$/.test(this.state.customerAddress[l].Pincode) ||
    (this.state.customerAddress[l].GSTValue ==='') ||(this.state.customerAddress[l].ContactRole1 ==='') ||
    this.state.customerAddress[l].ContactPerson1 === '' || !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[l].ContactRole1) ||
    (this.state.customerAddress[l].ContactNumber1.length!==8 && this.state.customerAddress[l].ContactNumber1.length!==10) ||
    !/^\d+$/.test(this.state.customerAddress[l].ContactNumber1) ||
    this.state.customerAddress[l].Email1 === '' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.customerAddress[l].Email1)
    )
    //alert("Please Enter relevant Address Data. Press 'Add More' to Check where the Problem is")
    {
      if(this.state.customerAddress[l].Address === '')
      // alert("Please Enter valid Address")
       aerror=true
       if(this.state.customerAddress[l].Pincode.length!==6 || !/^\d+$/.test(this.state.customerAddress[l].Pincode))
       perror=true
       if(this.state.customerAddress[l].GSTValue ==='')
       //alert("Please Enter valid GST Address")
       gerror=true
       if(this.state.customerAddress[l].ContactPerson1 === '' || !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[l].ContactPerson1))
       //alert("Please Enter valid name")
       cperror=true
       if((this.state.customerAddress[l].ContactNumber1.length!==8 && this.state.customerAddress[l].ContactNumber1.length!==10) ||
       !/^\d+$/.test(this.state.customerAddress[l].ContactNumber1))
       //alert("Please Enter a valid Main Contact Number")
       cnerror=true
       if(this.state.customerAddress[l].Email1 === '' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.customerAddress[l].Email1))
       //alert("Please Enter a valid Main Email")
       eerror=true
       this.setState({
        addressError:aerror,
        PincodeError:perror,
        gstError:gerror,
        contactPersonError:cperror,
        contactNumberError:cnerror,
        emailError:eerror
      })
    }
    else
   {

    var errorCName = true;
    var scname;
    if (!this.state.CName ||this.state.CName === '' || !/^[a-zA-Z_.-\s]*$/.test(this.state.CName)) {
      errorCName = true
    } else {
      var str=this.state.CName.toLowerCase()
      scname=str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
      errorCName = false
    }
    var cinNumberError=false;
    if(this.state.Cin.length < 21) 
    {
      cinNumberError=true
      notify.error('Customer CIN should be greater than 20 characters!')
    } 

    var errorPanNumber=true;
    if(this.state.PanNumber === '') {
        errorPanNumber=true
    } else{
        errorPanNumber=false
    }

    if(!errorCName 
        && !errorPanNumber
    )
    {
      submitSuccess=true
    }

    var submitSuccess;
    this.setState({
        CName:scname,
        CNameError: errorCName,
        PanNumberError:errorPanNumber,
        cinError:cinNumberError,       
        customerAddress:this.state.customerAddress
    },this.commitCustomer)

  }
  

  }

  resetForm = () => {
    this.setState(this.baseState)
  }

  commitCustomer = () =>
  {
    if(!this.state.CNameError 
        &&
        !this.state.PanNumberError
        &&
        !this.state.cinError
    )
    {        
        fetch(`/insert_customer?cin=${this.state.Cin}&customer_name=${this.state.CName}&pan_number=${this.state.PanNumber}&comments=${this.state.Comments}&address=${JSON.stringify(this.state.customerAddress, null, 2)}`,
        {method:'POST'})
        .then(r => r.json())
        .then(data => {
          this.resetForm();
          notify.successBottom("Customer details have been entered");
          this.setState({ formSubmitSuccess:true,});
        })
        .catch(err => console.log(err))
    }
    else
    {
        notify.errorBottom("Please check your fields!!!There seems to be a problem");

    }
  }

  handleCustomerAddressChange = (idx) => (evt) => {
    
    const newAddress = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Address: evt.target.value,};
    });
    this.setState({ customerAddress: newAddress });
  }

  handleCustomerCityChange = (idx) => (evt) => {
    
    const newCity = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, City: evt.target.value,};
    });
    this.setState({ customerAddress: newCity });
  }

  handleCustomerStateChange = (idx) => (evt) => {
    
    const newState = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, State: evt.target.value,};
    });
    this.setState({ customerAddress: newState });
  }

  handleCustomerPincodeChange = (idx) => (evt) => {
    
    const newPincode = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Pincode: evt.target.value,};
    });
    this.setState({ customerAddress: newPincode });
  }

  handleCustomerGSTChange = (idx) => (evt) => {
    
    const newGST = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, GSTValue: evt.target.value,};
    });
    this.setState({ customerAddress: newGST });
  }

  handleCustomerContactPersonNameChange1 = (idx) => (evt) => {
    
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson1: evt.target.value,};
    });
    this.setState({ customerAddress: ContactPerson });
  }

  handleCustomerContactChange1 = (idx) => (evt) => {
    
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber1: evt.target.value,};
    });
    this.setState({ customerAddress: Contact });
  }



  handleCustomerEmailChange1 = (idx) => (evt) => {
    
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email1: evt.target.value,};
    });
    this.setState({ customerAddress: Email });
  }

  handleCustomerContactPersonNameChange2 = (idx) => (evt) => {
    
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson2: evt.target.value,};
    });
    this.setState({ customerAddress: ContactPerson });
  }

  handleCustomerContactChange2 = (idx) => (evt) => {
    
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber2: evt.target.value,};
    });
    this.setState({ customerAddress: Contact });
  }



  handleCustomerEmailChange2 = (idx) => (evt) => {
    
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email2: evt.target.value,};
    });
    this.setState({ customerAddress: Email });
  }

  handleCustomerContactPersonNameChange3 = (idx) => (evt) => {
    
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson3: evt.target.value,};
    });
    this.setState({ customerAddress: ContactPerson });
  }

  handleCustomerContactChange3 = (idx) => (evt) => {
    
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber3: evt.target.value,};
    });
    this.setState({ customerAddress: Contact });
  }



  handleCustomerEmailChange3 = (idx) => (evt) => {
    
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email3: evt.target.value,};
    });
    this.setState({ customerAddress: Email });
  }

  handleCustomerContactPersonNameChange4 = (idx) => (evt) => {
    
    const ContactPerson = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactPerson4: evt.target.value,};
    });
    this.setState({ customerAddress: ContactPerson });
  }

  handleCustomerContactChange4 = (idx) => (evt) => {
    
    const Contact = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactNumber4: evt.target.value,};
    });
    this.setState({ customerAddress: Contact });
  }



  handleCustomerEmailChange4 = (idx) => (evt) => {
    
    const Email = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, Email4: evt.target.value,};
    });
    this.setState({ customerAddress: Email });
  }

  /*handleCustomerRoleChange1 = (idx) => (evt) => {
      // alert(evt.target.value)
    console.log('handleCustomerRoleChange1= '+evt.target.value);
    console.log(evt ,'IDX= ' +idx);
    const CustomerRole = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;      
      return { ...attribute, id: idx, ContactRole1: evt.target.value,};
    });
   // console.log('CustomerRole',CustomerRole);
    this.setState({ customerAddress: CustomerRole });
    //console.warm(CustomerRole)
    
  }*/

  handleCustomerRoleChange1 = (idx,dataValue)  => {  
  const CustomerRole = this.state.customerAddress.map((attribute, sidx) => {
    if (idx !== sidx) return attribute;      
    return { ...attribute, id: idx, ContactRole1: dataValue,};
  }); 
  this.setState({ customerAddress: CustomerRole });
}


  handleCustomerRoleChange2 =  (idx,dataValue) => {
    
    const CustomerRole = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactRole2: dataValue,};
    });
    this.setState({ customerAddress: CustomerRole });
  }
  handleCustomerRoleChange3 = (idx,dataValue) => {
    
    const CustomerRole = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactRole3: dataValue,};
    });
    this.setState({ customerAddress: CustomerRole });
  }
  handleCustomerRoleChange4 = (idx,dataValue) => {    
    const CustomerRole = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, id: idx, ContactRole4: dataValue,};
    });
    this.setState({ customerAddress: CustomerRole });
  }


  onMainAddressChange = (idx) => (evt) => {

    const AddressChange = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, isMain: evt.target.checked };
    });
    this.setState({ customerAddress: AddressChange });
  }

  onSEZChange = (idx) => (evt) => {

    const newAttribute = this.state.customerAddress.map((attribute, sidx) => {
      if (idx !== sidx) return attribute;
      return { ...attribute, SEZ: evt.target.checked };
    });
    this.setState({ customerAddress: newAttribute });
  }

  handleAddressRemove = (idx) => () => {
    //console.log(idx)
    if(this.state.customerAddress.length!==1)
    {
      this.setState({
        customerAddress: this.state.customerAddress.filter((s, sidx) => idx !== sidx)
      })
    }
  }

  handleAddressAdd = (idx) => () => 
  {
     //  console.log("hello")
     var aerror,perror,gerror,cperror,cnerror,eerror
    if(this.state.customerAddress[idx].Address === '' ||
      this.state.customerAddress[idx].Pincode.length!==6 || !/^\d+$/.test(this.state.customerAddress[idx].Pincode) ||
      (this.state.customerAddress[idx].GSTValue ==='') ||
      this.state.customerAddress[idx].ContactPerson1 === '' || !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[idx].ContactPerson1) ||
      (this.state.customerAddress[idx].ContactNumber1.length!==8 && this.state.customerAddress[idx].ContactNumber1.length!==10) ||
      !/^\d+$/.test(this.state.customerAddress[idx].ContactNumber1) ||
      this.state.customerAddress[idx].Email1 === '' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.customerAddress[idx].Email1)
      )
    {
        if(this.state.customerAddress[idx].Address === '')
       // alert("Please Enter valid Address")
        aerror=true
        if(this.state.customerAddress[idx].Pincode.length!==6 || !/^\d+$/.test(this.state.customerAddress[idx].Pincode))
        perror=true
        if(this.state.customerAddress[idx].GSTValue ==='')
        //alert("Please Enter valid GST Address")
        gerror=true
        if(this.state.customerAddress[idx].ContactPerson1 === '' || !/^[a-zA-Z\s]*$/.test(this.state.customerAddress[idx].ContactPerson1))
        //alert("Please Enter valid name")
        cperror=true
        if((this.state.customerAddress[idx].ContactNumber1.length!==8 && this.state.customerAddress[idx].ContactNumber1.length!==10) ||
        !/^\d+$/.test(this.state.customerAddress[idx].ContactNumber1))
        //alert("Please Enter a valid Main Contact Number")
        cnerror=true
        if(this.state.customerAddress[idx].Email1 === '' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.customerAddress[idx].Email1))
        //alert("Please Enter a valid Main Email")
        eerror=true
    }

     this.setState({
       addressError:aerror,
       PincodeError:perror,
       gstError:gerror,
       contactPersonError:cperror,
       contactNumberError:cnerror,
       emailError:eerror
     },this.setAddForm)
  }

  setAddForm = () =>
  {
    if(!this.state.addressError && !this.state.gstError &&
       !this.state.contactPersonError && !this.state.contactNumberError &&
       !this.state.emailError &&
       !this.state.PincodeError && !this.state.cinError
    )
    {
      this.setState({
        customerAddress: this.state.customerAddress.concat([{
          Address:"",
          City:"",
          State:"",
          Pincode:"",
          GSTValue:"",
          ContactPerson1:"",
          ContactNumber1:"",
          Email1:"",
          ContactRole1:"",
          ContactPerson2:"",
          ContactNumber2:"",
          Email2:"",
          ContactRole2:"",
          ContactPerson3:"",
          ContactNumber3:"",
          Email3:"",
          ContactRole3:"",
          ContactPerson4:"",
          ContactNumber4:"",
          Email4:"",
          ContactRole4:"",
          SEZ:false,
          isMain:false,
        }])
      });
    }
  }

        renderCustomerAddressForm()
        {

           var addressrender,gstrender,pincoderender,contactpersonrender,contactnumberrender,emailrender,rolerender;
           if(this.state.addressError)
           {
            addressrender = <div className="ui red pointing basic label">Please enter a valid Address</div>
           }
           else
           addressrender=undefined

           if(this.state.PincodeError)
           {
            pincoderender = <div className="ui red left pointing basic label">Please enter a valid pincode</div>
           }
           else
           pincoderender=undefined

           if(this.state.gstError)
           {
            gstrender = <div className="ui red pointing basic label">Please enter a valid GST or enter NA</div>
           }
           else
           gstrender=undefined

           if(this.state.contactNumberError)
           {
            contactnumberrender = <div className="ui red basic pointing basic label">Please enter a valid Contact Number</div>
           }
           else
           contactnumberrender=undefined

           if(this.state.contactPersonError)
           {
            contactpersonrender = <div className="ui red left pointing basic label">Please enter a valid Contact Person Name</div>
           }
           else
           contactpersonrender=undefined

           if(this.state.emailError)
           {
            emailrender = <div className="ui red basic pointing basic label">Please enter a valid Email</div>
           }
           if(this.state.roleError)
           {
            rolerender = <div className="ui red basic pointing basic label">Please select a valid Role</div>
           }
           else
           rolerender=undefined
            //console.log(this.state)
            return (
                <div>
                {this.state.customerAddress.map((attribute, idx) => {return(

                    <Form key={idx + 1}>
                    <Form.TextArea label={`Address #${idx + 1}`} value={attribute.Address} placeholder='Enter Address' onChange={this.handleCustomerAddressChange(idx)} />
                    {(idx===this.state.customerAddress.length-1)
                    ?
                    addressrender
                    :
                    undefined
                    }
                    <Form.Group>
                    <Form.Input  label='City' value={attribute.City}  placeholder='Enter City' onChange={this.handleCustomerCityChange(idx)} />
                    <Form.Input  label='State' value={attribute.State}  placeholder='Enter State' onChange={this.handleCustomerStateChange(idx)} />
                    <Form.Input  label='Pincode' value={attribute.Pincode} icon='star'  placeholder='Enter Pincode' onChange={this.handleCustomerPincodeChange(idx)} />
                    {(idx===this.state.customerAddress.length-1)
                    ?
                    pincoderender
                    :
                    undefined
                    }
                    </Form.Group>
                    <Form.Group inline>
                    <Form.Input type="Checkbox" label="Main Address" defaultChecked="true" checked={attribute.isMain}  onChange={this.onMainAddressChange(idx)}/>
                      <Form.Input type="Checkbox" label="SEZ" defaultChecked="true" checked={attribute.SEZ} onChange={this.onSEZChange(idx)}/>
                    </Form.Group>
                    <Divider />
                    <Form.Input  label='GST' value={attribute.GSTValue}  placeholder='GST' width={10} onChange={this.handleCustomerGSTChange(idx)} />
                    {(idx===this.state.customerAddress.length-1)
                    ?
                    gstrender
                    :
                    undefined
                    }
                    <Form.Group>
                  
                        <Form.Input  icon='star' color='red' value={attribute.ContactPerson1} fluid label='Main Contact Person' width={8} placeholder='Enter Contact Person' onChange={this.handleCustomerContactPersonNameChange1(idx)} />
                        
                        {(idx===this.state.customerAddress.length-1)
                        ?
                        contactpersonrender
                        :
                        undefined
                        }
                      
                    <div>
                      <Form.Input  label='Main Contact Number' value={attribute.ContactNumber1} icon='star' placeholder='Enter Contact Number' onChange={this.handleCustomerContactChange1(idx)} />
                      {(idx===this.state.customerAddress.length-1)
                      ?
                      contactnumberrender
                      :
                      undefined
                      }
                   </div>
                   <div>
                      <Form.Input  label='Main Email' icon='star' value={attribute.Email1} placeholder='Enter Email' onChange={this.handleCustomerEmailChange1(idx)} />
                      {(idx===this.state.customerAddress.length-1)
                      ?
                      emailrender
                      :
                      undefined
                      }
                    </div>
                    { this.state.visibleRol1 &&(
                      
                        <Form.Select
                        onChange={(e,data)=>{
                          this.handleCustomerRoleChange1(idx ,data.value)
                        } }
                        value={attribute.ContactRole1}
                        size="small"
                        label="Branch"
                        style={{ maxWidth: "400px" }}
                        placeholder="Select Branch"
                        options={this.state.customerRoles}  />
                       
                    ) }                     

                    <Divider />

                    </Form.Group>


                    <Divider/>
                    <Header>Alternate Contact Information</Header>
                    <Form.Group>
                    <Form.Input  value={attribute.ContactPerson2} fluid label='Contact Person' width={8} placeholder='Enter Contact Person' onChange={this.handleCustomerContactPersonNameChange2(idx)} />
                    <Form.Input  label='Contact Number'  width={3} value={attribute.ContactNumber2}  placeholder='Enter Contact Number' onChange={this.handleCustomerContactChange2(idx)} />
                    <Form.Input  label='Email' value={attribute.Email2} placeholder='Enter Email' onChange={this.handleCustomerEmailChange2(idx)} />
                    <Form.Dropdown  
                          label='Role'
                          width={4}
                          fluid
                          selection
                          icon='search'
						              search
                          value={attribute.ContactRole2}
                          //placeholder="Select a Role"
                          options={this.state.customerRoles}
                          onChange={(e,data)=>{

                            this.handleCustomerRoleChange2(idx ,data.value)
                          } }
                         
                    />
                    </Form.Group>
                    <Form.Group >
                    <Form.Input  value={attribute.ContactPerson3} fluid label='Contact Person' width={8} placeholder='Enter Contact Person' onChange={this.handleCustomerContactPersonNameChange3(idx)} />
                    <Form.Input  label='Contact Number'  width={3} value={attribute.ContactNumber3}  placeholder='Enter Contact Number' onChange={this.handleCustomerContactChange3(idx)} />
                    <Form.Input  label='Email' value={attribute.Email3} placeholder='Enter Email' onChange={this.handleCustomerEmailChange3(idx)} />
                    <Form.Dropdown
                          label='Role'  
                          width={4}
                          fluid
                          selection
                          icon='search'
						              search
                          value={attribute.ContactRole3}
                          //placeholder="Select a Role"
                          options={this.state.customerRoles}
                          onChange={(e,data)=>{
                            this.handleCustomerRoleChange3(idx ,data.value)
                          } } 
                    />
                    </Form.Group>
                    <Form.Group >
                    <Form.Input  value={attribute.ContactPerson4} fluid label='Contact Person' width={8} placeholder='Enter Contact Person' onChange={this.handleCustomerContactPersonNameChange4(idx)} />
                    <Form.Input  label='Contact Number' width={3} value={attribute.ContactNumber4}  placeholder='Enter Contact Number' onChange={this.handleCustomerContactChange4(idx)} />
                    <Form.Input  label='Email' value={attribute.Email4} placeholder='Enter Email' onChange={this.handleCustomerEmailChange4(idx)} />
                    <Form.Dropdown  
                          label='Role'
                          width={4}
                          fluid
                          selection
                          icon='search'
						              search
                          value={attribute.ContactRole4}
                          //placeholder="Select a Role"
                          options={this.state.customerRoles}                         
                          onChange={(e,data)=>{
                            this.handleCustomerRoleChange4(idx ,data.value)
                          } }
                    />
                    </Form.Group>
                    <Form.Group >
                    <Button onClick={this.handleAddressRemove(idx)}><Icon name="minus square outline"  />Remove</Button>
                    {(idx===this.state.customerAddress.length-1) 
                    ?  
                    <Button onClick={this.handleAddressAdd(idx)}><Icon name="plus" />Add More</Button>
                    :
                    undefined}
                    </Form.Group>
                    </Form>
                )})}
                 <center><Button width="100px" color="green" onClick={this.handleCustomerSubmission} icon="add user" label="Add Customer" /></center>
                </div>
            )

        }

        render()
        {
            var rendercname,renderpannumber,render_cin;

            if (this.state.CNameError) {
                rendercname = <div className="ui red pointing basic label">Please enter a valid name</div>
            }
            else
              rendercname = undefined 
          
              if (this.state.cinError) {
                render_cin = <div className="ui red pointing basic label">Please enter a valid CIN</div>
              }
              else
              render_cin = undefined
                    
            if (this.state.PanNumberError) {
                renderpannumber = <div className="ui red pointing basic label">Please enter a valid pan-number</div>
            }
            else
                renderpannumber = undefined     

                var formsubmit=undefined;
                if(this.state.formSubmitSuccess)
                {
                  formsubmit = <div class="ui success message">
                    <div class="content">
                      <div class="header">Success!!!</div>
                      <p>Customer details have been entered.</p>
                    </div>
                  </div>
                }    

            return(
                <div className="page">
                    <h1>Add Customer</h1>
                    <Segment>
                        <Form>
                            <Form.Field className="ui required field">
                                <label>Name</label>
                                <input id="CName" placeholder="Name" onChange={this.onChangeName} />
                                {rendercname}
                            </Form.Field>
                            <Form.Field className="ui required field">
                                <label>Pan Number</label>
                                <input id="PanNumber" placeholder="PanNumber" onChange={this.onChangePanNumber} />
                                {renderpannumber}
                            </Form.Field>
                            <Form.Field className="ui required field">
                                <label>Customer CIN </label>
                                <input id="CustomerCIN" placeholder="Enter CIN" onChange={this.onChangeCin} />
                                {render_cin}
                            </Form.Field>
                            <Form.TextArea label='Comments' placeholder='Add Comments...' onChange={this.onChangeComments} />
                        </Form>
                        </Segment>
                        <Segment>
                        {this.renderCustomerAddressForm()}
                        <Divider />
                        <div>
                            {formsubmit}
                        </div>
                    </Segment>
                </div>
            )
        }


    

}

export default InsertCustomer;
