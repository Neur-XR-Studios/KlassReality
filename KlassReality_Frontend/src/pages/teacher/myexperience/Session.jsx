// Session.js
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Spin,
  Typography,
} from "antd";
import subjectOptions from "../../../json/subject";

const Session = ({
  handleClose,
  handleSave,
  session,
  addLoader,
  setSession,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); 
  const handleSession = (name, value) => {
    setSession((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <Spin spinning={loading}>
    <Form
      name="basic"
      initialValues={{
        remember: true,
        name: session.name,
        grade: session.grade,
        subject: session.subject, // Set the default value here
      }}
      onFinish={handleSave}
      autoComplete="off"
      form={form}
    >
      <Row gutter={[16, 16]} className="py-3">
        <Col span={24}>
          <Form.Item
            label="Experience Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
              {
                min: 5,
                message: "Experience name must be at least 5 characters!",
              },
            ]}
          >
            <Input
              name="name"
              placeholder="Please enter Experience name"
              onChange={(e) => handleSession("name", e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Grade"
            name="grade"
            rules={[
              {
                required: true,
                message: "Please input your grade!",
              },
            ]}
          >
            <InputNumber
              className="w-[100%]"
              name="grade"
              min={6}
              max={12}
              placeholder="Please enter grade"
             
              onChange={(value) => handleSession("grade", value.toString())}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Subject"
            name="subject"
            rules={[
              {
                required: true,
                message: "Please select your subject!",
              },
            ]}
          >
            <Select
              style={{
                width: "100%",
              }}
              name="subject"
              onChange={(value) => handleSession("subject", value)}
              options={subjectOptions}
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <div className="mt-5 flex justify-end">
            <Button type="default" className="mr-5" onClick={handleClose}>
              Close
            </Button>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={addLoader}>
                Save & Next
              </Button>
            </Form.Item>
          </div>
        </Col>
      </Row>
    </Form>
    </Spin>
  );
};

export default Session;
