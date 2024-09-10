import React, { useEffect, useState } from "react";
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tooltip,
  Upload,
  message,
} from "antd";
import PropTypes from "prop-types";
import {
  CreateStudents,
  DeleteStudents,
  GetGrades,
  GetSections,
  GetStudents,
  GradeSectionFilter,
  ImportStudents,
  PatchStudents,
  SearchStudents,
} from "../../../../services/Index";
import excelsample from "../../../../assets/samplestudent.xlsx";

const { Option } = Select;

const StudentTable = ({
  setStudentOpen,
  studentOpen,
  selectedStudent,
  setSelectedStudent,
  excelOpen,
  grades,
  setExcelOpen,
}) => {
  const [files, setFiles] = useState([]);
  const [disable, setDisable] = useState(false);
  const [disable1, setDisable1] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState({
    gradeId: "",
    sectionId: "",
  });
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [refresh, setRefresh] = useState(false);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    setDisable1(false)
    setDisable(false)
    const fetchData = async () => {
      try {
        setLoading(true);
        const studentResponse = await GetStudents();
        setStudents(studentResponse);
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
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (searchValue.gradeId && searchValue.sectionId) {
          SearchStudents(searchValue).then((res) => {
            setStudents(res);
          });
        } else {
          const studentResponse = await GetStudents();
          setStudents(studentResponse.results);
        }
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
  }, [refresh, searchValue]);
  const handleSearch = async (value, name) => {
    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));

    if (name === "gradeId") {
      try {
        const response = await GradeSectionFilter(value);
        setSections(response);
      } catch (error) {
        setSections([]);
        message.error("Failed to fetch sections for the selected grade.");
      }
    }
  };
  const handleGradeSelect = async (value) => {
    try {
      // Fetch sections based on the selected gradeId
      const response = await GradeSectionFilter(value);
      setSections(response);
      form.setFieldsValue({ sectionId: undefined }); // Clear sectionId selection
    } catch (error) {
      console.error("Failed to fetch sections for the selected grade:", error);
      message.error("Failed to fetch sections for the selected grade.");
    }
  };

  const handleStudentDelete = (id) => {
    DeleteStudents(id)
      .then(() => {
        message.success("Deleted Successfully!");
        setRefresh(!refresh);
      })
      .catch((err) => {
        console.error(err);
        message.error("Failed to delete section");
      });
  };

  const handleStudentEdit = (student) => {
    form.setFieldsValue({
      name: student.name,
      gradeId: student.gradeId.id,
      sectionId: student.sectionId.id,
    });
    setSelectedStudent(student);
    setStudentOpen(true);
  };

  const columns = [
    {
      title: "Grade Name",
      dataIndex: "grade",
      key: "grade",
      render: (text, record) => {
        if (record.grade && record.grade.name) {
          return record.grade.name;
        } else {
          return "N/A"; // Or any other fallback value
        }
      },
    },
    {
      title: "Section Name",
      dataIndex: "section",
      key: "section",
      render: (text, record) => {
        // Check if teacherID exists before accessing its properties
        if (record.section && record.section.name) {
          return record.section.name;
        } else {
          return "N/A"; // Or any other fallback value
        }
      },
    },
    {
      title: "Student Name",
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
              onClick={() => handleStudentEdit(record)} // Pass the record to handleView
            />
          </Tooltip>
          <Tooltip placement="top" title="Delete">
            <Popconfirm
              title="Delete the Student"
              description="Are you sure to delete this Student?"
              onConfirm={() => handleStudentDelete(record._id)}
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
  const onStudentFinish = async (values) => {
    setDisable(true);
    const { name, gradeId, sectionId } = values;
    const requestData = { name: name, gradeId: gradeId, sectionId: sectionId };
    try {
      if (selectedStudent) {
        await PatchStudents(selectedStudent._id, requestData);
        setDisable(false);
        message.success("Student updated successfully!");
      } else {
        await CreateStudents(requestData);
        setDisable(false);
        message.success("Student created successfully!");
      }
      setStudentOpen(false);
      setRefresh(!refresh);
      form.resetFields();
    } catch (error) {
      console.error(error);
      setDisable(false);
      message.error("Failed to save Student");
    }
  };
  const handleFile = (file) => {
    setFiles(file);
  };
  const handleCancel = () => {
    setStudentOpen(false);
    form.resetFields();
  };
  const handleCancel1 = () => {
    setExcelOpen(false);
    form1.resetFields();
  };
  const ExcelUpload = async (values) => {
    setDisable1(true);
    const { file, gradeId, sectionId } = values;
    const formData = new FormData();
    formData.append("file", files);
    formData.append("gradeId", gradeId);
    formData.append("sectionId", sectionId);
    try {
      await ImportStudents(formData);
      message.success("Student Import successfully!");
      setDisable1(false);
      setExcelOpen(false);
      setRefresh(!refresh)
      form1.resetFields();
    } catch (error) {
      setDisable1(false);
      message.error("Failed to save Student");
    }
  };
  const handleRemovefile = () => {
    setFiles([]);
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

  return (
    <>
      <Modal
        width={600}
        title={`${selectedStudent ? "Edit" : "Create"} Student`}
        open={studentOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          onFinish={onStudentFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          {!selectedStudent ? (
            <>
              <Form.Item
                name="gradeId"
                label="Grade"
                rules={[{ required: true, message: "Choose grade" }]}
              >
                <Select placeholder="Choose grade" onChange={handleGradeSelect}>
                  {grades.map((grade) => (
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
                  {sections.map((section) => (
                    <Option key={section.id} value={section.id}>
                      {section.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : null}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input section name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={disable}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        width={600}
        title={`Import Student`}
        open={excelOpen}
        onCancel={handleCancel1}
        footer={null}
      >
        <Form
          form={form1}
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
            <Button type="primary" htmlType="submit" loading={disable1}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left">
          <Col span={12}>
            <Select
              showSearch
              placeholder="Select a Grade"
              allowClear
              className="min-w-72"
              onChange={(value) => handleSearch(value, "gradeId")}
            >
              {grades.map((grade) => (
                <Option key={grade.id} value={grade.id}>
                  {grade.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={12}>
            <Select
              showSearch
              placeholder="Select a Section"
              allowClear
              className="min-w-72"
              onChange={(value) => handleSearch(value, "sectionId")}
            >
              {sections.map((section) => (
                <Option key={section.id} value={section.id}>
                  {section.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <Table
        loading={loading}
        className="mt-7"
        columns={columns}
        dataSource={students}
        pagination={true}
      />
      {/* <Pagination
        current={ST_current}
        pageSize={ST_pageSize}
        total={ST_total}
        onChange={ST_onChange}
        onShowSizeChange={ST_onShowSizeChange} // Handle size change event
        style={{ marginTop: "30px", textAlign: "center" }}
      /> */}
    </>
  );
};

StudentTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleRefresh: PropTypes.func,
  loading: PropTypes.bool,
  handleStudentDelete: PropTypes.func,
  handleView: PropTypes.func, // Add handleView to propTypes
};

export default StudentTable;
