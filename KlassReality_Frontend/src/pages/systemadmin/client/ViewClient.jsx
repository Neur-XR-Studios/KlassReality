import React, { useEffect, useState } from "react";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import moment from "moment";
const { Option } = Select;

const ViewClient = ({ data, handleRefresh }) => {
  const [editopen, setEditopen] = useState(false);
  const [loading, setLoading] = useState(false);
  const EditDrawer = () => {
    setEditopen(true);
  };
  const Close = () => {
    setEditopen(false);
  };
  const [formData, setFormData] = useState({
    schoolName: "",
    schoolAddress: "",
    schoolType: "",
    gradeLevelsServed: "",
    schoolDistrict: "",
    schoolIdentificationNumber: "",
    maxAllowedDevice: "",
    schoolEmail: "",
    schoolPhoneNumber: "",
    subscription: [
      {
        name: "",
        description: "",
        term: "",
        createdAt: "",
      },
    ],
    users: [],
  });
  const [form] = Form.useForm();
  useEffect(() => {
    // Fetch subscriptions from API

    if (data) {
      setFormData({
        ...formData,
        schoolName: data.schoolName,
        schoolAddress: data.schoolAddress,
        schoolType: data.schoolType,
        maxAllowedDevice: data.maxAllowedDevice,
        gradeLevelsServed: data.gradeLevelsServed,
        schoolDistrict: data.schoolDistrict,
        schoolIdentificationNumber: data.schoolIdentificationNumber,
        schoolEmail: data.schoolEmail,
        schoolPhoneNumber: data.schoolPhoneNumber,
        subscription: data.subscritpions[0],
        users: data.users,
      });
      setLoading(false);
    }
  }, [data]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (text, record) => (
        <a href={`mailto:${text}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
  ];
  return (
    <>
      <Button type="primary" onClick={EditDrawer} icon={<EyeOutlined />} />
      <Drawer
        title={formData.schoolName}
        width={1000}
        onClose={Close}
        open={editopen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={Close}>Close</Button>
          </Space>
        }
      >
        <Row className="mb-10">
          <Col xs="24" sm="24" md="24" lg="24">
            <Divider style={{ fontSize: "20px" }}>Client Details</Divider>
            <Descriptions title="" layout="vertical">
              <Descriptions.Item
                label="School Name"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolName}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Email"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolEmail}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Type"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolType}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Phonenumber"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolPhoneNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Grade Levels Served"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.gradeLevelsServed}
              </Descriptions.Item>
              <Descriptions.Item
                label="School District"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolDistrict}
              </Descriptions.Item>
              <Descriptions.Item
                label="school Identification Number"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolIdentificationNumber}
              </Descriptions.Item>
              <Descriptions.Item
                label="Allowed Device"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.maxAllowedDevice}
              </Descriptions.Item>
              <Descriptions.Item
                label="School Address"
                style={{ fontWeight: 500, marginBottom: "20px" }}
              >
                {formData.schoolAddress}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        {formData.subscription ? (
          <Row className="mb-5 mt-5">
            <Col xs="24" sm="24" md="24" lg="24">
              <Divider style={{ fontSize: "20px" }}>
                Subscription Details
              </Divider>
              <Descriptions title="" layout="vertical">
                <Descriptions.Item
                  label="Plan Name"
                  style={{ fontWeight: 500, marginBottom: "20px" }}
                >
                  {formData.subscription?.name}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Plan Term"
                  style={{ fontWeight: 500, marginBottom: "20px" }}
                >
                  {formData.subscription?.term}
                </Descriptions.Item>
                <Descriptions.Item
                  label="Plan Created Date"
                  style={{ fontWeight: 500, marginBottom: "20px" }}
                >
                  {moment(formData.subscription?.createdAt).format(
                    "YYYY-MM-DD HH:mm"
                  )}
                </Descriptions.Item>

                <Descriptions.Item
                  label="Plan Description"
                  style={{ fontWeight: 500, marginBottom: "20px" }}
                >
                  {formData.subscription?.description}
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>
        ) : (
          <Tag className="center w-full flex justify-center" color="red">
            No Subcription Plan
          </Tag>
        )}
        <Divider style={{ fontSize: "20px" }}>Users Details</Divider>
        <Table
          loading={loading}
          className="mt-7"
          columns={columns}
          dataSource={formData.users}
        />
      </Drawer>
    </>
  );
};

ViewClient.propTypes = {
  data: PropTypes.object,
  handleRefresh: PropTypes.func,
};

export default ViewClient;
