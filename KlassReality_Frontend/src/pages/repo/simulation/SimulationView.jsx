import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Typography,
  Upload,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { PatchVideo } from "../../../services/Index";
import SimulationIFrame from "../../../common/SimulationIFrame";

const SimulationView = () => {
  const location = useLocation();
  const { file } = location.state;
  const Nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState({
    id: file.id,
    title: file.title,
    description: file.description,
    subject: file.subject,
    displayTime: file.displayTime,
  });
  const [form] = Form.useForm();
  const goBack = () => {
    Nav("/simulation", { replace: true });
  };
  return (
    <>
      <div className="text-start">
        <Card
          type="inner"
          title={
            <div className="flex gap-3 items-center">
              <Button
                icon={<ArrowLeftOutlined />}
                size="default"
                type="primary"
                onClick={() => goBack()}
              >
                Back
              </Button>
              {value.title} Video
            </div>
          }
        >
          <Row gutter={16}>
            <Col span={24}>
              <Card>
                <Descriptions>
                  <Descriptions.Item label="Title">
                    {value.title}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item label="Display Time">
                    {value.displayTime}
                  </Descriptions.Item>
                </Descriptions>
                <Descriptions>
                  <Descriptions.Item label="subject">
                    {value.subject}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <div style={{ height: "100%" }}>
                  <SimulationIFrame
                    url={file.simulationURL}
                    controls
                    width="100%"
                    height="100%"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    </>
  );
};
export default SimulationView;
