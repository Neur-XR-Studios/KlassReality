import React, { useEffect, useState } from "react";
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
  Popconfirm,
  message,
  Form,
  FloatButton,
  Image,
} from "antd";
import noimage from "../../../../public/no image.png";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteImage,
  GetImage,
  GetRepoImageTag,
  PostImage,
} from "../../../services/Index";
import {
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import subjectOptions from "../../../json/subject";

const Image360 = () => {
  const [imageDuration, setImageDuration] = useState(null);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sorting, setSorting] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [value, setValue] = useState({
    title: "",
    description: "",
    tags: [],
    imageFile: "",
    script: "",
  });
  const imgStyle = {
    display: "block",
    width: "100%",
    height: 160,
  };

  const style = {
    padding: "8px 0",
  };

  const [searchValue, setSearchValue] = useState({
    title: "",
    tags: [],
  });
  const handleSearch = (e) => {
    const { name, value } = e.target;
    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  const handleTagSearch = (value) => {
    setSearchValue((state) => ({
      ...state,
      tags: value,
    }));
  };

  useEffect(() => {
    setLoading(true);
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value.length !== 0)
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      GetImage(filteredSearchValue)
        .then((response) => {
          setImages(response.results);
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
      GetImage({
        limit: pageSize,
        page: currentPage,
      })
        .then((response) => {
          setImages(response.results);
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
    GetRepoImageTag().then((res) => {
      const formattedTags = res.map((tag) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    });
  }, [currentPage, pageSize, sorting, refresh, searchValue]);

  const handleImageClick = (file) => {
    nav("/image-view", { state: { file: file }, replace: true });
  };

  const handleFile = (file) => {
    setValue((prevValue) => ({
      ...prevValue,
      imageFile: file,
      readyToUpload: true,
    }));

    const image = document.createElement("img");
    image.src = URL.createObjectURL(file);
    image.onloadedmetadata = () => {
      setImageDuration(image.duration);
    };
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setValue((prevContent) => ({ ...prevContent, imageFile: "" }));
    setImagePreviewUrl(null);
    setImageDuration(null);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1);
    setPageSize(size);
  };

  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };

  const handleUpload = async (values) => {
    const file = value.imageFile;
    const { title, description } = values;
    const tags = values.tags || [];
    const formData = new FormData();
    formData.append("imageFile", file);
    formData.append("title", title);
    formData.append("description", description);
    tags.forEach((tag) => formData.append("tags[]", tag.trim()));
    setUploading(true);
    try {
      const response = await PostImage(formData);
      form.resetFields();
      setValue({
        title: "",
        description: "",
        tags: [],
        imageFile: "",
        script: "",
      });
      setRefresh(!refresh);
      setOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (value, name) => {
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelete = (id) => {
    DeleteImage(id)
      .then(() => {
        setImages((prevImages) =>
          prevImages.filter((image) => image.id !== id)
        );
        message.success("Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const options = [];

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xl m-0">Images</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Col span={12}>
            <Input
              placeholder="Search the title"
              className="min-w-72"
              value={searchValue.title}
              name="title"
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
          onChange={handleTagSearch}
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
            title="Add Image"
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
              initialValues={{
                remember: true,
              }}
              onFinish={handleUpload}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Please input your title!",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter the title"
                  onChange={(e) => handleChange(e.target.value, "title")}
                />
              </Form.Item>
              <Form.Item label="Tags" name="tags">
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Please select tags"
                  onChange={(value) => handleChange(value, "tags")}
                  options={options}
                />
              </Form.Item>
              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter description!" },
                ]}
              >
                <TextArea
                  rows={3}
                  placeholder="Please enter description"
                  onChange={(e) => handleChange(e.target.value, "description")}
                />
              </Form.Item>
              <Form.Item
                label="Upload Image"
                name="imageFile"
                rules={[{ required: true, message: "Please enter imageFile!" }]}
              >
                <Upload
                  name="imageFile"
                  listType="picture"
                  beforeUpload={(file) => {
                    handleFile(file);
                    return false;
                  }}
                  maxCount={1}
                  accept=".jpg,.jpeg"
                  onRemove={() => handleRemove()}
                  fileList={value.imageFile ? [value.imageFile] : []}
                >
                  <Button danger icon={<UploadOutlined />}>
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
              <div className="flex">
                <div style={{ float: "left", width: "20%" }}></div>
                <div style={{ color: "red", marginBottom: 12, float: "right" }}>
                  Note: Only monoscopic 360 images are allowed. Minimum
                  dimensions: 2048x1024
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
        <div>Error loading images. Please try again.</div>
      ) : (
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {images.map((val, index) => (
            <Col key={index} className="gutter-row" span={6}>
              <div style={style}>
                <Card hoverable>
                  <Row>
                    <Image
                      width={526}
                      height={153}
                      src={val.imageURL ? val.imageURL : noimage}
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
                    <Row>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleImageClick(val)}
                        size="small"
                      />
                      &nbsp;
                      <Popconfirm
                        title="Are you sure to delete this image?"
                        onConfirm={() => handleDelete(val.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          danger
                          size="small"
                          type="primary"
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
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        {selectedImage && (
          <iframe
            title="Simulation"
            src="https://klass-vr-file.s3.ap-south-1.amazonaws.com/klass-simulations/Hibiscus/index.html"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </Modal>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalResults}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
        style={{ marginTop: "20px", textAlign: "center" }}
        showSizeChanger={true}
        showQuickJumper={false}
      />
      <Tooltip placement="left" title="Add Image">
        <FloatButton.Group
          trigger="click"
          type="primary"
          style={{
            right: 94,
          }}
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        ></FloatButton.Group>
      </Tooltip>
    </>
  );
};

export default Image360;
