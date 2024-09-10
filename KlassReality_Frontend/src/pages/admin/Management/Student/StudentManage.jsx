import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  Pagination,
  Select,
  Tabs,
  Upload,
  message,
} from "antd";
import {
  ExportOutlined,
  PlusOutlined,
  UploadOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import FileSaver from "file-saver";
import {
  CreateStudents,
  DeleteStudents,
  ExportStudents,
  GetGrades,
  GetSections,
  GetStudents,
  GradeSectionFilter,
  ImportStudents,
  PatchStudents,
} from "../../../../services/Index";
import { useEffect, useState } from "react";
import GradeTable from "./GradeTable";
import SectionTable from "./SectionTable";
import StudentTable from "./StudentTable";
const { TabPane } = Tabs;
const { Option } = Select;
import excelsample from "../../../../assets/samplestudent.xlsx";

const StudentManagement = () => {
  // State variables
  const [grades, setGrades] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [excelOpen, setExcelOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const [selectedSection, setSelectedSection] = useState(null);
  const [studentOpen, setStudentOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("grade");
  // grade pagination start
  const [refresh, setRefresh] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const gradeResponse = await GetGrades();
        // const sectionResponse = await GetSections();
        setGrades(gradeResponse);
        // setSections(sectionResponse);
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

  // Handlers for tab change and refresh
  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  // Operations buttons for each tab
  const operations = (
    <>
      <Button
        style={{
          marginRight: "10px",
        }}
        type="primary"
        onClick={() => setExportOpen(true)}
        icon={<ExportOutlined />}
      >
        Excel Export
      </Button>
      <Button
        style={{
          marginRight: "10px",
        }}
        type="primary"
        onClick={() => setExcelOpen(true)}
        icon={<PlusOutlined />}
      >
        Excel Import
      </Button>
      {selectedTab === "grade" && (
        <Button
          type="primary"
          onClick={() => handleAdd("grade")}
          icon={<PlusOutlined />}
        >
          Grade
        </Button>
      )}
      {selectedTab === "section" && (
        <Button
          type="primary"
          onClick={() => handleAdd("section")}
          icon={<PlusOutlined />}
        >
          Section
        </Button>
      )}
      {selectedTab === "student" && (
        <Button
          type="primary"
          onClick={() => handleAdd("student")}
          icon={<PlusOutlined />}
        >
          Student
        </Button>
      )}
    </>
  );

  // Handler for adding items (grade, section, student)
  const handleAdd = (type) => {
    form.resetFields();
    switch (type) {
      case "grade":
        setSelectedGrade(null);
        setGradeOpen(true);
        break;
      case "section":
        setSelectedSection(null);
        setSectionOpen(true);
        break;
      case "student":
        setSelectedStudent(null);
        setStudentOpen(true);
        break;
      default:
        break;
    }
  };

  // Items for each tab
  const tabItems = [
    {
      label: "Grade",
      key: "grade",
      content: <GradeTable  grades={grades} setGradeOpen={setGradeOpen} handleRefresh={handleRefresh} gradeOpen={gradeOpen}  setExcelOpen={setExcelOpen}
      excelOpen={excelOpen} />,
    },
    {
      label: "Section",
      key: "section",
      content: (
        <SectionTable
        grades={grades}
          sectionOpen={sectionOpen}
          setSectionOpen={setSectionOpen}
          setExcelOpen={setExcelOpen}
          excelOpen={excelOpen}
        />
      ),
    },
    {
      label: "Students",
      key: "student",
      content: (
        <StudentTable
        grades={grades}
          studentOpen={studentOpen}
          setStudentOpen={setStudentOpen}
          setSelectedStudent={setSelectedStudent}
          selectedStudent={selectedStudent}
          setExcelOpen={setExcelOpen}
          excelOpen={excelOpen}
        />
      ),
    },
  ];

  // Form submission handlers for grade and section

  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    // Detect and remove the data URL scheme if present
    const base64Data = base64.includes("base64,")
      ? base64.split("base64,")[1]
      : base64;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  // ExcelExport function with error handling and base64 data processing
  const ExcelExport = async (values) => {
    const { gradeId, sectionId } = values;
    const requestData = { gradeId, sectionId };
    try {
      // Make the API call to export students
      const response = await ExportStudents(requestData);
      const base64Response = response;

      // Validate if base64Response is available
      if (!base64Response) {
        throw new Error("No base64 string received from the server.");
      }

      // Convert the base64 string to a Blob
      const blob = base64ToBlob(
        base64Response,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      // Save the Blob as a file
      FileSaver.saveAs(blob, "students.xlsx");

      // Display success message
      message.success("Students exported successfully!");
      form1.resetFields();
      // Update the state to control modal visibility
      setExportOpen(false); // Assuming setExportOpen is a state setter for controlling modal visibility
    } catch (error) {
      // Handle errors
      console.error(error);
      message.error("Failed to export students. " + (error.message || ""));
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

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Student
      </Divider>
      <Tabs
        size="large"
        tabBarExtraContent={operations}
        onChange={handleTabChange}
      >
        {tabItems.map((item) => (
          <TabPane tab={item.label} key={item.key}>
            {item.content}
          </TabPane>
        ))}
      </Tabs>

      <Modal
        width={600}
        title={`Excel Export`}
        open={exportOpen}
        onCancel={() => setExportOpen(false)}
        footer={null}
      >
        <Form
          form={form1}
          onFinish={ExcelExport}
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
              {sections &&
                sections.map((section) => (
                  <Option key={section.id} value={section.id}>
                    {section.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Export to Excel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default StudentManagement;
