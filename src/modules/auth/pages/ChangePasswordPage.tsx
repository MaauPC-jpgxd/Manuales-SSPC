import { useState } from 'react'
import { motion } from 'framer-motion'

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import LockIcon from '@mui/icons-material/Lock'
import SecurityIcon from '@mui/icons-material/Security'
import PasswordIcon from '@mui/icons-material/Password'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ShieldIcon from '@mui/icons-material/Shield'
import KeyIcon from '@mui/icons-material/Key'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

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
    <Box sx={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            border: '1px solid #DCE5F3',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
            boxShadow: '0 22px 55px rgba(9, 9, 121, 0.09)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component={motion.div}
            animate={{ rotate: 360 }}
            transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
            sx={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              right: -70,
              top: -80,
              background:
                'conic-gradient(from 180deg, rgba(9,9,121,0.16), rgba(29,78,216,0.05), rgba(9,9,121,0.16))',
              filter: 'blur(2px)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: { xs: 'flex-start', sm: 'center' },
                justifyContent: 'space-between',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component={motion.div}
                  whileHover={{
                    rotate: [-2, 3, -3, 2],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 0.65,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                    background: '#EEF3FF',
                    color: '#090979',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 34 }} />
                </Box>

                <Box>
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: '16px !important' }} />}
                    label="Seguridad de cuenta"
                    size="small"
                    sx={{
                      mb: 1,
                      fontWeight: 800,
                      color: '#090979',
                      background: '#EEF3FF',
                      border: '1px solid #DCE5F3',
                    }}
                  />

                  <Typography variant="h4" fontWeight="900" color="#090979">
                    Cambiar contraseña
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={720}>
                    Actualiza tus credenciales de acceso de forma segura.
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<KeyIcon sx={{ fontSize: '16px !important' }} />}
                label="Reautenticación requerida"
                sx={{
                  background: '#EEF3FF',
                  color: '#090979',
                  fontWeight: 900,
                  border: '1px solid #DCE5F3',
                  height: 36,
                }}
              />
            </Box>
          </Box>
        </Paper>
      </motion.div>

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
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, delay: 0.12, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: '1px solid #DCE5F3',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
              boxShadow: '0 18px 45px rgba(9, 9, 121, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              whileHover={{
                opacity: [0, 0.45, 0],
                scale: [0.94, 1.1, 1.24],
              }}
              transition={{
                duration: 1.15,
                repeat: Infinity,
                ease: 'easeOut',
              }}
              sx={{
                position: 'absolute',
                inset: 10,
                borderRadius: 5,
                border: '2px solid #090979',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography fontWeight="900" color="#090979" mb={0.5}>
                Validación de contraseña
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Confirma tu contraseña actual y establece una nueva clave de acceso.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
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
                  label="Confirmar nueva contraseña"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleChangePassword()
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <VerifiedUserIcon sx={{ color: '#090979' }} />
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
                  variant="contained"
                  onClick={handleChangePassword}
                  disabled={saving}
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
                      boxShadow: '0 16px 34px rgba(9,9,121,0.25)',
                    },
                  }}
                >
                  {saving ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                      <CircularProgress size={20} color="inherit" />
                      Actualizando...
                    </Box>
                  ) : (
                    'Actualizar contraseña'
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, delay: 0.22, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 3.5 },
              borderRadius: 5,
              border: '1px solid #DCE5F3',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
              boxShadow: '0 18px 45px rgba(9, 9, 121, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                right: -55,
                bottom: -55,
                background: '#EEF3FF',
                opacity: 0.85,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component={motion.div}
                  whileHover={{
                    rotate: [-2, 3, -3, 2],
                    scale: [1, 1.08, 1],
                  }}
                  transition={{
                    duration: 0.65,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 3,
                    background: '#EEF3FF',
                    color: '#090979',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CheckCircleIcon />
                </Box>

                <Box>
                  <Typography fontWeight="900" color="#090979">
                    Recomendaciones de seguridad
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Buenas prácticas para proteger tu cuenta.
                  </Typography>
                </Box>
              </Box>

              <Alert
                severity="info"
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  border: '1px solid #DCE5F3',
                  background: '#EEF3FF',
                  color: '#090979',
                  fontWeight: 700,
                }}
              >
                Usa una contraseña distinta a la anterior y evita compartirla.
              </Alert>

              <Divider sx={{ my: 2 }} />

              <Box
                component="ul"
                sx={{
                  pl: 0,
                  m: 0,
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  color: '#475569',
                }}
              >
                {[
                  'Mínimo 8 caracteres.',
                  'Combina letras, números y símbolos.',
                  'No uses datos personales evidentes.',
                  'Cierra sesión si usas un equipo compartido.',
                ].map((item) => (
                  <Box
                    key={item}
                    component="li"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.2,
                      p: 1.2,
                      borderRadius: 3,
                      background: '#FFFFFF',
                      border: '1px solid #EEF2F7',
                    }}
                  >
                    <CheckCircleIcon sx={{ color: '#157347', fontSize: 20 }} />
                    <Typography variant="body2" fontWeight={700}>
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Box>
  )
} 