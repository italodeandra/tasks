import { Header } from "./header/Header";
import { TrelloKanban } from "./kanban/TrelloKanban";
import { Projects } from "./projects/Projects";

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
