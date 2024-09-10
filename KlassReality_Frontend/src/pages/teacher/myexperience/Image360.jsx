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
import { GetImage, GetTeacherImageTag, PostImage } from "../../../services/Index";
import TextArea from "antd/es/input/TextArea";
import {
  EyeOutlined,
  LoadingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import "./style.css";
import ReactPlayer from "react-player";
import subjectOptions from "../../../json/subject";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";

dayjs.extend(customParseFormat);

const Image360 = ({
  content,
  setContent,
  handleBack,
  handleClose,
  handleSave,
}) => {
  const [dataValue, setDataValue] = useState([
    {
      title: "",
      description: "",
      tags: [],
      imageFile: "",
      script: "",
    },
  ]);
  const optionsWithDisabled = [
    {
      label: "Local Image",
      value: "local",
    },
    {
      label: "Repo Image",
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
    tags: [],
  });
  const [tags, setTags] = useState([]);
  const [form] = Form.useForm();
  const [scriptReadingTime, setScriptReadingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const wordsPerMinute = 200;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    content.imageDetails &&
      content.imageDetails.length > 0 &&
      content.imageDetails[0] &&
      content.imageDetails[0]?.imageDetail
      ? content.imageDetails[0]?.imageDetail.imageURL
      : null
  );
  const [loading, setLoading] = useState(false);
  const [showCollapse, setShowCollapse] = useState(
    content.imageDetails && content.imageDetails.length > 0
  );
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingImages, setLoadingImages] = useState(true);
  const pageSize = 10;
  const [imageList, setImageList] = useState([]);
  const options = [];
  const [contentValue, setContentValue] = useState({
    script:
      content.imageDetails &&
      content.imageDetails.length > 0 &&
      content.imageDetails[0] &&
      content.imageDetails[0]?.script
        ? content.imageDetails[0]?.script
        : "",
    ImageId:
      content.imageDetails &&
      content.imageDetails.length > 0 &&
      content.imageDetails[0] &&
      content.imageDetails[0]
        ? content.imageDetails[0]?.ImageId
        : "",
    displayTime:
      content.imageDetails &&
      content.imageDetails.length > 0 &&
      content.imageDetails[0] &&
      content.imageDetails[0]
        ? content.imageDetails[0]?.displayTime
        : "05:00",
  });
  const handleDelete = () => {
    setDataValue([
      {
        title: "",
        description: "",
        tags: "",
        imageFile: "",
        script: "",
      },
    ]);
    setContent((prevContent) => ({
      ...prevContent,
      imageDetails: [],
    }));
    setValue4("");
    setContentValue({
      script: "",
      ImageId: "",
      displayTime: "05:00",
    });
    setShowCollapse(false);
    setImagePreviewUrl(null);
  };
  const handleCancel = () => {
    setOpen(false);
    setValue4("");
  };
  const handleImageSelect = (selectedImage) => {
    setImagePreviewUrl(selectedImage.imageURL);
    const image = document.createElement("image");
    image.src = selectedImage.imageURL;

    let tempValue = contentValue;
    tempValue.ImageId = selectedImage.id;
    setContentValue((prevContent) => ({
      ...prevContent,
      ...tempValue,
    }));

    setContent((prevContent) => ({
      ...prevContent,
      imageDetails: [tempValue],
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
      imageFile: null,
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
    setContentValue((prevContentValue) => ({
      ...prevContentValue,
      [field]: value,
    }));

    setContent((prevContent) => ({
      ...prevContent,
      imageDetails: [contentValue],
    }));
  };
  const handleChangeTime = (time, name) => {
    const formattedTime = time.format("mm:ss");
    let tempValue = { ...contentValue, [name]: formattedTime };
    setContentValue(tempValue);
    setContent((prevContent) => ({
      ...prevContent,
      imageDetails: [tempValue],
    }));
  };
  const handleUpload = async () => {
    const file = dataValue[0].imageFile;

    const title = dataValue[0].title;
    const description = dataValue[0].description;
    const tags = dataValue[0].tags;
    // const tags = ["science"];
    const formData = new FormData();
    formData.append("imageFile", file);
    formData.append("title", title);
    formData.append("description", description);
    // formData.append("tags", dataValue[0].tags);
    tags.forEach(tag => formData.append("tags[]", tag.trim()));
    setLoading(true);
    try {
      const response = await PostImage(formData);
      setImagePreviewUrl(response.imageURL);
      setOpen(false);
      setShowCollapse(true);
      let tempValue = contentValue;
      tempValue.ImageId = response.id;
      setContentValue((prevContent) => ({
        ...prevContent,
        ...tempValue,
      }));

      setContent((prevContent) => ({
        ...prevContent,
        imageDetails: [tempValue],
      }));
      form.resetFields();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      GetImage(filteredSearchValue)
        .then((res) => {
          setImageList(res.results);
        })
        .finally(() => {
          setLoadingImages(false); // Update loading state after fetching images
        });
    } else {
      GetImage()
        .then((res) => {
          setImageList(res.results);
        })
        .finally(() => {
          setLoadingImages(false); // Update loading state after fetching images
        });
    }
    GetTeacherImageTag().then((res) => {
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
      imageFile: file,
      readyToUpload: true,
    };
    setDataValue(updatedContent);
  };

  const items = [
    {
      key: "1",
      label: "360 Image",
      children: (
        <>
          <Form
            name="basic"
            initialValues={{
              remember: true,
              script:
                content.imageDetails &&
                content.imageDetails.length > 0 &&
                content.imageDetails[0] &&
                content.imageDetails[0]?.script
                  ? content.imageDetails[0]?.script
                  : "",
              displayTime:
                content.imageDetails &&
                content.imageDetails.length > 0 &&
                content.imageDetails[0] &&
                content.imageDetails[0]?.displayTime
                  ? content.imageDetails[0]?.displayTime
                  : "",
            }}
            onFinish={handleSave}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col span={12}>
                {imagePreviewUrl && (
                  <>
                    <Col span={24}>
                      <Typography>Image Preview:</Typography>
                      <Image src={imagePreviewUrl} />
                    </Col>
                  </>
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Script"
                  name="script"
                  rules={[
                    {
                      required: true,
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
                    onChange={(e) =>
                      handleChangeOption(e.target.value, "script", 0)
                    }
                    placeholder="Please enter your Image script"
                    autoSize={{ minRows: 11, maxRows: 11 }}
                    className="mb-2"
                  />
                </Form.Item>
                <Typography className="text-right">
                  Reading Time: {scriptReadingTime.minutes} minute(s)
                </Typography>
                <Row className="p-6 float-right">
                  <Form.Item
                    name="displayTime"
                    rules={[
                      {
                        required: true,
                        message: "Please enter displayTime!",
                      },
                    ]}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                        label="Display Time"
                        value={dayjs(contentValue.displayTime, "mm:ss")} // Pass the current value of displayTime as a dayjs object
                        onChange={(time) =>
                          handleChangeTime(time, "displayTime", 0)
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
                  onClick={() => handleBack("3")}
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
                onClick={() => handleBack("3")}
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

      {/* local image */}
      <Modal
        width={800}
        open={open}
        title="Add Image"
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
            label="Upload Image"
            name={`imageFile-${0}`}
            rules={[{ required: true, message: "Please Enter imageFile!" }]}
          >
            <Upload
              name={`imageFile-${0}`}
              listType="picture"
              beforeUpload={(file) => {
                handleFile(file);
                return false;
              }}
              maxCount={1}
              accept=".jpg,.jpeg"
              onRemove={() => handleRemovefile(0)}
              fileList={dataValue[0].imageFile ? [dataValue[0].imageFile] : []}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <div className="flex">
            <div style={{ float: "left", width: "20%" }}></div>
            <div style={{ color: "red", marginBottom: 12, float: "right" }}>
              Note: Only monoscopic 360 images are allowed. Minimum dimensions:
              2048x1024
            </div>
          </div>
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

      {/* repo image */}
      <Modal
        title={
          <>
            <div className="flex items-center justify-between p-4">
              <span className="text-xl m-0">Select Image</span>
              <div className="flex items-center justify-between mt-3">
                <Row gutter={16} className="text-left"></Row>
                <div className="flex gap-4">
                  <Col span={12}>
                    <Input
                      placeholder="Enter Image"
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
            tags: "",
          });
          setOpenModel(false);
          setValue4("");
        }}
        footer={null}
        width={800}
      >
        {/* Display Spin component while loading */}
        {loadingImages ? ( // Display spinner while loading images
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
              {imageList.map((val, index) => (
                <Col key={index} className="gutter-row" span={12}>
                  <div style={style}>
                    <Card
                      hoverable
                      onClick={() => handleImageSelect(val)}
                      className="h-[260px]"
                    >
                      <Row>
                        <Image
                          alt="thumbnailUrl"
                          src={val.imageURL}
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
              total={imageList.length}
              onChange={handlePageChange}
            />
          </>
        )}
      </Modal>
    </>
  );
};
export default Image360;
