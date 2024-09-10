import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Typography,
  Input,
  Select,
  Form,
} from "antd";
import ModelViewer from "../../../components/modelViewer/ModelViewer";
import { PatchModel } from "../../../services/Index";
import { useLocation, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { ArrowLeftOutlined } from "@ant-design/icons";
import subjectOptions from "../../../json/subject";

const RepoView = () => {
  const location = useLocation();
  const [form] = Form.useForm();
  const { file } = location.state;
  const Nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState({
    id: file.id,
    modelName: file.modelName,
    description: file.description,
    tags: file.tags,
  });

  const goBack = () => {
    Nav("/model");
  };

  const handleChange = (value, name) => {
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onFinish = async (values) => {
    const data = {
      modelName: values.modelName,
      description: values.description,
      tags: values.tags,
    };
    setUploading(true);
    try {
      const response = await PatchModel(value.id, data);
      setOpen(false);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const options = [];
  return (
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
          {value.modelName} Model
        </div>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <ModelViewer
              modelUrl={file.modelUrl}
              style={{
                width: "100%",
                height: "100%",
                focus: true,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card className="h-full ">
            <Descriptions>
              <Descriptions.Item label="Model Name">
                {value.modelName}
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
            <div className="flex justify-start">
              <Button type="primary" onClick={() => setOpen(true)}>
                Edit
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <Modal
        width={800}
        title="Edit Model"
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
            modelName: value.modelName || "", // Set initial value for modelName
            tags: value.tags || [], // Set initial value for tags as an empty array
            description: value.description || "", // Set initial value for description
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
            rules={[{ required: true, message: "Please Enter description!" }]}
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
  );
};

export default RepoView;
