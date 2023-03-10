import Modal from "@italodeandra/ui/components/Modal/Modal";
import Button from "@italodeandra/ui/components/Button/Button";
import useModalState from "@italodeandra/ui/components/Modal/useModalState";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Input from "@italodeandra/ui/components/Input/Input";
import { useProjectCreate } from "../../../../pages/api/project/create";
import { useForm } from "react-hook-form";
import { ProjectColor } from "../../../../collections/project";

type FieldValues = {
  name: string;
};

export function NewProjectModal({
  state,
}: {
  state: ReturnType<typeof useModalState>;
}) {
  let [modalOpen, { closeModal }] = state;
  let { mutate: create, isLoading } = useProjectCreate({
    onSuccess() {
      closeModal();
    },
  });

  let {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>();

  let onSubmit = (data: FieldValues) =>
    create({ ...data, color: ProjectColor.BLUE });

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
