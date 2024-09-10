import {
  CameraOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  DollarOutlined,
  FileImageOutlined,
  LogoutOutlined,
  MailOutlined,
  PicLeftOutlined,
  RotateRightOutlined,
  SaveOutlined,
  StockOutlined,
  TeamOutlined,
  UngroupOutlined,
  UserAddOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Divider, Dropdown, Layout, Menu, message, theme } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../redux/features/counter/adminSlice";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const Roles = useSelector((state) => state.admin.user.role);
  const location = useLocation();
  const [active] = useState(location.pathname.replace("/", ""));
  const User = useSelector((state) => state.admin.user);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAvatarClick = (e) => {
    if (e.key === "logout") {
      message.success("Successfully logged out");
      dispatch(resetApplication());
      dispatch(resetUserData());
      localStorage.clear();
      navigate("/login", { replace: true });
    }
    setVisible(false);
  };

  const avatarMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: User.name,
    },
    {
      key: "email",
      icon: <MailOutlined />,
      label: User.email,
    },
    {
      key: "divider",
      label: <Divider className="m-0" />,
    },
    {
      key: "logout",
      label: (
        <div className="flex gap-2 items-center text-red-500">
          <LogoutOutlined /> <span>Log out</span>
        </div>
      ),
    },
  ];

  const getMenuItems = () => {
    switch (Roles) {
      case "teacher":
        return [
          {
            key: "dashboard",
            icon: <DashboardOutlined />,
            label: <Link to="/teacherDashboard">Dashboard</Link>,
          },
          {
            key: "experience",
            icon: <SaveOutlined />,
            label: <Link to="/experience">Experience</Link>,
          },
          {
            key: "myexperience",
            icon: <PicLeftOutlined />,
            label: <Link to="/myexperience">My Experience</Link>,
          },
          {
            key: "experience_contucted",
            icon:<StockOutlined />,
            label: <Link to="/experienceList">Experience Report</Link>,
          },
        ];
      case "systemadmin":
        return [
          {
            key: "dashboard",
            icon: <DesktopOutlined />,
            label: <Link to="/dashboard">Dashboard</Link>,
          },
          {
            key: "client",
            icon: <UserOutlined />,
            label: <Link to="/client">Client</Link>,
          },
          {
            key: "subscription",
            icon: <DollarOutlined />,
            label: <Link to="/subscription">Subscription</Link>,
          },
          {
            key: "roles",
            icon: <UsergroupAddOutlined />,
            label: <Link to="/roles">Roles</Link>,
          },
        ];
      case "repoManager":
        return [
          {
            key: "model",
            icon: <RotateRightOutlined />,
            label: <Link to="/model">3D Model</Link>,
          },
          {
            key: "video",
            icon: <VideoCameraOutlined />,
            label: <Link to="/video">360 Video</Link>,
          },
          {
            key: "image",
            icon: <CameraOutlined />,
            label: <Link to="/image">360 Image</Link>,
          },
          {
            key: "simulation",
            icon: <UngroupOutlined />,
            label: <Link to="/simulation">Simulation</Link>,
          },
        ];
      case "admin":
        return [
          {
            key: "management",
            icon: <RotateRightOutlined />,
            label: "Management",
            children: [
              {
                key: "devicemanagement",
                icon: <DatabaseOutlined />,
                label: <Link to="/devicemanagement">Device</Link>,
              },
              {
                key: "teachermanagement",
                icon: <TeamOutlined />,
                label: <Link to="/teachermanagement">Teacher</Link>,
              },
              {
                key: "studentmanagement",
                icon: <UserAddOutlined />,
                label: <Link to="/studentmanagement">Student</Link>,
              },
            ],
          },
        ];
      case "superadmin":
        return [
          {
            key: "_dashboard",
            icon: <DesktopOutlined />,
            label: <Link to="/_dashboard">Dashboard</Link>,
          },
        ];
      default:
        return [];
    }
  };

  return (
    <Layout hasSider>
      <Sider
        theme="dark"
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="px-3 py-1 my-2 mx-1">
          <p className="text-base py-2 text-gray-50 bg-gray-700 rounded m-0 text-center">
            Klass Reality
          </p>
          {/* <img src="" alt="" /> */}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          style={{ fontSize: "16px" }}
          defaultSelectedKeys={[active]}
        >
          {getMenuItems().map((item) => {
            if (item.children) {
              return (
                <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
                  {item.children.map((child) => (
                    <Menu.Item key={child.key} icon={child.icon}>
                      {child.label}
                    </Menu.Item>
                  ))}
                </Menu.SubMenu>
              );
            } else {
              return (
                <Menu.Item key={item.key} icon={item.icon}>
                  {item.label}
                </Menu.Item>
              );
            }
          })}
        </Menu>
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
          height: "100%",
          minHeight: "100vh",
        }}
      >
        <Header className="flex justify-end px-4 items-center layout-bg">
          <Dropdown
            overlay={<Menu onClick={handleAvatarClick} items={avatarMenuItems} />}
            trigger={["click"]}
            open={visible}
            onOpenChange={(flag) => setVisible(flag)}
          >
            <Avatar
              style={{
                backgroundColor: "#ba28a9",
                verticalAlign: "middle",
              }}
              size="large"
              gap={2}
              className="cursor-pointer"
            >
              <UserOutlined size={"small"} color={"black"} />
            </Avatar>
          </Dropdown>
        </Header>
        <Content
          className="layout-bg"
          style={{
            padding: "24px 16px 0",
            overflow: "initial",
          }}
        >
          <div
            style={{
              padding: 24,
              textAlign: "center",
              borderRadius: borderRadiusLG,
              background: "rgba(255, 255, 255, 0.83)",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
