import {
  action,
  computed,
  configure,
  makeAutoObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { history } from "../..";
import { createAttendee, setActivityProps } from "../common/util/util";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const LIMIT = 2;

configure({ enforceActions: "always" });

export default class ActivityStore {
  activityRegistry = new Map();
  activity = null;
  loadingInitial = false;
  submitting = false;
  target = "";
  rootStore;
  loading = false;
  hubConnection = null;
  activityCount = 0;
  page = 0;
  predicate = new Map();

  constructor(rootStore) {
    makeAutoObservable(this, {
      hubConnection: observable.ref,
      activityCount: observable,
      page: observable,
      totalPages: computed,
      setPage: action,
      predicate: observable,
      setPredicate: action,
      axiosParams: computed,
    });
    this.rootStore = rootStore;

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadActivities();
      }
    );
  }

  setPredicate = (predicate, value) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOSring());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  get totalPages() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  setPage = (page) => {
    this.page = page;
  };

  createHubConnection = (activityId) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        accessTokenFactory: () => this.rootStore.commonStore.token,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection.state))
      .then(() => {
        console.log("Attempting to join group");
        this.hubConnection.invoke("AddToGroup", activityId);
      })
      .catch((error) => console.log("Error establishing connection : ", error));

    this.hubConnection.on("ReceiveComment", (comment) => {
      runInAction(() => {
        this.activity.comments.push(comment);
      });
    });

    this.hubConnection.on("Send", (message) => {
      toast.info(message);
    });
  };

  stopHubConnection = () => {
    this.hubConnection
      .invoke("RemoveFromGroup", this.activity.id)
      .then(() => {
        this.hubConnection.stop();
      })
      .then(() => console.log("Connection stopped"))
      .catch((err) => console.log(err));
  };

  addComment = async (values) => {
    values.activityId = this.activity.id;
    try {
      await this.hubConnection.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };

  get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, [])
    );
  }

  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelope;
      runInAction(() => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };

  getActivity = (id) => {
    return this.activityRegistry.get(id);
  };

  clearActivity = () => {
    this.activity = null;
  };

  createActivity = async (activity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = [];
      activity.isHost = true;
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        toast.error("Problem submitting data");
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error);
    }
  };

  editActivity = async (activity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error);
    }
  };

  loadActivity = async (id) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction(() => {
          setActivityProps(activity, this.rootStore.userStore.user);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  deleteActivity = async (event, id) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await agent.Activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };

  attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem signing up to activity");
    }
  };

  cancelAttendance = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling attendance");
    }
  };
}
