import React, { useState, useEffect } from "react";
import { TextField, Select, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../index.scss";
import { baseURL } from "../../api/api-slice";
import { CustomSidebar } from "../component/SideBar";
import { CustomSpinner } from "../component/Spinner";
import { convertRuby } from "../../../utils/config";
import { RubyField } from "../component/RubyField";
import { default as JsxParser } from "html-react-parser";
import useStateEx from "../../../utils/useStateEx";
import { makeStyles } from "@material-ui/core/styles";
import {
  useGetCategoriesQuery,
  useGetGradesQuery,
  useGetUnitsQuery,
} from "../../api/api-slice";

function UploadVideoScreen() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedCaptionFile, setSelectedCaptionFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [content, setContent] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [videoWordList, setVideoWordList] = useState([]);
  const [videoWordIds, setVideoWordIds] = useState([]);

  const [videoTitle, setVideoTitle] = useState("");
  const [videoContent, setVideoContent] = useState("");
  const [selectionStart, setSelectionStart, getSelectionStart] = useStateEx(0);
  const [selectionEnd, setSelectionEnd, getSelectionEnd] = useStateEx(0);
  const _onConfirmed = (value) => {
    if (value) {
      const rubyField = document.getElementById("video-content");
      const promises = [getSelectionStart(), getSelectionEnd()];
      Promise.all(promises).then((results) => {
        const selectionStart_ = results[0];
        const selectionEnd_ = results[1];
        if (rubyField) {
          const temp = rubyField.value ?? "";
          const a = temp.slice(0, selectionStart_);
          const b = value;
          const c = temp.slice(selectionEnd_);
          setVideoContent(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeCategoryName = (e) => {
    if (e) {
      setVideoContent(e.currentTarget.value);
    }
  };

  const _onConfirmedTitle = (value) => {
    if (value) {
      const rubyField = document.getElementById("video-title");
      const promises = [getSelectionStart(), getSelectionEnd()];
      Promise.all(promises).then((results) => {
        const selectionStart_ = results[0];
        const selectionEnd_ = results[1];
        if (rubyField) {
          const temp = rubyField.value ?? "";
          const a = temp.slice(0, selectionStart_);
          const b = value;
          const c = temp.slice(selectionEnd_);
          setVideoTitle(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeTitle = (e) => {
    if (e) {
      setVideoTitle(e.currentTarget.value);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const fileLabel = document.getElementById("selectedLabel");
    if (file !== null && file !== undefined) {
      let fileName = file.name;
      fileLabel.textContent = fileName;
      setSelectedFile(file);
    } else {
      setSelectedFile(file);
      fileLabel.textContent = "ファイルを選択してください。";
    }
  };

  const handleCaptionFileChange = (event) => {
    const file = event.target.files[0];
    const fileLabel = document.getElementById("selectedCaptionLabel");
    if (file !== null && file !== undefined) {
      let fileName = file.name;
      fileLabel.textContent = fileName;
      setSelectedCaptionFile(file);
    } else {
      setSelectedCaptionFile(file);
      fileLabel.textContent = "ファイルを選択してください。";
    }
  };

  const [category, setCategory] = React.useState(0);
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };
  const [grade, setGrade] = React.useState(0);
  const handleGrade = (event) => {
    setGrade(event.target.value);
  };
  const [classroom, setClassroom] = React.useState(0);
  const handleClassroom = (event) => {
    setClassroom(event.target.value);
  };

  const handleAddVideoWord = () => {
    setVideoWordList((prevList) => [...prevList, ""]);
  };

  const handleDeleteWord = (e) => {
    setVideoWordList((prevList) =>
      prevList.filter((item, index) => index !== parseInt(e.target.id))
    );
  };

  const handleVideoWordList = (e, i) => {
    setVideoWordList((prevList) =>
      prevList.map((item, index) => (index === i ? e.target.value : item))
    );
  };

  const getWordContent = (e, i) => {
    fetch(
      `https://mastercode.jp/apps/api/dictionary/search/?mode=esjp&search_word=${e.target.value}&search_mode=exact`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("getWordContent", response);
          return response.json();
        }
        console.log("what is getWordContent: ", response);

        throw new Error("getWordContent response was not ok");
      })
      .then((data) => {
        console.log("getWordContent successful:", data);

        let pattern = /showDetailUNI_(\d+)_search/;

        let matches = pattern.exec(data);

        if (matches) {
          let extractedNumber = matches[1];
          console.log(extractedNumber);
        } else {
          console.log("No match found.");
        }
      })
      .catch((error) => {
        console.error("getWordContent error:", error);
      });
  };

  const { data: categoriesData } = useGetCategoriesQuery();
  console.log("categories", categoriesData);
  const { data: gradesData, refetch: refetchGrades } =
    useGetGradesQuery(category);
  console.log("gradesData", gradesData);
  const { data: unitsData, refetch: refetchUnits } = useGetUnitsQuery(grade);
  console.log("unitsData", unitsData);

  const refetchData = () => {
    refetchGrades();
    refetchUnits();
  };

  useEffect(() => {
    refetchData();
  }, [category, grade]);

  const handleChange = (event) => {
    const title = event.target.value;
    setTitle(title);
  };

  const handleContent = (event) => {
    const content = event.target.value;
    setContent(content);
  };

  const handleUpload = () => {
    if (selectedFile) {
      console.log("Uploading file:", selectedFile);
      let video_title = document.getElementById("video-title").value;
      let video_content = document.getElementById("video-content").value;
      const formData = new FormData();
      formData.append("media", selectedFile, selectedFile.name);
      formData.append("caption", selectedCaptionFile, selectedCaptionFile.name);
      formData.append("title", video_title);
      formData.append("content", video_content);
      formData.append("category", category);
      formData.append("grade", grade);
      formData.append("unit", classroom);
      videoWordList.forEach((word, index) => {
        formData.append(`word_list`, word);
      });

      setIsLoading(false);
      fetch(`${baseURL}videos/`, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("response", response);
            return response.json();
          }
          //   toast.warn("アップロードに失敗しました!");
          // toast.success("アップロードに成功しました！");
          console.log("what is error: ", response);

          throw new Error("Network response was not ok");
        })
        .then((data) => {
          console.log("Upload successful:", data);
          setIsLoading(true);
          setResponseText(data);
          toast.success("アップロードに成功しました！");
        })
        .catch((error) => {
          console.error("Upload error:", error);
          setIsLoading(true);
          setResponseText(error);
          toast.warn("アップロードに失敗しました!");
          // toast.success("アップロードに成功しました！");
        });
    } else {
      alert("アップロードするファイルを選択してください。");
    }
  };

  if (!isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "1rem 3rem",
            backgroundColor: "#6fa1d5",
          }}
        ></div>
        <div>
          <div style={{ display: "flex" }}>
            <CustomSidebar></CustomSidebar>
            <div
              style={{
                width: "100%",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CustomSpinner></CustomSpinner>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
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
            <div className="upload-container">
              <h2 style={{ color: "#6fa1d5" }}>ファイルアップロード</h2>
              {/* <div className="upload-title">
                <label>ファイル名:</label>
                <input onChange={handleChange}></input>
              </div> */}
              <div className="upload-title">
                <label>分野</label>
                <div>
                  <Select
                    labelId="category-label"
                    id="category"
                    value={category}
                    onChange={handleCategory}
                  >
                    <MenuItem value={0}>選択してください。</MenuItem>
                    {categoriesData !== undefined &&
                      categoriesData.map((element) => (
                        <MenuItem key={element.id} value={element.id}>
                          {element.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
              </div>
              {category > 0 ? (
                <div style={{ width: "100%" }}>
                  <div className="upload-title">
                    <label>学年</label>
                    <div>
                      <Select
                        labelId="grade-label"
                        id="grade"
                        value={grade}
                        onChange={handleGrade}
                      >
                        <MenuItem value={0}>選択してください。</MenuItem>
                        {gradesData !== undefined &&
                          gradesData.map((element) => (
                            <MenuItem value={element.id}>
                              {element.level}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                  </div>
                  <div className="upload-title">
                    <label>単元名</label>
                    <div>
                      <Select
                        labelId="classroom-label"
                        id="classroom"
                        value={classroom}
                        onChange={handleClassroom}
                      >
                        <MenuItem value={0}>
                          選択してください。
                        </MenuItem>
                        {unitsData !== undefined &&
                          unitsData.map((element) => (
                            <MenuItem value={element.id}>
                              {element.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                  </div>
                  {category === 1 ? (
                    <>
                      <div className="upload-title">
                        <label>計算スキル用①</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className="upload-title">
                        <label>計算スキル用②</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}

                  {category === 3 ? (
                    <>
                      <div className="upload-title">
                        <label>漢字スキル用①</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className="upload-title">
                        <label>漢字スキル用②</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {category === 4 ? (
                    <>
                      <div className="upload-title">
                        <label>トモプラ用①</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                      <div className="upload-title">
                        <label>トモプラ用②</label>
                        <div>
                          <Select
                            labelId="classroom-label"
                            id="classroom"
                            value={classroom}
                            onChange={handleClassroom}
                          >
                            <MenuItem value={"placeholder"}>
                              選択してください。
                            </MenuItem>
                            {unitsData !== undefined &&
                              unitsData.map((element) => (
                                <MenuItem value={element.id}>
                                  {element.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  <div className="upload-content">
                    <label>映像のタイトル</label>
                    <div style={{ width: "72%" }}>
                      <RubyField
                        id="video-title-temp"
                        onConfirmed={_onConfirmedTitle}
                        inputProps={{ maxLength: 32 }}
                        fullWidth
                      />
                      <TextField
                        id="video-title"
                        value={videoTitle}
                        onChange={_onChangeTitle}
                        multiline
                        fullWidth
                      />
                    </div>
                  </div>
                  <div className="upload-content video-content">
                    <label>映像の説明文</label>
                    <div style={{ width: "72%" }}>
                      <RubyField
                        id="video-content-temp"
                        onConfirmed={_onConfirmed}
                        inputProps={{ maxLength: 32 }}
                        fullWidth
                      />
                      <TextField
                        id="video-content"
                        value={videoContent}
                        onChange={_onChangeCategoryName}
                        multiline
                        fullWidth
                      />
                    </div>
                  </div>
                  {category === 2 ? (
                    <>
                      <div className="upload-title">
                        <label>言葉</label>
                        <div className="upload-word-list">
                          <div className="upload-word">
                            {videoWordList.length ? (
                              Array.from(
                                { length: videoWordList.length },
                                (_, i) => (
                                  <>
                                    <TextField
                                      id={`video-word-${i}`}
                                      onChange={(e) =>
                                        handleVideoWordList(e, i)
                                      }
                                      value={videoWordList[i]}
                                      multiline
                                      fullWidth
                                    />
                                    <button
                                      id={`${i}`}
                                      onClick={handleDeleteWord}
                                    >
                                      削除
                                    </button>
                                  </>
                                )
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="upload-word">
                            <button onClick={handleAddVideoWord}>追加</button>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <></>
                  )}
                  {/* {category === 2 ? (
                    <div className="upload-content video-content">
                      <label>問いボックス</label>
                      <div style={{ width: "72%" }}>
                        <RubyField
                          id="video-content-temp"
                          onConfirmed={_onConfirmed}
                          inputProps={{ maxLength: 32 }}
                          fullWidth
                        />
                        <TextField
                          id="video-content"
                          value={videoContent}
                          onChange={_onChangeCategoryName}
                          multiline
                          fullWidth
                        />
                      </div>
                    </div>
                  ) : (
                    <></>
                  )} */}
                  <div className="upload-file">
                    <input
                      type="file"
                      title=" "
                      id="inputFile"
                      onChange={handleFileChange}
                    />
                    <label for="inputFile" id="fileLabel">
                      映像ファイル
                    </label>
                    <label id="selectedLabel">選択してください。</label>
                  </div>
                  <div className="upload-file">
                    <input
                      type="file"
                      title=" "
                      id="inputCaptionFile"
                      onChange={handleCaptionFileChange}
                    />
                    <label for="inputCaptionFile" id="captionFileLabel">
                      字幕ファイル
                    </label>
                    <label id="selectedCaptionLabel">選択してください。</label>
                  </div>
                  <div className="upload-button">
                    <button onClick={handleUpload}>アップロード</button>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadVideoScreen;
