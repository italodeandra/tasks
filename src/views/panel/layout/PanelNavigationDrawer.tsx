import { HomeIcon, LockClosedIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";
import { useAuthGetUser } from "@italodeandra/auth/api/getUser";
import UiNavigationDrawer from "@italodeandra/ui/components/NavigationDrawer/NavigationDrawer";
import NavigationItem from "@italodeandra/ui/components/NavigationDrawer/NavigationItem";
import Routes from "../../../Routes";
import { checkUserType } from "@italodeandra/auth/collections/user/User.service";
import { UserType } from "@italodeandra/auth/collections/user/User";

export default function NavigationDrawer({
  children,
}: {
  children: ReactNode;
}) {
  let { data: user } = useAuthGetUser();

  let isAdmin = checkUserType(user, [UserType.ADMIN]);

  return (
    <UiNavigationDrawer
      navigationChildren={
        <>
          <NavigationItem icon={<HomeIcon />} href={Routes.Panel} exact>
            Home
          </NavigationItem>
          {isAdmin && (
            <>
              <NavigationItem
                href={Routes.PanelUsers}
                alternativeActiveHrefs={[Routes.PanelUser("")]}
                icon={<LockClosedIcon />}
              >
                Users
              </NavigationItem>
            </>
          )}
        </>
      }
    >
      {children}
    </UiNavigationDrawer>
  );
}
