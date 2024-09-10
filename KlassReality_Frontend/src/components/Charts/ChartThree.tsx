import { Radio } from 'antd';
import { ApexOptions } from 'apexcharts';
import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

interface ChartThreeState {
  series: number[];
}

const options: ApexOptions = {
  chart: {
    fontFamily: 'Satoshi, sans-serif',
    type: 'donut',
  },
  colors: ['#701a75', '#a21caf', '#d946ef', '#f0abfc'],
  labels: ['School', 'Super Admin', 'Admin', 'Teachers'],
  legend: {
    show: false,
    position: 'bottom',
  },

  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  responsive: [
    {
      breakpoint: 2600,
      options: {
        chart: {
          width: 380,
        },
      },
    },
    {
      breakpoint: 640,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const ChartThree: React.FC = () => {
  const [state, setState] = useState<ChartThreeState>({
    series: [65, 34, 12, 56],
  });

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      series: [65, 34, 12, 56],
    }));
  };
  handleReset;
  const [size, setSize] = useState('small');
  const onChange = (e) => {
    setSize(e.target.value);
  };
  return (
    <div className="sm:px-7.5 col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-5"style={{padding:"30px"}}>
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="text-xl font-semibold text-black dark:text-white">
            Visitors Analytics
          </h5>
        </div>
        <div>
          <div className="relative z-20 inline-block" style={{margin:"33.4px"}}>
          <Radio.Group
        value={size}
        onChange={onChange}
        style={{
          marginBottom: 16,
        }}
      >
        <Radio.Button value="small">Monthly</Radio.Button>
        <Radio.Button value="middle">Yearly</Radio.Button>
      </Radio.Group>
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart
            options={options}
            series={state.series}
            type="donut"
          />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-fuchsia-900"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> School </span>
              <span> 65% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-fuchsia-700"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> SuperAdmin </span>
              <span> 34% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-fuchsia-500"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Admin </span>
              <span> 12% </span>
            </p>
          </div>
        </div>
        <div className="sm:w-1/2 w-full px-8">
          <div className="flex w-full items-center">
            <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-fuchsia-300"></span>
            <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
              <span> Teachers </span>
              <span> 56% </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
