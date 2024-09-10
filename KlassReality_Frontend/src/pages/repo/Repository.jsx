import "./Repository.css";
import React, { useEffect, useState } from "react";
import { DeleteModel, GetModel, GetModelImageTag, PostModel } from "../../services/Index";
import ReactPlayer from "react-player";
import ModelViewer from "../../components/modelViewer/ModelViewer";
import {
  Card,
  Col,
  Row,
  Typography,
  Modal,
  Pagination,
  Select,
  Spin,
  Tooltip,
  Button,
  Input,
  Upload,
  Flex,
  Badge,
  Popconfirm,
  Form,
  FloatButton,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import noimage from "../../assets/no-preview.gif";
import subjectOptions from "../../json/subject";

const { Option } = Select;

const Repository = () => {
  const style = {
    padding: "8px 0",
  };
  const [model, setModel] = useState([]);
  const nav = useNavigate();
  const [tags, setTags] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Set initial page size
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sorting, setSorting] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState({
    modelName: "",
    tags: [],
  });
  const [uploading, setUploading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState({
    modelName: "",
    description: "",
    model: "",
    tags: [],
  });
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("modelFile", value.model);
    formData.append("modelName", value.modelName);
    formData.append("description", value.description);
    value.tags.forEach(tag => formData.append("tags[]", tag.trim()));
    formData.append("thumbnailFile", value.model);
    setUploading(true);
    try {
      const response = await PostModel(formData);
      form.resetFields();
      setValue({
        modelName: "",
        description: "",
        model: "",
        tags: [],
      });
      setRefresh(!refresh);
      setOpen(false);
    } catch (error) {
      message.error("Something Went Wrong");
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleSearch = (e) => {
    const { name, value } = e.target;

    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoading(true);
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      const data = {
        ...filteredSearchValue,
        limit: pageSize, // Use pageSize in the API call
        page: currentPage,
      };
      GetModel(data)
        .then((response) => {
          setModel(response.results);
          setTotalPages(response.totalPages);
          setTotalResults(response.totalResults);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      GetModel({
        limit: pageSize, // Use pageSize in the API call
        page: currentPage,
      })
        .then((response) => {
          setModel(response.results);
          setTotalPages(response.totalPages);
          setTotalResults(response.totalResults);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    GetModelImageTag().then((res) => {
      const formattedTags = res.map((tag) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    });
  }, [
    currentPage,
    searchValue,
    pageSize,
    sorting,
    modalVisible,
    searchQuery,
    refresh,
  ]);

  const handleChange = (value, name) => {
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleModelClick = (modelUrl) => {
    nav("/model-view", { state: { file: modelUrl }, replace: true });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to the first page when changing page size
    setPageSize(size); // Update page size
  };

  const handleRemovefile = () => {
    setValue((prevValue) => ({
      ...prevValue,
      model: null, // Clear the model
      readyToUpload: false, // Reset the upload state
    }));
  };

  const handleFile = (file) => {
    setValue((prevValue) => ({
      ...prevValue,
      model: file,
      readyToUpload: true,
    }));
  };

  const handleDelete = (id) => {
    DeleteModel(id)
      .then(() => {
        setModel((prevModels) => prevModels.filter((model) => model.id !== id));
        message.success("Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const options = [];
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xl m-0">3D Model</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Col span={12}>
            <Input
              placeholder="Search the ModelName"
              className="min-w-72"
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
        <div className="flex gap-4">
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
              onFinish={onFinish}
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
                rules={[
                  { required: true, message: "Please Enter description!" },
                ]}
              >
                <TextArea
                  placeholder="Please enter the description"
                  onChange={(e) => handleChange(e.target.value, "description")}
                />
              </Form.Item>
              <Form.Item
                label="Upload Model"
                name="modelUrl"
                rules={[{ required: true, message: "Upload Model!" }]}
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
                  onRemove={() => handleRemovefile()} // Issue here
                  fileList={value.model ? [value.model] : []}
                >
                  <Tooltip placement="right" title="Supported Formats: .glb">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Tooltip>
                </Upload>
              </Form.Item>
              <div className="flex">
                <div style={{ float: "left", width: "40%" }}></div>
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
                <Button type="primary" htmlType="submit" loading={uploading}>
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <br />
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div>Error loading model. Please try again.</div>
      ) : (
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {model.map((val, index) => (
            <Col key={index} className="gutter-row" span={6}>
              <div style={style}>
                <Card hoverable>
                  <Row>
                    <ModelViewer
                      modelUrl={val.modelUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        focus: true,
                      }}
                    />
                  </Row>
                  <Row
                    vertical
                    align="flex-end"
                    justify="space-between"
                    style={{
                      padding: 10,
                    }}
                  >
                    <Typography>{val.modelName}</Typography>
                    <Row>
                      <Button
                        type="primary"
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handleModelClick(val)}
                      />
                      &nbsp;
                      <Popconfirm
                        title="Are you sure you want to delete this model?"
                        onConfirm={() => handleDelete(val.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          danger
                          type="primary"
                          size="small"
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    </Row>
                  </Row>
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalResults}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange} // Handle size change event
        style={{ marginTop: "20px", textAlign: "center" }}
        showSizeChanger={true}
        showQuickJumper={false}
      />

      <Tooltip placement="left" title="Add Model">
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{
            right: 94,
          }}
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        />
      </Tooltip>
    </>
  );
};

export default Repository;
