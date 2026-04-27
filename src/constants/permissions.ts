// src/constants/permissions.ts
// ============================================================
// QUẢN LÝ QUYỀN TẬP TRUNG
// Muốn thêm role mới hoặc thay đổi quyền → chỉ sửa file này
// ============================================================

export type UserGroup = 'admin' | 'manager' | 'recruiter' | 'vendor';

// ── CANDIDATE ────────────────────────────────────────────────────────────

export const CandidatePermissions = {
  // Xem danh sách tất cả candidates (không giới hạn theo assigned_user)
  viewAll: ['admin', 'manager'] as UserGroup[],

  // Tạo candidate mới
  create: ['admin', 'manager', 'recruiter', 'vendor'] as UserGroup[],

  // Khi tạo: có thể chỉ định assigned_user là người khác
  assignToOthers: ['admin', 'manager'] as UserGroup[],

  // Sửa thông tin cá nhân + phễu tuyển dụng
  edit: ['admin', 'manager', 'recruiter'] as UserGroup[],

  // Sửa nguồn dữ liệu (data_source_*)
  editSource: ['admin'] as UserGroup[],

  // Xóa candidate
  delete: ['admin'] as UserGroup[],
};

// ── PROJECT ──────────────────────────────────────────────────────────────

export const ProjectPermissions = {
  // Xem danh sách và chi tiết dự án
  view: ['admin', 'manager', 'recruiter', 'vendor'] as UserGroup[],

  // Thêm / sửa dự án
  edit: ['admin', 'manager'] as UserGroup[],
};

// ── DASHBOARD ────────────────────────────────────────────────────────────

export const DashboardPermissions = {
  // Xem số liệu toàn đội (không giới hạn scope)
  viewAll: ['admin', 'manager'] as UserGroup[],
};

// ── HELPER FUNCTION ──────────────────────────────────────────────────────

/**
 * Kiểm tra user có quyền không
 * @example can('recruiter', CandidatePermissions.edit) // true
 * @example can('vendor', CandidatePermissions.edit)    // false
 */
export const can = (userGroup: string | null, permission: UserGroup[]): boolean => {
  if (!userGroup) return false;
  return permission.includes(userGroup as UserGroup);
};
