import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'

import { sendPasswordResetEmail } from 'firebase/auth'

import { auth } from '@/firebase/auth'

import logo from '@/assets/logo/Recurso 9-100.jpg'

export default function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)

  const handleResetPassword = async () => {
    if (!email.trim()) {
      alert('Escribe tu correo electrónico.')
      return
    }

    try {
      setSending(true)

      await sendPasswordResetEmail(
        auth,
        email.trim().toLowerCase(),
      )

      alert('Te enviamos un correo para recuperar tu contraseña.')
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('No se pudo enviar el correo de recuperación.')
    } finally {
      setSending(false)
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
          }}
        >
          <Box
            component={motion.img}
            src={logo}
            alt="Optimización Corporativa"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            sx={{
              width: '100%',
              maxWidth: 330,
              objectFit: 'contain',
              display: 'block',
              mx: 'auto',
              mb: 3,
              filter: 'drop-shadow(0 12px 18px rgba(9,9,121,0.12))',
            }}
          />

          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
            >
              <Typography variant="h5" fontWeight="900" color="#090979">
                Recuperar contraseña
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Ingresa tu correo y recibirás un enlace seguro para restablecer tu contraseña.
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
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
              El enlace será enviado por Firebase Authentication.
            </Typography>
          </Box>

          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            <TextField
              fullWidth
              label="Correo electrónico"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleResetPassword()
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#090979' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
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
              fullWidth
              variant="contained"
              disabled={sending}
              onClick={handleResetPassword}
              sx={{
                height: 56,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 900,
                background: 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                boxShadow: '0 10px 25px rgba(9,9,121,0.18)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                  boxShadow: '0 16px 34px rgba(9,9,121,0.25)',
                },
              }}
            >
              {sending ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                  <CircularProgress size={20} color="inherit" />
                  Enviando enlace...
                </Box>
              ) : (
                <>
                  <MarkEmailReadIcon sx={{ mr: 1 }} />
                  Enviar enlace de recuperación
                </>
              )}
            </Button>

            <Button
              fullWidth
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/')}
              sx={{
                mt: 2,
                textTransform: 'none',
                color: '#090979',
                fontWeight: 800,
                borderRadius: 3,
                '&:hover': {
                  background: '#EEF3FF',
                },
              }}
            >
              Volver al inicio de sesión
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}