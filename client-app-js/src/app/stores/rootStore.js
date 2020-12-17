import { configure } from "mobx";
import { createContext } from "react";
import ActivityStore from "./activityStore";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import ModalStore from "./modalStore";

configure({ enforceActions: "always" });

export class RootStore {
  activityStore;
  userStore;
  commonStore;
  modalStore;

  constructor() {
    this.activityStore = new ActivityStore(this);
    this.userStore = new UserStore(this);
    this.commonStore = new CommonStore(this);
    this.modalStore = new ModalStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
