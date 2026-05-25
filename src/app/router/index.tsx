import { createBrowserRouter } from 'react-router-dom'

import LoginPage from '@/modules/auth/pages/LoginPage'
import DashboardPage from '@/modules/dashboard/pages/DashboardPage'
import UsersPage from '@/modules/users/pages/UsersPage'
import UploadManualPage from '@/modules/manuals/pages/UploadManualPage'
import ApprovalsPage from '@/modules/approvals/pages/ApprovalsPage'
import ChangePasswordPage from '@/modules/auth/pages/ChangePasswordPage'
import ForgotPasswordPage from '@/modules/auth/pages/ForgotPasswordPage'
import DashboardLayout from '@/layouts/DashboardLayout/DashboardLayout'
import ProtectedRoute from '@/components/ProtectedRoute'
import ManualsPage from '@/modules/manuals/pages/ManualsPage'
import InventoryPage from '@/modules/manuals/pages/InventoryPage'
import TicketsPage from '@/modules/manuals/pages/TicketsPage'
import VideosPage from '@/modules/videos/pages/VideosPage'
import RejectedDocumentsPage from '@/modules/manuals/pages/RejectedDocumentsPage'
import UploadHubPage from '@/modules/uploads/pages/UploadHubPage'
import UploadInventoryPage from '@/modules/manuals/pages/UploadInventoryPage'
import UploadTicketsPage from '@/modules/manuals/pages/UploadTicketsPage'
import UploadVideoPage from '@/modules/videos/pages/UploadVideoPage'
import RolePreviewPage from '@/modules/dev/pages/RolePreviewPage'
import UploadFormatPage from '@/modules/manuals/pages/UploadFormatPage'
import FormatPage from '@/modules/manuals/pages/FormatPage'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LoginPage />,
  },
  {
  path: '/recuperar-password',
  element: <ForgotPasswordPage />,
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
      {
      path: '/manuales',
      element: <ManualsPage />,
        },
        {
      path: '/inventario',
      element: <InventoryPage />,
    },
    {
      path: '/tickets',
      element: <TicketsPage />,
    },
    {
      path: '/videos',
      element: <VideosPage />,
    },
    {
        path: '/rechazados',
        element: <RejectedDocumentsPage />,
      },
      {
      path: '/subir',
      element: <UploadHubPage />,
    },
    {
      path: '/subir/inventario',
      element: <UploadInventoryPage />,
    },
    {
      path: '/subir/tickets',
      element: <UploadTicketsPage />,
    },
    {
      path: '/subir/videos',
      element: <UploadVideoPage />,
    },
    {
    path: '/ver-como',
    element: <RolePreviewPage />,
  },
  {
      path: '/subir/formato',
      element: <UploadFormatPage />,
    },
    {
  path: '/formato',
  element: <FormatPage />,
},
{
  path: '/subir/formato',
  element: <UploadFormatPage />,
},
    ],
  },
])