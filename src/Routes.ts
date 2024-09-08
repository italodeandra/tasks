const Routes = {
  Home: "/",
  SignUp: "/sign-up",
  SignIn: "/sign-in",
  ForgotPassword: "/forgot-password",
  ResetPassword: (token: string) => `/reset-password/${token}`,

  Board: (_id: string) => `/board/${_id}`,
  TimesheetList: (boardId: string) => `/board/${boardId}/timesheet`,
  TimesheetClosure: (boardId: string, timesheetId: string) =>
    `/board/${boardId}/timesheet/${timesheetId}`,

  Task: (boardId: string, taskId: string) => `/board/${boardId}?task=${taskId}`,

  Panel: "/panel",
  PanelUsers: "/panel/users",
  PanelNewUser: "/panel/user/new",
  PanelUser: (_id: string) => `/panel/user/${_id}`,
};

export default Routes;
