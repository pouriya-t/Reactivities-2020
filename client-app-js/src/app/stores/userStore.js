import { history } from "./../../index";
import { runInAction } from "mobx";
import agent from "../api/agent";

export default class UserStore {
  rootStore;
  user = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
  }


  get isLoggedIn() {
    return !!this.user;
  }

  login = async (values) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  register = async (values) => {
    try {
      const user = await agent.User.register(values);
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities')
    } catch (error) {
      throw error;
    }
  }

  getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };
}
