import { useState } from 'react'

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

import {
  Alert,
  Box,
  Button,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'
import PasswordIcon from '@mui/icons-material/Password'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import { auth } from '@/firebase/auth'

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleChangePassword = async () => {
    if (!auth.currentUser?.email) {
      alert('No hay sesión activa.')
      return
    }

    if (!currentPassword.trim()) {
      alert('Escribe tu contraseña actual.')
      return
    }

    if (newPassword.length < 8) {
      alert('La nueva contraseña debe tener mínimo 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      alert('Las contraseñas no coinciden.')
      return
    }

    try {
      setSaving(true)

      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword,
      )

      await reauthenticateWithCredential(
        auth.currentUser,
        credential,
      )

      await updatePassword(
        auth.currentUser,
        newPassword,
      )

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      alert('Contraseña actualizada correctamente.')
    } catch (error) {
      console.error(error)
      alert('No se pudo cambiar la contraseña. Verifica tu contraseña actual.')
    } finally {
      setSaving(false)
    }
  }

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
            <SecurityIcon sx={{ color: '#090979' }} />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight="900" color="#090979">
              Cambiar contraseña
            </Typography>

            <Typography color="text.secondary">
              Actualiza tus credenciales de acceso de forma segura.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 0.8fr',
          },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #DCE5F3',
            background: '#FFFFFF',
            boxShadow: '0 12px 35px rgba(9, 9, 121, 0.06)',
          }}
        >
          <Box className="flex flex-col gap-4">
            <TextField
              label="Contraseña actual"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: '#090979' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Nueva contraseña"
              type="password"
              fullWidth
              value={newPassword}
              helperText="Mínimo 8 caracteres"
              onChange={(event) => setNewPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon sx={{ color: '#090979' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirmar nueva contraseña"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VerifiedUserIcon sx={{ color: '#090979' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={handleChangePassword}
              disabled={saving}
              sx={{
                height: 54,
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
              {saving ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: '1px solid #DCE5F3',
            background:
              'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
          }}
        >
          <Typography fontWeight="900" color="#090979" mb={2}>
            Recomendaciones de seguridad
          </Typography>

          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              mb: 2,
            }}
          >
            Usa una contraseña distinta a la anterior y evita compartirla.
          </Alert>

          <Box component="ul" sx={{ pl: 3, color: '#475569' }}>
            <li>Mínimo 8 caracteres.</li>
            <li>Combina letras, números y símbolos.</li>
            <li>No uses datos personales evidentes.</li>
            <li>Cierra sesión si usas un equipo compartido.</li>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}