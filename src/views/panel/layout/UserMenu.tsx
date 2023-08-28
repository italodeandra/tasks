import UiMenu from "@italodeandra/ui/components/Menu/Menu";
import Button from "@italodeandra/ui/components/Button/Button";
import { ExclamationTriangleIcon, UserIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback } from "react";
import {
  setData_authGetUser,
  useAuthGetUser,
} from "@italodeandra/auth/api/getUser";
import Tooltip from "@italodeandra/ui/components/Tooltip/Tooltip";
import { deleteCookie } from "cookies-next";
import Routes from "../../../Routes";
import { checkUserType } from "@italodeandra/auth/collections/user/User.service";
import { UserType } from "@italodeandra/auth/collections/user/User";

export default function UserMenu() {
  let queryClient = useQueryClient();
  let { data: user, isLoading: isLoadingUser, isError } = useAuthGetUser();
  let router = useRouter();
  let isAdmin = checkUserType(user, [UserType.ADMIN]);

  let handleLogOutClick = useCallback(async () => {
    deleteCookie("auth", { path: "/" });
    setData_authGetUser(queryClient, null);
    await router.replace(Routes.Home);
  }, [queryClient, router]);

  if (isLoadingUser) {
    return (
      <div className="h-[42px] w-[42px] animate-pulse rounded-full bg-gray-300" />
    );
  }

  if (isError) {
    return (
      <Tooltip
        content="There was an unexpected error trying to get the logged in user data"
        delay={200}
      >
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-red-100">
          <ExclamationTriangleIcon className="w-6 text-red-500" />
        </div>
      </Tooltip>
    );
  }

  return (
    <UiMenu
      button={
        <Button icon className="!rounded-full">
          <UserIcon />
        </Button>
      }
    >
      {isAdmin && <UiMenu.Item href={Routes.Panel}>Panel</UiMenu.Item>}
      <UiMenu.Item onClick={handleLogOutClick}>Log out</UiMenu.Item>
    </UiMenu>
  );
}
