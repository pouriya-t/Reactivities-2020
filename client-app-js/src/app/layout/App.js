import React, { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import { observer } from "mobx-react-lite";
import { Route, Switch,withRouter } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NavBar from "../../features/nav/NavBar";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import { RootStoreContext } from "../stores/rootStore";
import ProfilePage from "../../features/profiles/ProfilePage";

const App = () => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [getUser, setAppLoaded, token]);

  if (!appLoaded) return <LoadingComponent content="Loading App..." />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container>
              <Switch>
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route path="/activities/:id" component={ActivityDetails} />
                <Route
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <Route path="/profile/:username" component={ProfilePage} />
                <Route exact component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
