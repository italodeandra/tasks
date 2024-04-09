import { useSnapshot } from "valtio";
import { homeState } from "../../home/home.state";
import Select from "@italodeandra/ui/components/Select";
import { Orientation } from "../../home/kanban/Orientation";
import Button from "@italodeandra/ui/components/Button";
import { Bars3Icon, ViewColumnsIcon } from "@heroicons/react/16/solid";
import Group from "@italodeandra/ui/components/Group";
import Tooltip from "@italodeandra/ui/components/Tooltip";

export function OrientationSelect() {
  const { orientation, setOrientation } = useSnapshot(homeState);

  return (
    <Select.Root
      onValueChange={(value: Orientation) => setOrientation(value)}
      value={orientation}
    >
      <Tooltip content="Orientation">
        <Select.Trigger>
          <Button icon size="xs">
            <Select.Value asChild>
              {orientation === Orientation.VERTICAL ? (
                <Bars3Icon className="w-3 h-3" />
              ) : (
                <ViewColumnsIcon className="w-3 h-3" />
              )}
            </Select.Value>
          </Button>
        </Select.Trigger>
      </Tooltip>
      <Select.Content>
        <Select.Item value={Orientation.VERTICAL}>
          <Group className="items-center">
            <span>Vertical</span>
            <Bars3Icon className="ml-auto w-3 h-3 -mr-5" />
          </Group>
        </Select.Item>
        <Select.Item value={Orientation.HORIZONTAL}>
          <Group className="items-center">
            <span>Horizontal</span>
            <ViewColumnsIcon className="ml-auto w-3 h-3 -mr-5" />
          </Group>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
