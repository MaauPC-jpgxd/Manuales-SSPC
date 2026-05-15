import { motion } from 'framer-motion'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Divider,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'

import { useForm } from 'react-hook-form'

import {
  zodResolver,
} from '@hookform/resolvers/zod'

import {
  loginSchema,
} from '../schemas/login.schema'

import type {
  LoginSchema,
} from '../schemas/login.schema'

import {
  loginUser,
} from '../services/login.service'

import { useNavigate } from 'react-router-dom'

import {
  useAuthStore,
} from '../store/auth.store'

import logo from '@/assets/logo/Recurso 9-100.jpg'

export default function LoginPage() {
  const navigate = useNavigate()

  const setUser = useAuthStore(
    (state) => state.setUser,
  )

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (
    data: LoginSchema,
  ) => {
    try {
      const response = await loginUser(
        data.email,
        data.password,
      )

      setUser({
        uid: response.firebaseUser.uid,
        name: response.profile.name,
        email: response.profile.email,
        role: response.profile.role,
      })

      navigate('/dashboard')
    } catch (error) {
      console.error(error)

      alert('Credenciales inválidas')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'linear-gradient(180deg, #F5F7FB 0%, #EAF0FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
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

      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.55,
        }}
        style={{
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
            p: {
              xs: 3,
              sm: 5,
            },
            border: '1px solid #DCE5F3',
            background:
              'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
            boxShadow:
              '0 24px 70px rgba(9, 9, 121, 0.14)',
          }}
        >
          <Box
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
              }}
            />
          </Box>

          <Box
            sx={{
              textAlign: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="900"
              color="#090979"
            >
              Base de Conocimiento
            </Typography>

            <Typography
              color="text.secondary"
              mt={0.5}
            >
              Plataforma empresarial segura
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Box
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

            <Typography
              variant="body2"
              color="#090979"
              fontWeight="700"
            >
              Acceso autorizado para usuarios registrados.
            </Typography>
          </Box>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
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
            />

            <Button
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
                boxShadow:
                  '0 10px 25px rgba(9,9,121,0.18)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                },
              }}
            >
              {isSubmitting ? 'Validando acceso...' : 'Iniciar sesión'}
            </Button>
          </form>

          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            textAlign="center"
            mt={4}
          >
            Optimización Corporativa · eficiencia redefinida
          </Typography>
        </Paper>
      </motion.div>
    </Box>
  )
}