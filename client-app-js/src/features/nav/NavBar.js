import { observer } from "mobx-react-lite";
import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu } from "semantic-ui-react";
import Navbar from "react-bootstrap/Navbar";

const NavBar = () => {
  return (
    <div style={{ marginBottom: "135px" }}>
      <Menu stackable fixed="top" inverted>
        <Container>
          <Menu.Item header as={NavLink} exact to="/">
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "10px" }}
            />
            Reactivities
          </Menu.Item>
          <Navbar expand="lg">
            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              style={{ color: "white", margin: 10, backgroundColor: "#cce2ff" }}
            />
            <Navbar.Collapse id="basic-navbar-nav">
              <Menu.Item name="Activities" as={NavLink} to="/activities" />
              <Menu.Item>
                <Button
                  as={NavLink}
                  to="/createActivity"
                  positive
                  content="Create Activity"
                />
              </Menu.Item>
            </Navbar.Collapse>
          </Navbar>
        </Container>
      </Menu>
    </div>
  );
};

export default observer(NavBar);
