import { useEffect, useState } from "react";
import {
  Superadmin,
  SuperadminWithoutParams,
  TeachersFilter,
} from "../../services/Index";
import { Card, Col, Divider, Row, Select, Spin } from "antd";
import ReactApexChart from "react-apexcharts";
import CardDataStats from "../../components/CardDataStats";
import { CrownFilled, DatabaseFilled, HomeOutlined } from "@ant-design/icons";

const { Option } = Select;

const SuperadminDashboard = () => {
  const [data, setData] = useState(null);
  const [data1, setData1] = useState(null);
  const [teacherData, setTeacherData] = useState([]);
  const [teacherFilter, setTeacherFilter] = useState({
    id: "",
  });
  const [loading, setLoading] = useState(true); // Default loading state is true

  useEffect(() => {
    TeachersFilter().then((res) => {
      setTeacherData(res);
      setLoading(false); // Set loading to false after fetching teacher data
    });

    SuperadminWithoutParams()
      .then((res) => {
        setData1(res);
        setLoading(false) // Setting data1 state here
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false if there's an error
      })
      .finally(() => setLoading(false));;
  }, []);

  const fetchData = (teacherId) => {
    setLoading(true); // Set loading to true before fetching data
    const requestData = {
      teacherId: teacherId,
    };
    Superadmin(requestData)
      .then((res) => {
        setData(res);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false)); // Set loading to false after fetching data
  };

  const handleInputChange = (name, value) => {
    setTeacherFilter({
      ...teacherFilter,
      [name]: value,
    });
    if (value !== undefined && value !== "") {
      fetchData(value);
    } else {
      setData(null); // Reset data when teacher is unselected
    }
  };

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Dashboard
      </Divider>
      <Row>
        <Col className="flex pb-3">
          <Select
            placeholder="Please select a teacher"
            allowClear
            onChange={(value) => handleInputChange("id", value)}
            onClear={() => {
              setTeacherFilter({ ...teacherFilter, id: "" });
            }}
          >
            {teacherData.map((sub) => (
              <Option key={sub.id} value={sub.id}>
                {sub.name}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Spin spinning={loading}>
        <div className="grid grid-cols-8 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
          {!data && (
            <CardDataStats
              title="Total Experience Conducted"
              total={data1 ? data1.totalNoOfExperienceConducted : 0}
              rate="0.43%"
            >
              <HomeOutlined style={{ fontSize: "50px", color: "#ba28a9" }} />
            </CardDataStats>
          )}
          {!data && (
            <CardDataStats
              title="Total Experience"
              total={data1 ? data1.totalNoOfExperience : 0}
              rate="4.35%"
            >
              <CrownFilled style={{ fontSize: "50px", color: "#ba28a9" }} />
            </CardDataStats>
          )}
          {!data && (
            <CardDataStats
              title="Total Assessment"
              total={data1 ? data1.totalNoOfAssessment : 0}
              rate="2.59%"
            >
              <DatabaseFilled
                style={{ fontSize: "50px", color: "#ba28a9" }}
              />
            </CardDataStats>
          )}
        </div>
        {data && (
          <>
            <div className="grid grid-cols-8 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
              <CardDataStats
                title="Total Experience Conducted"
                total={data ? data.totalNoOfExperienceConducted : 0}
                rate="0.43%"
              >
                <HomeOutlined style={{ fontSize: "50px", color: "#ba28a9" }} />
              </CardDataStats>
              <CardDataStats
                title="Total Experience"
                total={data ? data.totalNoOfExperience : 0}
                rate="4.35%"
              >
                <CrownFilled style={{ fontSize: "50px", color: "#ba28a9" }} />
              </CardDataStats>
              <CardDataStats
                title="Total Assessment"
                total={data ? data.totalNoOfAssessment : 0}
                rate="2.59%"
              >
                <DatabaseFilled
                  style={{ fontSize: "50px", color: "#ba28a9" }}
                />
              </CardDataStats>
            </div>
            <br />
            <Card className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
              <Divider orientation="left" style={{ fontSize: "18px" }}>
                Teacherwise Data
              </Divider>
              <div id="combinedChart" style={{ marginTop: "20px" }}>
                <ReactApexChart
                  options={{
                    chart: {
                      type: "bar",
                      height: 350,
                    },
                    stroke: {
                      width: [7, 7, 7],
                      curve: "smooth",
                    },
                    xaxis: {
                      type: "datetime",
                      categories: data.totalNoOfExperienceByTeacher.map(
                        (item) => item._id
                      ),
                    },
                    colors: ["#00E396", "#FF4560", "#775DD0"],
                  }}
                  series={[
                    {
                      name: "Total Experience Created",
                      data: data.totalNoOfExperienceByTeacher.map(
                        (item) => item.count
                      ),
                    },
                    {
                      name: "Experience Deployed",
                      data: data.ExperienceDeployedByTeacher.map(
                        (item) => item.count
                      ),
                    },
                    {
                      name: "Assessment Created",
                      data: data.AssessmentCreatedByTeacher.map(
                        (item) => item.count
                      ),
                    },
                  ]}
                  type="bar"
                  height={350}
                />
              </div>
            </Card>
          </>
        )}
      </Spin>
    </>
  );
};

export default SuperadminDashboard;
