import { useCallback, useState } from "react";
import { ITeam } from "./ITeam";
import { TeamList } from "./TeamList";
import { TeamEditForm } from "./TeamEditForm";
import { TeamMembers } from "./TeamMembers";

export function TeamsDialogContent() {
  const [route, setRoute] = useState<"edit" | "members" | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const handleTeamSelect = useCallback((team: ITeam) => {
    setSelectedTeamId(team._id);
    setRoute("members");
  }, []);

  const handleTeamEdit = useCallback((team: ITeam) => {
    setSelectedTeamId(team._id);
    setRoute("edit");
  }, []);

  if (selectedTeamId) {
    if (route === "edit") {
      return (
        <TeamEditForm
          _id={selectedTeamId}
          onGoBack={() => {
            setSelectedTeamId(null);
            setRoute(null);
          }}
        />
      );
    } else {
      return (
        <TeamMembers
          _id={selectedTeamId}
          onGoBack={() => {
            setSelectedTeamId(null);
            setRoute(null);
          }}
        />
      );
    }
  }

  return <TeamList onSelect={handleTeamSelect} onEdit={handleTeamEdit} />;
}
