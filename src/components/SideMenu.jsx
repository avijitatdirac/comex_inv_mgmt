import React from "react";
import { elastic as Menu } from "react-burger-menu";
import { findIndex } from "lodash";
import { history } from "../_helpers";
import { fetchAPI } from "../utility";

class SideMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDashboard: false,
      isAddCustomer: false,
      isManageCustomer: false,
      isAddToInventory: false,
      isOrderAsset: false,
      isEditAssetType: false,
      isManageInventory: false,
      isSavedChallanDrafts: false,
      isSettings: false
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  async fetchUserPrivileges() {
    const promises = [];
    try {
      promises.push(fetchAPI("/user/get_user_privileges", {}));
      promises.push(fetchAPI("/user/check_allow_movement_of_items", {}));
      const [res1, res2] = await Promise.all(promises);
      const data = await res1.json();
      const allowMovement = await res2.json();

      /**
       * below code block will show all side menu links in development env,
       * side menu will show up according to user's privileges in production env,
       * NOTE: this portion of code can be left as it is in production build as well
       */
      if (
        process.env.NODE_ENV === "development" &&
        (!data.result || data.result.length === 0)
      ) {
        const isDashboard = true;
        const isAddCustomer = true;
        const isManageCustomer = true;
        const isAddToInventory = true;
        const isOrderAsset = true;
        const isEditAssetType = true;
        const isManageInventory = true;
        const isSavedChallanDrafts = true;
        const isSettings = true;
        this.setState({
          isDashboard,
          isAddCustomer,
          isManageCustomer,
          isAddToInventory,
          isOrderAsset,
          isEditAssetType,
          isManageInventory,
          isSettings,
          isSavedChallanDrafts
        });
        return;
      }

      const { result } = data;
      const isDashboard = findIndex(result, { privilege_id: 1 }) > -1;
      const isAddCustomer = findIndex(result, { privilege_id: 2 }) > -1;
      const isManageCustomer = findIndex(result, { privilege_id: 3 }) > -1;
      const isAddToInventory = findIndex(result, { privilege_id: 4 }) > -1;
      const isOrderAsset = findIndex(result, { privilege_id: 5 }) > -1;
      const isEditAssetType = findIndex(result, { privilege_id: 6 }) > -1;
      const isManageInventory = findIndex(result, { privilege_id: 7 }) > -1;
      const isSavedChallanDrafts =
        findIndex(result, { privilege_id: 8 }) > -1 &&
        allowMovement.allow_movement_of_items === 1;
      const isSettings = findIndex(result, { privilege_id: 9 }) > -1;
      this.setState({
        isDashboard,
        isAddCustomer,
        isManageCustomer,
        isAddToInventory,
        isOrderAsset,
        isEditAssetType,
        isManageInventory,
        isSettings,
        isSavedChallanDrafts
      });
    } catch (err) {
      console.error(err);
    }
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

  componentDidMount() {
    this.fetchUserPrivileges();
  }

  render() {
    return (
      <div className="customNavMenu">
        <Menu pageWrapId={"page-wrap"} outerContainerId={"outer-container"}>
          {this.state.isDashboard ? (
            <a id="home" className="menu-item" href="/">
              <i className="tachometer alternate icon" /> Dashboard
            </a>
          ) : (
            false
          )}
          {/* {this.state.isAddCustomer ? (
            <a id="insertCustomer" className="menu-item" href="/insertCustomer">
              <i className="user plus icon" /> Add Customer
            </a>
          ) : (
            false
          )} */}
          {this.state.isManageCustomer ? (
            <a id="manageCustomer" className="menu-item" href="/customers">
              <i className="users icon" /> Manage Customer
            </a>
          ) : (
            false
          )}
          {this.state.isAddToInventory ? (
            <a id="addAsset" className="menu-item" href="/addAsset">
              <i className="edit icon" /> Add to Inventory
            </a>
          ) : (
            false
          )}
          {this.state.isOrderAsset ? (
            <a id="displayAssets" className="menu-item" href="/displayAssets">
              <i className="file alternate outline icon" /> Order Asset
            </a>
          ) : (
            false
          )}
          {this.state.isEditAssetType ? (
            <a id="contact" className="menu-item" href="/editAssetType">
              <i className="edit outline icon" /> Edit Asset Types
            </a>
          ) : (
            false
          )}
          {this.state.isManageInventory ? (
            <a id="returnAssets" className="menu-item" href="/returnAssets">
              <i className="cubes icon" /> Manage Inventory
            </a>
          ) : (
            false
          )}
          {this.state.isSavedChallanDrafts ? (
            <a id="challanDraft" className="menu-item" href="/challanDraft">
              <i className="copy outline icon" />
              Saved Challan Drafts
            </a>
          ) : (
            false
          )}
          {this.state.isSettings ? (
            <span id="settings" className="menu-item">
              <i className="cogs icon" /> Settings
              <ul>
                <li>
                  <a href="/addUsers">
                    <i className="angle right icon" />
                    Add User
                  </a>
                </li>
                <li>
                  <a href="/listUsers">
                    <i className="angle right icon" />
                    List User
                  </a>
                </li>
                <li>
                  <a href="/addOrganization">
                    <i className="angle right icon" />
                    Organization
                  </a>
                </li>
                <li>
                  <a href="/branch">
                    <i className="angle right icon" />
                    Branch
                  </a>
                </li>
                <li>
                  <a href="/roles">
                    <i className="angle right icon" />
                    Roles and Privileges
                  </a>
                </li>
                <li>
                  <a href="/vendors">
                    <i className="angle right icon" />
                    Manage Vendor
                  </a>
                </li>
              </ul>
            </span>
          ) : (
            false
          )}

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
