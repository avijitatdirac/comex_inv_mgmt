import React from "react";
import { elastic as Menu } from "react-burger-menu";
export default class SideMenu extends React.Component {
componentDidMount(){
     
     

}
render(){

  

  return (
    <div className="customNavMenu">
      <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
        <a id="home" className="menu-item" href="/">
          <i className="tachometer alternate icon"></i> Dashboard
        </a>
        <a id="insertCustomer" className="menu-item" href="/insertCustomer">
         <i className="user plus icon"></i> Add Customer
        </a>
        <a id="manageCustomer" className="menu-item" href="/manageCustomer">
         <i className="users icon"></i> Manage Customer
        </a>
        <a id="addAsset" className="menu-item" href="/addAsset">
         <i className="edit icon"></i> Add to Inventory
        </a>
        <a id="displayAssets" className="menu-item" href="/displayAssets" >
          <i className="file alternate outline icon"></i> Order Asset
        </a>
        <a id="contact" className="menu-item" href="/editAssetType">
          <i className="edit outline icon"></i> Edit Asset Types
        </a>
        <a id="returnAssets" className="menu-item" href="/returnAssets">
          <i className="cubes icon"></i> Manage Inventory
        </a>
        <a id="challanDraft" className="menu-item" href="/challanDraft">
          <i className="copy outline icon"></i>Saved Challan Drafts
        </a>
        <a id="settings" className="menu-item" href="/settings">
          <i className="cogs icon"></i>  Settings
          <ul>
            <li><a  href="/addUsers"><i className="angle right icon"></i>Add User</a></li>
            <li><a  href="/listUsers"><i className="angle right icon"></i>List User</a></li>
            <li><a href="/addOrganization"><i className="angle right icon"></i>Add Organization</a></li>
            <li><a href="/listOrgnization"><i className="angle right icon"></i>List Organization</a></li>
          </ul>
        </a>
        <a id="home" className="menu-item" href="/login">
          <i className="sign in alternate icon"></i> Logout
        </a>
      </Menu>
    </div>
  );
}  

}