import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Flex, Popconfirm, Table, Tag, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const ExperienceTable = ({
  data,
  loading,
  setHeader,
  handleView,
  setSelectedValue,
  selectedValue,
}) => {
  const nav = useNavigate();
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
          className="px-5 py-1 capitalize  "
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
        </Flex>
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys: [selectedValue],
    onChange: (selectedRowKeys,v) => {
      setHeader(v[0].name);
      setSelectedValue(selectedRowKeys[0]);
    },
  };
  const handleEdit = (id) => {
    nav(`/editexperience/${id}`);
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

ExperienceTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
};

export default ExperienceTable;
