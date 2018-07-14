import React, { Component } from 'react'
import { Form, Icon, Button,Segment,Divider,Input,Header,Transition,Dimmer,Loader,Label } from 'semantic-ui-react'
import { notify } from '../Classes';
const branchOptions = [
	{ key: 'a', text: 'Pune', value: 'Pune' },
	{ key: 'b', text: 'Bangalore', value: 'Bangalore' },
	{ key: 'c', text: 'Kolkata', value: 'Kolkata' }
  ]

export default class ListUsers extends Component
{
    constructor(props){
     super(props)
     this.state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        Phone: "",
        branch: "",     
        submitted: false, 
        dimmerActive:false,
        customerRoles:[],
        role:""   
      };
      this.handleChange = this.handleChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
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
    
    handleChange(e) {

        const { name, value } = e.target;
        console.log('event',e.target)
        this.setState({ [name]: value });        
    }    
    handleSubmit(e) 
    {  

    e.preventDefault();
    this.setState({ submitted: true });
  }  
   onChangeBranch = (evt, data) => this.setState({branch: data.value});
   onChangeRole = (evt, data) => this.setState({role: data.value});
   render()
   {
    const { dimmerActive ,submitted,branch,customerRoles,role} = this.state
     
       return (
        <div >
        <Dimmer.Dimmable as={Segment} dimmed={dimmerActive}>
            <Dimmer active={dimmerActive} inverted>
                <Loader>Submitting Data</Loader>
            </Dimmer>
            <h1>Users List</h1>

           <Segment>
                <div style={{}}>
                   </div>
                   <Divider />
                   <div>
                       <Label as='a' color='violet' ><Icon name="user" />User Details</Label>
                       <Form>
                           <Form.Group>
                               <Form.Input label="First Name" value="" onChange={this.nameChange} />
                               <Form.Input label="Last Name" value="" />
                               <Form.Input label="Email" value="" />
                               <Form.Input label="Phone" value="" />
                               <Form.Select
                                onChange={this.onChangeRole}
                                value={role}
                                size="small"
                                label="Role"                               
                                placeholder="Select Branch"
                                name="role"
                                options={customerRoles}
                            />
                            <Form.Select
                                onChange={this.onChangeBranch}
                                value={branch}
                                name='branch'
                                size="small"
                                label="Branch"                               
                                placeholder="Select Branch"
                                options={branchOptions}
                            />
                              
                           </Form.Group>
                       </Form>
                   </div>
                

           </Segment>
           </Dimmer.Dimmable>
              <div style={{ 'height':'80px'}}></div>
        </div>
       )
   }

       
}