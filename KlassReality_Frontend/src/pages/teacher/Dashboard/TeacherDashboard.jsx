import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  GradeSectionPerfomance,
  TeacherDashboards,
  GradeSectionFilter,
} from "../../../services/Index";
import { Card, Row, Select, Col, Divider, message } from "antd";

const { Option } = Select;

const TeacherDashboard = () => {
  const [data, setData] = useState([]);
  const [sections, setSections] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formData, setFormData] = useState({
    gradeId: "",
    sectionId: "",
  });
  const [showDefaultChart, setShowDefaultChart] = useState(false);
  const [showFilteredChart, setShowFilteredChart] = useState(false);

  useEffect(() => {
    GradeSectionPerfomance()
      .then((res) => {
        setData(res);
        setShowDefaultChart(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    if (
      formData.gradeId !== undefined &&
      formData.gradeId !== "" &&
      formData.sectionId !== undefined &&
      formData.sectionId !== ""
    ) {
      const requestData = {
        gradeId: formData.gradeId,
        sectionID: formData.sectionId,
      };
      TeacherDashboards(requestData)
        .then((res) => {
          setFilteredData([res]);
          setShowDefaultChart(false);
          setShowFilteredChart(true);
        })
        .catch((error) => {
          console.error("Error fetching filtered data:", error);
        });
    } else {
      setFilteredData([]);
      setShowFilteredChart(false);
      setShowDefaultChart(true);
    }
  }, [formData, sections]);

  const defaultChartData = {
    categories: data.map(
      (item) => `Grade ${item.gradeName} - Section ${item.sectionName}`
    ),
    totalScore: data.map((item) => item.totalScore),
    totalStudents: data.map((item) => item.totalStudents),
  };

  const filteredChartData = {
    categories: filteredData.map((item) => `Totals`),
    totalNoOf3dModels: filteredData.map((item) => item.totalNoOf3dModels),
    totalNoOf360Videos: filteredData.map((item) => item.totalNoOf360Videos),
  };

  const options = {
    xaxis: {
      categories: defaultChartData.categories,
    },
    colors: ["#ba28a9", "#28a9ba", "#ff0000", "#00ff00"],
  };

  const options2 = {
    xaxis: {
      categories: filteredChartData.categories,
    },
    colors: ["#ba28a9", "#28a9ba"],
  };

  const options3 = {
    xaxis: {
      categories: filteredData[0]?.clientSchoolPerfomance.map(
        (item) => item.studentID
      ),
    },
    colors: ["#ba28a9", "#28a9ba"],
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGradeChange = async (gradeId) => {
    if (gradeId === undefined) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gradeId: "",
        sectionId: "",
      }));
      setSections([]);
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        gradeId,
        sectionId: "",
      }));
      try {
        const response = await GradeSectionFilter(gradeId);
        setSections(response);
      } catch (error) {
        setFormData({
          gradeId: "",
          sectionId: "",
        });
        message.error("Error fetching sections");
      }
    }
  };

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Dashboard
      </Divider>
      <div className="mt-4 grid grid-cols-16 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <Card className="rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
          <Row>
            <Col className="flex pr-6">
              <Select
                className="min-w-72"
                placeholder="Choose grade"
                allowClear
                onChange={handleGradeChange}
                onClear={() => handleGradeChange(undefined)}
              >
                {data.map((sub) => (
                  <Option key={sub.gradeID} value={sub.gradeID}>
                    {sub.gradeName}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col className="flex">
              <Select
                className="min-w-72"
                placeholder="Choose Section"
                value={formData.sectionId}
                onChange={(value) => handleInputChange("sectionId", value)}
                onClear={() => {
                  setFormData({ ...formData, sectionId: "" });
                }}
                disabled={sections.length === 0} // Disable the select when there are no sections
              >
                {sections.map((section) => (
                  <Option key={section.id} value={section.id}>
                    {section.name}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>
          {showDefaultChart && (
            <div id="chartOne" style={{ marginTop: "20px" }}>
              <ReactApexChart
                options={options}
                series={[
                  { name: "Average Score", data: defaultChartData.totalScore },
                  {
                    name: "Total Students",
                    data: defaultChartData.totalStudents,
                  },
                ]}
                type="bar"
                height={350}
              />
            </div>
          )}

          {showFilteredChart && (
            <div>
              {filteredData[0].clientSchoolPerfomance && (
                <div id="chartThree" style={{ marginTop: "20px" }}>
                  <ReactApexChart
                    options={options3}
                    series={[
                      {
                        name: "Average Score",
                        data: filteredData[0].clientSchoolPerfomance.map(
                          (item) => item.averageScore
                        ),
                      },
                    ]}
                    type="bar"
                    height={350}
                  />
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </>
  );
};

export default TeacherDashboard;
