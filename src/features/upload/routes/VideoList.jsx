import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CustomSidebar } from "../component/SideBar";
import { CustomSpinner } from "../component/Spinner";
import { CustomTable } from "../component/Table";
import { useGetVideosQuery } from "../../api/api-slice";
import { convertRuby } from "../../../utils/config";
import { default as JsxParser } from "html-react-parser";
import "../index.scss";

function VideoListScreen() {
  const { data: videosData, isLoading } = useGetVideosQuery();
  console.log("videosData", videosData);

  useEffect(() => {
    if (localStorage.getItem("reload") === "true") {
      handleReload();
    }
  }, []);

  const handleReload = () => {
    localStorage.setItem("reload", "false");
    window.location.reload();
  };

  const keyToKeep = [
    "id",
    "title",
    "content",
    "media",
    "caption",
    "grade",
    "unit",
    "category",
  ];
  let tableData = [];
  if (videosData) {
    tableData = videosData.map((element) =>
      Object.fromEntries(
        Object.entries(element).filter(([key]) => keyToKeep.includes(key))
      )
    );
  }
  tableData.forEach((element) => {
    element.title = JsxParser(convertRuby(element.title));
    element.content = JsxParser(convertRuby(element.content));
    let decodedStr = decodeURIComponent(element.media);
    element.media = decodedStr.substring(decodedStr.lastIndexOf("/") + 1);
    let decodedCaptionStr = decodeURIComponent(element.caption);
    element.caption = decodedCaptionStr.substring(
      decodedCaptionStr.lastIndexOf("/") + 1
    );
  });
  console.log("tableData", tableData);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "1rem 3rem",
          backgroundColor: "#007bff",
        }}
      ></div>
      <div>
        <div style={{ display: "flex" }}>
          <CustomSidebar></CustomSidebar>
          <div className="custom-table">
            <CustomTable data={tableData} originData={videosData}></CustomTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoListScreen;
