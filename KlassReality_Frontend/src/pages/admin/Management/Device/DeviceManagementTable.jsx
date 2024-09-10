import { DeleteOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Popconfirm,
  Switch,
  Table,
  Tooltip,
  message,
  Spin,
  InputNumber,
} from "antd";
import PropTypes from "prop-types";
import { PatchStatus } from "../../../../services/Index";
import { useState } from "react";

const DeviceManagementTable = ({
  data,
  loading,
  handleDelete,
  handleRefresh,
  handleView,
}) => {
  const [editingRecord, setEditingRecord] = useState(null);
  const [saving, setSaving] = useState(false); // State for save button loading

  const handleStatus = (record, data) => {
    PatchStatus(record._id, data)
      .then(() => {
        message.success("Device updated successfully!");
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error updating Device:", error);
      });
  };

  const handleAction = (record, data) => {
    handleStatus(record, data);
  };

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
  };

  const handleInputChange = (value, key) => {
    setEditingRecord((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (record) => {
    setSaving(true); // Set saving to true
    try {
      const data1 = {
        uniqueID: record.uniqueID,
      };
      PatchStatus(record._id, data1)
        .then(() => {
          message.success("Device updated successfully!");
          handleRefresh();
          setEditingRecord(null);
        })
        .catch((error) => {
          message.error(error.response.data.message)
          console.error("Error updating Device:", error);
        })
        .finally(() => {
          setSaving(false); // Set saving to false after the operation
        });
    } catch (error) {
      setSaving(false); // Set saving to false if there is an error
      console.error(error);
      message.error("Failed to save section");
    }
  };

  const columns = [
    {
      title: "Device ID",
      dataIndex: "uniqueID",
      key: "uniqueID",
      sorter: (a, b) => a.uniqueID.localeCompare(b.uniqueID),
      render: (text, record) =>
        editingRecord && editingRecord._id === record._id ? (
          <InputNumber
            className="w-full"
            value={editingRecord.uniqueID}
            onChange={(value) =>
              handleInputChange(value.toString(), "uniqueID")
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Status",
      key: "isActive",
      align: "center",
      render: (text, record) => (
        <Spin spinning={loading}>
          <Switch
            checked={record.isActive}
            onChange={(checked) => handleAction(record, { isActive: checked })}
          />
        </Spin>
      ),
    },
    {
      title: "Action",
      key: "id",
      align: "center",
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip placement="top" title="Edit">
            {editingRecord && editingRecord._id === record._id ? (
              <Button
                type="primary"
                onClick={() => handleSave(editingRecord)}
                icon={<SaveOutlined />}
                loading={saving} // Add loading state to the button
              />
            ) : (
              <Button type="primary" onClick={() => handleEdit(record)}>
                <EditOutlined />
              </Button>
            )}
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Delete the Experience"
              description="Are you sure to delete this Experience?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" icon={<DeleteOutlined />} danger />
            </Popconfirm>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      className="mt-7"
      columns={columns}
      dataSource={data}
    />
  );
};

DeviceManagementTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};

export default DeviceManagementTable;
