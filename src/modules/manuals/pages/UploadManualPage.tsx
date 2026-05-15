import { useState } from 'react'

import {
  Alert,
  Box,
  Button,
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import UploadFileIcon from '@mui/icons-material/UploadFile'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import SecurityIcon from '@mui/icons-material/Security'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import {
  uploadPdfToCloudinary,
} from '@/services/cloudinary.service'

import {
  createManualForReview,
} from '../services/manuals.service'

type ManualPriority =
  'ALTA' |
  'MEDIA' |
  'BAJA'

export default function UploadManualPage() {
  const user = useAuthStore((state) => state.user)

  const [title, setTitle] = useState('')
  const [priority, setPriority] =
    useState<ManualPriority>('MEDIA')
  const [file, setFile] =
    useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!user) {
      alert('No hay sesión activa')
      return
    }

    if (!title.trim()) {
      alert('Escribe el título del manual')
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
        title,
        priority,
        fileUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        uploadedBy: user.uid,
        uploadedByName: user.name,
      })

      setTitle('')
      setPriority('MEDIA')
      setFile(null)

      alert('Manual enviado a revisión')
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'No se pudo subir el manual',
      )
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
        <Box className="flex items-center justify-between gap-4 flex-wrap">
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
              <CloudUploadIcon sx={{ color: '#090979' }} />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Subir manual
              </Typography>

              <Typography color="text.secondary">
                El manual será enviado a revisión antes de publicarse.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={
              <SecurityIcon
                sx={{
                  fontSize: '16px !important',
                }}
              />
            }
            label="Revisión requerida"
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
            <TextField
              label="Título del manual"
              fullWidth
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />

            <TextField
              select
              label="Prioridad del manual"
              fullWidth
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target.value as ManualPriority,
                )
              }
            >
              <MenuItem value="ALTA">
                🔴 Alta prioridad
              </MenuItem>

              <MenuItem value="MEDIA">
                🟡 Prioridad media
              </MenuItem>

              <MenuItem value="BAJA">
                🔵 Prioridad baja
              </MenuItem>
            </TextField>

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
              {file ? file.name : 'Seleccionar archivo PDF'}

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
                    <PictureAsPdfIcon
                      sx={{
                        color: '#D32F2F',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography fontWeight="800" color="#090979">
                      {file.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
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
              {saving ? 'Subiendo manual...' : 'Enviar a revisión'}
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
          <Typography
            fontWeight="900"
            color="#090979"
            mb={2}
          >
            Requisitos del manual
          </Typography>

          <Alert
            severity="info"
            sx={{
              borderRadius: 3,
              mb: 2,
            }}
          >
            Todos los manuales deben ser revisados por un usuario ROOT
            antes de publicarse.
          </Alert>

          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              border: '1px solid #DCE5F3',
              background: '#FFFFFF',
            }}
          >
            <Typography
              fontWeight="900"
              color="#090979"
              mb={2}
            >
              Prioridades de aprendizaje
            </Typography>

            <Box className="flex flex-col gap-2">
              <Chip
                label="🔴 ALTA · Manual crítico u obligatorio"
                sx={{
                  justifyContent: 'flex-start',
                  background: '#FDECEC',
                  color: '#B42318',
                  fontWeight: 800,
                }}
              />

              <Chip
                label="🟡 MEDIA · Manual importante"
                sx={{
                  justifyContent: 'flex-start',
                  background: '#FFF7E0',
                  color: '#9A6700',
                  fontWeight: 800,
                }}
              />

              <Chip
                label="🔵 BAJA · Material de consulta general"
                sx={{
                  justifyContent: 'flex-start',
                  background: '#EEF3FF',
                  color: '#090979',
                  fontWeight: 800,
                }}
              />
            </Box>
          </Paper>

          <Box
            component="ul"
            sx={{
              pl: 3,
              color: '#475569',
            }}
          >
            <li>Solo archivos PDF.</li>
            <li>Título claro y descriptivo.</li>
            <li>El manual puede reemplazar versiones anteriores automáticamente.</li>
           
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}