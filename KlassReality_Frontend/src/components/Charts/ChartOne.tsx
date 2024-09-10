// ChartOne component
import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartOne = ({ data }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar'
    },
    xaxis: {
      categories: data.labels,
      title: {
        text: 'School'
      }
    },
    yaxis: {
      title: {
        text: 'Performance'
      }
    },
    colors: ['#ba28a9']
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div>
        <div id="chartOne">
          <ReactApexChart
            options={options}
            series={[{ name: 'Performance', data: data.data }]}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
