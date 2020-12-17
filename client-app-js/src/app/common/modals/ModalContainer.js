import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Modal } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";

const ModalContainer = observer(() => {
  const rootStore = useContext(RootStoreContext);
  const {
    modal: { open, body },
    closeModal,
  } = rootStore.modalStore;
  return (
    <Modal
      open={open}
      onClose={closeModal}
      size="mini"
      style={{ marginLeft: "38%" }}
    >
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
});

export default ModalContainer;
