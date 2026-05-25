import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BlockIcon from '@mui/icons-material/Block'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import RestoreIcon from '@mui/icons-material/Restore'

import { UserRole } from '@/types/roles'
import { ManualStatus } from '@/types/manuals'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import type {
  Manual,
} from '@/modules/manuals/types/manual.types'

import {
  deleteManual,
  getRejectedManuals,
  restoreRejectedManual,
} from '@/modules/manuals/services/manuals.service'

export default function RejectedDocumentsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const isRoot = user?.role === UserRole.ROOT

  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedManual, setSelectedManual] =
    useState<Manual | null>(null)

  const loadRejected = async () => {
    try {
      setLoading(true)

      const data = await getRejectedManuals()

      setManuals(data)
    } catch (error) {
      console.error(error)
      alert('No se pudieron cargar los documentos rechazados')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRejected()
  }, [])

  const handleRestore = async (manualId: string) => {
    if (!isRoot) return

    try {
      await restoreRejectedManual(manualId)
      await loadRejected()
      setSelectedManual(null)
      alert('Documento restaurado a revisión')
    } catch (error) {
      console.error(error)
      alert('No se pudo restaurar el documento')
    }
  }

  const handleDelete = async (manualId: string) => {
    if (!isRoot) return

    const confirmed = confirm(
      '¿Eliminar definitivamente este documento rechazado?',
    )

    if (!confirmed) return

    try {
      await deleteManual(manualId)
      await loadRejected()
      setSelectedManual(null)
      alert('Documento eliminado')
    } catch (error) {
      console.error(error)
      alert('No se pudo eliminar el documento')
    }
  }

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
          border: '1px solid #F3C7C7',
          background:
            'linear-gradient(135deg, #FFFFFF 0%, #FFF8F8 100%)',
        }}
      >
        <Box className="flex items-center justify-between gap-4 flex-wrap">
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                background: '#FDECEC',
                color: '#B42318',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BlockIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#B42318"
              >
                Documentos rechazados
              </Typography>

              <Typography color="text.secondary">
                Consulta documentos rechazados y su motivo de rechazo.
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`${manuals.length} rechazado${
              manuals.length === 1 ? '' : 's'
            }`}
            sx={{
              background: '#FDECEC',
              color: '#B42318',
              fontWeight: 800,
              border: '1px solid #F3C7C7',
            }}
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando rechazados...
        </Typography>
      ) : manuals.length === 0 ? (
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
          <BlockIcon sx={{ fontSize: 70, color: '#94A3B8' }} />

          <Typography mt={2} fontWeight="800" color="#090979">
            Sin documentos rechazados
          </Typography>

          <Typography color="text.secondary">
            Cuando exista un rechazo aparecerá aquí.
          </Typography>
        </Paper>
      ) : (
        <Box className="flex flex-col gap-4">
          {manuals.map((manual, index) => (
            <Paper
              key={manual.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #DCE5F3',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                boxShadow:
                  '0 12px 35px rgba(9, 9, 121, 0.06)',
              }}
            >
              <Box className="flex items-center gap-4">
                <Box
                  sx={{
                    width: 54,
                    height: 54,
                    borderRadius: 3,
                    background: '#FDECEC',
                    color: '#B42318',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BlockIcon />
                </Box>

                <Box>
                  <Typography fontWeight="900" color="#090979">
                    Rechazado {index + 1}: {manual.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Motivo:{' '}
                    {manual.rejectionReason ??
                      'Sin motivo registrado'}
                  </Typography>

                  <Chip
                    label="RECHAZADO"
                    size="small"
                    sx={{
                      mt: 1,
                      background: '#FDECEC',
                      color: '#B42318',
                      fontWeight: 800,
                    }}
                  />
                </Box>
              </Box>

              <Box className="flex gap-2 flex-wrap">
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() => setSelectedManual(manual)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#090979',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                >
                  Ver
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={manual.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#090979',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                >
                  Descargar
                </Button>

                {isRoot && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<RestoreIcon />}
                      onClick={() => handleRestore(manual.id)}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        borderColor: '#157347',
                        color: '#157347',
                        fontWeight: 800,
                      }}
                    >
                      Restaurar
                    </Button>

                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(manual.id)}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 800,
                      }}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={!!selectedManual}
        onClose={() => setSelectedManual(null)}
        fullScreen
      >
        {selectedManual && (
          <>
            <DialogTitle
              sx={{
                flexShrink: 0,
                px: 3,
                py: 2,
                borderBottom: '1px solid #DCE5F3',
                background: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#090979"
                >
                  {selectedManual.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Motivo:{' '}
                  {selectedManual.rejectionReason ??
                    'Sin motivo registrado'}
                </Typography>
              </Box>

              <Box className="flex items-center gap-2">
                {isRoot && (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<RestoreIcon />}
                      onClick={() =>
                        handleRestore(selectedManual.id)
                      }
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        borderColor: '#157347',
                        color: '#157347',
                        fontWeight: 800,
                      }}
                    >
                      Restaurar
                    </Button>

                    <Button
                      color="error"
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      onClick={() =>
                        handleDelete(selectedManual.id)
                      }
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 800,
                      }}
                    >
                      Eliminar
                    </Button>
                  </>
                )}

                <IconButton onClick={() => setSelectedManual(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background: '#EEF3FF',
                height: 'calc(100vh - 88px)',
                overflow: 'hidden',
              }}
            >
              <iframe
                src={selectedManual.fileUrl}
                title={selectedManual.title}
                width="100%"
                height="100%"
                style={{
                  border: 'none',
                  display: 'block',
                }}
              />
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  )
}