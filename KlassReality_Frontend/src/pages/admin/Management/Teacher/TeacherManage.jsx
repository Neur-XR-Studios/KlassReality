import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Switch,
  Tooltip,
  message,
} from "antd";
import { useEffect, useState } from "react";
const { RangePicker } = DatePicker;
import { useNavigate } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import TeacherManagementTable from "./TeacherManagementTable";
import { CreateTeacher, DeleteTeacher, GetTeacher, PatchTeacher } from "../../../../services/Index";

const TeacherManagement = () => {
  const [teacher, setteacher] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnloading, setBtnLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedteacher, setSelectedteacher] = useState(null);
  const nav = useNavigate();

  const showModal = () => {
    form.resetFields();
    setSelectedteacher(null);
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const onFinish = (values) => {
    setBtnLoading(true)
    const { name, email, password } = values;
    let requestData = {
      name,
      email,
      password,
    };
  
    if (!selectedteacher) {
      // Update existing teacher
      requestData = {
        ...requestData,
        role: "teacher",
      };
    }
  
    if (selectedteacher) {
      // Update existing teacher
      PatchTeacher(selectedteacher.id, requestData)
        .then(() => {
          message.success("Teacher updated successfully!");
          handleRefresh();
          onClose();
          setBtnLoading(false)
          form.resetFields();
        })
        .catch((e)=>{
          setBtnLoading(false)
          message.error(e.response.data.message)
        });
    } else {
      // Create new teacher
      CreateTeacher(requestData)
        .then(() => {
          setBtnLoading(false)
          message.success("Teacher created successfully!");
          handleRefresh();
          onClose();
          form.resetFields();
        })
        .catch((e)=>{
          setBtnLoading(false)
          message.error(e.response.data.message)
        });
    }
  };
  

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };



  const onClose = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    DeleteTeacher(id)
      .then(() => {
        message.success("Deleted Successfully!");
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleView = (teacher) => {
    if (teacher) {
      form.setFieldsValue({
        name: teacher.name,
        email: teacher.email,
      });
      setSelectedteacher(teacher);
    }
    setOpen(true);
  };



  useEffect(() => {
    GetTeacher()
      .then((res) => {
        setteacher(
          res.results.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );

        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        let errRes = err.response.data;
        if (errRes.code == 401) {
          message.error(err.response.data.message);
          nav("/login", { replace: true });
        } else {
          message.error(err.response.data.message);
          setLoading(false);
        }
      });
  }, [refresh]);

  return (
    <div className="">
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Teacher
      </Divider>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Tooltip placement="top" title="Add teacher">
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add Teacher
            </Button>
          </Tooltip>
        </div>
      </div>
      <Modal
        width={800}
        title={`${selectedteacher ? "Edit" : "Create"} teacher`}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          name="register"
          loading={loading}
          onFinish={onFinish}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
              {
                pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/,
                message: "Password must contain at least one number, one special character, and one letter!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

         <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16,
              }}
            >
              <Button type="primary" htmlType="submit" loading={btnloading}>
                Submit
              </Button>
            </Form.Item>
        </Form>
      </Modal>
      <TeacherManagementTable
        data={teacher}
        handleRefresh={handleRefresh}
        loading={loading}
        handleDelete={handleDelete}
        handleView={handleView}
      />
    </div>
  );
};

export default TeacherManagement;
