import { Radio, Col, Select, Typography, Row, Form, Button, Image } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";

const Character = ({
  handleSave,
  handleClose,
  content,
  setContent,
  handleBack,
}) => {
  const [form] = Form.useForm();
  const [readingTime, setReadingTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const wordsPerMinute = 200;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (e) => {
    const { value } = e.target;
    setContent((prev) => ({
      ...prev,
      teacherCharacterGender: value,
    }));
  };

  const handleSelect = (name, value) => {
    setContent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (content.script && content.script.length > 5) {
      const words = content.script.split(/\s+/).length;
      const totalSeconds = Math.ceil((words / wordsPerMinute) * 60);

      const hours = Math.floor(totalSeconds / 3600);
      const remainingSecondsAfterHours = totalSeconds % 3600;

      const minutes = Math.floor(remainingSecondsAfterHours / 60);
      const seconds = remainingSecondsAfterHours % 60;

      setReadingTime({
        hours,
        minutes,
        seconds,
      });
    }
  }, [content.script]);

  return (
    <Form
      name="basic"
      initialValues={{
        remember: true,
        teacherCharacterGender: content.teacherCharacterGender,
        classEnvironment: content.classEnvironment,
        language: content.language,
        script: content.script,
      }}
      onFinish={handleSave}
      form={form}
      autoComplete="off"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Character Gender"
            name="teacherCharacterGender"
            rules={[
              {
                required: true,
                message: "Please select character gender!",
              },
            ]}
          >
            <Radio.Group
              onChange={handleGenderChange}
              value={content.teacherCharacterGender}
            >
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            label="Language"
            name="language"
            rules={[
              {
                required: true,
                message: "Please select a language!",
              },
            ]}
          >
            <Select
              defaultValue={content.language}
              style={{
                width: '100%',
              }}
              onChange={(value) => handleSelect("language", value)}
            >
              <Select.Option value="english">English</Select.Option>
              <Select.Option value="arabic">Arabic</Select.Option>
              <Select.Option value="spanish">Spanish</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Class Environment"
        name="classEnvironment"
        rules={[
          {
            required: true,
            message: "Please select a class environment!",
          },
        ]}
      >
        <Radio.Group
          value={content.classEnvironment}
          onChange={(e) => handleSelect("classEnvironment", e.target.value)}
          className="flex"
        >
          <Radio
            value="classEnvironment 1"
            className="flex flex-col-reverse gap-2"
          >
            <Image
              src="../../../assets/samplepicture/Stereoscopic - Side to Side.png"
              width={226}
              height={113}
            />
            <Typography className="text-center mb-0 capitalize">
            classEnvironment 1
            </Typography>
          </Radio>
          <Radio
            value="classEnvironment 2"
            className="flex flex-col-reverse gap-2"
          >
            <Image
              src="../../../assets/samplepicture/Stereoscopic - Top to Bottom.png"
              width={226}
              height={113}
            />
            <Typography className="text-center mb-0 capitalize">
            classEnvironment 2
            </Typography>
          </Radio>
          <Radio
            value="classEnvironment 3"
            className="flex flex-col-reverse gap-2"
          >
            <Image
              src="../../../assets/samplepicture/Monoscopic.png"
              width={226}
              height={113}
            />
            <Typography className="text-center mb-0 capitalize">
            classEnvironment 3
            </Typography>
          </Radio>
        </Radio.Group>
      </Form.Item>

      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            label="Script"
            name="script"
            rules={[
              {
                required: true,
                message: "Please enter your character script!",
              },
              {
                min: 5,
                message: "Character script must be at least 5 characters!",
              },
            ]}
          >
            <TextArea
              name="script"
              value={content.script}
              onChange={handleChange}
              placeholder="Please enter your character script"
              autoSize={{
                minRows: 12,
                maxRows: 12,
              }}
            />
          </Form.Item>
          <Typography className="text-right">
            Reading Time: {readingTime.minutes} minute(s)
          </Typography>
        </Col>
      </Row>

      <Col span={24}>
        <div className="mt-5 flex justify-end">
          <Button type="default" className="mr-5" onClick={handleClose}>
            Close
          </Button>
          <Button
            type="primary"
            className="mr-5"
            onClick={() => handleBack("1")}
          >
            Back
          </Button>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save & Next
            </Button>
          </Form.Item>
        </div>
      </Col>
    </Form>
  );
};

export default Character;
