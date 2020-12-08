// import { Fragment, default as React } from "react";
import { Fragment, useContext } from "react";
import { Item } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";

const ActivityList = () => {
  const activityStore = useContext(ActivityStore);
  const { activitiesByDate } = activityStore;

  // return <div>Hello</div>;

  return (
    <Fragment>
        <Fragment>
          <Item.Group divided>
            {activitiesByDate.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
    </Fragment>
  );
};

export default observer(ActivityList);
