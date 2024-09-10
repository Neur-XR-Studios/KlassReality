import {
  BankOutlined,
  BookOutlined,
  CameraOutlined,
  CrownFilled,
  DatabaseFilled,
  DeploymentUnitOutlined,
  HomeOutlined,
  SaveOutlined,
  SlidersFilled,
  UngroupOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import CardDataStats from "../../../components/CardDataStats";
import ChartOne from "../../../components/Charts/ChartOne";
import ChartTwo from "../../../components/Charts/ChartTwo";
import { useEffect, useState } from "react";
import { SystemAdmin } from "../../../services/Index";
import vr from "../../../assets/vrpng.png";
import { Divider, Spin } from "antd";

const Dashboard = () => {
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SystemAdmin()
      .then((res) => {
        // Format data.clientSchoolPerfomance data values to two decimal places
        const formattedPerformanceData = res.clientSchoolPerfomance.map(
          (value) => parseFloat(value.averageScore).toFixed(2)
        );
        const labels = res.clientSchoolPerfomance.map(
          (value) => value.schoolName
        );
        // Set the formatted data
        setData({
          ...res,
          clientSchoolPerfomance: {
            ...res.clientSchoolPerfomance,
            data: formattedPerformanceData,
            labels: labels,
          },
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Dashboard
      </Divider>
      <Spin spinning={loading}>
        {data && (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 flex">
              <CardDataStats
                title="School count"
                total={data.totalNoOfSchools}
                rate=""
                levelUp={false}
                className="flex space-evenly"
              >
                <BankOutlined style={{ fontSize: "50px", color: "#ba28a9" }} />
              </CardDataStats>
              <CardDataStats
                title="3D Model Count"
                total={data.totalNoOf3dModels}
                rate=""
                levelUp={false}
              >
                <DeploymentUnitOutlined
                  style={{ fontSize: "50px", color: "#ba28a9" }}
                />
              </CardDataStats>
              <CardDataStats
                title="360 Image Count"
                total={data.totalNoOfImage360}
                rate=""
                levelUp={false}
              >
                <CameraOutlined
                  style={{ fontSize: "50px", color: "#ba28a9" }}
                />
              </CardDataStats>
              <CardDataStats
                title="Simulation Count"
                total={data.totalNoOfSimulation}
                rate=""
                levelUp={false}
              >
                <UngroupOutlined
                  style={{ fontSize: "50px", color: "#ba28a9" }}
                />
              </CardDataStats>
              <CardDataStats
                title="Total 360 Videos"
                total={data.totalNoOf360Videos}
                rate=""
                levelUp={false}
              >
                <VideoCameraOutlined
                  style={{ fontSize: "50px", color: "#ba28a9" }}
                />
              </CardDataStats>
              <CardDataStats
                title="Total Experience Created"
                total={data.totalNoOfExperienceCreated}
                rate=""
                levelUp={false}
              >
                <BookOutlined style={{ fontSize: "50px", color: "#ba28a9" }} />
              </CardDataStats>
              <CardDataStats
                title="Total VR Devices"
                total={data.totalNoOfVrDevice}
                rate=""
                levelUp={false}
              >
                <img
                  src={vr}
                  style={{
                    fontSize: "50px",
                    color: "#ba28a9",
                    height: "50px",
                    width: "70px",
                    fontWeight: "bold",
                  }}
                />
              </CardDataStats>
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
              <ChartOne data={data.clientSchoolPerfomance} />
              <ChartTwo data={data.totalNoOfUsersWithRole} />
            </div>
          </>
        )}
      </Spin>
    </>
  );
};

export default Dashboard;
