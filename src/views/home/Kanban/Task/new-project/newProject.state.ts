import { proxy } from "valtio";

export const newProjectState = proxy({
  modalOpen: false,
  openModal() {
    newProjectState.modalOpen = true;
  },
  closeModal() {
    newProjectState.modalOpen = false;
  },
});
