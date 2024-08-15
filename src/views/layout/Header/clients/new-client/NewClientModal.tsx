import Modal from "@italodeandra/ui/components/Modal/Modal";
import Button from "@italodeandra/ui/components/Button/Button";
import Stack from "@italodeandra/ui/components/Stack/Stack";
import Input from "@italodeandra/ui/components/Input/Input";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { newClientState } from "./newClient.state";
import { clientCreateApi } from "../../../../../pages/api/client/create";

type FieldValues = {
  name: string;
};

export function NewClientModal() {
  const { modalOpen, closeModal } = useSnapshot(newClientState);
  const { mutate: create, isPending } = clientCreateApi.useMutation({
    onSuccess() {
      closeModal();
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FieldValues>();

  const onSubmit = (data: FieldValues) => create({ ...data });

  return (
    <Modal open={modalOpen} onClose={closeModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Container>
          <Modal.Title>New client</Modal.Title>
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
