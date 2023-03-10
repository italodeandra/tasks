import { proxy } from "valtio";

const kanbanState = proxy({
  editingItems: [] as string[],
  toggleEditingItem(id: string) {
    if (kanbanState.editingItems.includes(id)) {
      kanbanState.editingItems.splice(kanbanState.editingItems.indexOf(id), 1);
    } else {
      kanbanState.editingItems.push(id);
    }
  }
});