import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '@/modules/auth/pages/LoginPage'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import UsersPage from '@/modules/users/pages/UsersPage'
import UploadManualPage from '@/modules/manuals/pages/UploadManualPage'
import ApprovalsPage from '@/modules/approvals/pages/ApprovalsPage'
import ChangePasswordPage from '@/modules/auth/pages/ChangePasswordPage'

import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/usuarios',
        element: <UsersPage />,
      },
      {
        path: '/subir-manual',
        element: <UploadManualPage />,
      },
      {
        path: '/revision',
        element: <ApprovalsPage />,
      },
      {
        path: '/cambiar-password',
        element: <ChangePasswordPage />,
      },
    ],
  },
])