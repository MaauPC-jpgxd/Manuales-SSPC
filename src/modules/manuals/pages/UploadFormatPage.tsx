import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

import { useAuthStore } from '@/modules/auth/store/auth.store'

import {
  uploadDocxToCloudinary,
} from '@/services/cloudinary.service'

import {
  createManualForReview,
} from '../services/manuals.service'

export default function UploadFormatPage() {

  const navigate = useNavigate()

  const user = useAuthStore(
    (state) => state.user,
  )

  const [file, setFile] =
    useState<File | null>(null)

  const [saving, setSaving] =
    useState(false)

  const today =
    new Date()
      .toISOString()
      .slice(0, 10)

  const handleSubmit = async () => {

    if (!user) {

      alert(
        'No hay sesión activa',
      )

      return
    }

    if (!file) {

      alert(
        'Selecciona el formato autorizado',
      )

      return
    }

    if (
      file.type !==
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {

      alert(
        'Solo se permiten archivos DOCX',
      )

      return
    }

    try {

      setSaving(true)

      const cloudinaryResponse =
        await uploadDocxToCloudinary(file)

      await createManualForReview({

        title:
          'Formato actualizado',

        priority:
          'MEDIA',

        category:
          'FORMATO',

        startDate:
          today,

        endDate:
          today,

        fileUrl:
          cloudinaryResponse.secure_url,

        publicId:
          cloudinaryResponse.public_id,

        uploadedBy:
          user.uid,

        uploadedByName:
          user.name,
      })

      setFile(null)

      alert(
        'Formato actualizado correctamente',
      )

      navigate(
        '/subir',
        {
          replace: true,
        },
      )

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

    <Box>

      <Button
        variant="outlined"

        startIcon={
          <ArrowBackIcon />
        }

        onClick={() =>
          navigate(
            '/subir',
            {
              replace: true,
            },
          )
        }

        sx={{
          mb: 3,
          borderRadius: 3,
          textTransform:
            'none',
          borderColor:
            '#090979',
          color:
            '#090979',
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

          border:
            '1px solid #A7E0BC',

          background:
            'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)',
        }}
      >

        <Box
          className="
            flex
            items-center
            justify-between
            gap-4
            flex-wrap
          "
        >

          <Box
            className="
              flex
              items-center
              gap-3
            "
          >

            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,

                background:
                  '#EAF7EF',

                color:
                  '#157347',

                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >

              <ArticleIcon />

            </Box>

            <Box>

              <Typography
                variant="h5"
                fontWeight="900"
                color="#157347"
              >
                Subir formato autorizado
              </Typography>

              <Typography color="text.secondary">
                Actualiza el formato oficial corporativo en DOCX.
              </Typography>

            </Box>

          </Box>

          <Chip
            icon={
              <SecurityIcon
                sx={{
                  fontSize:
                    '16px !important',
                }}
              />
            }

            label="Solo ROOT"

            sx={{
              background:
                '#EAF7EF',

              color:
                '#157347',

              fontWeight:
                800,

              border:
                '1px solid #A7E0BC',
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

          alignItems:
            'start',
        }}
      >

        <Paper
          elevation={0}

          sx={{
            p: 4,
            borderRadius: 4,

            border:
              '1px solid #DCE5F3',

            background:
              '#FFFFFF',

            boxShadow:
              '0 12px 35px rgba(9, 9, 121, 0.06)',
          }}
        >

          <Box
            className="
              flex
              flex-col
              gap-4
            "
          >

            <Paper
              elevation={0}

              sx={{
                p: 2,
                borderRadius: 3,

                border:
                  '1px solid #DCE5F3',

                background:
                  '#F8FAFF',
              }}
            >

              <Typography
                fontWeight="900"
                color="#090979"
              >
                Título automático
              </Typography>

              <Typography color="text.secondary">
                Formato actualizado
              </Typography>

              <Typography
                mt={2}
                fontWeight="900"
                color="#090979"
              >
                Fecha de publicación
              </Typography>

              <Typography color="text.secondary">
                {today}
              </Typography>

            </Paper>

            <Button
              component="label"
              variant="outlined"

              startIcon={
                <UploadFileIcon />
              }

              sx={{
                height: 60,
                borderRadius: 3,
                textTransform:
                  'none',

                borderStyle:
                  'dashed',

                borderWidth: 2,

                borderColor:
                  '#CBD5E1',

                color:
                  '#090979',

                fontWeight:
                  800,

                justifyContent:
                  'flex-start',

                px: 3,

                '&:hover': {
                  borderColor:
                    '#090979',

                  background:
                    '#F8FAFF',
                },
              }}
            >

              {file
                ? file.name
                : 'Seleccionar formato DOCX'}

              <input
                hidden
                type="file"

                accept="
                  .docx,
                  application/vnd.openxmlformats-officedocument.wordprocessingml.document
                "

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

                  border:
                    '1px solid #DCE5F3',

                  background:
                    '#F8FAFF',
                }}
              >

                <Box
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >

                  <DescriptionIcon
                    sx={{
                      color:
                        '#2563EB',
                    }}
                  />

                  <Box>

                    <Typography
                      fontWeight="800"
                      color="#090979"
                    >
                      {file.name}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {(
                        file.size /
                        1024 /
                        1024
                      ).toFixed(2)} MB
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

              onClick={
                handleSubmit
              }

              sx={{
                height: 56,
                borderRadius: 3,

                textTransform:
                  'none',

                fontWeight:
                  900,

                background:
                  'linear-gradient(135deg, #157347 0%, #22C55E 100%)',

                boxShadow:
                  '0 10px 25px rgba(21,115,71,0.18)',

                '&:hover': {
                  background:
                    'linear-gradient(135deg, #0F5D39 0%, #16A34A 100%)',
                },
              }}
            >

              {saving
                ? 'Subiendo formato...'
                : 'Actualizar formato autorizado'}

            </Button>

          </Box>

        </Paper>

        <Paper
          elevation={0}

          sx={{
            p: 3,
            borderRadius: 4,

            border:
              '1px solid #DCE5F3',

            background:
              'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
          }}
        >

          <Typography
            fontWeight="900"
            color="#090979"
            mb={2}
          >
            Requisitos del formato
          </Typography>

          <Alert
            severity="info"

            sx={{
              borderRadius: 3,
              mb: 2,
            }}
          >
            Este documento será visible para ROOT, ADMIN y LECTOR desde el dashboard.
          </Alert>

          <Box
            component="ul"

            sx={{
              pl: 3,
              color: '#475569',
            }}
          >

            <li>
              Solo ROOT puede actualizar este formato.
            </li>

            <li>
              El documento debe subirse en formato DOCX.
            </li>

            <li>
              El título se guarda automáticamente.
            </li>

            <li>
              La fecha de publicación se registra automáticamente.
            </li>

            <li>
              Se publica directamente sin revisión.
            </li>

          </Box>

        </Paper>

      </Box>

    </Box>
  )
}