import React, { useEffect, useRef, useState } from "react";
import { Button, Tabs, Spin, message } from "antd"; // Import Spin component for loading indicator
import {
  CreateContent,
  GetExperienceById,
  PatchAssessments,
  PatchContent,
  PatchSession,
} from "../../../services/Index";
import { useNavigate, useParams } from "react-router-dom";
import Session from "./Session";
import Character from "./Character";
import Assessment from "./Assessment";
import moment from "moment";
import Video360 from "./Video360";
import Model3D from "./Model3D";
import Image360 from "./Image360";
import Simulation from "./Simulation";

const { TabPane } = Tabs;

const EditMyExperience = () => {
  const nav = useNavigate();
  const { id } = useParams();
  
  const videoPlayerRef = useRef(null);
  const [loading, setLoading] = useState(true); // State to manage loading status
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
    imageDetails: [],
    simulationDetails: [],
    videoDetails: [],
    classEnvironment: "",
    teacherCharacterGender: "male",
    language: "english",
    isDraft: false,
    youTubeUrl: "",
    youTubeVideoAudio: true,
    youTubeVideoScript: "",
    youTubeStartTimer: "",
    youTubeEndTimer: "",
  });
  const [contentRes, setContentRes] = useState([]);
  const params = useParams();
  const [assessment, setAssessment] = useState([
    {
      // _id: "",
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
      typeOfGame: "",
      isDraft: true,
    },
  ]);
  const [responseValue, setResponseValue] = useState([]);
  const [disableFields, setDisableFields] = useState(false);

  useEffect(() => {
    // Fetch data from API
    GetExperienceById(params.id)
      .then((res) => {
        // Handle response
        // Set loading to false once data is fetched
        setLoading(false);
        localStorage.setItem("experienceData", JSON.stringify(res[0]));
        res.map((val) => {
          setSession({
            name: val.name,
            grade: val.grade,
            subject: val.subject,
            sessionStartedTime: val.sessionStartedTime,
            sessionEndedTime: val.sessionEndedTime,
          });
          setContent({
            id: val.content[0]._id,
            script: val.content[0].script,
            youTubeUrl: val.content[0].youTubeUrl,
            youTubeVideoAudio: val.content[0].youTubeVideoAudio,
            youTubeVideoScript: val.content[0].youTubeVideoScript,
            youTubeStartTimer: val.content[0].youTubeStartTimer,
            youTubeEndTimer: val.content[0].youTubeEndTimer,
            language: val.content[0].language,
            teacherCharacterGender: val.content[0].teacherCharacterGender,
            classEnvironment: val.content[0].classEnvironment,
            videoDetails: val.content[0].videoDetails,
            imageDetails: val.content[0].imageDetails,
            simulationDetails: val.content[0].simulationDetails,
            modelDetails: val.content[0].modelDetails || [],
          });
          const decodedArray = [];
          val.assessment.forEach((valu) => {
            const updatedAssessment = valu.options.map((opt) => ({
              text: decodeURIComponent(opt.text),
              isCorrect: opt.isCorrect,
            }));
            decodedArray.push({
              assessmentId: valu._id,
              question: decodeURIComponent(valu.question),
              options: [...updatedAssessment],
              typeOfGame: decodeURIComponent(valu.typeOfGame),
              isDraft: true,
            });
          });
          setAssessment(decodedArray);
        });
      })
      .catch((err) => {
        // Handle error
        setLoading(false); // Make sure to set loading to false in case of error
        message.error(err);
      });
  }, [id]);

  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  const handleClose = () => {
    nav("/myexperience", { replace: true });
  };
  const handleSave = async (isDraft) => {
    setFormLoader(true);
    try {
      let nextTabKey = activeKey;
      switch (activeKey) {
        case "1":
          setAddLoader(true)
          if (!("id" in session)) {
            const res = await PatchSession(params.id, session);
            const duplicateContent = { ...content };
            setSession(res);
            setAddLoader(false)
            setContent({ ...duplicateContent, sessionId: res.id });
          }
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
          setAddLoader(true)
          const array = Array.isArray(content.modelDetails)
            ? content.modelDetails.map((mod) => ({
                _id: mod._id,
                modelId: mod.modelId,
                modelCoordinates: mod.modelCoordinates,
                script: mod.script,
                displayTime: mod.displayTime,
              }))
            : [];
          const Array2 = Array.isArray(content.videoDetails)
            ? content.videoDetails.map((mod) => ({
                _id: mod._id,
                script: mod.script,
                VideoId: mod.VideoId,
                videoSound: mod.videoSound,
              }))
            : [];
          const Array3 = Array.isArray(content.imageDetails)
            ? content.imageDetails.map((mod) => ({
                _id: mod._id,
                script: mod.script,
                ImageId: mod.ImageId,
                displayTime: mod.displayTime,
              }))
            : [];
            const Array4 = Array.isArray(content.simulationDetails)
            ? content.simulationDetails.map((mod) => ({
                _id: mod._id,
                script: mod.script,
                simulationId: mod.simulationId,
                displayTime: mod.displayTime,
              }))
            : [];
          const { id, ...contentWithoutIds } = content;
          const datas = {
            ...contentWithoutIds,
            modelDetails: array,
            videoDetails: Array2,
            imageDetails: Array3,
            simulationDetails: Array4,
          };
          if (!content.id) {
           
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
            setAddLoader(false)
            setResponseValue([...responseValue, { ...content, ...res }]);
          } else {
            const res = await PatchContent(content.id, datas);
            const updatedValue = Array.isArray(res.modelDetails)
              ? res.modelDetails.map((item, index) => ({
                  contentId: res.id,
                  _id: item._id,
                  modelUrl: content.modelDetails[index]?.modelUrl,
                }))
              : [];
            setContentRes(updatedValue);
            setAddLoader(false)
            setResponseValue([...responseValue, { ...content, ...res }]);
          }
          setAddLoader(false)
          nextTabKey = "7";
          break;
        case "7":
          setAddLoader(true)
          if (assessment[0]) {
            await PatchAssessments(params.id, assessment);
            setAddLoader(false)
          }
          message.success("Data saved successfully");
          setAddLoader(false)
          nav("/myexperience", { replace: true });
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

  return (
    <div>
      <div className="flex items-center justify-between p-2">
        <span className="text-xl m-0">Edit Experience - ( {session.name} )</span>
      </div>
      <div
        className="full-height"
        style={{ padding: "20px", background: "#d9d4e0" }}
      >
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Tabs activeKey={activeKey} onChange={handleTabChange} type="card">
            <TabPane tab="Experience" key="1" disabled>
              <Session
                addLoader={addLoader}
                session={session}
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
                setSession={setSession}
              />
            </TabPane>
            <TabPane tab="Character" key="2" disabled>
              <Character
                content={content}
                setContent={setContent}
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
              />
            </TabPane>
            <TabPane tab="360 Video" key="3" disabled>
              <Video360
              videoPlayerRef={videoPlayerRef}
                content={content}
                setContent={setContent}
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
              />
            </TabPane>
            <TabPane tab="360 Image" key="4" disabled>
              <Image360
                content={content}
                setContent={setContent}
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
              />
            </TabPane>
            <TabPane tab="3D Model" key="5" disabled>
              <Model3D
                disableFields={disableFields}
                content={content}
                setContent={setContent}
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
              />
            </TabPane>
            <TabPane tab="Simulation" key="6" disabled>
            <Simulation
              addLoader={addLoader}
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
                handleBack={handleTabChange}
                handleClose={handleClose}
                handleSave={handleSave}
                setDisableFields={setDisableFields}
              />
            </TabPane>
          </Tabs>
        )}
      </div>
      {!loading && (
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EditMyExperience;
