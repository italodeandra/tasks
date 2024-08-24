import { Header } from "./header/Header";
import { TrelloKanban } from "./kanban/TrelloKanban";
import { Projects } from "./Projects";

export function TrelloView() {
  return (
    <>
      <Header>
        <Projects />
      </Header>
      <TrelloKanban />
    </>
  );
}
