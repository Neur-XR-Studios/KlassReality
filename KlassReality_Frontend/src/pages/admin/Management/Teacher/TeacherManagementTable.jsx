import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Switch, Table, Tooltip, Tag } from "antd";
import PropTypes from "prop-types";

const TeacherManagementTable = ({ data, loading, handleDelete, handleRefresh, handleView }) => {
  // const handleStatus = (record, data) => {
  //   PatchStatus(record._id, data)
  //     .then(() => {
  //       message.success("Device updated successfully!");
  //       handleRefresh();
  //     })
  //     .catch((error) => {
  //       console.error("Error updating Device:", error);
  //     });
  // };

  // const handleAction = (record, data) => {
  //   handleStatus(record, data);
  // };

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
    },
    // {
    //   title: "Email Verified",
    //   key: "isEmailVerified",
    //   align: "center",
    //   filters: [
    //     {
    //       text: "Not Verified",
    //       value: false,
    //     },
    //     {
    //       text: "Verified",
    //       value: true,
    //     },
    //   ],
    //   onFilter: (value, record) => record.isEmailVerified === value,
    //   render: (text, record) => (
    //     <Tag
    //       color={`${record.isEmailVerified ? "green" : "blue"}`}
    //       className="px-5 py-1 capitalize  "
    //     >
    //       {record.isEmailVerified ? "Verified" : "Not Verified"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Suspended",
    //   key: "isSuspended",
    //   align: "center",
    //   render: (text, record) => (
    //     <Switch
    //       checked={record.isSuspended}
    //       // onChange={(checked) => handleAction(record, { isSuspended: checked })}
    //     />
    //   ),
    // },
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
              onConfirm={() => handleDelete(record.id)}
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

TeacherManagementTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};

export default TeacherManagementTable;
