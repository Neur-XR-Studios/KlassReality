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
  message,
  Tooltip,
} from "antd";
import { Button, Modal } from "antd";
import { GetModel, GetTeacherModelTag, PostModel } from "../../../services/Index";
import TextArea from "antd/es/input/TextArea";
import { UploadOutlined } from "@ant-design/icons";
import ModelViewer from "../../../components/modelViewer/ModelViewer";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import subjectOptions from "../../../json/subject";

dayjs.extend(customParseFormat);

const Model3D = ({
  handleBack,
  handleClose,
  handleSave,
  content,
  setContent,
}) => {
  const style = {
    padding: "8px 0",
  };
  // const [url, setUrl] = useState(null);
  const [dataValue, setDataValue] = useState({
    modelName: "",
    description: "",
    tags: [],
  });
  const [form] = Form.useForm();
  const [scriptReadingTime, setScriptReadingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [searchValue, setSearchValue] = useState({
    modelName: "",
    tags: [],
  });
  const wordsPerMinute = 200;
  const [tags, setTags] = useState([]);
  const [modelDuration, setModelDuration] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [modelList, setModelList] = useState([]);
  const [modelOpen, setModalOpen] = useState(false);
  const [indexSaver, setIndexSaver] = useState(0);
  const [modelValue, setModelValue] = useState([]);
  const [contentValue, setContentValue] = useState([
    {
      script: "",
      modelId: "",
      modelUrl: "",
      displayTime: "02:00",
    },
  ]);
  const [isFormValidList, setIsFormValidList] = useState(
    contentValue.map(() => false)
  );
  useEffect(() => {
    const initialContentValue = content.modelDetails.map((modelDetail) => ({
      script: modelDetail.script,
      modelId: modelDetail.modelData?.id,
      modelUrl: modelDetail?.modelData?.modelUrl,
      displayTime: modelDetail.displayTime,
      modelCoordinates: modelDetail?.modelCoordinates,
    }));
    setContentValue(initialContentValue);
  }, []);

  const handleSearch = (e) => {
    const { name, value } = e.target;
    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleDelete = (index) => {
    const filteredContent = contentValue.filter((_, idx) => idx !== index);
    setContentValue(filteredContent);
    setContent((prevContent) => ({
      ...prevContent,
      modelDetails: filteredContent,
    }));
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const handleModelSelect = (model) => {
    let tempValue = contentValue;
    tempValue[indexSaver] = {
      ...tempValue[indexSaver],
      modelId: model.id,
      modelUrl: model.modelUrl,
    };
    setContentValue(tempValue);
    setContent((prevContent) => ({
      ...prevContent,
      modelDetails: tempValue,
    }));
    setOpenModel(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page); // Update current page
  };
  const handleSelectModel = async (index) => {
    setIndexSaver(index);
    try {
      setOpenModel(true);
    } catch (error) {
      console.error("Error fetching model list:", error);
    }
  };
  const showModal = (index) => {
    setIndexSaver(index);
    setOpen(true);
  };
  const handleChange = (value, name) => {
    setDataValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeOption = (value, field, index) => {
    let tempvalue = contentValue;
    tempvalue[index] = {
      ...tempvalue[index],
      [field]: value,
    };
    setContentValue(tempvalue);
    setContent((prevContent) => ({
      ...prevContent,
      modelDetails: tempvalue,
    }));
    // console.log(contentValue)
  };

  const handleFinish = async (values) => {
    const formData = new FormData();

    const value = dataValue;
    formData.append("modelFile", value.model);
    formData.append("modelName", value.modelName);
    formData.append("description", value.description);
    value.tags.forEach(tag => formData.append("tags[]", tag.trim()));
    formData.append("thumbnailFile", value.model);
    setLoading(true);
    try {
      const response = await PostModel(formData);
      let tempValue = contentValue;
      tempValue[indexSaver] = {
        ...tempValue[indexSaver],
        modelId: response.id,
        modelUrl: response.modelUrl,
      };
      setContentValue(tempValue);
      setContent((prevContent) => ({
        ...prevContent,
        modelDetails: tempValue,
      }));
      setLoading(false);
      message.success("Model uploaded successfully");
    } catch (error) {
      message.error("Failed to upload model");
      console.error("Upload failed:", error);
    }

    setOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    if (dataValue.modelFile && dataValue.modelFile.type?.includes("model/")) {
      const model = document.createElement("model");
      model.src = URL.createObjectURL(dataValue.modelFile);
      model.onloadedmetadata = () => {
        setModelDuration(model.duration);
      };
    }

    if (contentValue.script && contentValue.script.length > 5) {
      const words = contentValue.script.split(/\s+/).length;
      const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);

      const hours = Math.floor(totalSeconds / 3600);
      const remainingSecondsAfterHours = totalSeconds % 3600;

      const minutes = Math.floor(remainingSecondsAfterHours / 60);
      const seconds = remainingSecondsAfterHours % 60;

      setScriptReadingTime({
        hours,
        minutes,
        seconds,
      });
    }
  }, [dataValue, setDataValue, wordsPerMinute, contentValue]);
  useEffect(() => {
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );
  
    if (Object.keys(filteredSearchValue).length > 0) {
      const data = {
        ...filteredSearchValue,
        limit: pageSize, // Use pageSize in the API call
        page: currentPage,
      };
      GetModel(data).then((res) => {
        setModelList(res.results);
      });
    } else {
      GetModel().then((res) => {
        setModelList(res.results);
      });
    }
    GetTeacherModelTag().then((res) => {
      const formattedTags = res.map((tag) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    });
  }, [searchValue]);

  const handleFile = (file) => {
    setDataValue((prevValue) => ({
      ...prevValue,
      model: file,
      readyToUpload: true,
    }));
  };

  const handleRemovefile = (index) => {
    const updatedContent = contentValue.filter((_, i) => i !== index);
    setContentValue(updatedContent);
  };
  const handleChangeTime = (time, name, index) => {
    const formattedTime = time.format("mm:ss");
    const tempValue = [...contentValue];
    tempValue[index] = {
      ...tempValue[index],
      displayTime: formattedTime,
    };
    setContentValue(tempValue);
    setContent((prevContent) => ({
      ...prevContent,
      modelDetails: tempValue,
    }));
  };

  const panels = contentValue.map((val, index) => (
    <Collapse.Panel header={`Model ${index + 1}`} key={index}>
      <Row className="flex gap-20 ">
        <Col>
          <div className="text-left">
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => showModal(index)}
            >
              {" "}
              Local Model
            </Button>
          </div>
        </Col>
        <Col>
          <div className="text-left">
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => handleSelectModel(index)} // Pass index here
            >
              Repo Model
            </Button>
          </div>
        </Col>
      </Row>
      <Form
        name="basic"
        initialValues={{
          remember: true,
          displayTime: val.displayTime ? dayjs(val.displayTime, "mm:ss") : null,
          script: val.script,
        }}
        onFinish={handleSave}
        autoComplete="off"
        onValuesChange={(changedValues, allValues) => {
          const isCurrentFormValid =
            allValues.script &&
            allValues.script.trim().length > 5 &&
            allValues.displayTime;

          setIsFormValidList((prevList) => {
            const newList = [...prevList];
            newList[index] = isCurrentFormValid;
            return newList;
          });
        }}
      >
        <Row gutter={16}>
          <Col span={12} className="mt-6">
            <>
              {(index === 0 || val.modelUrl) && (
                <Card>
                  {val.modelId ? (
                    <>
                    <div className="flex flex-col gap-0 items-center h-56">
                      <ModelViewer
                        modelUrl={val.modelUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          focus: true,
                        }}
                      />
                      
                    </div>
                      <div style={{ color: "black", margin: 12}}>
                      Note: Uploading a Model Exceding 1,00,000 PolyCount may cause
                      performance degradation on device
                    </div>
                    </>
                  ) : (
                    <p>Model Not Found</p>
                  )}
                </Card>
              )}
            </>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Script"
              name="script"
              rules={[
                {
                  required: contentValue[index].modelId != "",
                  message: "Script Missing!",
                },
                {
                  min: 5,
                  message: "Character script must be at least 5 characters!",
                },
              ]}
            >
              <TextArea
                name="script"
                value={val.script}
                disabled={contentValue[index].modelId == ""}
                onChange={(e) =>
                  handleChangeOption(e.target.value, "script", index)
                }
                placeholder="Please enter your Model script"
                autoSize={{ minRows: 12, maxRows: 12 }}
              />
            </Form.Item>

            <Row className="p-6 float-right">
              <Form.Item
                name="displayTime"
                rules={[
                  {
                    required: true,
                    message: "Please enter your character displayTime!",
                  },
                ]}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Interaction Timer"
                    value={dayjs(val.displayTime, "mm:ss")} // Pass the current value of displayTime as a dayjs object
                    onChange={(time) =>
                      handleChangeTime(time, "displayTime", index)
                    } // Call handleChangeTime with the time and index
                    views={["minutes", "seconds"]}
                    format="mm:ss"
                  />
                </LocalizationProvider>
              </Form.Item>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="flex">
            <Space
              align="center"
              style={{ width: "100%", paddingTop: "11px" }}
              justify="space-between"
            >
              <Button type="primary" danger onClick={() => handleDelete(index)}>
                Delete
              </Button>

              {isFormValidList[index] && (
                <Button
                  type="primary"
                  className="mr-3"
                  onClick={() => addNewModel(contentValue.length)}
                >
                  Add More
                </Button>
              )}
            </Space>
            <Space>
              <div className="pt-7 flex justify-end">
                <Button type="default" className="mr-5" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  type="primary"
                  className="mr-3"
                  onClick={() => handleBack("4")}
                >
                  Back
                </Button>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Save & Next
                  </Button>
                </Form.Item>
              </div>
            </Space>
          </Col>
        </Row>
        <Col span={24}></Col>
      </Form>
    </Collapse.Panel>
  ));
  const addNewModel = (index) => {
    if (index != 3) {
      setContentValue([
        ...contentValue,
        {
          script: "",
          modelId: "",
          modelUrl: "",
          displayTime: "02:00",
        },
      ]);
    } else {
      message.warning("Model Limit Reached");
    }
  };
  const options = [];
  return (
    <>
      <Collapse defaultActiveKey={["1"]} accordion>
        {panels}
      </Collapse>
      {contentValue.length < 3 && (
        <>
          {contentValue.length == 0 && (
            <Col span={24}>
              <Button
                onClick={() => addNewModel(contentValue.length)}
                style={{ marginTop: 16 }}
              >
                Add Model
              </Button>
              <div className="mt-5 flex justify-end">
                <Button type="default" className="mr-5" onClick={handleClose}>
                  Close
                </Button>
                <Button
                  type="primary"
                  className="mr-5"
                  onClick={() => handleBack("4")}
                >
                  Back
                </Button>

                <Button
                  type="primary"
                  className="mr-5"
                  onClick={() => handleSave()}
                >
                  Skip
                </Button>
              </div>
            </Col>
          )}
        </>
      )}

      <Modal
        width={800}
        title="Add Model"
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Model Name"
            name="modelName"
            rules={[
              {
                required: true,
                message: "Please input your modelName!",
              },
            ]}
          >
            <Input
              placeholder="Please enter the modelName"
              onChange={(e) => handleChange(e.target.value, "modelName")}
            />
          </Form.Item>
          <Form.Item
            label="Tags"
            name="tag"
            rules={[
              {
                required: true,
                message: "Please input your tag!",
              },
            ]}
          >
            <Select
            allowClear 
          mode="tags"
               placeholder="Please enter the tags"
              style={{
                width: "100%",
              }}
              name="tags"
              onChange={(value) => handleChange(value, "tags")}
              options={options}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please Enter description!" }]}
          >
            <TextArea
              placeholder="Please enter the description"
              onChange={(e) => handleChange(e.target.value, "description")}
            />
          </Form.Item>
          <Form.Item
            label="Upload Model"
            name="modelUrl"
            rules={[{ required: true, message: "Please Enter modelUrl!" }]}
          >
            <Upload
              name={`modelUrl`}
              listType="picture"
              beforeUpload={(file) => {
                handleFile(file);
                return false;
              }}
              accept=".glb,.gltf"
              maxCount={1}
              onRemove={() => handleRemovefile()}
            >
              <Tooltip placement="right" title="Supported Formats: .glb">
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Tooltip>
            </Upload>
          </Form.Item>
          <div className="flex">
            <div style={{ float: "left", width: "20%" }}></div>
            <div style={{ color: "black", marginBottom: 12, float: "right" }}>
              Note: Uploading a Model Exceding 1,00,000 PolyCount may cause
              performance degradation on device
            </div>
          </div>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={
          <>
            <div className="flex items-center justify-between p-4">
              <span className="text-xl m-0">Select Model</span>
              <div className="flex items-center justify-between mt-3">
                <Row gutter={16} className="text-left"></Row>
                <div className="flex gap-4">
                  <Col span={12}>
                    <Input
                      placeholder="Search the ModelName"
                      className="min-w-52"
                      value={searchValue.modelName}
                      name="modelName"
                      onChange={(e) => handleSearch(e)}
                    />
                  </Col>
                  <Col span={12}>
                    <Select
                   allowClear
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
                 >
                   {tags.map((option) => (
                     <Select.Option key={option.value} value={option.value}>
                       {option.label}
                     </Select.Option>
                   ))}
                    </Select>
                  </Col>
                </div>
              </div>
            </div>
          </>
        }
        open={openModel}
        onCancel={() => {setSearchValue({
          modelName: "",
          tags: [],
        }) ,setOpenModel(false)}}
        footer={null}
        width={800}
      >
        {modelList.length === 0 ? (
          <div style={{ textAlign: "center" }}>
            <Typography>No Data Found</Typography>
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
              {modelList.map((val, index) => (
                <Col key={index} className="gutter-row" span={12}>
                  <div style={style}>
                    <Card
                      hoverable
                      onClick={() => handleModelSelect(val, index)}
                      style={{ cursor: "pointer" }}
                    >
                      <ModelViewer
                        modelUrl={val.modelUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                          focus: true,
                        }}
                      />

                      <Row
                        align="flex-end"
                        justify="space-between"
                        style={{
                          padding: 10,
                        }}
                      >
                        <Typography>{val.modelName}</Typography>
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
              total={modelList.length}
              onChange={handlePageChange}
            />
          </>
        )}
      </Modal>
      <Modal
        title="View Model"
        open={modelOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        <Col span={24} className="p-2">
          <Card>
            <div className="flex flex-col gap-0 items-center h-96">
              <ModelViewer
                modelUrl={modelValue.modelUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  focus: true,
                }}
              />
            </div>
          </Card>
        </Col>
      </Modal>
    </>
  );
};
export default Model3D;
