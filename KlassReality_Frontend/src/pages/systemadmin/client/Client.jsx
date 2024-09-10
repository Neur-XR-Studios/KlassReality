import { Divider, Form, Row, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
// import AddExperience from "./Add/AddExperience";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import ClientTable from "./ClientTable";
import AddClient from "./AddClient";
import {
  DeleteSchool,
  GetSchool,
  GetSubscription,
} from "../../../services/Index";
import { resetApplication } from "../../../redux/features/counter/applicationSlice";
import { resetUserData } from "../../../redux/features/counter/adminSlice";

const Client = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [client, setClient] = useState([]);
  const [open, setOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const handleRefresh = () => {
    setRefresh(!refresh);
  };
  useEffect(() => {
    // Fetch subscriptions from API
    GetSubscription()
      .then((res) => {
        setSubscriptions(res);
      })
      .catch((err) => {
        let errRes = err.response.data;
        if (errRes.code === 401) {
          message.error(err.response.data.message);
          dispatch(resetApplication());
          dispatch(resetUserData());
          nav("/login", { replace: true });
        } else {
          message.error(err.response.data.message);
        }
      });
  }, []);
  useEffect(() => {
    GetSchool()
      .then((res) => {
        setClient(
          res.map((item) => {
            return {
              ...item,
              key: item._id,
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
  const handleDelete = (id) => {
    DeleteSchool(id)
      .then(() => {
        message.success("Deleted Successfully!");
        handleRefresh();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <div className="">
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Client
      </Divider>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Tooltip placement="top" title="Add Client">
            <AddClient
              showDrawer={showDrawer}
              onClose={onClose}
              subscriptions={subscriptions}
              form={form}
              open={open}
              handleRefresh={handleRefresh}
            />
          </Tooltip>
        </div>
      </div>
      <ClientTable
        data={client}
        subscriptions={subscriptions}
        handleRefresh={handleRefresh}
        loading={loading}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default Client;
