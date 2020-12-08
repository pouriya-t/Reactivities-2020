import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import "./styles.css";
import { observer } from "mobx-react-lite";
import { Route } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NavBar from "../../features/nav/NavBar";
import HomePage from "../../features/home/HomePage";
import ActivityForm from '../../features/activities/form/ActivityForm'

const App = observer(({ location }) => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container>
              <Route exact path="/activities" component={ActivityDashboard} />
              <Route path="/activities/:id" component={ActivityDetails} />
              <Route
                // key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
});

export default App;
