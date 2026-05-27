import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ArticleIcon from '@mui/icons-material/Article'
import DescriptionIcon from '@mui/icons-material/Description'
import SecurityIcon from '@mui/icons-material/Security'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CloudDoneIcon from '@mui/icons-material/CloudDone'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import { uploadDocxToCloudinary } from '@/services/cloudinary.service'

import { createManualForReview } from '../services/manuals.service'

export default function UploadFormatPage() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)

  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const handleSubmit = async () => {
    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!file) {
      alert('Selecciona el formato autorizado')
      return
    }

    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      alert('Solo se permiten archivos DOCX')
      return
    }

    try {
      setSaving(true)

      const cloudinaryResponse = await uploadDocxToCloudinary(file)

      await createManualForReview({
        title: 'Formato actualizado',
        priority: 'MEDIA',
        category: 'FORMATO',
        startDate: today,
        endDate: today,
        fileUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        uploadedBy: user.uid,
        uploadedByName: user.name,
      })

      setFile(null)

      alert('Formato actualizado correctamente')

      navigate('/subir', {
        replace: true,
      })
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo subir el formato',
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
            borderColor: '#157347',
            color: '#157347',
            fontWeight: 900,
            background: '#FFFFFF',
            boxShadow: '0 10px 24px rgba(21,115,71,0.06)',
            '&:hover': {
              borderColor: '#157347',
              background: '#EAF7EF',
              boxShadow: '0 14px 30px rgba(21,115,71,0.11)',
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
            border: '1px solid #A7E0BC',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)',
            boxShadow: '0 22px 55px rgba(21, 115, 71, 0.09)',
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
                'conic-gradient(from 180deg, rgba(21,115,71,0.16), rgba(34,197,94,0.05), rgba(21,115,71,0.16))',
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
                    background: '#EAF7EF',
                    color: '#157347',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                  }}
                >
                  <ArticleIcon sx={{ fontSize: 34 }} />
                </Box>

                <Box>
                  <Chip
                    icon={<SecurityIcon sx={{ fontSize: '16px !important' }} />}
                    label="Solo ROOT"
                    size="small"
                    sx={{
                      mb: 1,
                      fontWeight: 900,
                      color: '#157347',
                      background: '#EAF7EF',
                      border: '1px solid #A7E0BC',
                    }}
                  />

                  <Typography variant="h4" fontWeight="900" color="#157347">
                    Subir formato autorizado
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={720}>
                    Actualiza el formato oficial corporativo en DOCX.
                  </Typography>
                </Box>
              </Box>

              <Chip
                icon={<CloudDoneIcon sx={{ fontSize: '16px !important' }} />}
                label="Publicación directa"
                sx={{
                  background: '#EAF7EF',
                  color: '#157347',
                  fontWeight: 900,
                  border: '1px solid #A7E0BC',
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
                border: '2px solid #157347',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography fontWeight="900" color="#090979" mb={0.5}>
                Datos automáticos del formato
              </Typography>

              <Typography color="text.secondary" mb={3}>
                El sistema asigna el título y la fecha de publicación automáticamente.
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  mb: 2.5,
                  borderRadius: 4,
                  border: '1px solid #DCE5F3',
                  background: '#F8FAFF',
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: '1fr 1fr',
                    },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography fontWeight="900" color="#090979">
                      Título automático
                    </Typography>

                    <Typography color="text.secondary">
                      Formato actualizado
                    </Typography>
                  </Box>

                  <Box>
                    <Typography fontWeight="900" color="#090979">
                      Fecha de publicación
                    </Typography>

                    <Chip
                      icon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
                      label={today}
                      size="small"
                      sx={{
                        mt: 0.7,
                        background: '#EAF7EF',
                        color: '#157347',
                        fontWeight: 900,
                        border: '1px solid #A7E0BC',
                      }}
                    />
                  </Box>
                </Box>
              </Paper>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    height: 68,
                    borderRadius: 3,
                    textTransform: 'none',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: file ? '#157347' : '#CBD5E1',
                    color: file ? '#157347' : '#090979',
                    fontWeight: 900,
                    justifyContent: 'flex-start',
                    px: 3,
                    background: file ? '#EAF7EF' : '#FFFFFF',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#157347',
                      background: '#F1FFF6',
                      boxShadow: '0 12px 28px rgba(21,115,71,0.1)',
                    },
                  }}
                >
                  {file ? file.name : 'Seleccionar formato DOCX'}

                  <input
                    hidden
                    type="file"
                    accept="
                      .docx,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document
                    "
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null

                      setFile(selectedFile)
                    }}
                  />
                </Button>

                {file && (
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 4,
                        border: '1px solid #DCE5F3',
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                        boxShadow: '0 12px 28px rgba(9,9,121,0.08)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                          component={motion.div}
                          animate={{ scale: [1, 1.06, 1] }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          sx={{
                            width: 54,
                            height: 54,
                            borderRadius: 3,
                            background: '#EEF3FF',
                            color: '#2563EB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <DescriptionIcon sx={{ fontSize: 30 }} />
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight="900" color="#090979" noWrap>
                            {file.name}
                          </Typography>

                          <Typography variant="body2" color="text.secondary">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                )}

                {saving && (
                  <Box>
                    <Typography
                      variant="body2"
                      fontWeight="800"
                      color="#157347"
                      mb={1}
                    >
                      Subiendo formato autorizado...
                    </Typography>

                    <LinearProgress
                      sx={{
                        borderRadius: 999,
                        height: 9,
                        background: '#EAF7EF',
                        '& .MuiLinearProgress-bar': {
                          background:
                            'linear-gradient(135deg, #157347 0%, #22C55E 100%)',
                        },
                      }}
                    />
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
                      'linear-gradient(135deg, #157347 0%, #22C55E 100%)',
                    boxShadow: '0 10px 25px rgba(21,115,71,0.18)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #0F5D39 0%, #16A34A 100%)',
                      boxShadow: '0 16px 34px rgba(21,115,71,0.25)',
                    },
                  }}
                >
                  {saving
                    ? 'Subiendo formato...'
                    : 'Actualizar formato autorizado'}
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
                background: '#EAF7EF',
                opacity: 0.85,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography fontWeight="900" color="#090979" mb={0.5}>
                Requisitos del formato
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Verifica que el archivo corresponda al formato oficial actualizado.
              </Typography>

              <Alert
                severity="info"
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  border: '1px solid #A7E0BC',
                  background: '#EAF7EF',
                  color: '#157347',
                  fontWeight: 700,
                }}
              >
                Este documento será visible para ROOT, ADMIN y LECTOR desde el dashboard.
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
                  'Solo ROOT puede actualizar este formato.',
                  'El documento debe subirse en formato DOCX.',
                  'El título se guarda automáticamente.',
                  'La fecha de publicación se registra automáticamente.',
                  'Se publica directamente sin revisión.',
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