import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArticleIcon from '@mui/icons-material/Article'
import DownloadIcon from '@mui/icons-material/Download'
import CloudDoneIcon from '@mui/icons-material/CloudDone'

import type {
  Manual,
} from '@/modules/manuals/types/manual.types'

import {
  getApprovedManuals,
} from '@/modules/manuals/services/manuals.service'

const getCreatedAtMillis = (
  createdAt: unknown,
) => {
  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'toDate' in createdAt &&
    typeof createdAt.toDate === 'function'
  ) {
    return createdAt.toDate().getTime()
  }

  return 0
}

const formatCreatedAt = (
  createdAt: unknown,
) => {
  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'toDate' in createdAt &&
    typeof createdAt.toDate === 'function'
  ) {
    return createdAt
      .toDate()
      .toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
  }

  return 'Sin fecha'
}

export default function FormatPage() {
  const navigate = useNavigate()

  const [format, setFormat] =
    useState<Manual | null>(null)

  const [loading, setLoading] =
    useState(true)

  const loadFormat = async () => {
    try {
      setLoading(true)

      const data =
        await getApprovedManuals()

      const formats =
        data.filter(
          (item) =>
            item.category === 'FORMATO',
        )

      const latestFormat =
        formats.sort(
          (a, b) =>
            getCreatedAtMillis(b.createdAt) -
            getCreatedAtMillis(a.createdAt),
        )[0] ?? null

      setFormat(latestFormat)
    } catch (error) {
      console.error(error)
      alert('No se pudo cargar el formato autorizado')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadFormat()
  }, [])

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() =>
          navigate('/dashboard', {
            replace: true,
          })
        }
        sx={{
          mb: 3,
          borderRadius: 3,
          textTransform: 'none',
          borderColor: '#157347',
          color: '#157347',
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
          border: '1px solid #A7E0BC',
          background:
            'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)',
        }}
      >
        <Box className="flex items-center justify-between gap-4 flex-wrap">
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                background: '#EAF7EF',
                color: '#157347',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                Formato autorizado
              </Typography>

              <Typography color="text.secondary">
                Consulta y descarga la plantilla corporativa oficial.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={
              <CloudDoneIcon
                sx={{
                  fontSize: '16px !important',
                }}
              />
            }
            label={
              format
                ? 'Formato disponible'
                : 'Sin formato'
            }
            sx={{
              background: '#EAF7EF',
              color: '#157347',
              fontWeight: 800,
              border: '1px solid #A7E0BC',
            }}
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando formato...
        </Typography>
      ) : !format ? (
        <Paper
          elevation={0}
          sx={{
            height: 280,
            borderRadius: 4,
            border: '1px dashed #CBD5E1',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArticleIcon
            sx={{
              fontSize: 70,
              color: '#94A3B8',
            }}
          />

          <Typography
            mt={2}
            fontWeight="800"
            color="#157347"
          >
            Sin formato autorizado
          </Typography>

          <Typography color="text.secondary">
            Aún no se ha publicado ningún formato.
          </Typography>
        </Paper>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #DCE5F3',
            background: '#FFFFFF',
            boxShadow:
              '0 12px 35px rgba(9, 9, 121, 0.06)',
          }}
        >
          <Box className="flex items-center justify-between gap-4 flex-wrap">
            <Box className="flex items-center gap-4">
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: '#EAF7EF',
                  color: '#157347',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ArticleIcon
                  sx={{
                    fontSize: 34,
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#157347"
                >
                  {format.title}
                </Typography>

                <Typography color="text.secondary">
                  Publicado el {formatCreatedAt(format.createdAt)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              href={format.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 800,
                background:
                  'linear-gradient(135deg, #157347 0%, #22C55E 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #0F5D39 0%, #16A34A 100%)',
                },
              }}
            >
              Descargar DOCX
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  )
}