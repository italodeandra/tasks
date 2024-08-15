import Modal from "@italodeandra/ui/components/Modal/Modal";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Input from "@italodeandra/ui/components/Input/Input";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { newProjectState } from "./newProject.state";
import { projectCreateApi } from "../../../../../pages/api/project/create";
import { clientListApi } from "../../../../../pages/api/client/list";

type FieldValues = {
  name: string;
  clientId: string;
};

export function NewProjectModal() {
  const { modalOpen, closeModal } = useSnapshot(newProjectState);
  const { mutate: create, isPending } = projectCreateApi.useMutation({
    onSuccess() {
      closeModal();
    }
  });
  const { data: clients, isLoading: isLoadingClients } =
    clientListApi.useQuery();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>();

  const onSubmit = (data: FieldValues) => create(data);

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Container>
          <Modal.Title>New project</Modal.Title>
          <Stack>
            <Input
              label="Name"
              required
              {...register("name", {
                required: "Please fill with a name"
              })}
              error={!!errors.name}
              helpText={errors.name?.message}
            />
            <Input
              label="Client"
              {...register("clientId")}
              error={!!errors.name}
              helpText={errors.name?.message}
              select
              loading={isLoadingClients}
            >
              <option value="" />
              {clients?.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </Input>
          </Stack>
          <Modal.Actions>
            <Modal.CloseButton onClick={closeModal} />
            <Button
              variant="filled"
              color="primary"
              className="w-full"
              type="submit"
              loading={isPending}
            >
              Save
            </Button>
          </Modal.Actions>
        </Modal.Container>
      </form>
    </Modal>
  );
}
