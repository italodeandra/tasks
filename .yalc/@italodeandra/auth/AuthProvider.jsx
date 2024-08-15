import Notifications from "@italodeandra/ui/components/Notifications/Notifications";
import { AuthContext } from "./AuthContext";
export default function AuthProvider({ children, ...props }) {
    return (<AuthContext.Provider value={props}>
      <Notifications />
      {children}
    </AuthContext.Provider>);
}
