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
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloudDoneIcon from '@mui/icons-material/CloudDone'

import { useAuthStore } from '@/modules/auth/store/auth.store'
import { uploadPdfToCloudinary } from '@/services/cloudinary.service'
import { createManualForReview } from '../services/manuals.service'

const formatWeekTitle = (
  startDate: string,
  endDate: string,
) => {
  if (!startDate || !endDate) {
    return 'Reporte semanal de tickets resueltos'
  }

  return `Tickets resueltos del ${startDate} al ${endDate}`
}

export default function UploadTicketsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!weekStart || !weekEnd) {
      alert('Selecciona el inicio y fin de la semana')
      return
    }

    if (weekStart > weekEnd) {
      alert('La fecha inicial no puede ser mayor que la fecha final')
      return
    }

    if (!file) {
      alert('Selecciona un PDF')
      return
    }

    if (file.type !== 'application/pdf') {
      alert('Solo se permiten archivos PDF')
      return
    }

    try {
      setSaving(true)

      const cloudinaryResponse = await uploadPdfToCloudinary(file)

      await createManualForReview({
        title: formatWeekTitle(weekStart, weekEnd),
        priority: 'MEDIA',
        category: 'TICKETS',
        startDate: weekStart,
        endDate: weekEnd,
        fileUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        uploadedBy: user.uid,
        uploadedByName: user.name,
      })

      setWeekStart('')
      setWeekEnd('')
      setFile(null)

      alert('Reporte de tickets publicado correctamente')
      navigate('/subir', { replace: true })
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo subir el reporte de tickets',
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
                  <ConfirmationNumberIcon sx={{ fontSize: 34 }} />
                </Box>

                <Box>
                  <Chip
                    icon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
                    label="Periodo semanal"
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
                    Subir tickets resueltos
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={720}>
                    Publica reportes semanales de tickets resueltos en PDF.
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
                border: '2px solid #090979',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography fontWeight="900" color="#090979" mb={0.5}>
                Periodo del reporte
              </Typography>

              <Typography color="text.secondary" mb={3}>
                Selecciona el rango semanal y adjunta el PDF correspondiente.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '1fr 1fr',
                    },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Inicio de semana"
                    type="date"
                    fullWidth
                    value={weekStart}
                    onChange={(event) => setWeekStart(event.target.value)}
                    InputLabelProps={{
                      shrink: true,
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
                    label="Fin de semana"
                    type="date"
                    fullWidth
                    value={weekEnd}
                    onChange={(event) => setWeekEnd(event.target.value)}
                    InputLabelProps={{
                      shrink: true,
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
                </Box>

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
                    borderColor: file ? '#090979' : '#CBD5E1',
                    color: '#090979',
                    fontWeight: 900,
                    justifyContent: 'flex-start',
                    px: 3,
                    background: file ? '#EEF3FF' : '#FFFFFF',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      borderColor: '#090979',
                      background: '#F8FAFF',
                      boxShadow: '0 12px 28px rgba(9,9,121,0.1)',
                    },
                  }}
                >
                  {file ? file.name : 'Seleccionar PDF de tickets resueltos'}

                  <input
                    hidden
                    type="file"
                    accept="application/pdf"
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
                          animate={{
                            scale: [1, 1.06, 1],
                          }}
                          transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          sx={{
                            width: 54,
                            height: 54,
                            borderRadius: 3,
                            background: '#FDECEC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <PictureAsPdfIcon sx={{ color: '#D32F2F', fontSize: 30 }} />
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
                      color="#090979"
                      mb={1}
                    >
                      Subiendo archivo y publicando reporte...
                    </Typography>

                    <LinearProgress
                      sx={{
                        borderRadius: 999,
                        height: 9,
                        background: '#EEF3FF',
                        '& .MuiLinearProgress-bar': {
                          background:
                            'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
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
                      'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                    boxShadow: '0 10px 25px rgba(9,9,121,0.18)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                      boxShadow: '0 16px 34px rgba(9,9,121,0.25)',
                    },
                  }}
                >
                  {saving ? 'Subiendo reporte...' : 'Publicar tickets resueltos'}
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
                Requisitos del reporte
              </Typography>

              <Typography variant="body2" color="text.secondary" mb={2}>
                Verifica que el documento corresponda al periodo seleccionado.
              </Typography>

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
                Los tickets resueltos se cargan por semana y se consultan por ese periodo.
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
                  'Solo archivos PDF.',
                  'Selecciona inicio y fin de semana.',
                  'Se publica directamente sin revisión.',
                  'El filtro de consulta buscará por la semana del reporte.',
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