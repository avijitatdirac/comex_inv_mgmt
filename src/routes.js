import React from "react";
import Loadable from "react-loadable";
import DefaultLayout from "./containers/DefaultLayout";

function Loading() {
  return <div>Loading...</div>;
}
const AddAsset = Loadable({
  loader: () => import("./pages/AddAsset"),
  loading: Loading
});

const Dashboard = Loadable({
  loader: () => import("./pages/Dashboard"),
  loading: Loading
});

const RemoveAsset = Loadable({
  loader: () => import("./pages/RemoveAsset"),
  loading: Loading
});

const DisplayAssets = Loadable({
  loader: () => import("./pages/DisplayAssets"),
  loading: Loading
});
const AddAddress = Loadable({
  loader: () => import("./pages/AddAddress"),
  loading: Loading
});
const UpgradeWarranty = Loadable({
  loader: () => import("./pages/UpgradeWarranty"),
  loading: Loading
});
const AddAssetType = Loadable({
  loader: () => import("./pages/AddAssetType"),
  loading: Loading
});
const ReturnAssets = Loadable({
  loader: () => import("./pages/ReturnAssets"),
  loading: Loading
});
const AssetAddition = Loadable({
  loader: () => import("./pages/AssetAddition"),
  loading: Loading
});

const EditAssetType = Loadable({
  loader: () => import("./pages/EditAssetType"),
  loading: Loading
});
const ManageCustomer = Loadable({
  loader: () => import("./pages/ManageCustomer"),
  loading: Loading
});
const InsertCustomer = Loadable({
  loader: () => import("./pages/InsertCustomer"),
  loading: Loading
});
const ChallanDraft = Loadable({
  loader: () => import("./pages/ChallanDraft"),
  loading: Loading
});
const AddUsers = Loadable({
  loader: () => import("./pages/AddUsers"),
  loading: Loading
});
const AddOrganization = Loadable({
  loader: () => import("./pages/AddOrganization.jsx"),
  loading: Loading
});
const ListUsers = Loadable({
  loader: () => import("./pages/ListUsers.jsx"),
  loading: Loading
});
const ListOrgnization = Loadable({
  loader: () => import("./pages/ListOrgnization.jsx"),
  loading: Loading
});

const Branch = Loadable({
  loader: () => import("./pages/Branch"),
  loading: Loading
});

const Roles = Loadable({
  loader: () => import("./pages/Roles"),
  loading: Loading
});

const routes = [
  { path: "/", exact: true, name: "dashboard", component: DefaultLayout },
  { path: "/addAsset", name: "AddAsset", component: AddAsset },
  { path: "/dashboard", name: "dashboard", component: Dashboard },
  { path: "/home", name: "dashboard", component: Dashboard },
  { path: "/addAssetType", name: "AddAssetType", component: AddAssetType },
  { path: "/returnAssets", name: "ReturnAssets", component: ReturnAssets },
  { path: "/editAssetType", name: "EditAssetType", component: EditAssetType },
  {
    path: "/manageCustomer",
    name: "ManageCustomer",
    component: ManageCustomer
  },
  {
    path: "/insertCustomer",
    name: "InsertCustomer",
    component: InsertCustomer
  },
  { path: "/challanDraft", name: "ChallanDraft", component: ChallanDraft },
  { path: "/addAddress", name: "AddAddress", component: AddAddress },
  { path: "/assetAddition", name: "AssetAddition", component: AssetAddition },
  {
    path: "/upgradeWarranty",
    name: "UpgradeWarranty",
    component: UpgradeWarranty
  },
  { path: "/displayAssets", name: "DisplayAssets", component: DisplayAssets },
  { path: "/removeAsset", name: "RemoveAsset", component: RemoveAsset },
  { path: "/addUsers", name: "AddUsers", component: AddUsers },
  {
    path: "/addOrganization",
    name: "AddOrganization",
    component: AddOrganization
  },
  { path: "/listUsers", name: "ListUsers", component: ListUsers },
  {
    path: "/listOrgnization",
    name: "ListOrgnization",
    component: ListOrgnization
  },
  { path: "/branch", name: "Branch", component: Branch },
  { path: "/roles", name: "Roles", component: Roles }
];

export default routes;
