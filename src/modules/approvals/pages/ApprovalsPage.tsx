import { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import DescriptionIcon from '@mui/icons-material/Description'
import DownloadIcon from '@mui/icons-material/Download'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import type {
  Manual,
  ManualPriority,
} from '@/modules/manuals/types/manual.types'

import {
  approveManual,
  getPendingManuals,
  rejectManual,
  updateManualPriority,
} from '@/modules/manuals/services/manuals.service'

const getPriorityStyles = (
  priority?: ManualPriority,
) => {
  if (priority === 'ALTA') {
    return {
      label: '🔴 ALTA',
      background: '#FDECEC',
      color: '#B42318',
    }
  }

  if (priority === 'BAJA') {
    return {
      label: '🔵 BAJA',
      background: '#EEF3FF',
      color: '#090979',
    }
  }

  return {
    label: '🟡 MEDIA',
    background: '#FFF7E0',
    color: '#9A6700',
  }
}

export default function ApprovalsPage() {
  const user = useAuthStore((state) => state.user)

  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedManual, setSelectedManual] =
    useState<Manual | null>(null)

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [manualToReject, setManualToReject] =
    useState<Manual | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const loadManuals = async () => {
    try {
      setLoading(true)
      const data = await getPendingManuals()
      setManuals(data)
    } catch (error) {
      console.error(error)
      alert('No se pudieron cargar los manuales pendientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManuals()
  }, [])

  const handleApprove = async (
    manual: Manual,
  ) => {
    if (!user) return

    try {
      await approveManual(manual, user.uid)

      setSelectedManual(null)

      await loadManuals()

      alert('Manual aprobado y publicado')
    } catch (error) {
      console.error(error)
      alert('No se pudo aprobar el manual')
    }
  }

  const openRejectModal = (
    manual: Manual,
  ) => {
    setManualToReject(manual)
    setRejectionReason('')
    setRejectModalOpen(true)
  }

  const handleReject = async () => {
    if (!manualToReject) return

    if (!rejectionReason.trim()) {
      alert('Escribe el motivo del rechazo')
      return
    }

    try {
      await rejectManual(
        manualToReject.id,
        rejectionReason.trim(),
      )

      setSelectedManual(null)
      setManualToReject(null)
      setRejectionReason('')
      setRejectModalOpen(false)

      await loadManuals()

      alert('Manual rechazado correctamente')
    } catch (error) {
      console.error(error)
      alert('No se pudo rechazar el manual')
    }
  }

  const handleChangePriority = async (
    manualId: string,
    priority: ManualPriority,
  ) => {
    try {
      await updateManualPriority(manualId, priority)

      setManuals((currentManuals) =>
        currentManuals.map((manual) =>
          manual.id === manualId
            ? {
                ...manual,
                priority,
              }
            : manual,
        ),
      )

      setSelectedManual((currentManual) =>
        currentManual
          ? {
              ...currentManual,
              priority,
            }
          : currentManual,
      )
    } catch (error) {
      console.error(error)
      alert('No se pudo actualizar la prioridad')
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
          <Box>
            <Typography
              variant="h5"
              fontWeight="900"
              color="#090979"
            >
              Revisión de manuales
            </Typography>

            <Typography color="text.secondary" mt={0.5}>
              Aprueba, rechaza o ajusta la prioridad de los manuales enviados.
            </Typography>
          </Box>

          <Chip
            icon={
              <AccessTimeIcon
                sx={{
                  fontSize: '16px !important',
                }}
              />
            }
            label={`${manuals.length} pendiente${
              manuals.length === 1 ? '' : 's'
            }`}
            sx={{
              background: '#EEF3FF',
              color: '#090979',
              fontWeight: 800,
              border: '1px solid #DCE5F3',
            }}
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando manuales...
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
          <DescriptionIcon
            sx={{
              fontSize: 70,
              color: '#94A3B8',
            }}
          />

          <Typography
            mt={2}
            fontWeight="800"
            color="#090979"
          >
            Sin manuales pendientes
          </Typography>

          <Typography color="text.secondary">
            Cuando se suba un manual aparecerá aquí.
          </Typography>
        </Paper>
      ) : (
        <Box className="flex flex-col gap-4">
          {manuals.map((manual, index) => {
            const priorityStyle =
              getPriorityStyles(manual.priority)

            return (
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
                      background: '#EEF3FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DescriptionIcon
                      sx={{
                        color: '#090979',
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      fontWeight="900"
                      color="#090979"
                    >
                      Manual {index + 1}: {manual.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Subido por: {manual.uploadedByName}
                    </Typography>

                    <Box className="flex gap-2 flex-wrap mt-2">
                      <Chip
                        label="Pendiente de revisión"
                        size="small"
                        sx={{
                          background: '#FFF4DE',
                          color: '#8A5A00',
                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        label={priorityStyle.label}
                        size="small"
                        sx={{
                          background:
                            priorityStyle.background,
                          color: priorityStyle.color,
                          fontWeight: 800,
                        }}
                      />
                    </Box>
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
                </Box>
              </Paper>
            )
          })}
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

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Subido por: {selectedManual.uploadedByName}
                </Typography>
              </Box>

              <Box className="flex items-center gap-2 flex-wrap">
                <TextField
                  select
                  size="small"
                  label="Prioridad"
                  value={selectedManual.priority ?? 'MEDIA'}
                  onChange={(event) =>
                    handleChangePriority(
                      selectedManual.id,
                      event.target.value as ManualPriority,
                    )
                  }
                  sx={{
                    minWidth: 160,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontWeight: 800,
                    },
                  }}
                >
                  <MenuItem value="ALTA">
                    🔴 Alta
                  </MenuItem>

                  <MenuItem value="MEDIA">
                    🟡 Media
                  </MenuItem>

                  <MenuItem value="BAJA">
                    🔵 Baja
                  </MenuItem>
                </TextField>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={selectedManual.fileUrl}
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

                <Button
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteIcon />}
                  onClick={() => openRejectModal(selectedManual)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 800,
                  }}
                >
                  Rechazar
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CheckIcon />}
                  onClick={() => handleApprove(selectedManual)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 800,
                    background:
                      'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                    },
                  }}
                >
                  Aprobar
                </Button>

                <IconButton onClick={() => setSelectedManual(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background: '#EEF3FF',
                height: '100%',
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

      <Dialog
        open={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            color: '#B42318',
            borderBottom: '1px solid #F3C7C7',
          }}
        >
          Motivo del rechazo
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Typography color="text.secondary" mb={2}>
            Escribe por qué este manual no fue aprobado. Este comentario
            aparecerá en el apartado de rechazados.
          </Typography>

          <TextField
            label="Comentario del rechazo"
            fullWidth
            multiline
            minRows={4}
            value={rejectionReason}
            onChange={(event) =>
              setRejectionReason(event.target.value)
            }
          />
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setRejectModalOpen(false)
              setManualToReject(null)
              setRejectionReason('')
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 800,
            }}
          >
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleReject}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 900,
            }}
          >
            Rechazar manual
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}