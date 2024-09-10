import { Button, Card, Col, Divider, Row } from "antd";
import ModelViewer from "../../../components/modelViewer/ModelViewer";
import React from "react";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Anotation = ({ contentRes, sessionId }) => {
  const navigate = useNavigate();

  const handleDownload = (modelid, url, contentId) => {
    const token = localStorage.getItem("accessToken");
    localStorage.setItem("contentId", modelid);
    localStorage.setItem("model", url);
    localStorage.setItem(
      "experienceData",
      JSON.stringify({ modelid, url, token })
    );
    navigate("/unity", {
      state: {
        contentId: contentId,
        model: url,
        modelId: modelid,
        token: token,
        sessionId: sessionId,
        modelCoordinates: "",
        provider: {
          loaderUrl: "../../../assets/WEBGLbuild/build84.loader.js",
          dataUrl: "../../../assets/WEBGLbuild/build84.data.unityweb",
          frameworkUrl:
            "../../../assets/WEBGLbuild/build84.framework.js.unityweb",
          codeUrl: "../../../assets/WEBGLbuild/build84.wasm.unityweb",
        },
      },
      replace: true,
    });
  };

  const handleClose = () => {
    navigate("/myexperience", { replace: true });
  };

  return (
    <Col span={24} className="p-2">
      <Card type="inner" title="3D Model">
        {contentRes.length === 0 ? (
          <div>No 3D Model</div>
        ) : (
          contentRes.map((mod) => (
            <React.Fragment key={mod._id}>
              <Row gutter={16}>
                <Col span={24}>
                  <Card>
                    <div className="flex flex-col gap-0 items-center h-96">
                      {mod.modelUrl ? (
                        <ModelViewer
                          modelUrl={mod.modelUrl}
                          style={{
                            width: "100%",
                            height: "100%",
                            focus: true,
                          }}
                        />
                      ) : (
                        "No 3D Model"
                      )}
                      <Button
                        className="mt-5"
                        type="primary"
                        onClick={() =>
                          handleDownload(mod._id, mod.modelUrl, mod.contentId)
                        }
                      >
                        <EditOutlined /> Edit
                      </Button>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Divider />
            </React.Fragment>
          ))
        )}
      </Card>
      <div className="mt-5 flex justify-end">
        <Button type="primary" className="mr-5" onClick={handleClose}>
          Finish
        </Button>
      </div>
    </Col>
  );
};

export default Anotation;
