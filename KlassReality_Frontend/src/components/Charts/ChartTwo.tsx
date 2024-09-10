// ChartTwo component
import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartTwo = ({ data }) => {
  const options: ApexOptions = {
    xaxis: {
      categories: ['Teachers', 'Admins', 'SuperAdmins', 'RepoTeam']
    },colors: ['#ba28a9']
  };

  const seriesData = [
    { name: 'Total', data: [data.totalNoOfTeacher, data.totalNoOfAdmin, data.totalNoOfSuperAdmin, data.totalNoOfRepoTeam] }
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div>
        <div id="chartTwo">
          <ReactApexChart
            options={options}
            series={seriesData}
            type="area"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartTwo;
