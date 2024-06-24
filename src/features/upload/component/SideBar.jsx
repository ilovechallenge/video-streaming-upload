import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
  useProSidebar,
} from "react-pro-sidebar";
import { useNavigate } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";

export const CustomSidebar = () => {
  const { collapseSidebar } = useProSidebar();
  const navigate = useNavigate();
  return (
    <div id="side-bar" style={({ height: "100vh" }, { display: "flex" })}>
      <Sidebar style={{ height: "100%" }}>
        <Menu>
          <MenuItem
            icon={<MenuOutlinedIcon />}
            onClick={() => {
              collapseSidebar();
            }}
            style={{ textAlign: "left" }}
          >
            <h2>管理画面</h2>
          </MenuItem>
          <MenuItem icon={<HomeOutlinedIcon />}>ダッシュボード</MenuItem>
          <MenuItem icon={<PeopleOutlinedIcon />}>ユーザー管理</MenuItem>
          <SubMenu label="ファイル管理" icon={<ReceiptOutlinedIcon />}>
            <MenuItem icon={<ListIcon />} onClick={() => {
              localStorage.setItem("reload", "true");
              navigate("/");}
            }>
              リスト
            </MenuItem>
            <MenuItem icon={<AddIcon />} onClick={() => navigate("/add_file")}>
              追加
            </MenuItem>
            <MenuItem
              icon={<ArrowDropUp />}
              onClick={() => navigate("/manage_unit")}
            >
              単元管理
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};
