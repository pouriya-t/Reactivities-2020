import React, { useState } from "react";
import { useContext } from "react";
import { Tab, Grid, Header, Button } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser, updateProfile } = rootStore.profileStore;

  const [addAboutMode, setAddAboutMode] = useState(true);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={addAboutMode ? "Edit Profile" : "Cancel"}
              onClick={() => setAddAboutMode(!addAboutMode)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addAboutMode ? (
            <div style={{ marginTop: "30px" }}>
              <h4>{profile?.bio}</h4>
            </div>
          ) : (
            <div style={{ padding: "3%" }}>
              <ProfileEditForm
                profile={profile!}
                updateProfile={updateProfile}
              />
            </div>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default ProfileDescription;
