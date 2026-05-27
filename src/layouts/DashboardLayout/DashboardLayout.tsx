import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { motion } from 'framer-motion'

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
import DashboardIcon from '@mui/icons-material/Dashboard'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import GroupIcon from '@mui/icons-material/Group'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import PasswordIcon from '@mui/icons-material/Password'
import VisibilityIcon from '@mui/icons-material/Visibility'

import logo from '@/assets/logo/Recurso 9-100.jpg'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import { UserRole } from '@/types/roles'

const drawerWidth = 300

interface MenuItem {
  label: string
  icon: ReactNode
  path: string
  roles: UserRole[]
  realRootOnly?: boolean
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [open, setOpen] = useState(false)

  const user = useAuthStore((state) => state.user)
  const previewRole = useAuthStore((state) => state.previewRole)
  const logout = useAuthStore((state) => state.logout)

  const effectiveRole = previewRole ?? user?.role ?? null

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const logoutByInactivity = () => {
      logout()
      navigate('/')
      alert('Sesión cerrada por inactividad.')
    }

    const resetTimer = () => {
      clearTimeout(timeoutId)

      timeoutId = setTimeout(
        logoutByInactivity,
        15 * 60 * 1000,
      )
    }

    const events = [
      'mousemove',
      'keydown',
      'click',
      'scroll',
      'touchstart',
    ]

    events.forEach((event) => {
      window.addEventListener(event, resetTimer)
    })

    resetTimer()

    return () => {
      clearTimeout(timeoutId)

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [logout, navigate])

  const menuItems = useMemo(() => {
    if (!user) return []

    const items: MenuItem[] = [
      {
        label: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
        roles: [
          UserRole.ROOT,
          UserRole.ADMIN,
          UserRole.LECTOR,
        ],
      },
      {
        label: 'Subir documentos',
        icon: <UploadFileIcon />,
        path: '/subir',
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
        label: 'Ver como',
        icon: <VisibilityIcon />,
        path: '/ver-como',
        roles: [
          UserRole.ROOT,
        ],
        realRootOnly: true,
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
    ]

    return items.filter((item) => {
      if (!effectiveRole) return false

      if (item.realRootOnly) {
        return user.role === UserRole.ROOT
      }

      return item.roles.includes(effectiveRole)
    })
  }, [user, effectiveRole])

  const handleNavigate = (path: string) => {
    navigate(path)
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F8FAFF 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          top: -80,
          right: -95,
          background:
            'radial-gradient(circle, rgba(9,9,121,0.16) 0%, rgba(9,9,121,0) 70%)',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        <Box
          component={motion.img}
          src={logo}
          alt="Optimización Corporativa"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          sx={{
            width: '100%',
            maxWidth: 220,
            objectFit: 'contain',
            display: 'block',
            mx: 'auto',
            mb: 3,
            filter: 'drop-shadow(0 10px 16px rgba(9,9,121,0.12))',
          }}
        />

        <Box
          component={motion.div}
          initial={{ opacity: 0, x: -18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          sx={{
            p: 2,
            borderRadius: 4,
            background: '#EEF3FF',
            border: '1px solid #DCE5F3',
            display: 'flex',
            alignItems: 'center',
            gap: 1.7,
            boxShadow: '0 14px 34px rgba(9,9,121,0.08)',
          }}
        >
          <Avatar
            sx={{
              width: 52,
              height: 52,
              bgcolor: '#090979',
              color: '#FFFFFF',
              fontWeight: 900,
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              fontWeight="900"
              color="#090979"
              noWrap
              sx={{ lineHeight: 1.2 }}
            >
              {user?.name}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ lineHeight: 1.3 }}
            >
              {user?.email}
            </Typography>

            <Chip
              label={effectiveRole ?? 'Sin rol'}
              size="small"
              sx={{
                mt: 1,
                height: 24,
                fontWeight: 800,
                color: '#090979',
                background: '#FFFFFF',
                border: '1px solid #DCE5F3',
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider />

      <List
        sx={{
          px: 2,
          py: 2,
          flexGrow: 1,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {menuItems.map((item, index) => {
          const active = location.pathname === item.path

          return (
            <Box
              key={item.path}
              component={motion.div}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.06,
                ease: 'easeOut',
              }}
            >
              <ListItemButton
                onClick={() => handleNavigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  minHeight: 54,
                  color: active ? '#FFFFFF' : '#090979',
                  background: active
                    ? 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)'
                    : 'transparent',
                  boxShadow: active
                    ? '0 12px 24px rgba(9,9,121,0.18)'
                    : 'none',
                  transition: 'all 0.25s ease',
                  '&:hover': {
                    background: active
                      ? 'linear-gradient(135deg, #070760 0%, #1E40AF 100%)'
                      : '#EEF3FF',
                    transform: 'translateX(5px)',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active ? '#FFFFFF' : '#090979',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 900 : 800,
                  }}
                />
              </ListItemButton>
            </Box>
          )
        })}
      </List>

      <Box
        sx={{
          p: 2,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            height: 52,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 900,
            color: '#B42318',
            background: '#FDECEC',
            border: '1px solid #F3C7C7',
            boxShadow: '0 10px 22px rgba(180,35,24,0.08)',
            '&:hover': {
              background: '#FBE1E1',
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 30px rgba(180,35,24,0.13)',
            },
          }}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #F5F7FB 0%, #EDF2FA 100%)',
      }}
    >
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid #DCE5F3',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                color: '#090979',
                background: '#EEF3FF',
                border: '1px solid #DCE5F3',
                '&:hover': {
                  background: '#E1EAFE',
                },
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
            sx={{
              display: {
                xs: 'none',
                md: 'flex',
              },
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1,
              borderRadius: 4,
              background: '#EEF3FF',
              border: '1px solid #DCE5F3',
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: '#090979',
                fontWeight: 900,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </Avatar>

            <Box>
              <Typography
                fontWeight="900"
                color="#090979"
                lineHeight={1.1}
              >
                {user?.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
              >
                {effectiveRole}
              </Typography>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: drawerWidth,
            borderRight: '1px solid #DCE5F3',
            borderTopRightRadius: {
              xs: 0,
              sm: 24,
            },
            borderBottomRightRadius: {
              xs: 0,
              sm: 24,
            },
            overflow: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          p: {
            xs: 2,
            md: 4,
          },
          maxWidth: 1500,
          mx: 'auto',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </Box>
    </Box>
  )
}