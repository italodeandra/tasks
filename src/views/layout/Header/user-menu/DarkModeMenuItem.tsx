import { useModeToggle } from "@italodeandra/ui/components/ModeToggle";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";

export function DarkModeMenuItem() {
  const toggleMode = useModeToggle();

  return (
    <>
      <DropdownMenu.CheckboxItem className="dark:hidden" onClick={toggleMode}>
        Dark mode
      </DropdownMenu.CheckboxItem>
      <DropdownMenu.CheckboxItem
        className="hidden dark:block"
        onClick={toggleMode}
        checked
      >
        Dark mode
      </DropdownMenu.CheckboxItem>
    </>
  );
}
