import React, { useState } from "react";
import { Button, Flex, message, Table, Tooltip } from "antd";
import moment from "moment";
import PropTypes from "prop-types";
import { FileExcelFilled } from "@ant-design/icons";
import { PerformanceReport } from "../../../services/Index";
import FileSaver from "file-saver";

const ConductedTable = ({ data, loading }) => {
  const [loadingButtons, setLoadingButtons] = useState({});

  const handleReportDownload = async (id) => {
    setLoadingButtons((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await PerformanceReport(id);
      const base64Response = response;

      if (!base64Response) {
        throw new Error("No base64 string received from the server.");
      }

      const blob = base64ToBlob(
        base64Response,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      FileSaver.saveAs(blob, "students.xlsx");
      message.success("Exported successfully!");
    } catch (error) {
      message.error("Failed to export students. " + (error.message || ""));
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [id]: false }));
    }
  };

  const base64ToBlob = (base64, contentType = "", sliceSize = 512) => {
    const base64Data = base64.includes("base64,")
      ? base64.split("base64,")[1]
      : base64;

    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const dateFilters =
    data &&
    data.map((item) => ({
      text: moment(item.conductedDate).format("DD/MM/YYYY"),
      value: item.conductedDate,
    }));
  const uniqueDateFilters = Array.from(
    new Set(dateFilters && dateFilters.map(JSON.stringify))
  ).map(JSON.parse);

  const columns = [
    {
      title: "Experience Name",
      dataIndex: "experienceName",
      key: "experienceName",
      render: (text, record) => {
        if (record.sessionID && record.sessionID.name) {
          return record.sessionID.name;
        } else {
          return "N/A";
        }
      },
    },
    {
      title: "Active device count",
      dataIndex: "totalDevicesActive",
      key: "totalDevicesActive",
    },
    {
      title: "Total attendance",
      dataIndex: "totalStudentsAttended",
      key: "totalStudentsAttended",
    },
    {
      title: "Class hours conducted",
      dataIndex: "classConductedHours",
      key: "classConductedHours",
    },
    {
      title: "Feedback",
      dataIndex: "feedback",
      key: "feedback",
    },
    {
      title: "Conducted Date",
      dataIndex: "conductedDate",
      key: "conductedDate",
      render: (text) => moment(text).format("DD/MM/YYYY"),
      filters: uniqueDateFilters,
      onFilter: (value, record) => record.conductedDate === value,
    },
    // {
    //   title: "Action",
    //   key: "action",
    //   align: "center",
    //   fixed: "right",
    //   render: (text, record) => (
    //     <Flex wrap="wrap" gap="small" justify="center">
    //       <Tooltip title="Actions">
    //         <>
    //           <Button
    //             type="primary"
    //             loading={loadingButtons[record.id]}
    //             onClick={() => handleReportDownload(record.id)}
    //             danger
    //             icon={<FileExcelFilled />}
    //           />
    //         </>
    //       </Tooltip>
    //     </Flex>
    //   ),
    // },
  ];

  const expandedRowRender = (record) => {
    const childRecord = data.find((item) => item.parentID === record.parentID);

    if (!childRecord) {
      return null;
    }

    const columns = [
      {
        title: "Teacher Name",
        dataIndex: "teacherID",
        key: "teacherID",
        render: (text, record) => {
          if (record.teacherID && record.teacherID.name) {
            return record.teacherID.name;
          } else {
            return "N/A";
          }
        },
      },
      {
        title: "School Name",
        dataIndex: "schoolID.schoolName",
        key: "schoolName",
        render: (text, record) => {
          if (record.schoolID && record.schoolID.schoolName) {
            return record.schoolID.schoolName;
          } else {
            return "N/A";
          }
        },
      },
      {
        title: "Section Name",
        dataIndex: "sectionID.name",
        key: "sectionname",
        render: (text, record) => {
          if (record.sectionID && record.sectionID.name) {
            return record.sectionID.name;
          } else {
            return "N/A";
          }
        },
      },
      {
        title: "Grade Name",
        dataIndex: "gradeID",
        key: "gradeID",
        render: (text, record) => {
          if (record.gradeID && record.gradeID.name) {
            return record.gradeID.name;
          } else {
            return "N/A";
          }
        },
      },
    ];

    return <Table columns={columns} dataSource={[childRecord]} pagination={false} />;
  };

  return (
    <Table
      columns={columns}
      expandable={{
        expandedRowRender,
        defaultExpandedRowKeys: ["0"],
      }}
      loading={loading}
      pagination={false}
      dataSource={data}
      size="middle"
    />
  );
};

ConductedTable.propTypes = {
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export default ConductedTable;