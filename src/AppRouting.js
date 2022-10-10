import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRoutes } from "react-router-dom";
import LoadingScreen from "./components/ui/LoadingScreen";
import { checkUserSession } from "./redux/actions/authActions";
import routes from "./routes";

function AppRouting() {
  const dispatch = useDispatch();
  const { user, checkingSession } = useSelector((state) => state.auth);

  const routing = useRoutes(routes(user));

  useEffect(() => {
    dispatch(checkUserSession());
  }, []);

  if (checkingSession) return <LoadingScreen />;

  return <>{routing}</>;
}

export default AppRouting;
