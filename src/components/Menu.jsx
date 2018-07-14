import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import {history} from '../_helpers'
export default class MainMenu extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => {this.setState({ activeItem: name })
   if(name === 'Add to Inventory'){
       name = 'addAsset'
   }
   if(name === 'Order Asset'){
    name = 'displayAssets'
   }
   if(name === 'Edit Asset Types'){
    name = 'editAssetType'
   }
   if(name === 'Manage Inventory'){
     name = 'returnAssets'
   }
   if(name === 'Saved Challan Drafts'){
    name = 'challanDraft'
  }
   
  
     history.push(name) 
}

  render() {
    const { activeItem } = this.state

    return (
      <Menu inverted>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          name='insertCustomer'
          active={activeItem === 'insertCustomer'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='manageCustomer'
          active={activeItem === 'manageCustomer'}
          onClick={this.handleItemClick}
        />
         <Menu.Item
          name='Add to Inventory'
          active={activeItem === 'Add to Inventory'}
          onClick={this.handleItemClick}
        />
         <Menu.Item
          name='Order Asset'
          active={activeItem === 'Order Asset'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='Edit Asset Types'
          active={activeItem === 'Edit Asset Types'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          name='Saved Challan Drafts'
          active={activeItem === 'Saved Challan Drafts'}
          onClick={this.handleItemClick}
        />
      </Menu>
    )
  }
}
