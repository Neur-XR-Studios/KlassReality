import { Button, Checkbox, Form, Input, message } from "antd";
import {
  UserLogin,
  ForgotPassword,
  ResetPassword,
} from "../../../services/Index"; // Make sure to import your reset password service
import { useLocalStorage } from "../../../redux/useLocalStorage";
import { useDispatch } from "react-redux";
import {
  accessToken,
  refreshToken,
  user,
} from "../../../redux/features/counter/adminSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

const LoginForm = () => {
  const nav = useNavigate();
  const location = useLocation();

  const [, setAccessToken] = useLocalStorage("accessToken", null);
  const [, setRefreshToken] = useLocalStorage("refreshToken", null);
  const [, setUserData] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    if (token) {
      setToken(token);
      setIsResetPassword(true);
    }
  }, [location.search]);

  const onFinish = (values) => {
    setLoading(true);
    const loginValues = {
      ...values,
    };

    UserLogin(loginValues)
      .then((res) => {
        setAccessToken(res.tokens.access.token);
        dispatch(accessToken(res.tokens.access.token));

        setRefreshToken(res.tokens.refresh.token);
        dispatch(refreshToken(res.tokens.refresh.token));

        setUserData(res.user);
        dispatch(user(res.user));
        message.success("Login successful");
        if (res.user.role === "systemadmin") {
          nav("/dashboard", { replace: true });
        } else if (res.user.role === "teacher") {
          nav("/teacherDashboard", { replace: true });
        } else if (res.user.role === "repoManager") {
          nav("/model", { replace: true });
        } else if (res.user.role === "admin") {
          nav("/devicemanagement", { replace: true });
        } else if (res.user.role === "superadmin") {
          nav("/_dashboard", { replace: true });
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error("Incorrect email or password");
        console.log(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleForgotPassword = (values) => {
    setLoading(true);
    ForgotPassword({ email: values.email })
      .then((res) => {
        message.success("Password reset link sent to your email");
        setIsForgotPassword(false);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error(err.response.data.message);
      });
  };

  const handleResetPassword = (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    const data = {
      password: values.password,
    };
    ResetPassword(token, data)
      .then((res) => {
        message.success("Password reset successfully");
        setIsResetPassword(false);
        nav("/login", { replace: true });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        message.error("Failed to reset password");
      });
  };

  return (
    <div>
      {isResetPassword ? (
        <Form
          name="reset_password"
          wrapperCol={{
            span: 24,
          }}
          onFinish={handleResetPassword}
          autoComplete="off"
          className="mt-8"
        >
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters",
              },
              {
                pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}|:"<>?])(?=.*\d).+$/,
                message:
                  "Password must contain at least one uppercase letter, one symbol, and one number",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon p-3" />}
              placeholder="New password"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            rules={[
              {
                required: true,
                message: "Please confirm your new password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon p-3" />}
              placeholder="Confirm new password"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="w-full text-base font-semibold mt-5"
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      ) : isForgotPassword ? (
        <Form
          name="forgot_password"
          wrapperCol={{
            span: 24,
          }}
          onFinish={handleForgotPassword}
          autoComplete="off"
          className="mt-8"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon p-3" />}
              placeholder="user@example.com"
            />
          </Form.Item>
          <Form.Item>
            <Button
              className="w-full text-base font-semibold mt-5"
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Reset Password
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="link"
              className="text-white"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <Form
          name="basic"
          wrapperCol={{
            span: 24,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="mt-8"
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
              {
                type: "email",
                message: "Please enter a valid email address",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon p-3" />}
              placeholder="user@example.com"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              placeholder="password"
              prefix={<LockOutlined className="site-form-item-icon p-3" />}
            />
          </Form.Item>
          {/* <Form.Item>
           
          </Form.Item> */}
          <Form.Item>
            <Form.Item
              name="remember"
              valuePropName="checked"
              className="float-left"
              noStyle
            >
              {/* <Checkbox>Remember me</Checkbox> */}
            </Form.Item>

            <Button
              className="float-right text-white"
              type="link"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password?
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              className="w-full text-base font-semibold"
              size="large"
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default LoginForm;
