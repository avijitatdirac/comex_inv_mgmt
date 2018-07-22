import React from "react";
import { elastic as Menu } from "react-burger-menu";
import { history } from "../_helpers";
import { fetchAPI } from "../utility";

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout(e) {
    e.preventDefault();
    const endpoint = "/login/logout";
    const res = await fetchAPI(endpoint, {});
    const data = await res.json();
    if (data.is_success) {
      history.push("/login");
    }
  }
  render() {
    return (
      <div className="customNavMenu">
        <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
          <a id="home" className="menu-item" href="/">
            <i className="tachometer alternate icon" /> Dashboard
          </a>
          <a id="insertCustomer" className="menu-item" href="/insertCustomer">
            <i className="user plus icon" /> Add Customer
          </a>
          <a id="manageCustomer" className="menu-item" href="/manageCustomer">
            <i className="users icon" /> Manage Customer
          </a>
          <a id="addAsset" className="menu-item" href="/addAsset">
            <i className="edit icon" /> Add to Inventory
          </a>
          <a id="displayAssets" className="menu-item" href="/displayAssets">
            <i className="file alternate outline icon" /> Order Asset
          </a>
          <a id="contact" className="menu-item" href="/editAssetType">
            <i className="edit outline icon" /> Edit Asset Types
          </a>
          <a id="returnAssets" className="menu-item" href="/returnAssets">
            <i className="cubes icon" /> Manage Inventory
          </a>
          <a id="challanDraft" className="menu-item" href="/challanDraft">
            <i className="copy outline icon" />Saved Challan Drafts
          </a>
          <span id="settings" className="menu-item">
            <i className="cogs icon" /> Settings
            <ul>
              <li>
                <a href="/addUsers">
                  <i className="angle right icon" />Add User
                </a>
              </li>
              <li>
                <a href="/listUsers">
                  <i className="angle right icon" />List User
                </a>
              </li>
              <li>
                <a href="/addOrganization">
                  <i className="angle right icon" />Organization
                </a>
              </li>
              {/* <li>
                <a href="/listOrgnization">
                  <i className="angle right icon" />List Organization
                </a>
              </li> */}
            </ul>
          </span>
          <a
            id="home"
            className="menu-item"
            href=""
            onClick={this.handleLogout}
          >
            <i className="sign in alternate icon" /> Logout
          </a>
        </Menu>
      </div>
    );
  }
}

export default SideMenu;
