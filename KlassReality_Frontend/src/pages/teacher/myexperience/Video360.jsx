import React, { useEffect, useRef, useState } from "react";
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
  message,
} from "antd";
import { Button, Modal } from "antd";
import { GetTeacherVideoTag, GetVideo, PostVideo } from "../../../services/Index";
import TextArea from "antd/es/input/TextArea";
import {
  EyeOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./style.css";
import ReactPlayer from "react-player";
import subjectOptions from "../../../json/subject";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

// Use the plugins
dayjs.extend(isSameOrAfter);
dayjs.extend(customParseFormat);
const Video360 = ({
  content,
  setContent,
  handleBack,
  handleClose,
  handleSave,
  videoPlayerRef,
}) => {
  const format = "mm:ss";
  const [dataValue, setDataValue] = useState([
    {
      title: "",
      description: "",
      tags: [],
      videoFile: "",
      script: "",
      typeOfVideo: "stereoscopic-side-to-side",
    },
  ]);
  const optionsWithDisabled = [
    {
      label: "Local Video",
      value: "local",
    },
    {
      label: "Repo Video",
      value: "repo",
    },
    {
      label: "Youtube Video",
      value: "youtube",
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
    tags: [],
  });

  const [req, setReq] = useState(true);
  const [req1, setReq1] = useState(true);
  const [youtubesubmit, setYoutubeSubmit] = useState(true);
  const [form] = Form.useForm();
  const [scriptReadingTime, setScriptReadingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const wordsPerMinute = 200;
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(
    content.videoDetails &&
      content.videoDetails.length > 0 &&
      content.videoDetails[0] &&
      content.videoDetails[0]?.videoDetail
      ? content.videoDetails[0]?.videoDetail.videoURL
      : null
  );
  const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = Math.floor(duration % 60);
    return `${hours > 0 ? hours + "h " : ""}${
      minutes > 0 ? minutes + "m " : ""
    }${seconds}s`;
  };
  const [YoutueVideoFlag, setYoutueVideoFlag] = useState(false);
  const [videoDuration, setVideoDuration] = useState(null);
  const [youtubeVideo, setYoutubeVideo] = useState(content.youTubeUrl);
  const [loading, setLoading] = useState(false);
  const [showCollapse, setShowCollapse] = useState(
    content.videoDetails && content.videoDetails.length > 0
  );
  const [modelValue, setModelValue] = useState([]);
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [showYoutubeCollapse, setShowYoutubeCollapse] = useState(
    content.youTubeUrl != "" ? true : false
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const pageSize = 10;
  const [tags, setTags] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [contentValue, setContentValue] = useState({
    script:
      content.videoDetails &&
      content.videoDetails.length > 0 &&
      content.videoDetails[0] &&
      content.videoDetails[0]?.script
        ? content.videoDetails[0]?.script
        : "",
    videoSound: content.videoDetails[0]?.videoSound
      ? content.videoDetails[0]?.videoSound
      : "",
    VideoId:
      content.videoDetails &&
      content.videoDetails.length > 0 &&
      content.videoDetails[0] &&
      content.videoDetails[0]
        ? content.videoDetails[0]?.VideoId
        : "",
  });
  const scriptValue1 = contentValue.videoSound === "tts";
  const scriptValue = content.youTubeVideoAudio === true;
  const handleDelete = () => {
    setReq(true);
    setReq1(true);
    setDataValue([
      {
        title: "",
        description: "",
        tags: [],
        videoFile: "",
        script: "",
      },
    ]);

    setContent((prevContent) => ({
      ...prevContent,
      videoDetails: [],
      youTubeUrl: "",
      youTubeVideoScript: "",
      youTubeStartTimer: "",
      youTubeEndTimer: "", // Change from {} to []
    }));
    setYoutubeVideo(null);
    setValue4("");
    setContentValue({
      videoSound: "",
      script: "",
      VideoId: "",
    });
    setShowCollapse(false);
    setShowYoutubeCollapse(false);
    setVideoPreviewUrl(null);
  };
  const handleCancel = () => {
    setOpen(false);
    setValue4("");
  };
  const handleVideoSelect = (selectedVideo) => {
    setVideoPreviewUrl(selectedVideo.videoURL);
    const video = document.createElement("video");
    video.src = selectedVideo.videoURL;
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
    };

    let tempValue = contentValue;
    tempValue.VideoId = selectedVideo.id;
    setContentValue((prevContent) => ({
      ...prevContent,
      ...tempValue,
    }));

    setContent((prevContent) => ({
      ...prevContent,
      videoDetails: [tempValue],
    }));
    setShowCollapse(true);
    setOpenModel(false);
  };
  useEffect(() => {
    if (content && content.videoDetails.length > 0) {
      const video = document.createElement("video");
      video.src = content.videoDetails[0]?.videoDetail
        ? content.videoDetails[0]?.videoDetail.videoURL
        : content.videoDetails[0]?.videoURL;
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
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

  const handleYoutubeVideo = (selectedVideo) => {
    setYoutueVideoFlag(false);
    setShowYoutubeCollapse(true);
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
  const handleURLChange = (value, field) => {
    if (dayjs.isDayjs(value)) {
      const minutes = value.minute().toString().padStart(2, "0");
      const seconds = value.second().toString().padStart(2, "0");
      value = `${minutes}:${seconds}`;
    }

    if (field === "youTubeStartTimer") {
      setReq(false);
      const [minutes, seconds] = value.split(":").map(Number);

      if (
        isNaN(minutes) ||
        isNaN(seconds) ||
        minutes < 0 ||
        seconds < 0 ||
        seconds >= 60
      ) {
        message.error("Invalid time format");
        return;
      }

      const totalSeconds = minutes * 60 + seconds;
      let modifiedUrl = content.youTubeUrl;

      modifiedUrl = modifiedUrl.replace(/&?t=\d+/g, "");
      modifiedUrl += `&t=${totalSeconds}`;

      setContent((prevState) => ({
        ...prevState,
        // youTubeUrl: modifiedUrl,
        [field]: value,
      }));
    } else if (field === "youTubeEndTimer") {
      setReq1(false);
      setContent((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    } else {
      setContent((prevState) => ({
        ...prevState,
        [field]: value,
      }));
    }
  };
  const handleRemovefile = (index) => {
    // Logic to handle file removal
    const updatedContent = [...dataValue];
    updatedContent[index] = {
      ...updatedContent[index],
      videoFile: null,
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

  const handleChangeOption = (value, field, index) => {
    const tempValue = { ...contentValue };
    tempValue[field] = value;
    setContentValue(tempValue);
    setContent((prevContent) => {
      return {
        ...prevContent,
        videoDetails: [tempValue],
      };
    });
  };

  const handleUpload = async () => {
    const file = dataValue[0].videoFile;

    const title = dataValue[0].title;
    const description = dataValue[0].description;
    const tags = dataValue[0].tags;

    const formData = new FormData();
    formData.append("videoFile", file);
    formData.append("title", title);
    formData.append("description", description);
    tags.forEach(tag => formData.append("tags[]", tag.trim()));
    formData.append("typeOfVideo", dataValue[0].typeOfVideo);
    setLoading(true);
    try {
      const response = await PostVideo(formData);
      setVideoPreviewUrl(response.videoURL);
      setOpen(false);
      setShowCollapse(true);
      let tempValue = contentValue;
      tempValue.VideoId = response.id;
      setContentValue((prevContent) => ({
        ...prevContent,
        ...tempValue,
      }));

      setContent((prevContent) => ({
        ...prevContent,
        videoDetails: [tempValue],
      }));
      form.resetFields();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      dataValue[0].videoFile &&
      dataValue[0].videoFile.type?.includes("video/")
    ) {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(dataValue[0].videoFile);
      video.onloadedmetadata = () => {
        setVideoDuration(video.duration);
        video.remove(); // Clean up the created video element
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
  }, [dataValue, setDataValue, wordsPerMinute, contentValue.script]);

  useEffect(() => {
    // Create a new object excluding empty key-value pairs
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      GetVideo(filteredSearchValue)
        .then((res) => {
          setVideoList(res.results);
        })
        .finally(() => {
          setLoadingVideos(false); // Update loading state after fetching videos
        });
    } else {
      GetVideo()
        .then((res) => {
          setVideoList(res.results);
        })
        .finally(() => {
          setLoadingVideos(false); // Update loading state after fetching videos
        });
    }
    GetTeacherVideoTag().then((res) => {
      const formattedTags = res.map((tag) => ({
        label: tag,
        value: tag,
      }));
      setTags(formattedTags);
    });
  }, [searchValue]);

  const handleFile = (file) => {
    const updatedContent = [...dataValue];
    updatedContent[0] = {
      ...updatedContent[0],
      videoFile: file,
      readyToUpload: true,
    };
    setDataValue(updatedContent);
  };
  const handleModelClick = (item) => {
    setModelValue(item);
  };
  const handleYoutubePaste = (value) => {
    setYoutubeVideo(value);
    setYoutubeSubmit(false);
  };
  const handleVisibilityChange = () => {
    const player = document.querySelector(".react-player > video");
    if (player) {
      if (document.visibilityState === "hidden") {
        player.pause();
      } else {
        player.play();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
  const validateTimes = (_, value) => {
    const startTime = dayjs(content.youTubeStartTimer, "mm:ss");
    const endTime = dayjs(content.youTubeEndTimer, "mm:ss");

    if (startTime.isSameOrAfter(endTime)) {
      return Promise.reject(
        "Start time must be less than end time and cannot be the same."
      );
    }
    return Promise.resolve();
  };
  const items = [
    {
      key: "1",
      label: "360 Video",
      children: (
        <>
          <Form
            name="basic"
            initialValues={{
              remember: true,
              script:
                content.videoDetails &&
                content.videoDetails.length > 0 &&
                content.videoDetails[0] &&
                content.videoDetails[0]?.script
                  ? content.videoDetails[0]?.script
                  : "",
              videoSound: content.videoDetails[0]?.videoSound
                ? content.videoDetails[0]?.videoSound
                : "",
            }}
            onFinish={handleSave}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                {videoPreviewUrl && (
                  <>
                    <Col span={24}>
                      {/* <Typography>Video Preview:</Typography> */}
                      <video
                        controls
                        style={{ width: "100%" }}
                        ref={videoPlayerRef}
                      >
                        <source src={videoPreviewUrl} type="video/mp4" />
                      </video>
                      {/* <ReactPlayer
              ref={videoPlayerRef}
              url={videoPreviewUrl}
              width="100%"
              height="100%"
              controls={true}
              playing={false} // Always set to true to ensure video plays
              className="react-player" // Added class for styling
            /> */}
                    </Col>
                  </>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Video Sound"
                  name="videoSound"
                  rules={[
                    {
                      required: true,
                      message: "Please select videoSound!",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      handleChangeOption(e.target.value, "videoSound", 0)
                    }
                    value={contentValue.videoSound}
                  >
                    <Radio value="tts">Script Audio </Radio>
                    <Radio value="mute">360 Video Audio</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                  label="Script"
                  name="script"
                  rules={[
                    {
                      required: contentValue.videoSound === "tts",
                      message: "Please enter your character script!",
                    },
                    {
                      min: 5,
                      message:
                        "Character script must be at least 5 characters!",
                    },
                  ]}
                >
                  <TextArea
                    name="script"
                    value={contentValue.script}
                    disabled={!scriptValue1}
                    onChange={(e) =>
                      handleChangeOption(e.target.value, "script", 0)
                    }
                    placeholder="Please enter your Video script"
                    autoSize={{ minRows: 11, maxRows: 11 }}
                    className="mb-2"
                  />
                </Form.Item>

                <Divider />
                <div className="flex items-center justify-between mt-3">
                  <Typography className="text-left">
                    Reading Time: &nbsp;
                    {scriptReadingTime.minutes} minute(s)
                  </Typography>
                  <div className="flex gap-4">
                    <Col span={24} className="flex gap-2 items-center">
                      <Typography>Video Duration :</Typography>
                      <Badge count={formatDuration(videoDuration)} />
                    </Col>
                  </div>
                </div>
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
                  onClick={() => {
                    if (videoPlayerRef.current) {
                      videoPlayerRef.current.pause(); // Pause the video
                    }
                    handleBack("2");
                  }}
                >
                  Back
                </Button>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
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
  useEffect(() => {
    form.setFieldsValue({
      youTubeVideoScript: content.youTubeVideoAudio
        ? content.youTubeVideoScript
        : null,
    });
    form.validateFields(["youTubeVideoScript"]);
  }, [content.youTubeVideoAudio]);

  const youtubeItems = [
    {
      key: "1",
      label: "Youtube Video",
      children: (
        <>
          <Form
            name="basic"
            initialValues={{
              remember: true,
              youTubeVideoAudio: content.youTubeVideoAudio,
              youTubeVideoScript:
                content.youTubeVideoAudio === true
                  ? content.youTubeVideoScript
                  : null,
              youTubeStartTimer: content.youTubeStartTimer,
              youTubeEndTimer: content.youTubeEndTimer,
            }}
            onFinish={handleSave}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                <div className="video-player-container">
                  <ReactPlayer
                    ref={videoPlayerRef}
                    url={youtubeVideo}
                    width="100%"
                    height="100%"
                    controls={true}
                    playing={false} // Always set to true to ensure video plays
                    className="react-player" // Added class for styling
                  />
                </div>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Video Sound"
                  name="youTubeVideoAudio"
                  rules={[
                    {
                      required: true,
                      message: "Please select youTubeVideoAudio!",
                    },
                  ]}
                >
                  <Radio.Group
                    onChange={(e) =>
                      handleURLChange(e.target.value, "youTubeVideoAudio")
                    }
                    value={content.youTubeVideoAudio}
                  >
                    <Radio value={true}>Script Audio</Radio>
                    <Radio value={false}>Youtube Audio</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider />
                <Form.Item
                  label="Script"
                  name="youTubeVideoScript"
                  rules={[
                    {
                      required: content.youTubeVideoAudio === true,
                      message: "Please enter your character script!",
                    },
                    {
                      min: 5,
                      message:
                        "Character script must be at least 5 characters!",
                    },
                  ]}
                >
                  <Input.TextArea
                    name="youTubeVideoScript"
                    value={
                      content.youTubeVideoAudio === true
                        ? content.youTubeVideoScript
                        : null
                    }
                    disabled={!scriptValue}
                    onChange={(e) =>
                      handleURLChange(e.target.value, "youTubeVideoScript")
                    }
                    placeholder="Please enter your Video script"
                    autoSize={{ minRows: 11, maxRows: 11 }}
                    className="mb-2"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "16px" }}>
              <Col span={12}>
                <Form.Item
                  label="Start Time"
                  name="youTubeStartTimer"
                  rules={[
                    { required: req, message: "Please select Start Time!" },
                    { validator: validateTimes },
                  ]}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      ampm={false} // Hide AM/PM
                      label="Start Timer"
                      value={dayjs(content.youTubeStartTimer, "mm:ss")}
                      onChange={(time) =>
                        handleURLChange(time, "youTubeStartTimer")
                      }
                      views={["minutes", "seconds"]}
                      format="mm:ss"
                      minutesStep={1}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="End Time"
                  name="youTubeEndTimer"
                  rules={[
                    { required: req1, message: "Please select End Time!" },
                    { validator: validateTimes },
                  ]}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      label="End Timer"
                      value={dayjs(content.youTubeEndTimer, "mm:ss")}
                      onChange={(time) =>
                        handleURLChange(time, "youTubeEndTimer")
                      }
                      views={["minutes", "seconds"]}
                      format="mm:ss"
                      renderInput={(params) => <TextField {...params} />}
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
                  onClick={() => {
                    if (videoPlayerRef.current) {
                      const internalPlayer =
                        videoPlayerRef.current.getInternalPlayer();
                      if (
                        internalPlayer &&
                        typeof internalPlayer.pauseVideo === "function"
                      ) {
                        internalPlayer.pauseVideo(); // Use YouTube API's pauseVideo method
                      } else if (
                        internalPlayer &&
                        typeof internalPlayer.pause === "function"
                      ) {
                        internalPlayer.pause(); // Use HTML5 video element's pause method
                      }
                    }
                    handleBack("2");
                  }}
                >
                  Back
                </Button>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
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
      case "local":
        setOpen(true);
        break;
      case "repo":
        setOpenModel(true);
        break;
      case "youtube":
        setYoutueVideoFlag(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModal = () => {
    setYoutueVideoFlag(false);
    setOpenModel(false);
    setYoutubeVideo(null);
    setShowYoutubeCollapse(false);
    setValue4(""); // Clear the input value
    setContent((prevState) => ({
      ...prevState,
      youTubeUrl: "", // Clear the youTubeUrl field
    }));
    setYoutubeVideo(null);
    if (videoPlayerRef.current) {
      const internalPlayer = videoPlayerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.pauseVideo === "function") {
        internalPlayer.pauseVideo(); // Use YouTube API's pauseVideo method
      } else if (internalPlayer && typeof internalPlayer.pause === "function") {
        internalPlayer.pause(); // Use HTML5 video element's pause method
      }
    }
  };
  const options = [];
  return (
    <>
      {showCollapse ? (
        <Collapse defaultActiveKey={["1"]} accordion items={items} />
      ) : showYoutubeCollapse ? (
        <Collapse defaultActiveKey={["1"]} accordion items={youtubeItems} />
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
                onClick={() => {
                  if (videoPlayerRef.current) {
                    const internalPlayer =
                      videoPlayerRef.current.getInternalPlayer();
                    if (
                      internalPlayer &&
                      typeof internalPlayer.pauseVideo === "function"
                    ) {
                      internalPlayer.pauseVideo(); // Use YouTube API's pauseVideo method
                    } else if (
                      internalPlayer &&
                      typeof internalPlayer.pause === "function"
                    ) {
                      internalPlayer.pause(); // Use HTML5 video element's pause method
                    }
                  }
                  handleBack("2");
                }}
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
        </>
      )}

      {/* local video */}
      <Modal
        width={800}
        open={open}
        title="Add Video Repo"
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 24,
          }}
          style={{
            maxWidth: 700,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleUpload}
          // onFinishFailed={handleCancel}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Title"
            name={`title-${0}`}
            rules={[
              {
                required: true, // Make required only if title is non-empty
                message: "Please input your Title!",
              },
            ]}
          >
            <Input
              placeholder="Please enter the Title"
              onChange={(e) => handleChange(e.target.value, "title", 0)}
            />
          </Form.Item>
          <Form.Item
            label="Tags"
            name={`tags-${0}`}
            rules={[
              {
                required: true, // Make required only if tags are not selected
                message: "Please Add tags!",
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
              onChange={(value) => handleChange(value, "tags", 0)}
              options={options}
            />
          </Form.Item>
          <Form.Item
            label="Description"
            name={`description-${0}`}
            rules={[
              {
                required: true, // Make required only if description is non-empty
                message: "Please Enter description!",
              },
            ]}
          >
            <TextArea
              placeholder="Please enter the description"
              onChange={(e) => handleChange(e.target.value, "description", 0)}
            />
          </Form.Item>

          <Form.Item
            label="Upload Video"
            name={`videoFile-${0}`}
            rules={[{ required: true, message: "Please Enter videoFile!" }]}
          >
            <Upload
              name={`videoFile-${0}`}
              listType="picture"
              beforeUpload={(file) => {
                handleFile(file);
                return false;
              }}
              maxCount={1}
              accept=".mp4,.mov,.mkv,.avi"
              onRemove={() => handleRemovefile(0)}
              fileList={dataValue[0].videoFile ? [dataValue[0].videoFile] : []}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Typography className="text-center font-bold mb-0">
            {" "}
            Type of Video
          </Typography>
          <Row size={24} className="flex">
            <Radio.Group
              value={dataValue[0].typeOfVideo}
              onChange={(e) => handleChange(e.target.value, "typeOfVideo", 0)}
              className="flex"
            >
              <Radio
                value={"stereoscopic-side-to-side"}
                className="flex flex-col-reverse gap-3"
              >
                <Image
                  src="../../../assets/samplepicture/Stereoscopic - Side to Side.png"
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
                  src="../../../assets/samplepicture/Stereoscopic - Top to Bottom.png"
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
                  src="../../../assets/samplepicture/Monoscopic.png"
                  width={226}
                  height={113}
                />
                <Typography className="text-center mb-0 capitalize">
                  monoscopic
                </Typography>
              </Radio>
            </Radio.Group>
          </Row>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
            className="mt-5"
          >
            <Button type="default" className="mr-5" onClick={handleCancel}>
              Close
            </Button>
            <Button type="primary" loading={loading} htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* repo video */}
      <Modal
        title={
          <>
            <div className="flex items-center justify-between p-4">
              <span className="text-xl m-0">Select Video</span>
              <div className="flex items-center justify-between mt-3">
                <Row gutter={16} className="text-left"></Row>
                <div className="flex gap-4">
                  <Col span={12}>
                    <Input
                      placeholder="Enter Video"
                      className="min-w-52"
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
        onCancel={() => {
          setSearchValue({
            title: "",
            tags: [],
          });
          setOpenModel(false);
          setValue4("");
        }}
        footer={null}
        width={800}
      >
        {/* Display Spin component while loading */}
        {loadingVideos ? ( // Display spinner while loading videos
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
              {videoList.map((val, index) => (
                <Col key={index} className="gutter-row" span={12}>
                  <div style={style}>
                    <Card
                      hoverable
                      onClick={() => handleVideoSelect(val)}
                      className="h-[260px]"
                    >
                      <Row>
                        <img
                          alt="thumbnailUrl"
                          src={val.thumbnail}
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
                        <Button
                          type="primary"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => handleModelClick(val)}
                        />
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
              total={videoList.length}
              onChange={handlePageChange}
            />
          </>
        )}
      </Modal>

      {/* youtube video */}
      <Modal
        title={
          <div className="flex items-center justify-between p-4">
            <span className="text-xl m-0">Select Youtube URL Video</span>
          </div>
        }
        open={YoutueVideoFlag}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Input
          name="youTubeUrl"
          placeholder="Please enter the Youtube Url"
          value={content.youTubeUrl}
          onChange={(e) => handleURLChange(e.target.value, "youTubeUrl", 0)}
          onPaste={(e) => handleYoutubePaste(e.clipboardData.getData("text"))} // Handle paste event
          style={{ marginBottom: "10px" }} // Added margin bottom
        />
        <Col span={24}>
          <div className="video-player-container">
            <ReactPlayer
              ref={videoPlayerRef}
              url={youtubeVideo}
              width="100%"
              height="100%"
              controls={true}
              playing={false} // Always set to true to ensure video plays
              className="react-player" // Added class for styling
            />
          </div>
        </Col>
        <Col span={24}>
          <div className="mt-5 flex justify-end">
            <Button type="default" className="mr-5" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              type="primary"
              disabled={youtubesubmit}
              onClick={() => {
                if (videoPlayerRef.current) {
                  const internalPlayer =
                    videoPlayerRef.current.getInternalPlayer();
                  if (
                    internalPlayer &&
                    typeof internalPlayer.pauseVideo === "function"
                  ) {
                    internalPlayer.pauseVideo(); // Use YouTube API's pauseVideo method
                  } else if (
                    internalPlayer &&
                    typeof internalPlayer.pause === "function"
                  ) {
                    internalPlayer.pause(); // Use HTML5 video element's pause method
                  }
                }
                handleYoutubeVideo(youtubeVideo);
              }}
              htmlType="submit"
            >
              Select Video
            </Button>
          </div>
        </Col>
      </Modal>
    </>
  );
};
export default Video360;
