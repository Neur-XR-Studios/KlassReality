import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Statistic,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import subjectOptions from "../../../json/subject";
import MyExperienceTable from "./MyExperienceTable";
import {
  DeploySession,
  GetGrades,
  GetMyExperience,
  PostExperienceContected,
  StartSchool,
  StopSchool,
  SyncSchool,
  GradeSectionFilter, // Import the function here
} from "../../../services/Index";
import { useSelector } from "react-redux";
import moment from "moment";

const MyExperience = () => {
  const User = useSelector((state) => state.admin.user);
  const [experience, setExperience] = useState([]);
  const [searchValue, setSearchValue] = useState({
    grade: "",
    subject: "",
  });
  const [form] = Form.useForm();
  const [selectedValue, setSelectedValue] = useState(null);
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);

  const [deployModal, setDeployModal] = useState(false);
  const [deployModalStep2, setDeployModalStep2] = useState(false);
  const [IsActive, setIsActive] = useState(false);
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [deployedOpen, setDeployedOpen] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [deployButtonLoading, setDeployButtonLoading] = useState(false);
  const nav = useNavigate();

  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  const handleSearch = (e) => {
    const { name, value } = e.target;

    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleDeploy = async (values) => {
    try {
      setDeployButtonLoading(true);
      const { gradeId, sectionId } = values;
      localStorage.setItem("currentStartTime", new Date().toISOString());
      localStorage.setItem("currentgradeId", gradeId);
      localStorage.setItem("currentsectionId", sectionId);
      localStorage.setItem("CurrentsessionId", selectedValue);
      const session = await DeploySession(selectedValue).then(() => {
        message.success("Deployed Successfully!");
        setSelectedValue(null);
        setDeployModal(false);
        setIsActive(true);
        setDeployModalStep2(true);
        handleRefresh();
      });
      form.resetFields();
      const data = {
        sessionID: selectedValue,
        classStartTime: new Date().toISOString(),
        conductedDate: new Date().toISOString(),
        sectionID: sectionId,
        gradeID: gradeId,
      };
      const res = await PostExperienceContected(data);
      localStorage.setItem("expereinceConductedID", res.id),
        setTimeout(async () => {
          try {
            await StartSchool();
          } catch (err) {
            message.error(err.response.data.message);
          }
        }, 2000);
    } catch (err) {
      message.error(err.response.data.message);
    } finally {
      setDeployButtonLoading(false);
    }
  };

  const handleView = (id) => {
    nav(`/viewmyexperience/${id}`);
  };
  const handleClose = () => {
    setDeployModal(false), setSelectedValue(null);
    form.resetFields();
  };

  const handleGradeChange = async (gradeId) => {
    try {
      const response = await GradeSectionFilter(gradeId);
      setSections(response); // Assuming the response structure
      form.setFieldsValue({ sectionId: undefined });
    } catch (error) {
      message.error("Error fetching sections");
    }
  };

  useEffect(() => {
    if (IsActive) {
      const fetchData = async () => {
        try {
          const devices = await SyncSchool();
          if (devices) {
            if (User.schoolId === devices[0].schoolId) {
              let activeCount = 0;
              let inactiveCount = 0;
              devices.forEach((device) => {
                if (device.isActive) {
                  activeCount++;
                } else {
                  inactiveCount++;
                }
              });
              setOnlineCount(activeCount);
              if (activeCount != 0) {
                setDisabled(true);
              }
              setOfflineCount(inactiveCount);
              setTotalCount(devices.length);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();

      const intervalId = setInterval(fetchData, 5000);

      return () => clearInterval(intervalId);
    }
  }, [User.schoolId, totalCount, IsActive]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gradeResponse = await GetGrades();
        setGrades(gradeResponse);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        message.error(
          error.response ? error.response.data.message : "Error fetching data"
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setDeployedOpen(false);
    GetMyExperience(searchValue)
      .then((res) => {
        const deployedItems = res.filter((item) => item.isDeployed === true);
        const nonDeployedItems = res.filter((item) => item.isDeployed !== true);
        const sortedExperience = deployedItems.concat(nonDeployedItems);
        const hasDeployedItems = deployedItems.length > 0;
        setDeployedOpen(hasDeployedItems);
        setExperience(
          sortedExperience.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );

        setLoading(false);
      })
      .catch((err) => {
        let errRes = err.response.data;
        if (errRes.code == 401) {
        } else {
          message.error(err.response.data.message);
          setLoading(false);
        }
      });
  }, [refresh, searchValue]);

  const onRoute = () => {
    nav("/AddExperience", { replace: true });
  };
  const onSocketModel = () => {
    nav("/deviceconnect", {
      state: {
        SessionName: header,
      },
      replace: true,
    });
  };
  const setDeployedDeactive = async () => {
    try {
      setLoading(true);

      // Assuming StopSchool is an asynchronous function
      await StopSchool();
      localStorage.setItem("expereinceConductedID", null), setIsActive(false);
      setRefresh((prevRefresh) => !prevRefresh);
      await handleRefresh(); // Assuming handleRefresh is asynchronous
      setDeployModalStep2(false);
    } catch (error) {
      console.error("Error occurred:", error);
    } finally {
      setLoading(false);
    }
  };
  const OpenLiveClass = () => {
    nav("/deviceconnect");
  };
  return (
    <div className="">
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        My Experience
      </Divider>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left">
          <Col span={12}>
            <Input
              placeholder="Enter Grade"
              className="min-w-62"
              value={searchValue.grade}
              name="grade"
              onChange={(e) => handleSearch(e)}
            />
          </Col>
          <Col span={12}>
            <Select
              showSearch
              placeholder="Select a Subject"
              allowClear
              className="min-w-62"
              onChange={(e) =>
                handleSearch({ target: { value: e, name: "subject" } })
              }
              options={subjectOptions}
            />
          </Col>
        </Row>
        <div className="flex gap-4">
          <Tooltip placement="top" title="Live Class">
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={!deployedOpen}
              onClick={OpenLiveClass}
            >
              Live Classes
            </Button>
          </Tooltip>
          <Tooltip placement="top" title="Deploy Experience">
            <Button
              type="primary"
              icon={<SendOutlined />}
              disabled={!selectedValue}
              onClick={() => setDeployModal(true)}
              loading={deployButtonLoading}
            >
              Deploy
            </Button>
          </Tooltip>
          <Modal
            title="Select the Class for Deployment?"
            open={deployModal}
            footer={false}
            closable={false}
          >
            <Form
              form={form}
              onFinish={handleDeploy}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              autoComplete="off"
            >
              <Form.Item
                name="gradeId"
                label="Grade"
                rules={[{ required: true, message: "Please select grade!" }]}
              >
                <Select
                  placeholder="Choose grade"
                  onChange={handleGradeChange} // Add the handler here
                >
                  {grades.map((grade) => (
                    <Option key={grade.id} value={grade.id}>
                      {grade.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="sectionId"
                label="Section"
                rules={[{ required: true, message: "Please select section!" }]}
              >
                <Select placeholder="Please select a section">
                  {sections.map((section) => (
                    <Option key={section.id} value={section.id}>
                      {section.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Space>
                  <Button onClick={() => handleClose()}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={deployButtonLoading}
                  >
                    Submit
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            width={600}
            title={`Active & Inactive Devices`}
            open={deployModalStep2}
            okButtonProps={{ disabled: !disabled }}
            onCancel={setDeployedDeactive}
            onOk={onSocketModel}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Active"
                    value={onlineCount}
                    valueStyle={{
                      color: "#3f8600",
                    }}
                    prefix={<ArrowUpOutlined />}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card bordered={false}>
                  <Statistic
                    title="Inactive"
                    value={offlineCount}
                    valueStyle={{
                      color: "#cf1322",
                    }}
                    prefix={<ArrowDownOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Modal>
          <Tooltip placement="top" title="Add Experience">
            <Button type="primary" onClick={onRoute} icon={<PlusOutlined />}>
              Add Experience
            </Button>
          </Tooltip>
        </div>
      </div>
      <MyExperienceTable
        data={experience}
        handleRefresh={handleRefresh}
        loading={loading}
        handleDeploy={handleDeploy}
        handleView={handleView}
        setSelectedValue={setSelectedValue}
        selectedValue={selectedValue}
        setHeader={setHeader}
      />
    </div>
  );
};
export default MyExperience;
