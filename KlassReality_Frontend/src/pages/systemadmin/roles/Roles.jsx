// import { useState, useEffect } from "react";
// import {
//   Divider,
//   Table,
//   Checkbox,
//   Row,
//   Col,
//   message,
//   Tag,
//   Tooltip,
//   Flex,
//   Button,
// } from "antd";
// import { GetRoles, patchRoles } from "../../../services/Index";
// import { resetApplication } from "../../../redux/features/counter/applicationSlice";
// import { resetUserData } from "../../../redux/features/counter/adminSlice";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   CloseCircleOutlined,
//   DeleteOutlined,
//   EditOutlined,
// } from "@ant-design/icons";

// const Roles = () => {
//   const [roles, setRoles] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const dispatch = useDispatch();
//   const nav = useNavigate();

//   useEffect(() => {
//     GetRoles()
//       .then((res) => {
//         setRoles(
//           res.map((item) => ({
//             ...item,
//             key: item._id,
//           }))
//         );
//         setLoading(false);
//       })
//       .catch((err) => {
//         let errRes = err.response.data;
//         if (errRes.code === 401) {
//           message.error(err.response.data.message);
//           dispatch(resetApplication());
//           dispatch(resetUserData());
//           nav("/login");
//         } else {
//           message.error(err.response.data.message);
//           setLoading(false);
//         }
//       });
//   }, []);

//   const handleCheckboxChange = (roleId, permission, checked) => {
//     const updatedRoles = roles.map((role) => {
//       if (role._id === roleId) {
//         if (checked) {
//           role.permissions.push(permission);
//         } else {
//           role.permissions = role.permissions.filter((p) => p !== permission);
//         }
//       }
//       return role;
//     });
//     setRoles(updatedRoles);

//     if (checked) {
//       patchRoles(roleId, { permissions: [permission] });
//     } else {
//       patchRoles(roleId, { permissions: [] });
//     }
//   };

//   const columns = [
//     {
//       title: "Roles",
//       dataIndex: "role",
//       key: "role",
//       width: "20%",
//       render: (text) => text.charAt(0).toUpperCase() + text.slice(1), // Capitalize first letter
//     },
//     {
//       title: "Permission",
//       dataIndex: "permissions",
//       render: (_, record) => (
//         <Row gutter={[12, 12]}>
//           {record.permissions.map((permission, i) => (
//             <Col key={permission + i}>
//               <li>
//                 <Tag  color="#ba28a9" className="text-[14px] w-[200px] h-[35px] flex items-center text-center justify-between">
//                   {permission.charAt(0).toUpperCase() + permission.slice(1)}
//                 </Tag>
//               </li>
//             </Col>
//             // <Col key={permission+i} span={8}>
//             //   <Checkbox
//             //     value={permission}
//             //     disabled
//             //     onChange={(e) =>
//             //       handleCheckboxChange(record._id, permission, e.target.checked)
//             //     }
//             //   >
//             //     {permission.charAt(0).toUpperCase() + permission.slice(1)} {/* Capitalize first letter */}
//             //   </Checkbox>
//             // </Col>
//           ))}
//         </Row>
//       ),
//       key: "permission",
//       width: "80%",
//     },
//     // {
//     //   width: "10%",
//     //   title: "Action",
//     //   key: "id",
//     //   align: "center",
//     //   render: (text, record) => (
//     //     <Flex wrap="wrap" gap="small" justify="center">
//     //       <Tooltip placement="top" title="Edit">
//     //         <Button type="primary" disabled icon={<EditOutlined />} />
//     //       </Tooltip>
//     //       <Tooltip placement="top" title="Delete">
//     //       <Button type="primary" disabled icon={<DeleteOutlined />} danger />
//     //       </Tooltip>
//     //     </Flex>
//     //   ),
//     // },
//   ];

//   return (
//     <>
//       <Divider orientation="left" style={{ fontSize: "20px" }}>
//         Roles & Permissions
//       </Divider>
//       <Table
//         columns={columns}
//         loading={loading}
//         dataSource={roles}
//         style={{
//           marginTop: 24,
//         }}
//       />
//     </>
//   );
// };

// export default Roles;

import { useState, useEffect } from "react";
import { Divider, Table, Tag, Row, Col } from "antd";

const Roles = () => {
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch roles data and set it to state
  }, []);

  const columns = [
    {
      title: "Roles",
      dataIndex: "role",
      key: "role",
      width: "20%",
      render: (text) => text.charAt(0).toUpperCase() + text.slice(1), // Capitalize first letter
    },
    {
      title: "Permission",
      dataIndex: "permissions",
      render: (_, record) => (
        <Row gutter={[12, 12]}>
          {record.permissions.map((permission) => (
            <Col key={permission}>
              <li>
                <Tag
                  color="#ba28a9"
                  className="text-[13px] w-[250px] h-[35px] flex items-center text-center justify-between"
                >
                  {permission}
                </Tag>
              </li>
            </Col>
          ))}
        </Row>
      ),
      key: "permission",
      width: "80%",
    },
  ];

  // Define default permissions for each role
  const defaultPermissions = {
    "System Admin": [
      "Creation of admin/super admin account",
      "Client Licensing",
      "Monitoring Tools",
      "Client outboarding and management",
    ],
    Admin: [
      "Device Management",
      "Student Management",
      "Teacher account setup and management",
      "Monitoring Tools",
    ],
    "Super Admin (School Principal)": ["Monitoring Tools"],
    Teacher: [
      "Experience creation",
      "Experience deployment",
      "Monitoring Tools",
    ],
    Student: ["View Experience", "Assessment", "Interaction"],
    "Repository Team": ["360 Video", "3D Models", "360 Image", "Simulation"],
  };

  // Initialize roles with default permissions
  useEffect(() => {
    if (roles === null) {
      const rolesWithDefaultPermissions = Object.keys(defaultPermissions).map(
        (role) => ({
          role,
          permissions: defaultPermissions[role],
        })
      );
      setRoles(rolesWithDefaultPermissions);
      setLoading(false);
    }
  }, [roles]);

  return (
    <>
      <Divider orientation="left" style={{ fontSize: "20px" }}>
        Roles & Permissions
      </Divider>
      <Table
        columns={columns}
        loading={loading}
        dataSource={roles}
        style={{
          marginTop: 24,
        }}
      />
    </>
  );
};

export default Roles;
