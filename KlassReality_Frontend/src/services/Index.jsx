import axios from "axios";
import requests from "./httpServices";

// ========================================== POST =============================================
export const UserLogin = async (data) => {
  return await requests.post(`auth/login`, data);
};
export const ForgotPassword = async (data) => {
  return await requests.post(`auth/forgot-password`, data);
};
export const ResetPassword = async (token, data) => {
  return await requests.post(`auth/reset-password?token=${token}`, data);
};
export const RefreshToken = async (data) => {
  return await requests.post(`/auth/refresh-tokens`, data);
};
export const CreateSession = async (data) => {
  return await requests.post(`sessions`, data);
};

export const GetDraft = async () => {
  return await requests.post(`sessions/drafts`);
};

export const PatchSession = async (id, data) => {
  return await requests.patch(`sessions/${id}`, data);
};
export const CreateContent = async (data) => {
  return await requests.post(`content`, data);
};
export const PatchContent = async (id, data) => {
  return await requests.patch(`content/${id}`, data);
};
export const PostVideo = async (data) => {
  return await requests.post(`video`, data);
};
export const PatchVideo = async (id, data) => {
  return await requests.patch(`video/${id}`, data);
};
export const PatchModel = async (id, data) => {
  return await requests.patch(`models/${id}`, data);
};
export const PostModel = async (data) => {
  return await requests.post(`models`, data);
};
export const CreateAssessments = async (data) => {
  return await requests.post(`assessments`, data);
};
export const PatchAssessments = async (id, data) => {
  return await requests.patch(`assessments/{sessionId}?sessionId=${id}`, data);
};
export const DeleteAssessments = async (id) => {
  return await requests.delete(`assessments/${id}`);
};
export const DeploySession = async (id) => {
  return await requests.patch(`sessions/deploy/${id}`);
};
export const DeleteSession = async (id) => {
  return await requests.delete(`sessions/${id}`);
};
export const DeleteDevice = async (id) => {
  return await requests.delete(`devices/${id}`);
};
export const DeleteVideo = async (id) => {
  return await requests.delete(`video/${id}`);
};
export const DeleteModel = async (id) => {
  return await requests.delete(`models/${id}`);
};
// export const GetAllExperience = async () => {
//   return await requests.get(`sessions`);
// };
export const GetAllExperience = async (data) => {
  return await requests.post(`sessions/filter`, data);
};
export const GetMyExperience = async (data) => {
  return await requests.post(`sessions/users`, data);
};
export const GetExperienceById = async (id) => {
  return await requests.get(`sessions/${id}`);
};
export const GetRoles = async () => {
  return await requests.get(`roles`);
};
export const GetDevice = async () => {
  return await requests.get(`devices`);
};
export const PatchStatus = async (id, data) => {
  return await requests.patch(`devices/${id}`, data);
};
export const PatchDevice = async (id, data) => {
  return await requests.patch(`devices/${id}`, data);
};
export const GetVideo = async (data) => {
  return await requests.get(`video`, { params: data });
};

// ssimulations
export const GetSimulation = async (data) => {
  return await requests.get(`simulations`, { params: data });
};

export const PostSimulation = async (data) => {
  return await requests.post(`simulations`, data);
};

export const DeleteSimulation = async (id) => {
  return await requests.delete(`video/${id}`);
};

// end
export const GetModel = async (data) => {
  return await requests.get(`models`, { params: data });
};

export const GetIdModel = async (data) => {
  return await requests.get(`models/${data}`);
};
export const GetTeacher = async () => {
  return await requests.get(`users?role=teacher`);
};
export const CreateTeacher = async (data) => {
  return await requests.post(`users`, data);
};
export const PatchTeacher = async (id, data) => {
  return await requests.patch(`users/${id}`, data);
};
export const PostUser = async (data) => {
  return await requests.post(`users`, data);
};
export const patchRoles = async (id, data) => {
  return await requests.patch(`/roles/${id}/permissions`, data);
};
export const DeleteTeacher = async (id) => {
  return await requests.delete(`users/${id}`);
};
export const GetSubscription = async () => {
  return await requests.get(`subscriptions`);
};

export const DeleteSubscriptions = async (id) => {
  return await requests.delete(`subscriptions/${id}`);
};
export const CreateSubscription = async (data) => {
  return await requests.post(`subscriptions`, data);
};

export const UpdateSubscription = async (id, data) => {
  return await requests.post(`subscriptions/${id}`, data);
};

export const PatchSubscription = async (id, data) => {
  return await requests.patch(`subscriptions/${id}`, data);
};

export const GetSchool = async () => {
  return await requests.get(`schools`);
};
// Grades
export const GetGrades = async (data) => {
  return await requests.get(`grades`, { params: data });
};
export const CreateGrades = async (data) => {
  return await requests.post(`grades`, data);
};
export const PatchGrades = async (id, data) => {
  return await requests.patch(`grades/${id}`, data);
};
export const DeleteGrades = async (id) => {
  return await requests.delete(`grades/${id}`);
};

// section
export const GetSections = async (data) => {
  return await requests.get(`sections`, { params: data });
};
export const CreateSections = async (data) => {
  return await requests.post(`sections`, data);
};
export const PatchSections = async (id, data) => {
  return await requests.patch(`sections/${id}`, data);
};
export const DeleteSections = async (id) => {
  return await requests.delete(`sections/${id}`);
};

// end
// section
export const GetStudents = async (data) => {
  return await requests.get(`students`, { params: data });
};
export const CreateStudents = async (data) => {
  return await requests.post(`students`, data);
};
export const ImportStudents = async (data) => {
  return await requests.post(`students/import`, data);
};
export const ExportStudents = async (data) => {
  return await requests.post(`students/export`, data);
};
export const PatchStudents = async (id, data) => {
  return await requests.patch(`students/${id}`, data);
};
export const DeleteStudents = async (id) => {
  return await requests.delete(`students/${id}`);
};
export const SearchStudents = async (data) => {
  return await requests.post(`students/search`, data);
};

// end
export const PatchSchool = async (id, data) => {
  return await requests.patch(`schools/${id}`, data);
};
export const DeleteSchool = async (id) => {
  return await requests.delete(`schools/${id}`);
};
export const CreateSchool = async (data) => {
  return await requests.post(`schools`, data);
};
export const GetIdSchool = async (id) => {
  return await requests.get(`schools/${id}`);
};
// Session Start Api
export const StartSchool = async () => {
  return await requests.post(`device_sync/start`);
};
export const SyncSchool = async () => {
  return await requests.get(`device_sync`);
};
export const StopSchool = async () => {
  return await requests.post(`device_sync/stop`);
};
export const ExperienceContected = async (data) => {
  return await requests.get(`experience_conducted`, { params: data });
};
export const PostExperienceContected = async (data) => {
  return await requests.post(`experience_conducted`, data);
};
export const PatchExperienceContected = async (id, data) => {
  return await requests.patch(`experience_conducted/${id}`, data);
};
export const LiveStatusDevice = async (data) => {
  return await requests.patch(`/device_sync/live_status`, data);
};

// dashboard data api

export const SystemAdmin = async () => {
  return await requests.get(`dashboard/systemadmin`);
};
export const TeacherDashboards = async (data) => {
  return await requests.get(
    `dashboard/teacher?gradeId=${data.gradeId}&sectionID=${data.sectionID}`
  );
};
export const GradeSectionPerfomance = async () => {
  return await requests.get(`dashboard/grade_section_performance`);
};
export const Superadmin = async (requestData) => {
  return await requests.get(
    `dashboard/super_admin?teacherId=${requestData.teacherId}`
  );
};
export const SuperadminWithoutParams = async () => {
  return await requests.get(`dashboard/super_admin`);
};
export const TeachersFilter = async () => {
  return await requests.get(`users/teacher`);
};

// Image
export const PostImage = async (data) => {
  return await requests.post(`images`, data);
};
export const PatchImage = async (id, data) => {
  return await requests.patch(`images/${id}`, data);
};
export const DeleteImage = async (id) => {
  return await requests.delete(`images/${id}`);
};
export const GetImage = async (data) => {
  return await requests.get(`images`, { params: data });
};

// section grade filter
export const GradeSectionFilter = async (id) => {
  return await requests.get(`sections/${id}/grade`);
};

export const PerformanceReport = async (id) => {
  return await requests.get(`/experience_conducted/${id}/performance-report
`);
};

// tagss

export const GetRepoImageTag = async () => {
  return await requests.get(`/images/tags`);
};

export const GetModelImageTag = async () => {
  return await requests.get(`/models/tags`);
};

export const GetVideoImageTag = async () => {
  return await requests.get(`/video/tags`);
};

export const GetTeacherImageTag = async () => {
  return await requests.get(`/images/tags-belongs-to-schools`);
};

export const GetTeacherModelTag = async () => {
  return await requests.get(`/models/tags-belongs-to-schools`);
};

export const GetTeacherVideoTag = async () => {
  return await requests.get(`/video/tags-belongs-to-schools`);
};
