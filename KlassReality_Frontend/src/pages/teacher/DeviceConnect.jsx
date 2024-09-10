import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Space,
  Divider,
  Badge,
  Tooltip,
  Popconfirm,
  message,
  Avatar,
} from "antd";
import vrglasses from "../../../public/vrglasses.png";
import {
  LiveStatusDevice,
  PatchExperienceContected,
  StopSchool,
  SyncSchool,
} from "../../services/Index";
const { Meta } = Card;

const DeviceConnect = () => {
  const [start, setStart] = useState(false);
  const [onlineDevices, setOnlineDevices] = useState([]);
  const [offlineDevices, setOfflineDevices] = useState([]);
  const [totalActive, setTotalActive] = useState([]);
  const ExpereinceConductedID = localStorage.getItem("expereinceConductedID");
  const [userCompleteStop, setUserCompleteStop] = useState(false);
  const [completedSyncedDevices, setCompletedSyncedDevices] = useState([]);
  const User = useSelector((state) => state.admin.user);
  const location = useLocation();
  const nav = useNavigate();
  const SessionName = localStorage.getItem("headers");
  const [afterStart, setAfterStart] = useState(false);
  const imgStyle = {
    display: "block",
    width: "90%",
    height: 60,
    marginBottom: "10px",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const devices = await SyncSchool();
        if (devices) {
          processDevices(devices);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, [User.schoolId]);

  const processDevices = (devices) => {
    let online = [];
    let offline = [];
    let completedSynced = [];
    devices.forEach((device) => {
      if (device.isActive) {
        const deviceElement = (
          <Col
            key={device.deviceId}
            className="gutter-row"
            xs={12}
            sm={10}
            md={7}
            lg={5}
            xl={3}
          >
            <Card
              style={{
                width: 120,
                marginTop: 16,
              }}
            >
              <Meta
                avatar={<Avatar src={vrglasses} />}
                description={
                  <Badge
                    status={device.isSynced ? "success" : "error"}
                    text={device.deviceId}
                  />
                }
              />
            </Card>
          </Col>
        );
        device.isSynced
          ? online.push(deviceElement)
          : offline.push(deviceElement);
        if (device.isCompleted && device.isSynced) {
          completedSynced.push(device);
        }
      }
    });
    setOnlineDevices(online);
    setOfflineDevices(offline);
    const allSyncCount = online.length;
    const deviceCount = online.length + offline.length;
    setTotalActive(allSyncCount);
    if (allSyncCount === deviceCount) {
      setStart(true);
    }
    setUserCompleteStop(devices.every((device) => !device.isCompleted));
    setCompletedSyncedDevices(completedSynced);
  };

  const handleStart = async () => {
    const data = {
      isStart: true,
      isStop: false,
      experienceId: ExpereinceConductedID,
      gradeId: localStorage.getItem("currentgradeId"),
      sectionId: localStorage.getItem("currentsectionId"),
    };
    await LiveStatusDevice(data);
    setAfterStart(true);
  };

  const handleCurrentStop = async () => {
    const data = { isStart: false, isStop: true };
    await LiveStatusDevice(data);
    await StopSchool();
    localStorage.removeItem("headers");
    localStorage.removeItem("CurrentsessionId");
    nav("/experienceList", { replace: true });
  };

  const handleCurrentStopValue = async () => {
    const startTime = new Date(localStorage.getItem("currentStartTime"));
    const endTime = new Date();
    const timeDiffInMilliseconds = endTime - startTime;
    const classConductedHours = timeDiffInMilliseconds / (1000 * 60 * 60);
    const data = {
      classEndTime: new Date().toISOString(),
      totalStudentsAttended: totalActive,
      totalDevicesActive: totalActive,
      classConductedHours: classConductedHours.toFixed(2),
      feedback: "Not Completed",
    };
    try {
      const res = await PatchExperienceContected(ExpereinceConductedID, data);
      const data1 = {
        isStart: false,
        isStop: true,
        experienceId: res.id,
        gradeId: localStorage.getItem("currentgradeId"),
        sectionId: localStorage.getItem("currentsectionId"),
      };
      await LiveStatusDevice(data1);
      await StopSchool();
      nav("/experienceList", { replace: true });
    } catch (error) {
      console.error("Error posting experience:", error);
    }
  };
  

  const handleStop = async () => {
    const startTime = new Date(localStorage.getItem("currentStartTime"));
    const endTime = new Date();
    const timeDiffInMilliseconds = endTime - startTime;
    const classConductedHours = timeDiffInMilliseconds / (1000 * 60 * 60);
    const data = {
      classEndTime: new Date().toISOString(),
      totalStudentsAttended: totalActive,
      totalDevicesActive: totalActive,
      classConductedHours: classConductedHours.toFixed(2),
      feedback: "Completed",
    };
    try {
      const res = await PatchExperienceContected(ExpereinceConductedID, data);
      const data1 = {
        isStart: false,
        isStop: true,
        experienceId: res.id,
        gradeId: localStorage.getItem("currentgradeId"),
        sectionId: localStorage.getItem("currentsectionId"),
      };
      await LiveStatusDevice(data1);
      await StopSchool();
      message.success("Experience completed successfully");
      nav("/experienceList", { replace: true });
    } catch (error) {
      console.error("Error posting experience:", error);
    }
  };

  return (
    <div>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Connected Device - {SessionName}
      </Divider>
      <div className="flex justify-center">
        <Card
          style={{
            width: 300,
          }}
          actions={[
            <Tooltip placement="top" title="Offline">
              <Badge status={"error"} text={offlineDevices.length} />
            </Tooltip>,
            <Tooltip placement="top" title="Online">
              <Badge status={"success"} text={onlineDevices.length} />
            </Tooltip>,
            <Tooltip placement="top" title="Completed">
              <Badge
                status={"processing"}
                text={completedSyncedDevices.length}
              />
            </Tooltip>,
          ]}
        >
          <Meta title="Total Count" />
        </Card>
      </div>
      {!afterStart ? (
        <>
          <div className="flex items-center justify-between mt-3">
            <Row gutter={16} className="text-left"></Row>
            <div className="flex gap-4">
              <Space>
                <Tooltip placement="top" title="Stop Class">
                  <Popconfirm
                    title="Stop the Class"
                    description="Are you sure to Stop this class?"
                    onConfirm={handleCurrentStop}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger type="primary" icon={<StopOutlined />}>
                      Stop
                    </Button>
                  </Popconfirm>
                </Tooltip>
                <Tooltip placement="top" title="Start Class">
                  <Popconfirm
                    title="Start the Class"
                    description="Are you sure to Start this class?"
                    onConfirm={handleStart}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button disabled={!start}>Start</Button>
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          </div>
          <Row gutter={[16, 16]}>
            {onlineDevices}
            {offlineDevices}
          </Row>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-between mt-3">
            <Row gutter={16} className="text-left">
              <Typography>Live Class Ongoing...</Typography>
            </Row>
            <div className="flex gap-4">
              <Space>
                <Tooltip placement="top" title="Stop Class">
                  <Popconfirm
                    title="Stop the Class"
                    description="Are you sure to Stop this class?"
                    onConfirm={handleCurrentStopValue}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger type="primary">
                      Experience Stop
                    </Button>
                  </Popconfirm>
                </Tooltip>
                <Tooltip placement="top" title="Finish Class">
                  <Popconfirm
                    title="Finish the Class"
                    description="Are you sure to Finish this class?"
                    onConfirm={handleStop}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" disabled={userCompleteStop}>
                      Finish
                    </Button>
                  </Popconfirm>
                </Tooltip>
              </Space>
            </div>
          </div>
          <Row gutter={[16, 16]}>{onlineDevices}</Row>
        </div>
      )}
    </div>
  );
};

export default DeviceConnect;
