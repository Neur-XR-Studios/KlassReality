// ViewMyExperience.jsx
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  message,
  Spin,
  Image,
  Empty,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EditOutlined,
} from "@ant-design/icons";
import ReactPlayer from "react-player";
import { useEffect, useState } from "react";
import ModelViewer from "../../../components/modelViewer/ModelViewer";
import { GetExperienceById } from "../../../services/Index";
import SimulationIFrame from "../../../common/SimulationIFrame";

const ViewMyExperience = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    GetExperienceById(params.id)
      .then((res) => {
        setData(res[0]);
        localStorage.setItem("experienceData", JSON.stringify(res[0]));
        setLoading(false);
      })
      .catch((err) => {
        message.error(err);
        setLoading(false);
      });
  }, [params.id]);

  const handleDownload = (
    modelid,
    url,
    contentId,
    sessionId,
    modelCoordinates
  ) => {
    const token = localStorage.getItem("accessToken");
    localStorage.setItem("contentId", modelid);
    localStorage.setItem("model", url);
    localStorage.setItem(
      "experienceData",
      JSON.stringify({ modelid, url, token })
    );
    navigate("/unity", {
      state: {
        contentId,
        model: url,
        modelId: modelid,
        token,
        sessionId,
        modelCoordinates: modelCoordinates || "[]",
        provider: {
          loaderUrl: "../assets/WEBGLbuild/build44.loader.js",
          dataUrl: "../assets/WEBGLbuild/build44.data.unityweb",
          frameworkUrl: "../assets/WEBGLbuild/build44.framework.js.unityweb",
          codeUrl: "../assets/WEBGLbuild/build44.wasm.unityweb",
        },
      },
      replace: true,
    });
  };

  const goBack = () => {
    navigate("/myexperience", { replace: true });
  };

  return loading ? (
    <Spin tip="Loading Application..." size="large"></Spin>
  ) : (
    data && (
      <Badge.Ribbon
        color={data.isDeployed ? "green" : "blue"}
        text={data.isDeployed ? "Deployed" : "Not Deployed"}
      >
        <div className="text-start">
          <Card
            title={
              <div className="flex gap-3 items-center">
                <Button
                  icon={<ArrowLeftOutlined />}
                  size="default"
                  type="primary"
                  onClick={goBack}
                >
                  Back
                </Button>
                {data.name}
              </div>
            }
          >
            <div className="grid gap-5 grid-cols-1">
              {data.content.length > 0 ? (
                data.content.map((cont, item) => (
                  <div key={item} className="grid gap-5 grid-cols-1">
                    <Card type="inner" title="Character">
                      <Card>{cont.script}</Card>
                    </Card>
                    {cont.youTubeUrl != "" ? (
                      <Card key={"youtube"} type="inner" title="Youtube Video">
                        <Row gutter={16}>
                          <Col span={12}>
                            <div className="video-player-container">
                              <ReactPlayer
                                url={cont.youTubeUrl}
                                width="100%"
                                height="100%"
                                controls={true}
                                className="react-player" // Added class for styling
                              />
                            </div>
                          </Col>
                          <Col span={12}>
                            <Card>{cont.youTubeVideoScript}</Card>
                          </Col>
                        </Row>
                      </Card>
                    ) : (
                      ""
                    )}
                    {cont.videoDetails?.map((vid) => (
                      <Card key={vid.id} type="inner" title="360 Video">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Card>
                              <ReactPlayer
                                url={vid.videoDetail?.videoURL}
                                controls
                                width="100%"
                                height="auto"
                              />
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card>{vid.script}</Card>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    {cont.imageDetails?.map((vid) => (
                      <Card key={vid.id} type="inner" title="360 Image">
                        <Row gutter={16}>
                          <Col span={12}>
                            <Card>
                              <Image src={vid.imageDetail?.imageURL} />
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card>{vid.script}</Card>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    {cont.simulationDetails?.map((vid) => (
                      <Card key={vid.id} type="inner" title="Simulations">
                        <Row gutter={16}>
                          <Col span={24}>
                            <Card>
                              <SimulationIFrame
                                url={vid.simulationDetail?.simulationURL}
                                title={vid.simulationDetail.title}
                              />
                            </Card>
                          </Col>
                          <Col span={12}>
                            <Card>{vid.script}</Card>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    {cont.modelDetails.length > 0 &&
                      cont.modelDetails.map((mod) => (
                        <Card type="inner" title="3D Model">
                          <div key={mod.id}>
                            <Row gutter={16}>
                              <Col span={12}>
                                <Card>
                                  <div className="flex flex-col gap-0 items-center h-96">
                                    <ModelViewer
                                      modelUrl={mod.modelData?.modelUrl}
                                      style={{
                                        width: "100%",
                                        height: "100%",
                                      }}
                                    />
                                    <Button
                                      className="mt-5"
                                      type="primary"
                                      onClick={() =>
                                        handleDownload(
                                          mod._id,
                                          mod.modelData.modelUrl,
                                          cont._id,
                                          data._id,
                                          mod.modelCoordinates
                                        )
                                      }
                                    >
                                      <EditOutlined /> Edit
                                    </Button>
                                  </div>
                                </Card>
                              </Col>
                              <Col span={12}>
                                <Card>{mod.script}</Card>
                              </Col>
                            </Row>
                            <Divider />
                          </div>
                        </Card>
                      ))}
                  </div>
                ))
              ) : (
                <Empty />
              )}
              {data.assessment.length > 0 &&
                data.assessment.map((ass, index) => (
                  <Card type="inner" title="Assessment">
                    <div className="grid gap-5">
                      <Card
                        key={index}
                        type="inner"
                        title={`${index + 1}) ${ass.question}`}
                      >
                        <div className="grid gap-5 grid-cols-2">
                          {ass.options.map((option, ind) => (
                            <Card key={ind} type="inner" size="small">
                              <div className="flex justify-between">
                                <p className="m-0">
                                  <b>{String.fromCharCode(65 + ind)}) </b>
                                  {option.text}
                                </p>
                                {option.isCorrect && (
                                  <CheckOutlined className="text-green-600 text-lg" />
                                )}
                              </div>
                            </Card>
                          ))}
                        </div>
                      </Card>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </div>
      </Badge.Ribbon>
    )
  );
};

export default ViewMyExperience;
