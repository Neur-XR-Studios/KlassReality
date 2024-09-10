import {
    Divider,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import DeviceManagementTable from "./DeviceManagementTable";
import { DeleteDevice, GetDevice } from "../../../../services/Index";
  
  const DeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const handleRefresh = () => {
      setRefresh(!refresh);
    };
  
    const handleDelete = (id) => {
        DeleteDevice(id)
        .then(() => {
          message.success("Deleted Successfully!");
          handleRefresh();
        })
        .catch((err) => {
          console.log(err);
        });
    };
  
    useEffect(() => {
        GetDevice()
        .then((res) => {
          setDevices(
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
          } else {
            message.error(err.response.data.message);
            setLoading(false);
          }
        });
    }, [refresh]);
  
    return (
      <div className="">
        <Divider orientation="left" style={{ fontSize: "20px" }}>
          Device Management
        </Divider>
        <DeviceManagementTable
          data={devices}
          handleRefresh={handleRefresh}
          loading={loading}
          handleDelete={handleDelete}
        />
      </div>
    );
  };
  
  export default DeviceManagement;
  