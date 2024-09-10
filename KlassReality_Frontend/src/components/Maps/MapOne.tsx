import React, { useEffect } from 'react'; // Import React
import 'jsvectormap'; // Import jsVectorMap without destructuring
import 'jsvectormap/dist/css/jsvectormap.css'; // Import jsVectorMap CSS
import '../../js/us-aea-en'; // Import map data

const MapOne = () => {
  useEffect(() => {
    const mapOne = new window.jsVectorMap({ // Access jsVectorMap from window object
      selector: '#mapOne',
      map: 'us_aea_en',
      zoomButtons: true,

      regionStyle: {
        initial: {
          fill: '#C8D0D8',
        },
        hover: {
          fillOpacity: 1,
          fill: '#ba28a9',
        },
      },
      regionLabelStyle: {
        initial: {
          fontFamily: 'Satoshi',
          fontWeight: 'semibold',
          fill: '#fff',
        },
        hover: {
          cursor: 'pointer',
        },
      },

      labels: {
        regions: {
          render(code) {
            return code.split('-')[1];
          },
        },
      },
    });
  }, []); // Empty dependency array to run the effect only once

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7" style={{padding:"30px"}}>
      <h4 className="mb-2 text-xl font-semibold text-black dark:text-white">
        Login Locations
      </h4>
      <div id="mapOne" className="mapOne map-btn h-90"></div>
    </div>
  );
};

export default MapOne;
