import { Route, Routes } from "react-router-dom";
import UploadVideoScreen from "./UploadVideo";
import VideoListScreen from "./VideoList";
import ManageUnit from "./ManageUnit";

export const UploadRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<VideoListScreen />} />
      <Route path="/add_file" element={<UploadVideoScreen />} />
      <Route path="/manage_unit" element={<ManageUnit />} />
    </Routes>
  );
};
