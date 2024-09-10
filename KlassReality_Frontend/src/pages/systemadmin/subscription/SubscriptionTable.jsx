import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Switch, Table, Tooltip, message } from "antd";
import PropTypes from "prop-types";
import { PatchSubscription } from "../../../services/Index";

const SubscriptionTable = ({ data, loading, handleDelete, handleRefresh, handleView }) => {
  const handleStatus = (record, checked) => {
    const data = {
      isActive: checked,
    };
    PatchSubscription(record._id, data)
      .then(() => {
        message.success("Subscription updated successfully!");
        handleRefresh();
      })
      .catch((error) => {
        console.error("Error updating subscription:", error);
        // Optionally, handle errors if the patch request fails
      });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Term",
      dataIndex: "term",
      key: "term",
      sorter: (a, b) => a.term.localeCompare(b.term),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
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
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip placement="top" title="Edit">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleView(record)} // Pass the record to handleView
            />
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

SubscriptionTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};

export default SubscriptionTable;
