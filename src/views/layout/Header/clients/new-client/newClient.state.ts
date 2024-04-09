import { proxy } from "valtio";

export const newClientState = proxy({
  modalOpen: false,
  openModal() {
    newClientState.modalOpen = true;
  },
  closeModal() {
    newClientState.modalOpen = false;
  },
});
