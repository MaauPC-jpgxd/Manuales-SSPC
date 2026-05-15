import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import SecurityIcon from '@mui/icons-material/Security'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import {
  sendPasswordResetEmail,
} from 'firebase/auth'

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
        background:
          'linear-gradient(180deg, #F5F7FB 0%, #EAF0FA 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 480,
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
          component="img"
          src={logo}
          alt="Optimización Corporativa"
          sx={{
            width: '100%',
            maxWidth: 330,
            objectFit: 'contain',
            display: 'block',
            mx: 'auto',
            mb: 3,
          }}
        />

        <Typography
          variant="h5"
          fontWeight="900"
          color="#090979"
          textAlign="center"
        >
          Recuperar contraseña
        </Typography>

        <Typography
          color="text.secondary"
          textAlign="center"
          mt={1}
          mb={3}
        >
          Ingresa tu correo y recibirás un enlace seguro para restablecer tu contraseña.
        </Typography>

        <Divider sx={{ mb: 3 }} />

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
            El enlace será enviado por Firebase Authentication.
          </Typography>
        </Box>

        <TextField
          fullWidth
          label="Correo electrónico"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon sx={{ color: '#090979' }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          disabled={sending}
          onClick={handleResetPassword}
          sx={{
            height: 56,
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 900,
            background:
              'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
            boxShadow: '0 10px 25px rgba(9,9,121,0.18)',
            '&:hover': {
              background:
                'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
            },
          }}
        >
          {sending ? 'Enviando...' : 'Enviar enlace de recuperación'}
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
          }}
        >
          Volver al inicio de sesión
        </Button>
      </Paper>
    </Box>
  )
}