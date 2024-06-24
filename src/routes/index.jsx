import { useRoutes } from "react-router-dom";
import { UploadRoutes } from "../features/upload/routes";

const routes = [{ path: "/*", element: <UploadRoutes /> }];

export const AppRoutes = () => {
  const renderRoutes = useRoutes(routes);
  return renderRoutes;
};
