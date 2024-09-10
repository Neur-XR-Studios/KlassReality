import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Table, Tag, Tooltip, message } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { DeleteSession } from "../../../services/Index";
import { useState } from "react";

const MyExperienceTable = ({
  data,
  loading,
  handleRefresh,
  handleView,
  setHeader,
  setSelectedValue,
  selectedValue,
}) => {
  const nav = useNavigate();
  const [loadingMap, setLoadingMap] = useState({});

  const handleEdit = (id) => {
    nav(`/editexperience/${id}`);
  };

  const handleDelete = (id) => {
    setLoadingMap((prev) => ({ ...prev, [id]: true }));
    DeleteSession(id)
      .then(() => {
        handleRefresh();
        message.success("Deleted Successfully!");
        setLoadingMap((prev) => ({ ...prev, [id]: false }));
      })
      .catch((err) => {
        setLoadingMap((prev) => ({ ...prev, [id]: false }));
        console.log(err);
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
      title: "Grade",
      dataIndex: "grade",
      key: "grade",
      sorter: (a, b) => a.grade.localeCompare(b.grade),
    },
    {
      title: "Subject",
      dataIndex: "subject",
      key: "subject",
      sorter: (a, b) => a.subject.localeCompare(b.subject),
    },
    {
      title: "Status",
      key: "isDeployed",
      align: "center",
      filters: [
        {
          text: "Not Deployed",
          value: false,
        },
        {
          text: "Deployed",
          value: true,
        },
      ],
      onFilter: (value, record) => record.isDeployed === value,
      render: (text, record) => (
        <Tag
          color={`${record.isDeployed ? "green" : "blue"}`}
          className="px-5 py-1 capitalize"
        >
          {record.isDeployed ? "Deployed" : "Not Deployed"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "id",
      align: "center",
      render: (text, record) => (
        <Flex wrap="wrap" gap="small" justify="center">
          <Tooltip placement="top" title="View Experience">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleView(record.id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Edit Experience">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record.id)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete Experience">
            <Popconfirm
              title="Delete the Experience"
              description="Are you sure to delete this task?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                danger
                type="primary"
                loading={loadingMap[record.id] || false}
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Flex>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys: [selectedValue],
    onChange: (selectedRowKeys, v) => {
      setHeader(v[0].name);
      localStorage.setItem("headers", v[0].name);
      setSelectedValue(selectedRowKeys[0]);
    },
  };

  return (
    <Table
      loading={loading}
      className="mt-7"
      rowSelection={{
        type: "radio",
        ...rowSelection,
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

MyExperienceTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleView: PropTypes.func,
  setHeader: PropTypes.func,
  setSelectedValue: PropTypes.func,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default MyExperienceTable;
