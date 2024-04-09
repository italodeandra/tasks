import Modal from "@italodeandra/ui/components/Modal/Modal";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Input from "@italodeandra/ui/components/Input/Input";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { newProjectState } from "./newProject.state";
import { projectCreateApi } from "../../../pages/api/project/create";

type FieldValues = {
  name: string;
};

export function NewProjectModal() {
  const { modalOpen, closeModal } = useSnapshot(newProjectState);
  const { mutate: create, isLoading } = projectCreateApi.useMutation({
    onSuccess() {
      closeModal();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  const onSubmit = (data: FieldValues) => create({ ...data });

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
                required: "Please fill with a name",
              })}
              error={!!errors.name}
              helpText={errors.name?.message}
            />
          </Stack>
          <Modal.Actions>
            <Modal.CloseButton onClick={closeModal} />
            <Button
              variant="filled"
              color="primary"
              className="w-full"
              type="submit"
              loading={isLoading}
            >
              Save
            </Button>
          </Modal.Actions>
        </Modal.Container>
      </form>
    </Modal>
  );
}
