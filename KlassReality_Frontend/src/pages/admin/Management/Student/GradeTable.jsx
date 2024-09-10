import { DeleteOutlined, DownloadOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Switch,
  Table,
  Tooltip,
  Upload,
  message,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  CreateGrades,
  DeleteGrades,
  GetGrades,
  GradeSectionFilter,
  ImportStudents,
  PatchGrades,
} from "../../../../services/Index";
import excelsample from "../../../../assets/samplestudent.xlsx";

const GradeTable = ({grades, gradeOpen, setGradeOpen , setExcelOpen, excelOpen,handleRefresh}) => {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onEdit, setEdit] = useState(false);
  const [files, setFiles] = useState([]);
  const [disable, setDisable] = useState(false);
  const [sections, setSections] = useState([]);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();
  
  const handleView = (grade) => {
    form.setFieldsValue({
      name: grade.name,
    });
    setSelectedGrade(grade);
    setEdit(true);
  };
  
  const handleFile = (file) => {
    setFiles(file);
  };
  
  const handleDelete = (id) => {
    DeleteGrades(id)
      .then(() => {
        message.success("Deleted Successfully!");
        handleRefresh()
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete grade");
      });
  };
  


  const columns = [
    {
      title: "Grade Name",
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
              onClick={() => handleView(record)} // Pass the record to handleView
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Delete the Grade"
              description="Are you sure to delete this Grade?"
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

  const onAddFinish = async (values) => {
    setDisable(true);
    const { name } = values;
    const requestData = { name };
    try {
      await CreateGrades(requestData);
      setDisable(false);
      message.success("Grade created successfully!");
      handleRefresh()
      setGradeOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      setDisable(false);
      message.error("Failed to save grade");
    }
  };

  const onEditFinish = async (values) => {
    setDisable(true);
    const { name } = values;
    const requestData = { name };
    try {
      await PatchGrades(selectedGrade.id, requestData);
      setDisable(false);
      message.success("Grade updated successfully!");

      handleRefresh()
      setEdit(false);
      form1.resetFields();
    } catch (error) {
      console.error(error);
      setDisable(false);
      message.error("Failed to save grade");
    }
  };

  const handleCancel = () => {
    setGradeOpen(false);
    setExcelOpen(false)
    setEdit(false);
    form.resetFields();
  };
  const handleCancel1 = () => {
    setGradeOpen(false);
    setExcelOpen(false)
    setEdit(false);
    form1.resetFields();
  };
  const handleCancel2 = () => {
    setGradeOpen(false);
    setExcelOpen(false)
    setEdit(false);
    form2.resetFields();
  };
  const ExcelUpload = async (values) => {
    setDisable(true);
    const { file, gradeId, sectionId } = values;
    const formData = new FormData();
    formData.append("file", files);
    formData.append("gradeId", gradeId);
    formData.append("sectionId", sectionId);
    try {
      await ImportStudents(formData);
      message.success("Student Import successfully!");
      setDisable(false);
      setExcelOpen(false);
      handleRefresh()
      form2.resetFields();
    } catch (error) {
      setDisable(false);
      message.error("Failed to save Student");
    }
  };

  const handleGradeSelect = async (value) => {
    try {
      // Fetch sections based on the selected gradeId
      const response = await GradeSectionFilter(value);
      setSections(response);
      form2.setFieldsValue({ sectionId: undefined }); // Clear sectionId selection
    } catch (error) {
      console.error("Failed to fetch sections for the selected grade:", error);
      message.error("Failed to fetch sections for the selected grade.");
    }
  };

  const handleDownloadSample = () => {
    // Construct the relative URL to your sample Excel file
    const sampleExcelUrl = excelsample;
    // Create a temporary link element to trigger the download
    const link = document.createElement("a");
    link.href = sampleExcelUrl;
    link.setAttribute("download", "samplestudent.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRemovefile = () => {
    setFiles([]);
  };

  return (
    <>
      <Modal
        width={500}
        title={`Create Grade`}
        open={gradeOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onAddFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input grade name!" }]}
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
        width={500}
        title={`Edit Grade`}
        open={onEdit}
        onCancel={handleCancel1}
        footer={null}
      >
        <Form
          form={form1}
          onFinish={onEditFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input grade name!" }]}
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
        title={`Import Student`}
        open={excelOpen}
        onCancel={handleCancel2}
        footer={null}
      >
        <Form
          form={form2}
          onFinish={ExcelUpload}
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
            <Select placeholder="Choose grade" onChange={handleGradeSelect}>
              {grades &&
                grades.map((grade) => (
                  <Option key={grade.id} value={grade.id}>
                    {grade.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="sectionId"
            label="Section"
            rules={[{ required: true, message: "Please select section!" }]}
          >
            <Select placeholder="Please select a section">
              {sections &&
                sections.map((section) => (
                  <Option key={section.id} value={section.id}>
                    {section.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="File"
            name="file"
            rules={[{ required: true, message: "Please Enter file!" }]}
          >
            <Upload
              name="file"
              listType="picture"
              maxCount={1}
              accept=".xlsx,.csv"
              beforeUpload={(file) => {
                handleFile(file);
                return false;
              }}
              onRemove={() => handleRemovefile()}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Sample File">
            <Button
              type="primary"
              onClick={handleDownloadSample}
              icon={<DownloadOutlined />}
            >
              Download Sample Excel
            </Button>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" disabled={disable}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        loading={loading}
        className="mt-7"
        columns={columns}
        dataSource={grades}
        pagination={true}
      />
    </>
  );
};

GradeTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};

export default GradeTable;
