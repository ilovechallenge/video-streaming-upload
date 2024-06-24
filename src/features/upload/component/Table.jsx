import React from "react";
import MaterialTable from "material-table";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { EditModal } from "./EditModal";
import {
  useUpdateVideosMutation,
  useDeleteVideosMutation,
  useGetVideosQuery,
} from "../../api/api-slice";
import { ConfirmModal } from "./ConfirmModal";
import { CustomSpinner } from "./Spinner";

export function CustomTable({ data, originData }) {
  const defaultMaterialTheme = createTheme();
  const [showDialog, setShowDialog] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [confirmData, setConfirmData] = React.useState([]);
  const [selectedRowCnt, setSelectedRowCnt] = React.useState(0);

  const [videoId, setVideoId] = React.useState(0);
  const [videoTitle, setVideoTitle] = React.useState("");
  const [videoContent, setVideoContent] = React.useState("");

  const tableRef = React.useRef(null);

  const [updateVideo, updateResult] = useUpdateVideosMutation();
  const [deleteVideos, deleteResult] = useDeleteVideosMutation();
  const { videosData, refetch } = useGetVideosQuery();

  const handleEdit = (rowData) => {
    console.log("rowData: ", rowData)
    setVideoId(rowData.id);
    setVideoTitle(originData.find((obj) => obj.id === rowData.id).title);
    setVideoContent(originData.find((obj) => obj.id === rowData.id).content);
    setShowDialog(true);
  };
  const handleClose = () => {
    setShowDialog(false);
  };

  const handleConfirmClose = () => {
    setShowConfirmDialog(false);
  };

  const confirmDeletion = () => {
    let video_ids = confirmData.map((element) => element.id);
    deleteVideos(video_ids).then((response) => {
      let result = response.data;
      console.log("result", result);
      if (result.message === "success") {
        refetch();
      }
    });
    setShowConfirmDialog(false);
  };

  const handleDelete = (event, data) => {
    console.log("confirmdata: ", data);
    let testTable = tableRef.current.dataManager.data.filter(
      (o) => o.tableData.checked
    );
    setShowConfirmDialog(true);
    setConfirmData(data);
    setSelectedRowCnt(testTable.length);
  };

  const updateTable = (videoTitle, videoContent, category, grade, classroom) => {
    let title = videoTitle;
    let content = videoContent;
    let data = {
      id: videoId,
      data: {
        title: title,
        content: content,
        category: category,
        grade: grade,
        unit: classroom,
      },
    };
    updateVideo(data);
    setShowDialog(false);
  };

  const bgColor = "#ded6d6";
  const color = "#000";

  if (updateResult.isLoading || deleteResult.isLoading) {
    return (<CustomSpinner />)
  }
  return (
    <>
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="アップロード一覧"
          tableRef={tableRef}
          style={{
            backgroundColor: bgColor,
            color: color,
            fontFamily: "Noto Sans JP, sans-serif",
          }}
          columns={[
            { title: "映像ID", field: "id", hidden: true },
            { title: "分野", field: "category" },
            { title: "学年", field: "grade" },
            { title: "単元名", field: "unit" },
            { title: "タイトル", field: "title" },
            { title: "説明文", field: "content" },
            { title: "動画データ", field: "media" },
            { title: "字幕データ", field: "caption" },
            {
              title: "",
              field: "delete",
              render: (rowData) => (
                <Button
                  style={{
                    backgroundColor: "green",
                    color: "white",
                  }}
                  onClick={() => handleEdit(rowData)}
                >
                  <span
                    style={{
                      fontFamily: "'Noto Sans JP', sans-serif",
                      fontSize: "1rem",
                    }}
                  >
                    編集
                  </span>
                </Button>
              ),
            },
          ]}
          data={data}
          options={{
            selection: true,
            sorting: true,
            pageSizeOptions: [5, 10],
            addRowPosition: "last",
            headerStyle: {
              backgroundColor: bgColor,
              color: color,
            },
            rowStyle: {
              backgroundColor: bgColor,
              color: color,
            },
          }}
          localization={{
            body: {
              emptyDataSourceMessage: "データがありません。",
              addTooltip: "追加",
              deleteTooltip: "削除",
              editTooltip: "編集",
              filterRow: {
                filterTooltip: "フィルター",
              },
              editRow: {
                deleteText: "この行を本当に削除しますか？",
                cancelTooltip: "キャンセル",
                saveTooltip: "保存",
              },
            },
            grouping: {
              placeholder: "列をドラッグしてグループ化します...",
              groupedBy: "グループ化された項目:",
            },
            header: {
              actions: "アクション",
            },
            pagination: {
              labelDisplayedRows: "{count}件中{from}-{to}件目",
              labelRowsSelect: "行",
              labelRowsPerPage: "ページごとの行数:",
              firstAriaLabel: "最初のページ",
              firstTooltip: "最初のページ",
              previousAriaLabel: "前のページ",
              previousTooltip: "前のページ",
              nextAriaLabel: "次のページ",
              nextTooltip: "次のページ",
              lastAriaLabel: "最後のページ",
              lastTooltip: "最後のページ",
            },
            toolbar: {
              addRemoveColumns: "列の追加または削除",
              nRowsSelected: "選択された行数: {0}行",
              showColumnsTitle: "列の表示",
              showColumnsAriaLabel: "列の表示",
              exportTitle: "エクスポート",
              exportAriaLabel: "エクスポート",
              searchTooltip: "検索",
              searchPlaceholder: "検索",
            },
          }}
          actions={[
            {
              tooltip: "選択したデータをすべて削除",
              icon: "delete",
              onClick: (evt, data) => handleDelete(evt, data),
            },
          ]}
        />
      </ThemeProvider>
      <div className="edit-dialog">
        <EditModal
          showModal={showDialog}
          onClose={handleClose}
          onSave={updateTable}
          videoTitle={videoTitle}
          videoContent={videoContent}
          videoId={videoId}
        ></EditModal>
      </div>
      <div className="confirm-dialog">
        <ConfirmModal
          showModal={showConfirmDialog}
          onClose={handleConfirmClose}
          onSave={confirmDeletion}
          selectedRowCnt={selectedRowCnt}
        ></ConfirmModal>
      </div>
    </>
  );
}
