import {
  Button,
  Card,
  Col,
  Row,
  Image,
  Input,
  Radio,
  Switch,
  Typography,
  Form,
  Empty,
  Spin,
  Flex,
} from "antd";
import { useEffect, useState } from "react";
import { DeleteFilled, PlusOutlined } from "@ant-design/icons";
import { DeleteAssessments } from "../../../services/Index";
import "./style.css";

const Assessment = ({
  content,
  assessment,
  setAssessment,
  assessmentData,
  setDisableFields,
}) => {
  const [loading, setLoading] = useState([]);

  const createNewQuestion = () => ({
    question: "",
    options: [
      { text: "", isCorrect: true },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
    isDraft: true,
    typeOfGame: "",
  });

  useEffect(() => {
    const isAllValid = assessment.every((item) => {
      const isQuestionValid =
        item.question.trim() !== "" && item.question.length > 5;
      const isGameValid = item.typeOfGame.trim() !== "";
      const isCorrectValid = item.options.some((ans) => ans.isCorrect);
      const isTextValid = item.options.every((ans) => ans.text.trim() !== "");
      return isQuestionValid && isTextValid && isCorrectValid && isGameValid;
    });

    setDisableFields(!isAllValid);
  }, [assessment, setDisableFields]);

  const handleChange = (e, index, ansIndex) => {
    const { name, value } = e.target;
    const updatedAssessment = [...assessment];
    if (name === "question") {
      updatedAssessment[index][name] = value;
    } else {
      updatedAssessment[index].options[ansIndex].text = value;
    }
    setAssessment(updatedAssessment);
  };

  const handleSwitch = (e, index, ansIndex) => {
    const value = e;
    const updatedAssessment = [...assessment];
    if (value) {
      updatedAssessment[index].options.forEach((option, i) => {
        if (i !== ansIndex) {
          option.isCorrect = false;
        }
      });
    }
    updatedAssessment[index].options[ansIndex].isCorrect = value;
    setAssessment(updatedAssessment);
  };

  const AddNewQuestion = () => {
    setAssessment([...assessment, createNewQuestion()]);
  };

  const handleDelete = async (index) => {
    try {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = true;
        return newLoading;
      });

      const assessmentId = assessment[index].assessmentId;
      if (assessmentId !== undefined) {
        await DeleteAssessments(assessmentId);
      }

      const updatedAssessment = assessment.filter((_, i) => i !== index);
      setAssessment(updatedAssessment);
    } catch (error) {
      console.error("Failed to delete assessment:", error);
    } finally {
      setLoading((prevLoading) => {
        const newLoading = [...prevLoading];
        newLoading[index] = false;
        return newLoading;
      });
    }
  };

  const onChange = (e, index) => {
    const selectedValue = e.target.value;
    const updatedAssessment = [...assessment];
    updatedAssessment[index].typeOfGame = selectedValue;
    setAssessment(updatedAssessment);
  };

  return (
    <>
      <Row className="flex justify-between">
        <Col className="flex flex-col static-images-container bg-slate-400 p-2 w-[170px] rounded-md h-[350px] whitespace-nowrap text-center">
          <Typography className="font-bold mb-2">Type of Game :</Typography>
          <Col className="gutter-row mb-12">
            <Image
              width={150}
              height={80}
              src="../../../assets/samplepicture/images.jpeg"
            />
            <Typography className="w-full text-center">Archery</Typography>
          </Col>
          <Col className="gutter-row mb-12">
            <Image
              width={150}
              height={80}
              src="../../../assets/samplepicture/Untitled.jpeg"
            />
            <Typography className="w-full text-center">Basketball</Typography>
          </Col>
        </Col>
        <Col className="h-[500px] w-[calc(100%-180px)] overflow-scroll">
          <Col span={24}>
            <Form.List name="questions">
              {(fields, { add, remove }) => (
                <>
                  {assessment.map((item, index) => (
                    <Card
                      key={index}
                      size="small"
                      className="my-5"
                      extra={
                        loading[index] ? (
                          <Spin />
                        ) : (
                          <DeleteFilled
                            style={{ color: "red" }}
                            onClick={() => handleDelete(index)}
                          />
                        )
                      }
                    >
                      <Row className="flex mb-1">
                        <Typography className="font-bold w-1/12 mt-1">
                          MCQ {index + 1}:
                        </Typography>
                        <Input
                          className="w-11/12"
                          name="question"
                          value={item.question}
                          placeholder="Enter the question"
                          onChange={(e) => handleChange(e, index)}
                        />
                      </Row>
                      <Row gutter={16}>
                  {item.options.map((ans, i) => (
                    <Col span={12} key={i + 1}>
                      <Flex gap="small" align="center" justify="center">
                        <p>
                          {i == 0 ? "A" : i == 1 ? "B" : i == 2 ? "C" : "D"}:
                        </p>
                        <Input
                          name="text"
                          value={ans.text}
                          placeholder="Enter the Answer"
                          onChange={(e) => handleChange(e, index, i)}
                          variant="filled"
                        />
                        <Switch
                          name="isCorrect"
                          value={ans.isCorrect}
                          onChange={(e) => handleSwitch(e, index, i)}
                        />
                      </Flex>
                    </Col>
                  ))}
                </Row>
                      <Row className="flex gap-3">
                        <Typography className="font-bold">
                          Type of Game :
                        </Typography>
                        <Radio.Group
                          onChange={(e) => onChange(e, index)}
                          value={item.typeOfGame}
                        >
                          <Radio value="Archery">Archery</Radio>
                          <Radio value="MCQ">MCQ</Radio>
                          <Radio value="Basketball">Basketball</Radio>
                        </Radio.Group>
                      </Row>
                    </Card>
                  ))}
                  <Button
                    type="dashed"
                    onClick={AddNewQuestion}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Question
                  </Button>
                </>
              )}
            </Form.List>
          </Col>
        </Col>
      </Row>
    </>
  );
};

export default Assessment;
