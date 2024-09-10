import './Login.css'
import LoginForm from "./LoginForm";
import Eclipse from "../../../assets/Ellipse-4.svg";
import Eclipse1 from "../../../assets/Ellipse-5.svg";
import Eclipse2 from "../../../assets/Ellipse-3.svg";
import Eclipse3 from "../../../assets/Ellipse-2.svg";
import Cloud1 from "../../../assets/cloud-1.svg";
import Cloud2 from "../../../assets/cloud-2.svg";
import Cloud3 from "../../../assets/cloud-3.svg";
import Cloud4 from "../../../assets/cloud-4.svg";
import Cloud5 from "../../../assets/cloud-5.svg";
import { Content } from "antd/es/layout/layout";
import { Layout } from "antd";
const Login = () => {
  return (
    <Layout>
      <Content
        className="bg-white relative login-bg"
        style={{ padding: "0 50px" }}
      >
        {/* <div className="cloud1 lg:block md:hidden sm:hidden">
          <img src={Cloud3} alt="" />
        </div>
        <div className="cloud2 lg:block md:hidden sm:hidden">
          <img src={Cloud5} alt="" />
        </div>
        <div className="cloud3 lg:block md:hidden sm:hidden">
          <img src={Cloud2} alt="" />
        </div>
        <div className="cloud4 lg:block md:hidden sm:hidden">
          <img src={Cloud4} alt="" />
        </div>
        <div className="cloud5 lg:block md:hidden sm:hidden">
          <img src={Cloud1} alt="" />
        </div> */}
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
          <div className="w-full relative overflow-hidden p-6 m-auto bg-white rounded shadow bg-opacity-25 backdrop-filter backdrop-blur-lg lg:max-w-2xl">
            {/* <div className="Eclips">
              <img src={Eclipse} alt="" />
            </div>
            <div className="Eclips1">
              <img src={Eclipse1} alt="" />
            </div>
            <div className="Eclips2">
              <img src={Eclipse2} alt="" />
            </div>
            <div className="Eclips3">
              <img src={Eclipse3} alt="" />
            </div> */}
            <div className="text-center mt-3 relative">
              <p className="text-2xl text-slate-50 font-semibold tracking-wide m-0">
                Klass Reality
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Login;
