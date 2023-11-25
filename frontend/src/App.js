// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import { Layout, Menu } from "antd";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import Feed from "./components/Posts/Feed";

// const { Header, Content, Footer } = Layout;
// <Layout className="layout">
//   <Header>
//     <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}></Menu>
//   </Header>
//   <Content style={{ padding: "50px" }}></Content>
//   <Footer style={{ textAlign: "center" }}>Your App Name ©2023</Footer>
// </Layout>;
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" component={<Signup />} />
      <Route path="/reset-password" component={<ResetPassword />} />
      <Route path="/feed" component={<Feed />} />
    </Routes>
  );
};

export default App;
