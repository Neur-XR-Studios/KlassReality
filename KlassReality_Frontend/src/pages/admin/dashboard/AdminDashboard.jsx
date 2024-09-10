import {
  CrownFilled,
  CrownTwoTone,
  DatabaseFilled,
  DatabaseTwoTone,
  HomeOutlined,
  HomeTwoTone,
  SlidersFilled,
  SlidersTwoTone,
} from "@ant-design/icons";
import CardDataStats from "../../../components/CardDataStats";
import ChartOne from "../../../components/Charts/ChartOne";
import ChartThree from "../../../components/Charts/ChartThree";
import ChartTwo from "../../../components/Charts/ChartTwo";
import ChatCard from "../../../components/Chat/ChatCard";
import MapOne from "../../../components/Maps/MapOne";
import TableOne from "../../../components/Tables/TableOne";
import { Divider } from "antd";

const AdminDashboard = () => {
  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Dashboard
      </Divider>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:/grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Schools"
          total="3.456K"
          rate="0.43%"
          levelUp
        >
          <HomeOutlined style={{ fontSize: "50px", color: "#ba28a9" }} />
        </CardDataStats>
        <CardDataStats
          title="Total SuperAdmins"
          total="45,2K"
          rate="4.35%"
          levelUp
        >
          <CrownFilled style={{ fontSize: "50px", color: "#ba28a9" }} />
        </CardDataStats>
        <CardDataStats title="Total Admin" total="2.450" rate="2.59%" levelUp>
          <DatabaseFilled style={{ fontSize: "50px", color: "#ba28a9" }} />
        </CardDataStats>
        <CardDataStats
          title="Total Teachers"
          total="3.456"
          rate="0.95%"
          levelDown
        >
          <SlidersFilled style={{ fontSize: "50px", color: "#ba28a9" }} />
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <ChartThree />
        <MapOne />
        {/* <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div> */}
      </div>
    </>
  );
};
export default AdminDashboard;
