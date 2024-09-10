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
  Flex,
  Upload,
  Divider,
  Badge,
  Popconfirm,
  message,
  Form,
  FloatButton,
  Space,
  Avatar,
  Radio,
  Image,
} from "antd";
import ReactPlayer from "react-player";
import noimage from "../../../../public/no image.png";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { DeleteVideo, GetVideo, GetVideoImageTag, PostVideo } from "../../../services/Index";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  StarOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import subjectOptions from "../../../json/subject";

const Video = () => {
  const [videoDuration, setVideoDuration] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Set initial page size
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sorting, setSorting] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const nav = useNavigate();
  const [value, setValue] = useState({
    title: "",
    description: "",
    tags: [],
    videoFile: "",
    script: "",
    typeOfVideo: "stereoscopic-side-to-side",
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

  useEffect(() => {
    setLoading(true);
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      GetVideo(filteredSearchValue)
        .then((response) => {
          setVideos(response.results);
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
      GetVideo({
        // sortBy: "title%3A"+sorting,
        limit: pageSize,
        page: currentPage,
      })
        .then((response) => {
          setVideos(response.results);
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
    GetVideoImageTag().then((res) => {
      const formattedTags = res.map((tag) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    });
  }, [currentPage, pageSize, sorting, refresh, searchValue]);

  const handleVideoClick = (file) => {
    nav("/video-view", { state: { file: file }, replace: true });
  };
  const handleFile = (file) => {
    setValue((prevValue) => ({
      ...prevValue,
      videoFile: file,
      readyToUpload: true,
    }));

    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
    };
    setVideoPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setValue((prevContent) => ({ ...prevContent, videoFile: "" }));
    setVideoPreviewUrl(null);
    setVideoDuration(null);
  };

  const handleModalClose = () => {
    setSelectedVideo(null);
    setModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to the first page when changing page size
    setPageSize(size); // Update page size
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
    const file = value.videoFile;
    const { title, tags, videoFile, typeOfVideo, description } = values;
    const formData = new FormData();
    formData.append("videoFile", file);
    formData.append("title", title);
    formData.append("description", description);
    tags.forEach(tag => formData.append("tags[]", tag.trim()));
    formData.append("typeOfVideo", value.typeOfVideo);
    // formData.append("thumbnailFile", file);
    setUploading(true);
    try {
      const response = await PostVideo(formData);
      form.resetFields();
      setValue({
        title: "",
        description: "",
        tags: [],
        videoFile: "",
        script: "",
        typeOfVideo: "stereoscopic-side-to-side",
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
    if (name === "typeOfVideo") {
      setValue((prev) => ({
        ...prev,
        typeOfVideo: value,
      }));
    } else {
      setValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDelete = (id) => {
    DeleteVideo(id)
      .then(() => {
        setVideos((prevVideos) =>
          prevVideos.filter((video) => video.id !== id)
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
        <span className="text-xl m-0">Videos</span>
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
          </Col>{" "}
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
            title="Add Video"
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
              <Form.Item
                label="Tags"
                name="tags"
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
                label="Upload Video"
                name="videoFile"
                rules={[{ required: true, message: "Please Enter videoFile!" }]}
              >
                <Upload
                  name="videoFile"
                  listType="picture"
                  beforeUpload={(file) => {
                    handleFile(file);
                    return false; // Prevent default upload behavior
                  }}
                  maxCount={1}
                  accept=".mp4,.mov,.mkv,.avi"
                  onRemove={() => handleRemove()}
                  fileList={value.videoFile ? [value.videoFile] : []}
                >
                  <Button danger icon={<UploadOutlined />}>
                    Upload
                  </Button>
                </Upload>
              </Form.Item>

              <Typography className="text-center font-bold mb-0">
                {" "}
                Type of Video
              </Typography>
              <Row size={24} className="flex">
                <Radio.Group
                  value={value.typeOfVideo}
                  onChange={(e) => handleChange(e.target.value, "typeOfVideo")}
                  className="flex"
                >
                  <Radio
                    value={"stereoscopic-side-to-side"}
                    className="flex flex-col-reverse gap-3"
                  >
                    <Image
                      src="../../../src/assets/Stereoscopic - Side to Side.png"
                      width={226}
                      height={113}
                    />
                    <Typography className="text-center mb-0 capitalize">
                      stereoscopic side-side
                    </Typography>
                  </Radio>
                  <Radio
                    value={"stereoscopic-top-to-bottom"}
                    className="flex flex-col-reverse gap-3"
                  >
                    <Image
                      src="../../../src/assets/Stereoscopic - Top to Bottom.png"
                      width={226}
                      height={113}
                    />
                    <Typography className="text-center mb-0 capitalize">
                      stereoscopic top-bottom
                    </Typography>
                  </Radio>
                  <Radio
                    value={"monoscopic"}
                    className="flex flex-col-reverse gap-3"
                  >
                    <Image
                      src="../../../src/assets/Monoscopic.png"
                      width={226}
                      height={113}
                    />
                    <Typography className="text-center mb-0 capitalize">
                      monoscopic
                    </Typography>
                  </Radio>
                </Radio.Group>
              </Row>
              {videoDuration && (
                <Form.Item label="Video Duration">
                  <Badge count={formatDuration(videoDuration)} />
                </Form.Item>
              )}
              {videoPreviewUrl && (
                <>
                  <Divider />
                  <Row>
                    <Col span={24}>
                      <video controls style={{ width: "100%" }}>
                        <source src={videoPreviewUrl} type="video/mp4" />
                      </video>
                    </Col>
                  </Row>
                </>
              )}
              <Divider />

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

          {/* When change the float button to uncomment the button */}
          {/* <Tooltip placement="top" title="Add Video">
            <Button
              type="primary"
              onClick={() => setOpen(true)}
              icon={<PlusOutlined />}
            >
              Add Video
            </Button>
          </Tooltip> */}
        </div>
      </div>
      <br />
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div>Error loading videos. Please try again.</div>
      ) : (
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {videos.map((val, index) => (
            <Col key={index} className="gutter-row" span={6}>
              <div style={style}>
                <Card hoverable>
                  <Row>
                    <img
                      alt="thumbnail"
                      src={val.thumbnail ? val.thumbnail : noimage}
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
                    <Row>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleVideoClick(val)}
                        size="small"
                      />
                      &nbsp;
                      <Popconfirm
                        title="Are you sure to delete this video?"
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
        {selectedVideo && (
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
        onShowSizeChange={handleSizeChange} // Handle size change event
        style={{ marginTop: "20px", textAlign: "center" }}
        showSizeChanger={true}
        showQuickJumper={false}
      />
      <Tooltip placement="left" title="Add Video">
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

export default Video;
