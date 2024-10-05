import { useCallback } from "react";
import Skeleton from "@italodeandra/ui/components/Skeleton";
import { projectListWithSubProjectsApi } from "../../../../../pages/api/project/list-with-sub-projects";
import MultiSelectInput from "@italodeandra/ui/components/Input/MultiSelectInput";

export function ProjectsSelect({
  boardId,
  value,
  onChange,
  loading,
  error,
}: {
  boardId: string;
  value?: string[];
  onChange: (value: string[]) => void;
  loading?: boolean;
  error?: string;
}) {
  const projectListWithSubProjects = projectListWithSubProjectsApi.useQuery({
    boardId,
  });

  const handleChange = useCallback(
    (value: string[]) => {
      onChange(value);
    },
    [onChange],
  );

  if (projectListWithSubProjects.isLoading || loading) {
    return <Skeleton className="h-5 w-16" />;
  }

  return (
    <MultiSelectInput
      label="Projects"
      options={
        projectListWithSubProjects.data?.map((project) => ({
          value: project._id,
          name: project.name,
        })) || []
      }
      value={value}
      onChange={handleChange}
      required
      error={error}
    />
  );
}
