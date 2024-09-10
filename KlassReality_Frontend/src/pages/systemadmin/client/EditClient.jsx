import React, { useEffect, useState } from "react";
import { EditOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetSubscription, PatchSchool } from "../../../services/Index";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../redux/features/counter/adminSlice";
const { Option } = Select;

const EditClient = ({ data, handleRefresh, subscriptions }) => {
  const [editopen, setEditopen] = useState(false);
  const EditDrawer = () => {
    setEditopen(true);
  };
  const Close = () => {
    setEditopen(false);
  };
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    gradeLevelsServed: "",
    schoolDistrict: "",
    schoolIdentificationNumber: "",
    schoolEmail: "",
    maxAllowedDevice: "",
    schoolPhoneNumber: "",
    subscriptionId: "",
  });
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const nav = useNavigate();
  useEffect(() => {
    // Fetch subscriptions from API

    if (data) {
      form.setFieldsValue({
        ...formData,
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolType: data.schoolType,
        gradeLevelsServed: data.gradeLevelsServed,
        schoolDistrict: data.schoolDistrict,
        schoolIdentificationNumber: data.schoolIdentificationNumber,
        schoolEmail: data.schoolEmail,
        schoolPhoneNumber: data.schoolPhoneNumber,
        subscriptionId: data.subscriptionId,
        maxAllowedDevice: data.maxAllowedDevice,
      });
      setFormData({
        ...formData,
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolType: data.schoolType,
        gradeLevelsServed: data.gradeLevelsServed,
        schoolDistrict: data.schoolDistrict,
        schoolIdentificationNumber: data.schoolIdentificationNumber,
        schoolEmail: data.schoolEmail,
        maxAllowedDevice: data.maxAllowedDevice,
        schoolPhoneNumber: data.schoolPhoneNumber,
        subscriptionId: data.subscriptionId,
      });
    }
  }, [data]);

  const handleSubmit = () => {
    setLoading(true);

    const formDataToSend = {
      ...formData,
    };
    PatchSchool(data._id, formDataToSend)
      .then(() => {
        message.success("Client updated");
        handleRefresh();
        setLoading(false);

        Close();
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error creating client:", error);
        message.error("Error creating client");
      });
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <Button type="primary" onClick={EditDrawer} icon={<EditOutlined />} />
      <Drawer
        title="Edit Client"
        width={1000}
        onClose={Close}
        open={editopen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          autoComplete="off"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolName"
                label="School Name"
                rules={[
                  {
                    required: true,
                    message: "Please enter user schoolName",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter user schoolName"
                  value={formData.schoolName}
                  onChange={(e) =>
                    handleInputChange("schoolName", e.target.value)
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolEmail"
                label="School Email"
                rules={[
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                  {
                    required: true,
                    message: "Please enter email",
                  },
                  {
                    validator: (rule, value, callback) => {
                      if (value) {
                        const validDomains = [".com", ".edu", ".org",".in"];
                        const isValid = validDomains.some((domain) =>
                          value.toLowerCase().endsWith(domain)
                        );
                        if (!isValid) {
                          callback(
                            "Invalid email address"
                          );
                        } else {
                          callback();
                        }
                      } else {
                        callback();
                      }
                    },
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  value={formData.schoolEmail}
                  onChange={(e) =>
                    handleInputChange("schoolEmail", e.target.value)
                  }
                  placeholder="Please enter email"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolType"
                label="School Type"
                rules={[
                  {
                    required: true,
                    message: "Please select an schoolType",
                  },
                ]}
              >
                <Select
                  placeholder="Please select an schoolType"
                  value={formData.schoolType}
                  onChange={(value) => handleInputChange("schoolType", value)}
                >
                  <Option value="Public">Public</Option>
                  <Option value="Private">Private</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="subscriptionId"
                label="School Subscription Name"
                rules={[
                  {
                    required: true,
                    message: "Please select an subscriptionId",
                  },
                ]}
              >
                <Select
                  placeholder="Please select a subscriptionId"
                  value={data.subscritpions ? formData.subscriptionId : ""}
                  onChange={(value) =>
                    handleInputChange("subscriptionId", value)
                  }
                >
                  {/* <Option value="">Please Select</Option> */}
                  {subscriptions.map((subscription) => (
                    <Option key={subscription._id} value={subscription._id}>
                      {subscription.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="schoolPhoneNumber"
                label="School PhoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Please choose the School PhoneNumber",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  value={formData.schoolPhoneNumber}
                  onChange={(e) =>
                    handleInputChange("schoolPhoneNumber", e.target.value)
                  }
                  placeholder="Please enter Phone Number"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolDistrict"
                label="School District"
                rules={[
                  {
                    required: true,
                    message: "Please choose the School District",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  value={formData.schoolDistrict}
                  onChange={(e) =>
                    handleInputChange("schoolDistrict", e.target.value)
                  }
                  placeholder="Please enter District"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gradeLevelsServed"
                label="GradeLevel Served"
                rules={[
                  {
                    required: true,
                    message: "Please choose the gradeLevelsServed",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  value={formData.gradeLevelsServed}
                  onChange={(e) =>
                    handleInputChange("gradeLevelsServed", e.target.value)
                  }
                  placeholder="Please enter gradeLevelsServed"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolIdentificationNumber"
                label="School IdentificationNumber"
                rules={[
                  {
                    required: true,
                    message: "Please choose the schoolIdentificationNumber",
                  },
                ]}
              >
                <Input
                  style={{
                    width: "100%",
                  }}
                  value={formData.schoolIdentificationNumber}
                  onChange={(e) =>
                    handleInputChange(
                      "schoolIdentificationNumber",
                      e.target.value
                    )
                  }
                  placeholder="Please enter school Identification Number"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxAllowedDevice"
                label="Max Allowed Device"
                rules={[
                  {
                    required: true,
                    message: "Please choose the maxAllowedDevice",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  value={formData.maxAllowedDevice}
                  onChange={(value) =>
                    handleInputChange("maxAllowedDevice", value.toString())
                  }
                  placeholder="Please enter maxAllowedDevice"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="schoolAddress"
                label="School Address"
                rules={[
                  {
                    required: true,
                    message: "please enter url schoolAddress",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  value={formData.schoolAddress}
                  onChange={(e) =>
                    handleInputChange("schoolAddress", e.target.value)
                  }
                  placeholder="please enter url schoolAddress"
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex justify-end">
            <Form.Item>
              <Space>
                <Button onClick={Close}>Cancel</Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </Space>
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

EditClient.propTypes = {
  data: PropTypes.object,
  handleRefresh: PropTypes.func,
};

export default EditClient;
