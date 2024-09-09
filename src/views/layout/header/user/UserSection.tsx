import { useQueryClient } from "@tanstack/react-query";
import authState, { useAuthSnapshot } from "@italodeandra/auth/auth.state";
import {
  setData_authGetUser,
  useAuthGetUser,
} from "@italodeandra/auth/api/getUser";
import { useRouter } from "next/router";
import { useAuthPanelUserStopImpersonate } from "@italodeandra/auth/api/panel/user/stop-impersonate";
import { checkUserType } from "@italodeandra/auth/collections/user/User.service";
import { UserType } from "@italodeandra/auth/collections/user/User";
import { useCallback } from "react";
import { deleteCookie } from "cookies-next";
import Routes from "../../../../Routes";
import Tooltip from "@italodeandra/ui/components/Tooltip";
import { ExclamationTriangleIcon, UserIcon } from "@heroicons/react/16/solid";
import DropdownMenu from "@italodeandra/ui/components/DropdownMenu";
import Button from "@italodeandra/ui/components/Button";
import stopPropagation from "@italodeandra/ui/utils/stopPropagation";
import Loading from "@italodeandra/ui/components/Loading";
import getInitials from "@italodeandra/ui/utils/getInitials";
import { showDialog } from "@italodeandra/ui/components/Dialog";
import { TeamsDialogContent } from "./teams/TeamsDialogContent";
import {
  colors,
  getColorForString,
} from "../../../../components/ColorPicker/colors";
import { reactQueryDialogContentProps } from "../../../../utils/reactQueryDialogContentProps";
import clsx from "@italodeandra/ui/utils/clsx";

export function UserSection() {
  const queryClient = useQueryClient();
  const { token, previousToken } = useAuthSnapshot();
  const { data: user, isLoading: isLoadingUser, isError } = useAuthGetUser();
  const router = useRouter();
  const { mutate: stopImpersonate, isPending: isStoppingImpersonate } =
    useAuthPanelUserStopImpersonate();
  const isAdmin = checkUserType(user, [UserType.ADMIN]);

  const handleLogOutClick = useCallback(async () => {
    authState.token = null;
    deleteCookie("auth", { path: "/" });
    setData_authGetUser(queryClient, null);
    await router.replace(Routes.Home);
  }, [queryClient, router]);

  const handleTeamsClick = useCallback(() => {
    showDialog({
      title: "Teams",
      content: <TeamsDialogContent />,
      contentProps: reactQueryDialogContentProps,
    });
  }, []);

  if (isError) {
    return (
      <Tooltip content="There was an unexpected error trying to get the logged in user data">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
        </div>
      </Tooltip>
    );
  }

  const isLoading = isStoppingImpersonate || (!!token && isLoadingUser);

  const userColor = user ? getColorForString(user._id) : colors.blue;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="filled"
          rounded
          className={clsx(
            "group/myself pointer-events-auto relative h-7 w-7 border-0 p-0 text-xs uppercase text-white",
            "before:absolute before:inset-0 before:rounded-full before:bg-white/0 before:transition hover:before:bg-white/5 active:before:bg-white/10",
          )}
          onClick={stopPropagation}
          style={
            {
              background: user?.profilePicture
                ? `center / cover url(${user.profilePicture})`
                : userColor["600"],
            } as Record<string, string>
          }
        >
          {isLoading ? (
            <Loading className="h-4 w-4" />
          ) : !user?.profilePicture ? (
            user ? (
              getInitials(user.name || user.email)
            ) : (
              <UserIcon className="h-4 w-4" />
            )
          ) : null}
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {user ? (
          <>
            <DropdownMenu.Label title={user.email}>
              {user.name || user.email}
            </DropdownMenu.Label>
            <DropdownMenu.Item href={Routes.Home}>Boards</DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleTeamsClick}>
              Teams
            </DropdownMenu.Item>
            {previousToken && (
              <DropdownMenu.Item onClick={() => stopImpersonate()}>
                Stop impersonating
              </DropdownMenu.Item>
            )}
            {isAdmin && (
              <DropdownMenu.Item href={Routes.Panel}>Panel</DropdownMenu.Item>
            )}
            <DropdownMenu.Item href={Routes.Profile}>
              Edit profile
            </DropdownMenu.Item>
            <DropdownMenu.Item onClick={handleLogOutClick}>
              Log out
            </DropdownMenu.Item>
          </>
        ) : (
          <>
            <DropdownMenu.Item href={Routes.SignIn}>Sign in</DropdownMenu.Item>
          </>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
