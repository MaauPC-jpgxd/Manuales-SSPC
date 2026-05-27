import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import LinkIcon from '@mui/icons-material/Link'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import { createVideoTutorial } from '../services/videos.service'

export default function UploadVideoPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!title.trim()) {
      alert('Escribe el título del tutorial')
      return
    }

    if (!description.trim()) {
      alert('Escribe una descripción breve')
      return
    }

    if (!youtubeUrl.trim()) {
      alert('Agrega el enlace de YouTube')
      return
    }

    try {
      setSaving(true)

      await createVideoTutorial({
        title,
        description,
        youtubeUrl,
        createdBy: user.uid,
        createdByName: user.name,
      })

      setTitle('')
      setDescription('')
      setYoutubeUrl('')

      alert('Video tutorial agregado correctamente')
      navigate('/subir', { replace: true })
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo guardar el video tutorial',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <Button
          component={motion.button}
          whileHover={{ x: -3, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            navigate('/subir', {
              replace: true,
            })
          }
          sx={{
            mb: 3,
            height: 44,
            borderRadius: 3,
            textTransform: 'none',
            borderColor: '#090979',
            color: '#090979',
            fontWeight: 900,
            background: '#FFFFFF',
            boxShadow: '0 10px 24px rgba(9,9,121,0.06)',
            '&:hover': {
              borderColor: '#090979',
              background: '#EEF3FF',
              boxShadow: '0 14px 30px rgba(9,9,121,0.11)',
            },
          }}
        >
          Regresar
        </Button>
      </motion.div>

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
                  <PlayCircleFilledIcon sx={{ fontSize: 36 }} />
                </Box>

                <Box>
                  <Chip
                    icon={<OndemandVideoIcon sx={{ fontSize: '16px !important' }} />}
                    label="Video tutorial"
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
                    Subir video tutorial
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={720}>
                    Agrega videos no listados de YouTube para consulta interna.
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<VisibilityIcon sx={{ fontSize: '16px !important' }} />}
                label="No listado"
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
                Datos del video tutorial
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Completa la información del video y pega el enlace de YouTube.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <TextField
                  label="Título del tutorial"
                  fullWidth
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
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
                  label="Descripción breve"
                  fullWidth
                  multiline
                  minRows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
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
                  label="Link no listado de YouTube"
                  fullWidth
                  value={youtubeUrl}
                  onChange={(event) => setYoutubeUrl(event.target.value)}
                  InputProps={{
                    startAdornment: (
                      <LinkIcon sx={{ mr: 1, color: '#090979' }} />
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

                {saving && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="800"
                      color="#090979"
                      mb={1}
                    >
                      Guardando video tutorial...
                    </Typography>

                    <LinearProgressBar />
                  </Box>
                )}

                <Button
                  component={motion.button}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  variant="contained"
                  disabled={saving}
                  onClick={handleSubmit}
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
                      Guardando...
                    </Box>
                  ) : (
                    'Guardar video tutorial'
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
              <Typography fontWeight="900" color="#090979" mb={0.5}>
                Requisitos del video
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Asegúrate de que el enlace sea accesible para los usuarios internos.
              </Typography>

              <Alert
                severity="warning"
                icon={<SecurityIcon />}
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  border: '1px solid #F6D98B',
                  background: '#FFF7E0',
                  color: '#7A4F01',
                  fontWeight: 700,
                }}
              >
                El video debe estar configurado como no listado en YouTube.
              </Alert>

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
                  'No uses videos públicos si son internos.',
                  'No uses videos privados, porque pueden bloquearse en el visor.',
                  'Usa videos no listados para que solo accedan quienes tengan el enlace.',
                  'El video se mostrará dentro de la plataforma.',
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

function LinearProgressBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: 9,
        borderRadius: 999,
        background: '#EEF3FF',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          width: '55%',
          height: '100%',
          borderRadius: 999,
          background: 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
        }}
      />
    </Box>
  )
}