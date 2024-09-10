import { DatePicker, Divider, Pagination, message } from "antd";
import { useEffect, useState } from "react";
import { ExperienceContected } from "../../../services/Index";
import ContuctedTable from "./ContuctedTable";

const Contucted = () => {
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalResults, setTotalResults] = useState(0);
  useEffect(() => {
    setLoading(true);
    ExperienceContected({
      limit: pageSize,
      page: currentPage,
    }).then((res) => {
      setTotalResults(res.totalResults);
      const data = [];
      res.results.map((res, i) => {
        data.push({
          ...res,
          key: i,
        });
      });

      setLoading(false);
      setValue(data);
    });
  }, [currentPage, pageSize]);
  const handleSizeChange = (current, size) => {
    setCurrentPage(1); // Reset to the first page when changing page size
    setPageSize(size); // Update page size
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="">
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Experience Reports
      </Divider>
      <ContuctedTable data={value} loading={loading} />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalResults}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange} // Handle size change event
        style={{ marginTop: "20px", textAlign: "center" }}
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </div>
  );
};

export default Contucted;
