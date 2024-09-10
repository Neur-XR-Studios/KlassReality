import { useEffect, useState } from "react";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  message,
  InputNumber,
  Card,
} from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CreateSchool } from "../../../services/Index";

const { Option } = Select;

const AddClient = ({ showDrawer, onClose, form, open, handleRefresh ,subscriptions}) => {
 
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]); // Initialize users as an empty array
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    gradeLevelsServed: "",
    schoolDistrict: "",
    schoolIdentificationNumber: "",
    schoolEmail: "",
    schoolPhoneNumber: "",
    maxAllowedDevice: "",
    subscriptionId: "",
    users: [],
  });
  const dispatch = useDispatch();
  const nav = useNavigate();



  const handleUserInputChange = (index, name, value) => {
    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [name]: value,
    };
    setUsers(updatedUsers);
  };

  const handleSubmit = async () => {
    setLoading(true);
  
    // Filter out empty user objects from users array
    const filteredUsers = users.filter(
      (user) =>
        user.name !== "" &&
        user.email !== "" &&
        user.password !== "" &&
        user.role !== ""
    );
  
    // Validate the number of super admins and admins
    const superAdminCount = filteredUsers.filter(
      (user) => user.role === "superadmin"
    ).length;
    const adminCount = filteredUsers.filter(
      (user) => user.role === "admin"
    ).length;
  
    if (superAdminCount > 1) {
      message.error("Only one Super Admin is allowed.");
      setLoading(false);
      return;
    }
  
    if (adminCount > 3) {
      message.error("Only up to three Admins are allowed.");
      setLoading(false);
      return;
    }
  
    // Validate for duplicate emails
    const emails = filteredUsers.map(user => user.email);
    const duplicateEmails = emails.filter((email, index) => emails.indexOf(email) !== index);
  
    if (duplicateEmails.length > 0) {
      message.error(`Duplicate user emails are not allowed: ${[...new Set(duplicateEmails)].join(', ')}`);
      setLoading(false);
      return;
    }
  
    const formDataToSend = {
      ...formData,
      users: filteredUsers.map((user) => ({
        email: user.email,
        name: user.name,
        password: user.password,
        role: user.role,
      })),
    };
  
    try {
      const res = await CreateSchool(formDataToSend);
  
      if (res.code === 409) {
        message.warning(res.message);
      } else {
        message.success("School created successfully!");
  
        // Reset form data and UI state
        setFormData({
          schoolName: "",
          schoolAddress: "",
          maxAllowedDevice: "",
          schoolType: "",
          gradeLevelsServed: "",
          schoolDistrict: "",
          schoolIdentificationNumber: "",
          schoolEmail: "",
          schoolPhoneNumber: "",
          subscriptionId: "",
          users: [],
        });
        handleRefresh();
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to create school");
    } finally {
      setLoading(false); // Reset loading state whether success or error
    }
  };
  
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onFinishFailed = (errorInfo) => {
    message.error(errorInfo);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        New Client
      </Button>
      <Drawer
        title="Create Client"
        onClose={onClose}
        width={1000}
        visible={open} // corrected prop name from open to visible
        style={{
          paddingBottom: 80,
        }}
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
          onFinishFailed={onFinishFailed}
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
                    message: "Please enter school name",
                  },
                ]}
              >
                <Input
                  placeholder="Please enter school name"
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
                    message: "The input is not a valid email!",
                  },
                  {
                    required: true,
                    message: "Please enter an email",
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
                    message: "Please select a school type",
                  },
                ]}
              >
                <Select
                  placeholder="Please select a school type"
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
                    message: "Please select a subscription",
                  },
                ]}
              >
                <Select
                  placeholder="Please select a subscription"
                  onChange={(value) =>
                    handleInputChange("subscriptionId", value)
                  }
                >
                  {subscriptions
                    .filter((subscription) => subscription.isActive === true)
                    .map((subscription) => (
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
                label="School Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the school phone number",
                  }
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) =>
                    handleInputChange("schoolPhoneNumber", value.toString())
                  }
                  placeholder="Please enter phone number"
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
                    message: "Please enter the school district",
                  },
                ]}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("schoolDistrict", e.target.value)
                  }
                  placeholder="Please enter district"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="gradeLevelsServed"
                label="Grade Levels Served"
                rules={[
                  {
                    required: true,
                    message: "Please enter the grade levels served",
                  },
                ]}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange("gradeLevelsServed", e.target.value)
                  }
                  placeholder="Please enter grade levels"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="schoolIdentificationNumber"
                label="School Identification Number"
                rules={[
                  {
                    required: true,
                    message: "Please enter the school identification number",
                  },
                ]}
              >
                <Input
                  onChange={(e) =>
                    handleInputChange(
                      "schoolIdentificationNumber",
                      e.target.value
                    )
                  }
                  placeholder="Please enter school identification number"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="maxAllowedDevice"
                label="Device limit"
                rules={[
                  {
                    required: true,
                    message: "Please enter the device limit",
                  },
                ]}
              >
                <InputNumber
                  style={{
                    width: "100%",
                  }}
                  onChange={(value) =>
                    handleInputChange("maxAllowedDevice", value.toString())
                  }
                  placeholder="Please enter max allowed devices"
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
                    message: "Please enter the school address",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  onChange={(e) =>
                    handleInputChange("schoolAddress", e.target.value)
                  }
                  placeholder="Please enter the school address"
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider orientation="left" style={{ fontSize: "20px" }}>
            Users
          </Divider>
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                  <Card
                    key={key}
                    size="small"
                    className="my-5"
                    extra={
                      <DeleteFilled
                        style={{ color: "red" }}
                        onClick={() => {
                          const updatedUsers = users.filter(
                            (_, i) => i !== index
                          );
                          setUsers(updatedUsers);
                          remove(name);
                        }}
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col span={6}>
                        <Form.Item
                          label="Role"
                          {...restField}
                          name={[name, "role"]}
                          fieldKey={[fieldKey, "role"]}
                          rules={[{ required: true, message: "Select a role" }]}
                        >
                          <Select
                            placeholder="Select a role"
                            onChange={(value) =>
                              handleUserInputChange(index, "role", value)
                            }
                          >
                            <Option
                              value="superadmin"
                              disabled={
                                users.filter(
                                  (user) => user.role === "superadmin"
                                ).length >= 1
                              }
                            >
                              Super Admin
                            </Option>
                            <Option
                              value="admin"
                              disabled={
                                users.filter((user) => user.role === "admin")
                                  .length >= 3
                              }
                            >
                              Admin
                            </Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="User Name"
                          {...restField}
                          name={[name, "name"]}
                          fieldKey={[fieldKey, "name"]}
                          rules={[{ required: true, message: "Enter a name" }]}
                        >
                          <Input
                            placeholder="User Name"
                            onChange={(e) =>
                              handleUserInputChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="User Email"
                          {...restField}
                          name={[name, "email"]}
                          fieldKey={[fieldKey, "email"]}
                          rules={[
                            {
                              type: "email",
                              message: "Invalid email address",
                            },
                            { required: true, message: "Enter an email" },
                          ]}
                        >
                          <Input
                            placeholder="User Email"
                            onChange={(e) =>
                              handleUserInputChange(
                                index,
                                "email",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          label="Password"
                          {...restField}
                          name={[name, "password"]}
                          fieldKey={[fieldKey, "password"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter a password",
                            },
                            {
                              min: 8,
                              message: "Password must be at least 8 characters",
                            },
                            {
                              pattern:
                                /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.*\d).+$/,
                              message:
                                "Password must contain at least one uppercase letter, one symbol, and one number",
                            },
                          ]}
                        >
                          <Input.Password
                            placeholder="Password"
                            onChange={(e) =>
                              handleUserInputChange(
                                index,
                                "password",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  disabled={
                    users.filter((user) => user.role === "superadmin").length >=
                      1 &&
                    users.filter((user) => user.role === "admin").length >= 3
                  }
                >
                  Add User
                </Button>
                <div style={{ color: "red", marginTop: 16 }}>
                  Note: Only one Super Admin and up to three Admins are allowed.
                </div>
              </>
            )}
          </Form.List>
          <div className="flex justify-end">
            <Form.Item>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
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

AddClient.propTypes = {
  showDrawer: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  handleRefresh: PropTypes.func.isRequired,
};

export default AddClient;
