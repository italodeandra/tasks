import { useSnapshot } from "valtio";
import { homeState } from "../../home/home.state";
import Select from "@italodeandra/ui/components/Select";
import { Orientation } from "../../home/kanban/Orientation";
import Button from "@italodeandra/ui/components/Button";
import { Bars3Icon, ViewColumnsIcon } from "@heroicons/react/16/solid";
import Group from "@italodeandra/ui/components/Group";

export function OrientationSelect() {
  const { orientation, setOrientation } = useSnapshot(homeState);

  return (
    <Select.Root
      onValueChange={(value: Orientation) => setOrientation(value)}
      value={orientation}
    >
      <Select.Trigger>
        <Button size="xs" className="py-1 px-1.5">
          <Select.Value>
            {orientation === Orientation.VERTICAL ? (
              <Group className="items-center">
                <Bars3Icon className="w-4 h-4" />
                Vertical
              </Group>
            ) : (
              <Group className="items-center">
                <ViewColumnsIcon className="w-4 h-4" />
                Horizontal
              </Group>
            )}
          </Select.Value>
        </Button>
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          <Select.Label>Orientation</Select.Label>
          <Select.Item value={Orientation.VERTICAL}>
            <Group className="items-center w-20">
              <div className="w-full">Vertical</div>
              <Bars3Icon className="w-4 h-4 shrink-0 -mr-5" />
            </Group>
          </Select.Item>
          <Select.Item value={Orientation.HORIZONTAL}>
            <Group className="items-center w-20">
              <div className="w-full">Horizontal</div>
              <ViewColumnsIcon className="w-4 h-4 shrink-0 -mr-5" />
            </Group>
          </Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}
