import React, { useEffect, useState } from "react";
import {
  Col,
  Collapse,
  Row,
  Typography,
  Spin,
  Card,
  Pagination,
  Input,
  Select,
  Upload,
  Form,
  Divider,
  Badge,
  Space,
  Radio,
  Image,
} from "antd";
import { Button, Modal } from "antd";
import { GetSimulation, PostSimulation } from "../../../services/Index";
import TextArea from "antd/es/input/TextArea";
import {
  EyeOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./style.css";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import SimulationIFrame from "../../../common/SimulationIFrame";
dayjs.extend(customParseFormat);
const Simulation = ({
  content,
  setContent,
  handleBack,
  handleClose,
  handleSave,
  addLoader,
}) => {
  const [dataValue, setDataValue] = useState([
    {
      title: "",
      description: "",
      tags: "",
      simulationFile: "",
    },
  ]);
  const optionsWithDisabled = [
    {
      label: "Repo Simulation",
      value: "repo",
    },
  ];
  const [value4, setValue4] = useState("");
  const style = {
    padding: "8px 0",
  };
  const imgStyle = {
    display: "block",
    width: "100%",
    height: 160,
  };
  const [searchValue, setSearchValue] = useState({
    title: "",
    tags: "",
  });
  const [form] = Form.useForm();
  const [scriptReadingTime, setScriptReadingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const wordsPerMinute = 200;
  const [simulationPreviewUrl, setSimulationPreviewUrl] = useState(
    content.simulationDetails &&
      content.simulationDetails.length > 0 &&
      content.simulationDetails[0] &&
      content.simulationDetails[0]?.simulationDetail
      ? content.simulationDetails[0]?.simulationDetail.simulationURL
      : null
  );
  const [loading, setLoading] = useState(false);
  const [showCollapse, setShowCollapse] = useState(
    content.simulationDetails && content.simulationDetails.length > 0
  );
  const [openModel, setOpenModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingSimulations, setLoadingSimulations] = useState(true);
  const pageSize = 10;
  const [simulationList, setSimulationList] = useState([]);
  const [contentValue, setContentValue] = useState({
    simulationId:
      content.simulationDetails &&
      content.simulationDetails.length > 0 &&
      content.simulationDetails[0] &&
      content.simulationDetails[0]
        ? content.simulationDetails[0]?.simulationId
        : "",
    displayTime:
      content.simulationDetails &&
      content.simulationDetails.length > 0 &&
      content.simulationDetails[0] &&
      content.simulationDetails[0]
        ? content.simulationDetails[0]?.displayTime
        : "10:00",
  });
  const handleDelete = () => {
    setDataValue([
      {
        title: "",
        description: "",
        tags: [],
        simulationFile: "",
      },
    ]);
    setContent((prevContent) => ({
      ...prevContent,
      simulationDetails: [],
    }));
    setValue4("");
    setContentValue({
      simulationId: "",
      displayTime: "10:00",
    });
    setShowCollapse(false);
    setSimulationPreviewUrl(null);
  };
  const handleSimulationSelect = (selectedSimulation) => {
    setSimulationPreviewUrl(selectedSimulation.simulationURL);
    const simulation = document.createElement("simulation");
    simulation.src = selectedSimulation.simulationURL;

    let tempValue = contentValue;
    tempValue.simulationId = selectedSimulation.id;
    setContentValue((prevContent) => ({
      ...prevContent,
      ...tempValue,
    }));

    setContent((prevContent) => ({
      ...prevContent,
      simulationDetails: [tempValue],
    }));
    setShowCollapse(true);
    setOpenModel(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
  };
  const handleChange = (value, field, index) => {
    setDataValue((prevState) => {
      const newDataValue = [...prevState];
      newDataValue[index] = {
        ...newDataValue[index],
        [field]: value,
      };
      return newDataValue;
    });
  };

  const handleRemovefile = (index) => {
    // Logic to handle file removal
    const updatedContent = [...dataValue];
    updatedContent[index] = {
      ...updatedContent[index],
      simulationFile: null,
      readyToUpload: false,
    };
    setDataValue(updatedContent);
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;

    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleChangeOption = (value, field) => {
    setContentValue((prevContentValue) => ({
      ...prevContentValue,
      [field]: value,
    }));

    setContent((prevContent) => ({
      ...prevContent,
      simulationDetails: [contentValue],
    }));
  };

  const handleChangeTime = (time, name) => {
    const formattedTime = time.format("mm:ss");
    let tempValue = { ...contentValue, [name]: formattedTime };
    setContentValue(tempValue);
    setContent((prevContent) => ({
      ...prevContent,
      simulationDetails: [tempValue],
    }));
  };

  useEffect(() => {
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );
  
    if (Object.keys(filteredSearchValue).length > 0) {
      GetSimulation(filteredSearchValue)
        .then((res) => {
          setSimulationList(res.results);
        })
        .finally(() => {
          setLoadingSimulations(false); // Update loading state after fetching simulations
        });
    } else {
      GetSimulation()
        .then((res) => {
          setSimulationList(res.results);
        })
        .finally(() => {
          setLoadingSimulations(false); // Update loading state after fetching simulations
        });
    }
  }, [searchValue]);

  const handleFile = (file) => {
    const updatedContent = [...dataValue];
    updatedContent[0] = {
      ...updatedContent[0],
      simulationFile: file,
      readyToUpload: true,
    };
    setDataValue(updatedContent);
  };

  const items = [
    {
      key: "1",
      label: "360 Simulation",
      children: (
        <>
          <Form
            name="basic"
            initialValues={{
              remember: true,
              displayTime:
                content.simulationDetails &&
                content.simulationDetails.length > 0 &&
                content.simulationDetails[0] &&
                content.simulationDetails[0]?.displayTime
                  ? content.simulationDetails[0]?.displayTime
                  : "",
            }}
            onFinish={handleSave}
            autoComplete="off"
          >
            <Col span={24}>
              {simulationPreviewUrl && (
                <>
                  <Col span={24}>
                    <Typography>Simulation Preview:</Typography>
                    <SimulationIFrame url={simulationPreviewUrl} />
                  </Col>
                </>
              )}
            </Col>
            <Row gutter={16} className="mt-5">
              <Col span={12}>
                <Form.Item
                  label="Simulation Time"
                  name="displayTime"
                  rules={[
                    {
                      required: true,
                      message: "Please enter display time!",
                    },
                  ]}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="Display Time"
                      value={dayjs(contentValue.displayTime, "mm:ss")}
                      onChange={(time) => handleChangeTime(time, "displayTime")}
                      views={["minutes", "seconds"]}
                      format="mm:ss"
                    />
                  </LocalizationProvider>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Space
                  align="center"
                  style={{ width: "100%", paddingTop: "12px" }}
                  justify="space-between"
                >
                  <Button type="primary" danger onClick={() => handleDelete(0)}>
                    Delete
                  </Button>
                </Space>
              </Col>
            </Row>
            <Col span={24}>
              <div className="mt-5 flex justify-end">
                <Button type="default" className="mr-5" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  type="primary"
                  className="mr-5"
                  onClick={() => handleBack("5")}
                >
                  Back
                </Button>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={addLoader}>
                    Save & Next
                  </Button>
                </Form.Item>
              </div>
            </Col>
          </Form>
        </>
      ),
    },
  ];

  const onChange4 = ({ target: { value } }) => {
    setValue4(value);
    switch (value) {
      case "repo":
        setOpenModel(true);
        break;
      default:
        break;
    }
  };
  return (
    <>
      {showCollapse ? (
        <Collapse defaultActiveKey={["1"]} accordion items={items} />
      ) : (
        <>
          <Row className="flex gap-20 ">
            <Radio.Group
              options={optionsWithDisabled}
              onChange={onChange4}
              value={value4}
              optionType="button"
              buttonStyle="solid"
            />
          </Row>
          <Col span={24}>
            <div className="mt-5 flex justify-end">
              <Button type="default" className="mr-5" onClick={handleClose}>
                Close
              </Button>
              <Button
                type="primary"
                className="mr-5"
                onClick={() => handleBack("5")}
              >
                Back
              </Button>
              <Button
                type="primary"
                loading={addLoader}
                className="mr-5"
                onClick={() => handleSave()}
              >
                Skip
              </Button>
            </div>
          </Col>
        </>
      )}

      {/* repo simulation */}
      <Modal
        title={
          <>
            <div className="flex items-center justify-between p-4">
              <span className="text-xl m-0">Select Simulation</span>
              <div className="flex items-center justify-between mt-3">
                <Row gutter={16} className="text-left"></Row>
                <div className="flex gap-4">
                  <Col span={12}>
                    <Input
                      placeholder="Enter Simulation"
                      className="min-w-52"
                      value={searchValue.title}
                      name="title"
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Select
                      mode="multiple"
                      placeholder="Search the Tags"
                      style={{ minWidth: 200 }}
                      value={searchValue.tags}
                      onChange={(value) =>
                        setSearchValue((prev) => ({
                          ...prev,
                          tags: value,
                        }))
                      }
                      allowClear
                    >
                      <Option value="Science">Science</Option>
                      <Option value="Mathematics">Mathematics</Option>
                      <Option value="Social Studies">Social Studies</Option>
                      {/* Add more options as needed */}
                    </Select>
                  </Col>
                </div>
              </div>
            </div>
          </>
        }
        open={openModel}
        onCancel={() => {
          setOpenModel(false);
          setValue4("");
        }}
        footer={null}
        width={800}
      >
        {/* Display Spin component while loading */}
        {loadingSimulations ? ( // Display spinner while loading simulations
          <div style={{ textAlign: "center" }}>
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          </div>
        ) : (
          <>
            <Row
              gutter={{
                xs: 8,
                sm: 16,
                md: 24,
                lg: 32,
              }}
            >
              {simulationList.map((val, index) => (
                <Col key={index} className="gutter-row" span={12}>
                  <div style={style}>
                    <Card
                      hoverable
                      onClick={() => handleSimulationSelect(val)}
                      className="h-[260px]"
                    >
                      <Row>
                        <img
                          alt="thumbnailUrl"
                          src={val.thumbnailURL}
                          style={imgStyle}
                        />
                      </Row>
                      <Row
                        align="flex-end"
                        justify="space-between"
                        style={{
                          padding: 10,
                        }}
                      >
                        <Typography>{val.title}</Typography>
                      </Row>
                    </Card>
                  </div>
                </Col>
              ))}
            </Row>
            <Pagination
              style={{ marginTop: "20px", textAlign: "right" }}
              current={currentPage}
              pageSize={pageSize}
              total={simulationList.length}
              onChange={handlePageChange}
            />
          </>
        )}
      </Modal>
    </>
  );
};
export default Simulation;
