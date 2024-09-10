import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Table,
  Tooltip,
  message,
} from "antd";
import PropTypes from "prop-types";
import {
  CreateSections,
  DeleteSections,
  GetGrades,
  GetSections,
  PatchSections, // Make sure to import PatchSections if it's not imported
} from "../../../../services/Index";
import { useEffect, useState } from "react";

const { Option } = Select;

const SectionTable = ({ setSectionOpen, sectionOpen,grades }) => {
  const [refresh, setRefresh] = useState(false);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [onEdit, setEdit] = useState(false);
  const [disable, setDisable] = useState(false);

  const [form] = Form.useForm();
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectionResponse = await GetSections();
        setSections(sectionResponse);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        message.error(
          error.response ? error.response.data.message : "Error fetching data"
        );
      }
    };

    fetchData();
  }, [refresh]);

  const columns = [
    {
      title: "Grade Name",
      dataIndex: "grade",
      key: "grade",
      render: (text, record) => {
        // Check if gradeId exists before accessing its properties
        if (record.gradeId && record.gradeId.name) {
          return record.gradeId.name;
        } else {
          return "N/A"; // Or any other fallback value
        }
      },
    },
    {
      title: "Section Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
              onClick={() => handleSectionEdit(record)} // Pass the record to handleSectionEdit
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Delete the Section"
              description="Are you sure to delete this Section?"
              onConfirm={() => handleSectionDelete(record.id)}
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

  const onSectionFinish = async (values) => {
    setDisable(true);
    const { name, gradeId } = values;
    const requestData = { name: name, gradeId: gradeId };
    try {
      await CreateSections(requestData);
      message.success("Section created successfully!");
      setDisable(false);
      setSectionOpen(false);
      setRefresh(!refresh);
      form.resetFields();
    } catch (error) {
      setDisable(false);
      console.error(error);
      message.error("Failed to save section");
    }
  };
  const onEditFinish = async (values) => {
    setDisable(true);
    const { name, gradeId } = values;
    const requestData = { name: name, gradeId: gradeId };
    try {
      await PatchSections(selectedSection.id, requestData);
      message.success("Section updated successfully!");
      setDisable(false);
      setEdit(false);
      setRefresh(!refresh);
      form.resetFields();
    } catch (error) {
      setDisable(false);
      console.error(error);
      message.error("Failed to save section");
    }
  };

  const handleSectionDelete = (id) => {
    DeleteSections(id)
      .then(() => {
        message.success("Deleted Successfully!");
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete section");
      });
  };

  const handleSectionEdit = (section) => {
    form.setFieldsValue({
      name: section.name,
      gradeId: section.gradeId.id,
    });
    setSelectedSection(section);
    setEdit(true);
  };

  const handleCancel = () => {
    setEdit(false);
    setSectionOpen(false);
    form.resetFields();
  };

  return (
    <>
      <Table
        loading={loading}
        className="mt-7"
        columns={columns}
        dataSource={sections}
        pagination={true}
      />
      <Modal
        width={600}
        title={`Create Section`}
        visible={sectionOpen} // Corrected prop name to 'visible'
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onSectionFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            name="gradeId"
            label="Grade"
            rules={[{ required: true, message: "Choose grade!" }]}
          >
            <Select placeholder="Choose grade">
              {grades.map((grade) => (
                <Option key={grade.id} value={grade.id}>
                  {grade.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input section name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={disable}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={600}
        title={`Edit Section`}
        visible={onEdit} // Corrected prop name to 'visible'
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onEditFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            name="gradeId"
            label="Grade"
            rules={[{ required: true, message: "Please select grade!" }]}
          >
            <Select placeholder="Choose grade">
              {grades.map((grade) => (
                <Option key={grade.id} value={grade.id}>
                  {grade.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input section name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

SectionTable.propTypes = {
  setSectionOpen: PropTypes.func.isRequired,
  sectionOpen: PropTypes.bool.isRequired,
};

export default SectionTable;
