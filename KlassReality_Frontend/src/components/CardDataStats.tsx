import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-xl border border-stroke bg-white p-6 py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark flex" style={{justifyContent:"space-evenly"}}>
      <div className="flex h-11.5 w-11.5 items-center rounded-full bg-meta-2 dark:bg-meta-4 flex  gap-8">
        {children}
      </div>

      <div className="m-4 flex items-end justify-between">
        <div>
          <h4 className="text-title-md font-bold text-black dark:text-white" style={{fontSize:"24px",margin:"0px"}}>
            {total}
          </h4>
          <span className="text-sm font-medium" style={{fontSize:"14px"}}>{title}</span>
        </div>

       

          {levelUp && (
            <span
            className={`flex items-center gap-1 text-sm font-medium`}
            style={{ color: '#10b981' }}
          >
            {rate}
            <ArrowUpOutlined style={{ color: '#10b981' }}/>
            </span>
          )}
          {levelDown && (
             <span
             className={`flex items-center gap-1 text-sm font-medium`}
             style={{ color: '#0ea5e9' }}
           >
            {rate}
             <ArrowDownOutlined style={{color:"#0ea5e9"}} />
             </span>
          )}
      </div>
    </div>
  );
};

export default CardDataStats;
