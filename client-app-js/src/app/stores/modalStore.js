import { makeAutoObservable } from "mobx";
import { observable } from "mobx";

export default class ModalStore {
  rootStore;

  modal = {
    open: false,
    body: null,
  };

  constructor(rootStore) {
    makeAutoObservable(this, {
      modal: observable.shallow,
    });
    this.rootStore = rootStore;
  }

  openModal = (content) => {
    this.modal.open = true;
    this.modal.body = content;
  };

  closeModal = () => {
    this.modal.open = false;
    this.modal.body = null;
  };
}
