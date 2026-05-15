import { useMemo, useState } from 'react'
import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import DescriptionIcon from '@mui/icons-material/Description'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import GroupIcon from '@mui/icons-material/Group'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import PasswordIcon from '@mui/icons-material/Password'

import logo from '@/assets/logo/Recurso 9-100.jpg'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import { UserRole } from '@/types/roles'

const drawerWidth = 300

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const user = useAuthStore(
    (state) => state.user,
  )

  const logout = useAuthStore(
    (state) => state.logout,
  )

  const menuItems = useMemo(() => {
    if (!user) return []

    return [
      {
        label: 'Manuales',
        icon: <DescriptionIcon />,
        path: '/dashboard',
        roles: [
          UserRole.ROOT,
          UserRole.ADMIN,
          UserRole.LECTOR,
        ],
      },

      {
        label: 'Subir manual',
        icon: <UploadFileIcon />,
        path: '/subir-manual',
        roles: [
          UserRole.ROOT,
          UserRole.ADMIN,
        ],
      },

      {
        label: 'Revisión',
        icon: <FactCheckIcon />,
        path: '/revision',
        roles: [
          UserRole.ROOT,
        ],
      },

      {
        label: 'Usuarios',
        icon: <GroupIcon />,
        path: '/usuarios',
        roles: [
          UserRole.ROOT,
        ],
      },

      {
        label: 'Cambiar contraseña',
        icon: <PasswordIcon />,
        path: '/cambiar-password',
        roles: [
          UserRole.ROOT,
          UserRole.ADMIN,
          UserRole.LECTOR,
        ],
      },
    ].filter(
      (item) =>
        item.roles.includes(user.role),
    )
  }, [user])

  const handleNavigate = (
    path: string,
  ) => {
    navigate(path)
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #F5F7FB 0%, #EDF2FA 100%)',
      }}
    >
      {/* TOPBAR */}

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: '#FFFFFF',
          borderBottom:
            '1px solid #DCE5F3',
          color: '#090979',
        }}
      >
        <Toolbar
          sx={{
            minHeight: '88px !important',
            px: {
              xs: 2,
              md: 4,
            },
          }}
        >
          <Box
            className="
              flex
              items-center
              gap-4
            "
          >
            <IconButton
              onClick={() =>
                setOpen(true)
              }
              sx={{
                color: '#090979',
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              component="img"
              src={logo}
              alt="Optimización Corporativa"
              sx={{
                height: 58,
                objectFit: 'contain',
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box
            className="
              hidden
              md:flex
              items-center
              gap-4
            "
          >
            <Box
              sx={{
                textAlign: 'right',
              }}
            >
              <Typography
                fontWeight="800"
                fontSize={14}
                color="#090979"
              >
                {user?.name}
              </Typography>

              <Typography
                fontSize={12}
                color="#64748B"
              >
                {user?.role}
              </Typography>
            </Box>

            <Avatar
              sx={{
                bgcolor: '#090979',
                width: 42,
                height: 42,
                fontWeight: 700,
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>

            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                background:
                  'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                px: 3,
                py: 1.1,
                fontWeight: 700,
                boxShadow:
                  '0 10px 25px rgba(9,9,121,0.18)',

                '&:hover': {
                  background:
                    'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                },
              }}
            >
              Salir
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}

      <Drawer
        anchor="left"
        open={open}
        onClose={() =>
          setOpen(false)
        }
      >
        <Box
          sx={{
            width: drawerWidth,
            height: '100%',
            background:
              'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
          }}
        >
          <Box
            sx={{
              p: 3,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                width: '100%',
                maxWidth: 220,
                objectFit: 'contain',
                mb: 3,
              }}
            />

            <Divider />

            <Box
              className="
                flex
                items-center
                gap-3
              "
              sx={{
                mt: 3,
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#090979',
                  width: 52,
                  height: 52,
                  fontWeight: 800,
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>

              <Box>
                <Typography
                  fontWeight="800"
                  color="#090979"
                >
                  {user?.name}
                </Typography>

                <Chip
                  label={user?.role}
                  size="small"
                  sx={{
                    mt: 0.5,
                    background:
                      '#EEF3FF',
                    color: '#090979',
                    fontWeight: 700,
                  }}
                />
              </Box>
            </Box>
          </Box>

          <List
            sx={{
              px: 2,
              mt: 1,
            }}
          >
            {menuItems.map((item) => {
              const active =
                location.pathname ===
                item.path

              return (
                <ListItemButton
                  key={item.path}
                  onClick={() =>
                    handleNavigate(
                      item.path,
                    )
                  }
                  sx={{
                    mb: 1,
                    borderRadius: 3,
                    py: 1.4,

                    background:
                      active
                        ? 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)'
                        : 'transparent',

                    color: active
                      ? '#FFFFFF'
                      : '#090979',

                    '&:hover': {
                      background:
                        active
                          ? 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)'
                          : '#EEF3FF',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active
                        ? '#FFFFFF'
                        : '#090979',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      item.label
                    }
                    primaryTypographyProps={{
                      fontWeight: 700,
                    }}
                  />
                </ListItemButton>
              )
            })}
          </List>
        </Box>
      </Drawer>

      {/* CONTENIDO */}

     <Box
  sx={{
    p: {
      xs: 2,
      md: 4,
    },
    pb: 8,
    minHeight: 'calc(100vh - 88px)',
    overflow: 'visible',
  }}
>
  <Outlet />
</Box>
      </Box>
  )
}