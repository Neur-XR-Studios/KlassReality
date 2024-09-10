import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  Modal,
  Pagination,
  Select,
  Spin,
  Tooltip,
  Button,
  Input,
  Flex,
  Upload,
  Divider,
  Badge,
  Popconfirm,
  message,
  Form,
  FloatButton,
  Space,
  Avatar,
  Radio,
  Image,
} from "antd";
import ReactPlayer from "react-player";
import noimage from "../../../../public/no image.png";
import {
  DeleteSimulation,
  DeleteVideo,
  GetSimulation,
  PostVideo,
} from "../../../services/Index";
import TextArea from "antd/es/input/TextArea";
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  PlusOutlined,
  StarOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Simulation = () => {
  const [simulationDuration, setSimulationDuration] = useState(null);
  const [simulations, setSimulations] = useState([]);
  const [selectedSimulation, setSelectedSimulation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Set initial page size
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [sorting, setSorting] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useNavigate();
  const imgStyle = {
    display: "block",
    width: "100%",
    height: 160,
  };

  const style = {
    padding: "8px 0",
  };

  const [searchValue, setSearchValue] = useState({
    title: "",
    subject: [],
  });
  const handleSearch = (e) => {
    const { name, value } = e.target;

    setSearchValue((state) => ({
      ...state,
      [name]: value,
    }));
  };

  useEffect(() => {
    setLoading(true);
    const filteredSearchValue = Object.fromEntries(
      Object.entries(searchValue).filter(([key, value]) => value !== "")
    );

    if (Object.keys(filteredSearchValue).length > 0) {
      GetSimulation(filteredSearchValue)
        .then((response) => {
          setSimulations(response.results);
          setTotalPages(response.totalPages);
          setTotalResults(response.totalResults);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      GetSimulation({
        // sortBy: "title%3A"+sorting,
        limit: pageSize,
        page: currentPage,
      })
        .then((response) => {
          setSimulations(response.results);
          setTotalPages(response.totalPages);
          setTotalResults(response.totalResults);
        })
        .catch((error) => {
          setError(error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPage, pageSize, sorting, refresh, searchValue]);

  const handleSimulationClick = (file) => {
    nav("/simulation-view", { state: { file: file }, replace: true });
  };

  const handleModalClose = () => {
    setSelectedSimulation(null);
    setModalVisible(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to the first page when changing page size
    setPageSize(size); // Update page size
  };

  const handleDelete = (id) => {
    DeleteSimulation(id)
      .then(() => {
        setSimulations((prevSimulations) =>
          prevSimulations.filter((simulation) => simulation.id !== id)
        );
        message.success("Deleted Successfully!");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSearchClear = () => {
    setSearchValue({
      title: "",
      subject: "",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <span className="text-xl m-0">Simulations</span>
      </div>
      <div className="flex items-center justify-between mt-3">
        <Row gutter={16} className="text-left"></Row>
        <div className="flex gap-4">
          <Col span={12}>
            <Input
              placeholder="Search the title"
              className="min-w-72"
              value={searchValue.title}
              name="title"
              onChange={(e) => handleSearch(e)}
            />
          </Col>{" "}
          <Col span={12}>
            <Select
              mode="multiple"
              placeholder="Search the Subject"
              style={{ minWidth: 200 }}
              value={searchValue.subject}
              onChange={(value) =>
                setSearchValue((prev) => ({
                  ...prev,
                  subject: value,
                }))
              }
              allowClear
              onClear={handleSearchClear}
            >
              <Option value="Science">Science</Option>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Social Studies">Social Studies</Option>
            </Select>
          </Col>
        </div>
      </div>
      <br />
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div>Error loading simulations. Please try again.</div>
      ) : (
        <Row
          gutter={{
            xs: 8,
            sm: 16,
            md: 24,
            lg: 32,
          }}
        >
          {simulations &&
            simulations.map((val, index) => (
              <Col key={index} className="gutter-row" span={6}>
                <div style={style}>
                  <Card hoverable>
                    <Row>
                      <img
                        alt="thumbnail"
                        src={val.thumbnailURL}
                        style={imgStyle}
                      />
                    </Row>
                    <Row
                      align="flex-end"
                      justify="space-between"
                      style={{
                        padding: 10,
                      }}
                    >
                      <Typography>{val.title}</Typography>
                      <Row>
                        <Button
                          type="primary"
                          icon={<EyeOutlined />}
                          onClick={() => handleSimulationClick(val)}
                          size="small"
                        />
                        {/* &nbsp;
                        <Popconfirm
                          title="Are you sure to delete this simulation?"
                          onConfirm={() => handleDelete(val.id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button
                            danger
                            size="small"
                            type="primary"
                            icon={<DeleteOutlined />}
                          />
                        </Popconfirm> */}
                      </Row>
                    </Row>
                  </Card>
                </div>
              </Col>
            ))}
        </Row>
      )}
      <Modal
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        destroyOnClose
      >
        {selectedSimulation && (
          <iframe
            title="Simulation"
            src="https://klass-vr-file.s3.ap-south-1.amazonaws.com/klass-simulations/Hibiscus/index.html"
            style={{ width: "100%", height: "100%", border: "none" }}
          />
        )}
      </Modal>
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalResults}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange} // Handle size change event
        style={{ marginTop: "20px", textAlign: "center" }}
        showSizeChanger={true}
        showQuickJumper={false}
      />
    </>
  );
};

export default Simulation;
