import { Button, Modal, Steps, Tabs, message, theme } from "antd";
import { useRef, useState } from "react";
import Session from "./Session";
import Character from "./Character";
import Model3D from "./Model3D";
import Video360 from "./Video360";
import Assessment from "./Assessment";
import moment from "moment";
import TabPane from "antd/es/tabs/TabPane";
import {
  CreateAssessments,
  CreateContent,
  CreateSession,
  PatchAssessments,
  PatchSession,
} from "../../../services/Index";
import Anotation from "./Anotation";
import { useNavigate } from "react-router-dom";
import Image360 from "./Image360";
import Simulation from "./Simulation";

const AddMyExperience = () => {
  const nav = useNavigate();
  
  const videoPlayerRef = useRef(null);
  const [activeKey, setActiveKey] = useState("1");
  const [formLoader, setFormLoader] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [session, setSession] = useState({
    sessionTimeAndDate: moment().format(),
    sessionStartedTime: moment().startOf("day").toISOString(),
    sessionEndedTime: moment().endOf("day").toISOString(),
    grade: "6",
    name: "",
    sessionStatus: "pending",
    subject: "Science",
    feedback: "string",
    sessionDuration: 0,
  });
  const [content, setContent] = useState({
    sessionId: "",
    script: "",
    modelDetails: [],
    videoDetails: [],
    imageDetails: [],
    teacherCharacterGender: "male",
    classEnvironment: "",
    language: "english",
    isDraft: false,
    youTubeUrl: "",
    youTubeVideoAudio: true,
    youTubeVideoScript: "",
    youTubeStartTimer: "00:00",
    youTubeEndTimer: "00:00",
  });
  const [contentRes, setContentRes] = useState([]);
  const [assessment, setAssessment] = useState([
    {
      question: "",
      options: [
        {
          text: "",
          isCorrect: true,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
        {
          text: "",
          isCorrect: false,
        },
      ],
      isDraft: true,
      typeOfGame: "",
    },
  ]);

  const [responseValue, setResponseValue] = useState([]);
  const [disableFields, setDisableFields] = useState(true);
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleClose = () => {
    nav("/myexperience", { replace: true });
  };
  const handleContentSave = async () => {
    setFormLoader(true);
    const res = await CreateContent({
      ...content,
      sessionId: session.id,
    });
    const updatedValue = res.modelDetails.map((item, index) => ({
      contentId: res.id,
      _id: item._id,
      modelUrl: content.modelDetails[index]?.modelUrl,
    }));

    setContentRes(updatedValue);
    setResponseValue([...responseValue, { ...content, ...res }]);
    handleTabChange("7");
  };

  const handleSave = async () => {
    setFormLoader(true);
    try {
      let nextTabKey = activeKey;
      switch (activeKey) {
        case "1": // Experience
          setAddLoader(true);
          if (!("id" in session)) {
            const res = await CreateSession({ ...session, isDraft: false });
            setSession(res);
            setAddLoader(false);
            setContent({ ...content, sessionId: res.id });
          } else {
            const data = {
              name: session.name,
              grade: session.grade,
              subject: session.subject,
            };
            const res = await PatchSession(content.sessionId, data);
            setSession(res);
            setAddLoader(false);
            setContent({ ...content, sessionId: res.id });
          }
          setAddLoader(false);
          nextTabKey = "2";
          break;

        case "2":
          nextTabKey = "3";
          break;
        case "3":
          if (videoPlayerRef.current) {
            // Check if it's a ReactPlayer instance
            if (videoPlayerRef.current.getInternalPlayer) {
              const internalPlayer = videoPlayerRef.current.getInternalPlayer();
              if (
                internalPlayer &&
                typeof internalPlayer.pauseVideo === "function"
              ) {
                internalPlayer.pauseVideo(); // Use YouTube API's pauseVideo method
              } else if (
                internalPlayer &&
                typeof internalPlayer.pause === "function"
              ) {
                internalPlayer.pause(); // Use HTML5 video element's pause method
              }
            } else if (videoPlayerRef.current.pause) {
              // Check if it's a standard HTML5 video element
              videoPlayerRef.current.pause(); // Pause the video
            }
          }
          nextTabKey = "4";
          break;
        case "4":
          nextTabKey = "5";
          break;
        case "5":
          nextTabKey = "6";
          break;
        case "6":
          nextTabKey = "7";
          break;

        case "7":
          setAddLoader(true);
          const res = await CreateContent({
            ...content,
            sessionId: session.id,
            isDraft: false,
          });
          const updatedValue = res.modelDetails.map((item, index) => ({
            contentId: res.id,
            _id: item._id,
            modelUrl: content.modelDetails[index]?.modelUrl,
          }));

          setContentRes(updatedValue);
          setResponseValue([...responseValue, { ...content, ...res }]);
          if (assessment.length != 0) {
            await PatchAssessments(session.id, assessment);
          }
          setAddLoader(false);
          message.success("Data saved successfully");
          nextTabKey = "8";
          break;

        default:
          nextTabKey = (parseInt(activeKey) + 1).toString();
          break;
      }

      setFormLoader(false);
      handleTabChange(nextTabKey);
    } catch (error) {
      setFormLoader(false);
      console.error(error);
    }
  };
  const handleSkip = async () => {
    setAddLoader(true);
    setFormLoader(true);
    let nextTabKey = activeKey;
    const res = await CreateContent({
      ...content,
      sessionId: session.id,
      isDraft: false,
    });
    const updatedValue = res.modelDetails.map((item, index) => ({
      contentId: res.id,
      _id: item._id,
      modelUrl: content.modelDetails[index]?.modelUrl,
    }));

    setContentRes(updatedValue);
    setResponseValue([...responseValue, { ...content, ...res }]);
    message.success("Data saved successfully");
    nextTabKey = "8";
    setFormLoader(false);
    setAddLoader(false);
    handleTabChange(nextTabKey);
  };
  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <span className="text-xl m-0">Add Experience</span>
      </div>
      <div
        className="full-height"
        style={{ padding: "20px", background: "#d9d4e0" }}
      >
        <Tabs activeKey={activeKey} onChange={handleTabChange} type="card">
          <TabPane tab="Experience" key="1" disabled>
            <Session
              addLoader={addLoader}
              handleClose={handleClose}
              session={session}
              setSession={setSession}
              setDisableFields={setDisableFields}
              handleSave={handleSave}
            />
          </TabPane>
          <TabPane tab="Character" key="2" disabled>
            <Character
              content={content}
              setContent={setContent}
              setDisableFields={setDisableFields}
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
            />
          </TabPane>
          <TabPane tab="360 Video" key="3" disabled>
            <Video360
            videoPlayerRef={videoPlayerRef}
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
              content={content}
              setContent={setContent}
              setDisableFields={setDisableFields}
            />
          </TabPane>

          <TabPane tab="360 Image" key="4" disabled>
            <Image360
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
              content={content}
              setContent={setContent}
              setDisableFields={setDisableFields}
            />
          </TabPane>
          <TabPane tab="3D Model" key="5" disabled>
            <Model3D
              disableFields={disableFields}
              content={content}
              setContent={setContent}
              setDisableFields={setDisableFields}
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
            />
          </TabPane>
          <TabPane tab="Simulation" key="6" disabled>
            <Simulation
              disableFields={disableFields}
              content={content}
              setContent={setContent}
              setDisableFields={setDisableFields}
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
            />
          </TabPane>
          <TabPane tab="Assessment" key="7" disabled>
            <Assessment
              content={content}
              assessment={assessment}
              setAssessment={setAssessment}
              handleContentSave={handleContentSave}
              handleBack={handleTabChange}
              handleClose={handleClose}
              handleSave={handleSave}
              setDisableFields={setDisableFields}
            />
          </TabPane>
          <TabPane tab="3D Model Editor" key="8" disabled>
            <Anotation
              responseValue={responseValue}
              contentRes={contentRes}
              sessionId={content.sessionId}
            />
          </TabPane>
        </Tabs>
      </div>
      <div className="mt-5 flex justify-end">
        {activeKey === "7" && (
          <>
            <Button type="default" className="mr-5" onClick={handleClose}>
              Close
            </Button>
            <Button
              type="primary"
              className="mr-3"
              onClick={() => handleTabChange("6")}
            >
              Back
            </Button>
            <Button
              type="primary"
              className="ml-3"
              loading={addLoader}
              onClick={() => handleSave(false)}
              disabled={disableFields}
            >
              Save & Submit
            </Button>
            <Button
              type="primary"
              className="ml-3"
              loading={addLoader}
              onClick={() => handleSkip(false)}
              disabled={!disableFields}
            >
              Skip
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddMyExperience;
