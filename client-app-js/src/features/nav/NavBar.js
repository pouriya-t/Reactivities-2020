import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Link, NavLink } from "react-router-dom";
import { Button, Container, Menu, Dropdown, Image } from "semantic-ui-react";
import Navbar from "react-bootstrap/Navbar";
import { RootStoreContext } from "../../app/stores/rootStore";

const NavBar = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
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
          {user && (
            <Menu.Item position="right">
              <Image
                avatar
                spaced="right"
                src={user.image || "/assets/user.png"}
              />
              <Dropdown pointing="top left" text={user.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/username`}
                    text="My profile"
                    icon="user"
                  />
                  <Dropdown.Item onClick={logout} text="Logout" icon="power" />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          )}
        </Container>
      </Menu>
    </div>
  );
});

export default NavBar;
