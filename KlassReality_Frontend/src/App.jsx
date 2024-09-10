import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect, Fragment } from "react";
import "./App.css";
import Login from "./pages/auth/login/Login";
import { ProtectedRoutes } from "./services/ProtectedRouter";
import AdminLayout from "./pages/auth/layout/AdminLayout";
import Dashboard from "./pages/systemadmin/dashboard/Dashboard";
import Client from "./pages/systemadmin/client/Client";
import Subscription from "./pages/systemadmin/subscription/Subsciption";
import Roles from "./pages/systemadmin/roles/Roles";
import ViewClient from "./pages/systemadmin/client/ViewClient";
import Repository from "./pages/repo/Repository";
import Video from "./pages/repo/360video/Video";
import VideoView from "./pages/repo/view/VideoView";
import RepoView from "./pages/repo/view/RepoView";
import AllExperience from "./pages/teacher/allexperience/Experience";
import MyExperience from "./pages/teacher/myexperience/MyExperience";
import AddMyExperience from "./pages/teacher/myexperience/AddMyExperience";
import EditMyExperience from "./pages/teacher/myexperience/EditMyExperience";
import ViewFrameModel from "./pages/teacher/ViewFrameModel";
import ViewMyExperience from "./pages/teacher/myexperience/ViewMyExperience";
import ViewExperience from "./pages/teacher/allexperience/view/ViewExperience";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import DeviceManagement from "./pages/admin/Management/Device/DeviceManage";
import TeacherManagement from "./pages/admin/Management/Teacher/TeacherManage";
import StudentManagement from "./pages/admin/Management/Student/StudentManage";
import DeviceConnect from "./pages/teacher/DeviceConnect";
import Contucted from "./pages/teacher/ExperienceContucted/Contucted";
import TeacherDashboard from "./pages/teacher/Dashboard/TeacherDashboard";
import SuperadminDashboard from "./pages/superadmin/SuperadminDashboard";
import Simulation from "./pages/repo/simulation/Simulation";
import Image360 from "./pages/repo/Image/Image";
import SimulationView from "./pages/repo/simulation/SimulationView";
import ImageView from "./pages/repo/view/ImageView";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index path="/myexperience" element={<MyExperience />} />
          <Route
            index
            path="/editexperience/:id"
            element={<EditMyExperience />}
          />
          <Route index path="/experience" element={<AllExperience />} />
          <Route index path="/admindashboard" element={<AdminDashboard />} />
          <Route index path="/model" element={<Repository />} />
          <Route index path="/video" element={<Video />} />
          <Route index path="/image" element={<Image360 />} />
          <Route index path="/simulation" element={<Simulation />} />
          <Route index path="/deviceconnect" element={<DeviceConnect />} />
          <Route index path="/video-view" element={<VideoView />} />
          <Route index path="/image-view" element={<ImageView />} />
          <Route index path="/model-view" element={<RepoView />} />
          <Route index path="/simulation-view" element={<SimulationView />} />
          <Route index path="/viewexperience/:id" element={<ViewExperience />} />
          <Route index path="/experienceList" element={<Contucted />} />
          <Route index path="/viewmyexperience/:id" element={<ViewMyExperience />} />
          <Route index path="/dashboard" element={<Dashboard />} />
          <Route index path="/teacherDashboard" element={<TeacherDashboard />} />
          <Route index path="/_dashboard" element={<SuperadminDashboard />} />
          <Route index path="/client" element={<Client />} />
          <Route index path="/subscription" element={<Subscription />} />
          <Route index path="/client/:id" element={<ViewClient />} />
          <Route index path="/roles" element={<Roles />} />
          <Route index path="/unity" element={<ViewFrameModel />} />
          <Route index path="/AddExperience" element={<AddMyExperience />} />
          <Route index path="/devicemanagement" element={<DeviceManagement/>} />
          <Route index path="/teachermanagement" element={<TeacherManagement />} />
          <Route index path="/studentmanagement" element={<StudentManagement />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
