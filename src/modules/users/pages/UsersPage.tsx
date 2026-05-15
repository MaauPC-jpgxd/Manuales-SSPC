import { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  MenuItem,
  TextField,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
} from '@mui/material'

import DeleteIcon from '@mui/icons-material/Delete'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import GroupIcon from '@mui/icons-material/Group'
import SecurityIcon from '@mui/icons-material/Security'

import {
  DataGrid,
  type GridColDef,
} from '@mui/x-data-grid'

import { UserRole } from '@/types/roles'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import type {
  SystemUser,
} from '../types/user.types'

import {
  createSystemUser,
  deleteUserProfile,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from '../services/users.service'

interface NewUserForm {
  name: string
  email: string
  password: string
  role: SystemUser['role']
}

const initialForm: NewUserForm = {
  name: '',
  email: '',
  password: '',
  role: UserRole.LECTOR,
}

export default function UsersPage() {
  const currentUser = useAuthStore((state) => state.user)

  const [users, setUsers] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<NewUserForm>(initialForm)

  const loadUsers = async () => {
    try {
      setLoading(true)

      const data = await getUsers()

      setUsers(data)
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar usuarios',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleCreateUser = async () => {
    if (!form.name.trim()) {
      alert('Escribe el nombre.')
      return
    }

    if (!form.email.trim()) {
      alert('Escribe el correo.')
      return
    }

    if (form.password.length < 8) {
      alert('La contraseña debe tener mínimo 8 caracteres.')
      return
    }

    try {
      setSaving(true)

      await createSystemUser(form)

      await loadUsers()

      setForm(initialForm)
      setModalOpen(false)

      alert('Usuario creado correctamente')
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo crear el usuario',
      )
    } finally {
      setSaving(false)
    }
  }

  const handleChangeRole = async (
    uid: string,
    role: SystemUser['role'],
  ) => {
    try {
      await updateUserRole(uid, role)
      await loadUsers()
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el rol',
      )
    }
  }

  const handleChangeStatus = async (
    uid: string,
    status: boolean,
  ) => {
    try {
      await updateUserStatus(uid, status)
      await loadUsers()
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo cambiar el estado',
      )
    }
  }

  const handleDeleteUser = async (
    uid: string,
  ) => {
    if (currentUser?.uid === uid) {
      alert('No puedes eliminar tu propio usuario.')
      return
    }

    const confirmed = confirm(
      '¿Eliminar este usuario del sistema? Esta acción no elimina Authentication todavía.',
    )

    if (!confirmed) return

    try {
      await deleteUserProfile(uid)
      await loadUsers()
      alert('Usuario eliminado de la colección')
    } catch (error) {
      console.error(error)
      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo eliminar el usuario',
      )
    }
  }

  const columns: GridColDef<SystemUser>[] = [
    {
      field: 'name',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 220,
      renderCell: (params) => (
        <Box className="flex items-center gap-3">
          <Avatar
            sx={{
              bgcolor: '#090979',
              width: 36,
              height: 36,
              fontWeight: 800,
            }}
          >
            {params.row.name?.charAt(0)}
          </Avatar>

          <Box>
         <Typography
  fontWeight="800"
  color="#090979"
  sx={{
    lineHeight: 1.2,
    fontSize: 15,
  }}
>
  {params.row.name}
</Typography>

<Typography
  variant="body2"
  color="text.secondary"
  sx={{
    mt: 0.3,
  }}
>
  {params.row.email}
</Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Rol',
      width: 180,
      renderCell: (params) => (
        <TextField
          select
          size="small"
          value={params.row.role}
          disabled={currentUser?.uid === params.row.uid}
          onChange={(event) =>
            handleChangeRole(
              params.row.uid,
              event.target.value as SystemUser['role'],
            )
          }
          sx={{
            minWidth: 140,
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              fontWeight: 700,
            },
          }}
        >
          <MenuItem value={UserRole.ROOT}>ROOT</MenuItem>
          <MenuItem value={UserRole.ADMIN}>ADMIN</MenuItem>
          <MenuItem value={UserRole.LECTOR}>LECTOR</MenuItem>
        </TextField>
      ),
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 150,
      renderCell: (params) => (
        <Chip
          label={params.row.status ? 'Activo' : 'Inactivo'}
          sx={{
            background: params.row.status ? '#EAF7EF' : '#F1F5F9',
            color: params.row.status ? '#157347' : '#64748B',
            fontWeight: 800,
            border: params.row.status
              ? '1px solid #A7E0BC'
              : '1px solid #CBD5E1',
          }}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 190,
      sortable: false,
      renderCell: (params) => {
        const isMe = currentUser?.uid === params.row.uid

        return (
          <Box className="flex items-center gap-2">
            <Tooltip title={isMe ? 'No puedes apagar tu propia cuenta' : 'Activar / desactivar'}>
              <span>
                <Switch
                  checked={params.row.status}
                  disabled={isMe}
                  onChange={(event) =>
                    handleChangeStatus(
                      params.row.uid,
                      event.target.checked,
                    )
                  }
                />
              </span>
            </Tooltip>

            <Tooltip title={isMe ? 'No puedes eliminarte a ti mismo' : 'Eliminar'}>
              <span>
                <IconButton
                  color="error"
                  disabled={isMe}
                  onClick={() => handleDeleteUser(params.row.uid)}
                  sx={{
                    border: '1px solid #F3C7C7',
                    borderRadius: 2,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          border: '1px solid #DCE5F3',
          background:
            'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
        }}
      >
        <Box className="flex items-center justify-between gap-4 flex-wrap">
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                background: '#EEF3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <GroupIcon sx={{ color: '#090979' }} />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="900" color="#090979">
                Gestión de usuarios
              </Typography>

              <Typography color="text.secondary">
                Administra roles, accesos y estado de usuarios.
              </Typography>
            </Box>
          </Box>

          <Box className="flex items-center gap-2 flex-wrap">
            <Chip
              icon={<SecurityIcon sx={{ fontSize: '16px !important' }} />}
              label={`${users.length} usuario${users.length === 1 ? '' : 's'}`}
              sx={{
                background: '#EEF3FF',
                color: '#090979',
                fontWeight: 800,
                border: '1px solid #DCE5F3',
              }}
            />

            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={() => {
                setForm(initialForm)
                setModalOpen(true)
              }}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 800,
                px: 3,
                background:
                  'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                boxShadow: '0 10px 25px rgba(9,9,121,0.18)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                },
              }}
            >
              Nuevo usuario
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #DCE5F3',
          overflow: 'hidden',
          background: '#FFFFFF',
          boxShadow: '0 12px 35px rgba(9, 9, 121, 0.06)',
        }}
      >
       <DataGrid
  rows={users}
  columns={columns}
  getRowId={(row) => row.uid}
  loading={loading}
  autoHeight
  rowHeight={92}
  columnHeaderHeight={70}
  disableRowSelectionOnClick
  pageSizeOptions={[5, 10, 25]}
  initialState={{
    pagination: {
      paginationModel: {
        pageSize: 5,
        page: 0,
      },
    },
  }}
  sx={{
    border: 0,

    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: '#F8FAFF',
      color: '#090979',
      fontWeight: 900,
      borderBottom: '1px solid #DCE5F3',
      minHeight: '70px !important',
    },

    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 900,
      fontSize: '15px',
    },

    '& .MuiDataGrid-row': {
      minHeight: '92px !important',
      maxHeight: '92px !important',

      '&:hover': {
        backgroundColor: '#F8FAFF',
      },
    },

    '& .MuiDataGrid-cell': {
      borderBottom: '1px solid #EEF2F7',
      display: 'flex',
      alignItems: 'center',
      fontSize: '15px',
    },

    '& .MuiDataGrid-footerContainer': {
      borderTop: '1px solid #EEF2F7',
      background: '#FFFFFF',
    },

    '& .MuiTablePagination-root': {
      color: '#090979',
      fontWeight: 700,
    },
  }}
/>
      </Paper>

      <Dialog
        open={modalOpen}
        onClose={() => {
          if (!saving) setModalOpen(false)
        }}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle
          fontWeight="900"
          color="#090979"
          sx={{
            borderBottom: '1px solid #DCE5F3',
          }}
        >
          Nuevo usuario
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} mt={3}>
            <TextField
              label="Nombre completo"
              fullWidth
              value={form.name}
              onChange={(event) =>
                setForm({
                  ...form,
                  name: event.target.value,
                })
              }
            />

            <TextField
              label="Correo electrónico"
              fullWidth
              value={form.email}
              onChange={(event) =>
                setForm({
                  ...form,
                  email: event.target.value,
                })
              }
            />

            <TextField
              label="Contraseña temporal"
              type="password"
              fullWidth
              value={form.password}
              helperText="Mínimo 8 caracteres"
              onChange={(event) =>
                setForm({
                  ...form,
                  password: event.target.value,
                })
              }
            />

            <TextField
              select
              label="Rol"
              fullWidth
              value={form.role}
              onChange={(event) =>
                setForm({
                  ...form,
                  role: event.target.value as SystemUser['role'],
                })
              }
            >
              <MenuItem value={UserRole.ADMIN}>ADMIN</MenuItem>
              <MenuItem value={UserRole.LECTOR}>LECTOR</MenuItem>
              <MenuItem value={UserRole.ROOT}>ROOT</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setModalOpen(false)}
            disabled={saving}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateUser}
            disabled={saving}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 800,
              background:
                'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
              '&:hover': {
                background:
                  'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
              },
            }}
          >
            {saving ? 'Guardando...' : 'Crear usuario'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}