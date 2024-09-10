import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { PatchImage } from "../../../services/Index";
import subjectOptions from "../../../json/subject";

const ImageView = () => {
  const location = useLocation();
  const { file } = location.state;
  const Nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState({
    id: file.id,
    title: file.title,
    description: file.description,
    tags: file.tags,
  });
  const [form] = Form.useForm();
  const goBack = () => {
    Nav("/image", { replace: true });
  };

  const handleUpload = async (values) => {
    const data = {
      title: values.title,
      description: values.description,
      tags: values.tags,
    };

    setUploading(true);
    try {
      await PatchImage(value.id, data);
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
  const formatSize = (sizeInBytes) => {
    if (sizeInBytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1024));
    return (
      parseFloat((sizeInBytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i]
    );
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const options = [];
  return (
    <>
      <div className="text-start">
        <Card
          type="inner"
          title={
            <div className="flex gap-3 items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                size="default"
                type="primary"
                onClick={() => goBack()}
              >
                Back
              </Button>
              {value.title} Image
            </div>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Card>
                <div style={{ height: "100%" }}>
                  <Image src={file.imageURL} width="100%" height="100%" />
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Descriptions>
                  <Descriptions.Item label="Title">
                    {value.title}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  {value.tags.map((tag, index) => (
                    <Descriptions.Item key={index} label={`Tag ${index + 1}`}>
                      {tag}
                    </Descriptions.Item>
                  ))}
                </Descriptions>

                <Descriptions>
                  <Descriptions.Item label="Description">
                    {value.description}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item label="Format">
                    {file.format}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item label="File Size">
                    {formatSize(file.fileSize)}
                  </Descriptions.Item>
                </Descriptions>
                <Button type="primary" onClick={() => setOpen(true)}>
                  Edit
                </Button>
              </Card>
            </Col>
          </Row>
          <Modal
            width={800}
            title="Edit Image"
            open={open}
            loading={uploading}
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
                title: value.title || "", // Set initial value for modelName
                tags: value.tags || [], // Set initial value for tags as an empty array
                description: value.description || "", // Set initial value for description
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
        </Card>
      </div>
    </>
  );
};
export default ImageView;
