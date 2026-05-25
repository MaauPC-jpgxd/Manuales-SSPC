import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

      const cloudinaryResponse =
        await uploadPdfToCloudinary(file)

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
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate('/subir', {
            replace: true,
          })
        }
        sx={{
          mb: 3,
          borderRadius: 3,
          textTransform: 'none',
          borderColor: '#090979',
          color: '#090979',
          fontWeight: 800,
        }}
      >
        Regresar
      </Button>

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
        <Box className="flex items-center justify-between gap-4 flex-wrap">
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                background: '#EEF3FF',
                color: '#090979',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ConfirmationNumberIcon />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight="900" color="#090979">
                Subir tickets resueltos
              </Typography>

              <Typography color="text.secondary">
                Publica reportes semanales de tickets resueltos en PDF.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
            label="Periodo semanal"
            sx={{
              background: '#EEF3FF',
              color: '#090979',
              fontWeight: 800,
              border: '1px solid #DCE5F3',
            }}
          />
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
              />
            </Box>

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{
                height: 60,
                borderRadius: 3,
                textTransform: 'none',
                borderStyle: 'dashed',
                borderWidth: 2,
                borderColor: '#CBD5E1',
                color: '#090979',
                fontWeight: 800,
                justifyContent: 'flex-start',
                px: 3,
                '&:hover': {
                  borderColor: '#090979',
                  background: '#F8FAFF',
                },
              }}
            >
              {file ? file.name : 'Seleccionar PDF de tickets resueltos'}

              <input
                hidden
                type="file"
                accept="application/pdf"
                onChange={(event) => {
                  const selectedFile =
                    event.target.files?.[0] ?? null

                  setFile(selectedFile)
                }}
              />
            </Button>

            {file && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: '1px solid #DCE5F3',
                  background: '#F8FAFF',
                }}
              >
                <Box className="flex items-center gap-3">
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      background: '#EEF3FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PictureAsPdfIcon sx={{ color: '#D32F2F' }} />
                  </Box>

                  <Box>
                    <Typography fontWeight="800" color="#090979">
                      {file.name}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}

            {saving && (
              <LinearProgress
                sx={{
                  borderRadius: 999,
                  height: 8,
                }}
              />
            )}

            <Button
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
                },
              }}
            >
              {saving ? 'Subiendo reporte...' : 'Publicar tickets resueltos'}
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
            Requisitos del reporte
          </Typography>

          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              mb: 2,
            }}
          >
            Los tickets resueltos se cargan por semana y se consultan por ese periodo.
          </Alert>

          <Box
            component="ul"
            sx={{
              pl: 3,
              color: '#475569',
            }}
          >
            <li>Solo archivos PDF.</li>
            <li>Selecciona inicio y fin de semana.</li>
            <li>Se publica directamente sin revisión.</li>
            <li>El filtro de consulta buscará por la semana del reporte.</li>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}