import React from "react";
import { Grid, List } from "semantic-ui-react";
import ActivityList from "./ActivityList";

const ActivityDashboard = ({ activities }) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} />
        {/* <List>
          {activities.map((activity) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List> */}
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;