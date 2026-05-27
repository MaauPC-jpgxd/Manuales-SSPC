import { motion } from 'framer-motion'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
  CircularProgress,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import { loginSchema } from '../schemas/login.schema'
import type { LoginSchema } from '../schemas/login.schema'

import { loginUser } from '../services/login.service'
import { useAuthStore } from '../store/auth.store'

import logo from '@/assets/logo/Recurso 9-100.jpg'

export default function LoginPage() {
  const navigate = useNavigate()

  const setUser = useAuthStore((state) => state.setUser)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await loginUser(data.email, data.password)

      setUser({
        uid: response.firebaseUser.uid,
        name: response.profile.name,
        email: response.profile.email,
        role: response.profile.role,
      })

      navigate('/dashboard', {
        replace: true,
      })
    } catch (error) {
      console.error(error)
      alert('Credenciales inválidas')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #F5F7FB 0%, #EAF0FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        animate={{ x: [0, 18, 0], y: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(9,9,121,0.16) 0%, rgba(9,9,121,0) 70%)',
          top: -120,
          left: -120,
        }}
      />

      <Box
        component={motion.div}
        animate={{ x: [0, -18, 0], y: [0, -14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        sx={{
          position: 'absolute',
          width: 460,
          height: 460,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(29,78,216,0.14) 0%, rgba(29,78,216,0) 70%)',
          bottom: -160,
          right: -140,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(9,9,121,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(9,9,121,0.035) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          maskImage:
            'radial-gradient(circle at center, black 0%, transparent 72%)',
        }}
      />

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        sx={{
          width: '100%',
          maxWidth: 480,
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            borderRadius: 5,
            p: { xs: 3, sm: 5 },
            border: '1px solid #DCE5F3',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
            boxShadow: '0 24px 70px rgba(9, 9, 121, 0.14)',
            backdropFilter: 'blur(18px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.15 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <Box
                component="img"
                src={logo}
                alt="Optimización Corporativa"
                sx={{
                  width: '100%',
                  maxWidth: 330,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 12px 18px rgba(9,9,121,0.12))',
                }}
              />
            </Box>

            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h5" fontWeight="900" color="#090979">
                Base de Conocimiento
              </Typography>

              <Typography color="text.secondary" mt={0.5}>
                Plataforma empresarial segura
              </Typography>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                background: '#EEF3FF',
                border: '1px solid #DCE5F3',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <SecurityIcon sx={{ color: '#090979' }} />

              <Typography variant="body2" color="#090979" fontWeight="700">
                Acceso autorizado para usuarios registrados.
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.5,
              }}
            >
              <TextField
                fullWidth
                label="Correo institucional"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#090979' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    transition: '0.25s ease',
                    '&:hover': {
                      boxShadow: '0 10px 24px rgba(9,9,121,0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 12px 28px rgba(9,9,121,0.12)',
                    },
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label="Contraseña"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#090979' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: '#FFFFFF',
                    transition: '0.25s ease',
                    '&:hover': {
                      boxShadow: '0 10px 24px rgba(9,9,121,0.08)',
                    },
                    '&.Mui-focused': {
                      boxShadow: '0 12px 28px rgba(9,9,121,0.12)',
                    },
                  },
                }}
              />

              <Button
                component={motion.button}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  height: 56,
                  borderRadius: 3,
                  fontWeight: 900,
                  textTransform: 'none',
                  fontSize: 16,
                  background:
                    'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                  boxShadow: '0 10px 25px rgba(9,9,121,0.18)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                    boxShadow: '0 16px 34px rgba(9,9,121,0.25)',
                  },
                }}
              >
                {isSubmitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <CircularProgress size={20} color="inherit" />
                    Validando acceso...
                  </Box>
                ) : (
                  'Iniciar sesión'
                )}
              </Button>

              <Button
                onClick={() => navigate('/recuperar-password')}
                sx={{
                  textTransform: 'none',
                  color: '#090979',
                  fontWeight: 800,
                  borderRadius: 3,
                  '&:hover': {
                    background: '#EEF3FF',
                  },
                }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              mt={4}
            >
              Optimización Corporativa · eficiencia redefinida
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}