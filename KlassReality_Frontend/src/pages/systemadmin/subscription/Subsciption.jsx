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
import {
  CreateSubscription,
  DeleteSubscriptions,
  GetSubscription,
  PatchSubscription,
} from "../../../services/Index"
const { RangePicker } = DatePicker;
// import AddExperience from "./Add/AddExperience";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SubscriptionTable from "./SubscriptionTable";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../redux/features/counter/adminSlice";

const Subscription = () => {
  const [subscription, setSubscription] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    range: [],
    isActive: false,
    description: "",
  });
  const dispatch = useDispatch();
  const nav = useNavigate();

  const showModal = () => {
    form.resetFields();
    setSelectedSubscription(null);
    setOpen(true);
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };
  const onFinish = (values) => {
    const { name, range, isActive, description } = values;
    const requestData = {
      name,
      startDate: range[0],
      endDate: range[1],
      isActive,
      description,
    };

    if (selectedSubscription) {
      // Update existing subscription
      PatchSubscription(selectedSubscription._id, requestData)
        .then(() => {
          message.success("Subscription updated successfully!");
          handleRefresh();
          form.resetFields();
          onClose();
        })
        .catch();
    } else {
      // Create new subscription
      CreateSubscription(requestData)
        .then(() => {
          message.success("Subscription created successfully!");
          handleRefresh();
          form.resetFields();
          onClose();
        })
        .catch();
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // Update form data state when input values change
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleDelete = (id) => {
    DeleteSubscriptions(id)
      .then(() => {
        message.success("Deleted Successfully!");
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleView = (subscription) => {
    if (subscription) {
      form.setFieldsValue({
        name: subscription.name,
        range: subscription.range
          ? [moment(subscription.range[0]), moment(subscription.range[1])]
          : [],
        isActive: subscription.isActive,
        description: subscription.description,
      });
      setSelectedSubscription(subscription);
    }
    setOpen(true);
  };

  useEffect(() => {
    GetSubscription()
      .then((res) => {
        setSubscription(
          res.map((item) => {
            return {
              ...item,
              key: item.id,
            };
          })
        );

        setLoading(false);
      })
      .catch((err) => {
        let errRes = err.response.data;
        if (errRes.code == 401) {
          message.error(err.response.data.message);
          dispatch(resetApplication());
          dispatch(resetUserData());
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
        Subscription
      </Divider>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Tooltip placement="top" title="Add Subscription">
            <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
              Add Subscription
            </Button>
          </Tooltip>
        </div>
      </div>
      <Modal
        width={800}
        title={`${selectedSubscription ? "Edit" : "Create"} Subscription`}
        open={open}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
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
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          form={form}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input
              placeholder="Please enter the name"
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="RangePicker"
            name="range"
            rules={[
              {
                required: selectedSubscription ? false : true,
                message: "Please input your RangePicker!",
              },
            ]}
          >
            <RangePicker
              onChange={(dates) => handleInputChange("range", dates)}
            />
          </Form.Item>

          {selectedSubscription ? null : (
            <Form.Item
              label="Status"
              name="isActive"
              rules={[
                {
                  required: false,
                  message: "Please input your Status!",
                },
              ]}
            >
              <Switch
                onChange={(checked) => handleInputChange("isActive", checked)}
              />
            </Form.Item>
          )}

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please Enter description!" }]}
          >
            <TextArea
              placeholder="Please enter the description"
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <SubscriptionTable
        data={subscription}
        handleRefresh={handleRefresh}
        loading={loading}
        handleDelete={handleDelete}
        handleView={handleView}
      />
    </div>
  );
};

export default Subscription;
