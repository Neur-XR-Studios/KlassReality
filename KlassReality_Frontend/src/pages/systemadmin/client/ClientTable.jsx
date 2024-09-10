import { DeleteOutlined, EditOutlined, EyeOutlined, UserAddOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Drawer,
  Flex,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import PropTypes from "prop-types";
import EditClient from "./EditClient";
import ViewClient from "./ViewClient";
import {
  DeleteTeacher,
  PatchTeacher,
  PatchSchool,
  PostUser,
} from "../../../services/Index";
import { useState, useEffect } from "react";

const ClientTable = ({
  data,
  loading,
  handleDelete,
  subscriptions,
  handleRefresh,
}) => {
  const [showSecretMap, setShowSecretMap] = useState({});
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [loading1, setLoading] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [editUserData, setEditUserData] = useState(null);
  const [schoolId, setSchoolId] = useState(null);
  const [users, setUsers] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    setExpandedRowKeys([]);
  }, [data]);

  const handleEditSubmit = async (values) => {
    const { name, useremail, password, role } = values;
    const userData = {
      name,
      email: useremail,
      password: password,
      role,
    };

    try {
      await PatchTeacher(editUserData._id, userData);
      message.success("User updated successfully!");
      handleRefresh();
      handleCloseEditDrawer();
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Failed to update user!");
    }
  };
  const handleUserSubmit = async (values) => {
    setLoading(true)
    const { name, useremail, password, role } = values;
    const userData = {
      schoolId:schoolId,
      name:name,
      email: useremail,
      password: password,
      role:role,
    };

    try {
      await PostUser(userData);
      message.success("User updated successfully!");
      handleRefresh();
      form1.resetFields();
      setLoading(false)
      setSchoolId(null)
      setCreateUserOpen(false)
      handleCloseEditDrawer();
    } catch (error) {
      setLoading(false)
      message.error( error.response.data.message);
    }
  };

  const handleStatus = async (record, checked) => {
    const data = { isActive: checked };

    try {
      await PatchSchool(record._id, data);
      message.success("School updated successfully!");
      handleRefresh();
    } catch (error) {
      console.error("Error updating school:", error);
      message.error("Failed to update school status!");
    }
  };

  const handleToggleSecret = (recordId) => {
    setShowSecretMap((prevState) => ({
      ...prevState,
      [recordId]: !prevState[recordId],
    }));
  };

  const handleEdit = (record) => {
    setEditUserData(record);
    form.setFieldsValue({
      name: record.name,
      useremail: record.email,
      role: record.role,
    });
    setEditDrawerVisible(true);
  };

  const handleCloseEditDrawer = () => {
    setEditUserData(null);
    form.resetFields();
    setEditDrawerVisible(false);
  };
  const handleCloseDrawer = () => {
    form1.resetFields();
    setSchoolId(null);
    setCreateUserOpen(false);
  };

  const handleUserDelete = async (record) => {
    try {
      await DeleteTeacher(record);
      message.success("User deleted successfully!");
      handleRefresh();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user!");
    }
  };

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "User Role",
        dataIndex: "role",
        key: "role",
      },
      {
        title: "User Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "User Email",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "Action",
        key: "id",
        align: "center",
        fixed: "right",
        render: (text, record) => (
          <>
            <Tooltip title="Edit">
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
            </Tooltip>{" "}
            <Popconfirm
              title="Are you sure delete this Client?"
              onConfirm={() => handleUserDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
        ),
      },
    ];

    const filteredUsers = record.users.filter(
      (user) => user.role !== "teacher"
    );
    return (
      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={false}
        rowKey="email"
      />
    );
  };
  const handleOpen =(record)=>{
    setSchoolId(record)
    setCreateUserOpen(true)
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "schoolName",
      key: "schoolName",
      sorter: (a, b) => a.schoolName.localeCompare(b.schoolName),
    },
    {
      title: "Email",
      dataIndex: "schoolEmail",
      key: "schoolEmail",
      sorter: (a, b) => a.schoolEmail.localeCompare(b.schoolEmail),
    },
    {
      title: "PhoneNumber",
      dataIndex: "schoolPhoneNumber",
      key: "schoolPhoneNumber",
      sorter: (a, b) => a.schoolPhoneNumber.localeCompare(b.schoolPhoneNumber),
    },
    {
      title: "Device Code",
      dataIndex: "vrDeviceRegisterSecret",
      key: "vrDeviceRegisterSecret",
      render: (text, record) => (
        <div>
          {showSecretMap[record._id] ? (
            <>
              <span>{record.vrDeviceRegisterSecret}</span>
              <Button
                type="link"
                onClick={() => handleToggleSecret(record._id)}
              >
                Hide
              </Button>
            </>
          ) : (
            <Button type="link" onClick={() => handleToggleSecret(record._id)}>
              Show Code
            </Button>
          )}
        </div>
      ),
    },
    {
      title: "MaxAllowedDevice",
      dataIndex: "maxAllowedDevice",
      key: "maxAllowedDevice",
      sorter: (a, b) => b.maxAllowedDevice - a.maxAllowedDevice,
    },
    {
      title: "Active status",
      dataIndex: "Expired",
      key: "Expired",
      render: (text, record) =>
        !record.isSubscribed ? (
          <Tag color="error">Expired</Tag>
        ) : (
          <Tag color="magenta">Active</Tag>
        ),
    },
    {
      title: "Type",
      dataIndex: "schoolType",
      key: "schoolType",
      sorter: (a, b) => a.schoolType.localeCompare(b.schoolType),
    },
    {
      title: "Subscription Remaining Days",
      dataIndex: "subscriptionRemainingDays",
      key: "subscriptionRemainingDays",
      sorter: (a, b) =>
        b.subscriptionRemainingDays - a.subscriptionRemainingDays,
    },
    {
      title: "Status",
      key: "isActive",
      align: "center",
      render: (text, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleStatus(record, checked)}
        />
      ),
    },
    {
      title: "Action",
      key: "id",
      align: "center",
      fixed: "right",
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip title="Actions">
            <>
            <Button type="primary"  onClick={()=>handleOpen(record._id)} danger icon={<UserAddOutlined  />} />{" "}
            
            <ViewClient data={record} handleRefresh={handleRefresh} />{" "}
              <EditClient
                data={record}
                subscriptions={subscriptions}
                handleRefresh={handleRefresh}
              />{" "}
              <Popconfirm
                title="Are you sure delete this Client?"
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const handleExpand = (expanded, record) => {
    setExpandedRowKeys(expanded ? [record._id] : []);
  };
  const handleUserInputChange = (index, name, value) => {
    const updatedUsers = [...users];
    updatedUsers[index] = {
      ...updatedUsers[index],
      [name]: value,
    };
    setUsers(updatedUsers);
  };


  return (
    <>
      <Table
        loading={loading}
        className="mt-7"
        columns={columns}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        expandedRowKeys={expandedRowKeys}
        onExpand={handleExpand}
        rowKey="_id"
        scroll={{ x: 1500 }}
      />
      <Drawer
        title="Edit User"
        width={400}
        onClose={handleCloseEditDrawer}
        visible={editDrawerVisible}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item
            name="name"
            label="User Name"
            initialValue={editUserData?.name}
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>
          <Form.Item
            name="useremail"
            label="User Email"
            initialValue={editUserData?.email}
            rules={[
              { required: true, message: "Please enter user email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: false,
                message: "Enter a password",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.*\d).+$/,
                message:
                  "Password must contain at least one uppercase letter, one symbol, and one number",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={handleCloseEditDrawer}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
      <Drawer
    title="Create User"
    width={800}
    onClose={handleCloseDrawer}
    visible={createUserOpen}
    destroyOnClose
  >
    <Form form={form1} layout="vertical" onFinish={handleUserSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Select a role" }]}
          >
            <Select
              placeholder="Select a role"
              onChange={(value) => handleUserInputChange(0, "role", value)}
            >
              <Option
                value="superadmin"
                disabled={users.filter((user) => user.role === "superadmin").length >= 1}
              >
                Super Admin
              </Option>
              <Option
                value="admin"
                disabled={users.filter((user) => user.role === "admin").length >= 3}
              >
                Admin
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="name"
            label="User Name"
            initialValue={editUserData?.name}
            rules={[{ required: true, message: "Please enter user name" }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="useremail"
            label="User Email"
            initialValue={editUserData?.email}
            rules={[
              { required: true, message: "Please enter user email" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input placeholder="Enter user email" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Password"
            name="password"
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
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.*\d).+$/,
                message: "Password must contain at least one uppercase letter, one symbol, and one number",
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("The new password that you entered do not match!"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading1}>
          Submit
        </Button>
        <Button style={{ marginLeft: 8 }} onClick={handleCloseDrawer}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  </Drawer>
    </>
  );
};

ClientTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
};

export default ClientTable;
