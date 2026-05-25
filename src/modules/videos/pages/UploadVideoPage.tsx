import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Alert,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import LinkIcon from '@mui/icons-material/Link'
import SecurityIcon from '@mui/icons-material/Security'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import {
  createVideoTutorial,
} from '../services/videos.service'

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
            <PlayCircleFilledIcon />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight="900" color="#090979">
              Subir video tutorial
            </Typography>

            <Typography color="text.secondary">
              Agrega videos no listados de YouTube para consulta interna.
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
              label="Título del tutorial"
              fullWidth
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <TextField
              label="Descripción breve"
              fullWidth
              multiline
              minRows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
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
            />

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
              {saving ? 'Guardando video...' : 'Guardar video tutorial'}
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
            Requisitos del video
          </Typography>

          <Alert
            severity="warning"
            icon={<SecurityIcon />}
            sx={{
              borderRadius: 3,
              mb: 2,
            }}
          >
            El video debe estar configurado como no listado en YouTube.
          </Alert>

          <Box
            component="ul"
            sx={{
              pl: 3,
              color: '#475569',
            }}
          >
            <li>No uses videos públicos si son internos.</li>
            <li>No uses videos privados, porque pueden bloquearse en el visor.</li>
            <li>Usa videos no listados para que solo accedan quienes tengan el enlace.</li>
            <li>El video se mostrará dentro de la plataforma.</li>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}