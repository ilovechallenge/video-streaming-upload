import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Select, MenuItem } from "@mui/material";

import { CustomSidebar } from "../component/SideBar";
import "../index.scss";
import {
  useGetCategoriesQuery,
  useGetGradesQuery,
  useGetUnitsQuery,
  useUpdateUnitsMutation,
} from "../../api/api-slice";

function ManageUnit() {
  const [unitList, setUnitList] = useState([]);
  const [category, setCategory] = useState(0);
  const [grade, setGrade] = useState(0);

  const { data: categoriesData } = useGetCategoriesQuery();
  console.log("unit categoryData", categoriesData);
  const { data: gradesData, refetch: refetchGrades } =
    useGetGradesQuery(category);
  console.log("unit gradesData", gradesData);

  const { data: unitsData, refetch: refetchUnits } = useGetUnitsQuery(grade);

  useEffect(() => {
    if (unitsData) {
      console.log("===============", unitsData);
      let tempArray = [...unitsData];
      tempArray.sort((a, b) => a.order - b.order);
      setUnitList(tempArray);
    }
  }, [unitsData]);
  console.log("unit unitsData", unitsData);

  const [updateUnit] = useUpdateUnitsMutation();

  const refetchData = () => {
    refetchGrades();
    refetchUnits();
  };

  useEffect(() => {
    refetchData();
  }, [category, grade]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: 10,
    margin: "0 0 10px 0",
    background: isDragging ? "#0d6efd" : "#9abae9",
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: 10,
    width: 800,
  });

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    let updatedResult = result.map((element, index) => ({
      ...element,
      order: index,
    }));
    return updatedResult;
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      unitList,
      result.source.index,
      result.destination.index
    );
    console.log("unitList", items);
    let ids = items.map((element) => element.id);
    setUnitList(items);
    updateUnit(ids);
  };

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
          <div className="unit-manage">
            <h2>単元の並び順</h2>
            <div className="select-unit">
              <div className="select-sub">
                <span>分野</span>
                <Select
                  labelId="category"
                  variant="standard"
                  id="category"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <MenuItem value={0}>選択してください。</MenuItem>
                  {categoriesData &&
                    categoriesData.map((element) => (
                      <MenuItem key={element.id} value={element.id}>
                        {element.name}
                      </MenuItem>
                    ))}
                </Select>
              </div>
              <div className="select-sub" onChange={handleGradeChange}>
                <span>学年</span>
                <Select
                  labelId="grade-label"
                  id="grade"
                  variant="standard"
                  value={grade}
                  onChange={handleGradeChange}
                >
                  <MenuItem value={0}>選択してください。</MenuItem>
                  {gradesData &&
                    gradesData.map((element) => (
                      <MenuItem key={element.id} value={element.id}>
                        {element.level}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
            <div className="drag-container">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {unitList.map((item, index) => (
                        <Draggable
                          key={`${item.id}`}
                          draggableId={`${item.id}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              {item.name}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUnit;
