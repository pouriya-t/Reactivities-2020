import {
  action,
  computed,
  makeAutoObservable,
  observable,
  runInAction,
  reaction,
} from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";

export default class ProfileStore {
  rootStore;

  constructor(rootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {
      loadingProfile: observable,
      isCurrentUser: computed,
      uploadPhoto: action,
      setMainPhoto: action,
      loading: observable,
      deletePhoto: action,
      updateProfile: action,
      setActiveTab: action,
      loadFollowings: action,
      follow: action,
      unfollow: action,
    });

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? "followers" : "following";
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    );
  }

  profile = null;
  loadingProfile = true;
  uploadingPhoto = false;
  loading = false;
  followings = [];
  activeTab = 0;

  get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  setActiveTab = (activeIndex) => {
    this.activeTab = activeIndex;
  };

  loadProfile = async (username) => {
    try {
      this.loadingProfile = true;
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
        this.loadingProfile = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  uploadPhoto = async (file) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
        this.uploadingPhoto = false;
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  setMainPhoto = async (photo) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        this.rootStore.userStore.user.image = photo.url;
        this.profile.photos.find((a) => a.isMain).isMain = false;
        this.profile.photos.find((a) => a.id === photo.id).isMain = true;
        this.profile.image = photo.url;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem setting photo as main");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deletePhoto = async (photo) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        this.profile.photos = this.profile.photos.filter(
          (a) => a.id !== photo.id
        );
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem deleting the photo");
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateProfile = async (profile) => {
    try {
      await agent.Profiles.updateProfile(profile);
      runInAction(() => {
        if (profile.displayName !== this.rootStore.userStore.user.displayName) {
          this.rootStore.userStore.user.displayName = profile.displayName;
        }
        this.profile = { ...this.profile, ...profile };
      });
    } catch (error) {
      toast.error("Problem updating profile");
    }
  };

  follow = async (username) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.profile.following = true;
        this.profile.followersCount++;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem following user");
      runInAction(() => {
        this.loading = true;
      });
    }
  };

  unfollow = async (username) => {
    this.loading = true;
    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.profile.following = false;
        this.profile.followersCount--;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      runInAction(() => {
        this.loading = true;
      });
    }
  };

  loadFollowings = async (predicate) => {
    this.loading = true;
    try {
      const profiles = await agent.Profiles.listFollowings(
        this.profile.username,
        predicate
      );
      runInAction(() => {
        this.followings = profiles;
        this.loading = false;
      });
    } catch (error) {
      toast.error("Problem loading followings");
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
