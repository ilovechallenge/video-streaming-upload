import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { RubyField } from "./RubyField";
import { TextField, Select, MenuItem } from "@mui/material";
import useStateEx from "../../../utils/useStateEx";
import { CustomSpinner } from "./Spinner";
import {
  useGetVideoByIdQuery,
  useGetCategoriesQuery,
  useGetGradesQuery,
  useGetUnitsQuery,
} from "../../api/api-slice";
import "../index.scss";
import "./EditModal.scss";


export const EditModal = ({
  showModal,
  onClose,
  onSave,
  videoTitle,
  videoContent,
  videoId
}) => {
  console.log(videoContent, "dsfdsda", videoTitle);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: videoData, isLoading } = useGetVideoByIdQuery(videoId);
  console.log("videoIdHERE", videoId, videoData)

  useEffect(() => {
    if (videoData) {
      setCategory(videoData.category_id);
      setGrade(videoData.grade_id);
      setClassroom(videoData.unit_id);
    }
  }, [videoData]);
  
  const { data: categoriesData } = useGetCategoriesQuery();
  const [category, setCategory] = React.useState(0);
  const handleCategory = (event) => {
    setCategory(event.target.value);
  };

  const { data: gradesData, refetch: refetchGrades } = useGetGradesQuery(category);
  const [grade, setGrade] = React.useState(0);
  const handleGrade = (event) => {
    setGrade(event.target.value);
  };

  const { data: unitsData, refetch: refetchUnits } = useGetUnitsQuery(grade);
  const [classroom, setClassroom] = React.useState(0);
  const handleClassroom = (event) => {
    setClassroom(event.target.value);
  };

  console.log("title: ", title, "content: ", content);
  const [selectionStart, setSelectionStart, getSelectionStart] = useStateEx(0);
  const [selectionEnd, setSelectionEnd, getSelectionEnd] = useStateEx(0);

  useEffect(() => {
    setTitle(videoTitle);
    setContent(videoContent);
  }, [videoTitle, videoContent]);
  const _onBlur = (e) => {
    if (e) {
      e.preventDefault();
      setSelectionStart(e.currentTarget.selectionStart ?? 0);
      setSelectionEnd(e.currentTarget.selectionEnd ?? 0);
    }
  };

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
          setContent(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeCategoryName = (e) => {
    if (e) {
      setContent(e.currentTarget.value);
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
          setTitle(a + b + c);
          setSelectionStart(selectionStart_ + b.length);
          setSelectionEnd(selectionEnd_ + b.length);
        }
      });
    }
  };
  const _onChangeTitle = (e) => {
    if (e) {
      setTitle(e.currentTarget.value);
    }
  };
  if (isLoading) {
    return (<CustomSpinner />)
  }
  return (
    <Modal
      show={showModal}
      onHide={onClose}
      dialogClassName="modal-stamp"
      size="lg"
      centered
    >
      <Modal.Header>
        <span
          className="edit-modal-header"
          style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
        >
          編集画面
        </span>
      </Modal.Header>
      <Modal.Body>
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
                  <MenuItem key={element.id} value={element.id}>
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
                  <MenuItem key={element.id} value={element.id}>
                    {element.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
        </div>
        <div className="edit-modal-title">
          <label>映像のタイトル</label>
          <div>
            <RubyField
              id="video-title-temp"
              onConfirmed={_onConfirmedTitle}
              inputProps={{ maxLength: 32 }}
              fullWidth
            />
            <TextField
              id="video-title"
              value={title}
              onChange={_onChangeTitle}
              onBlur={_onBlur}
              multiline
              fullWidth
            />
          </div>
        </div>
        <div className="edit-modal-content">
          <label>映像の説明文</label>
          <div>
            <RubyField
              id="video-content-temp"
              onConfirmed={_onConfirmed}
              inputProps={{ maxLength: 32 }}
              fullWidth
            />
            <TextField
              id="video-content"
              value={content}
              onChange={_onChangeCategoryName}
              onBlur={_onBlur}
              multiline
              fullWidth
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="edit-modal-footer">
          <Button onClick={onClose}>いいえ</Button>
          <Button onClick={() => {
            if (category && grade && classroom) {
              onSave(title, content, category, grade, classroom)
            } else {
              alert("更新情報が正しくありません。")
            }
          }}>はい</Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
