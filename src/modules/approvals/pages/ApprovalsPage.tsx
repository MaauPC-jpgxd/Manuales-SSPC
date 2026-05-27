import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
import FactCheckIcon from '@mui/icons-material/FactCheck'

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

const getPriorityStyles = (priority?: ManualPriority) => {
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

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.15,
    },
  },
}

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: 'easeOut',
    },
  },
}

export default function ApprovalsPage() {
  const user = useAuthStore((state) => state.user)

  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null)

  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [manualToReject, setManualToReject] = useState<Manual | null>(null)
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

  const handleApprove = async (manual: Manual) => {
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

  const openRejectModal = (manual: Manual) => {
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
      await rejectManual(manualToReject.id, rejectionReason.trim())

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
    <Box sx={{ position: 'relative' }}>
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
            <Chip
              icon={<FactCheckIcon />}
              label="Centro de revisión"
              sx={{
                mb: 2,
                fontWeight: 800,
                color: '#090979',
                background: '#EEF3FF',
                border: '1px solid #DCE5F3',
              }}
            />

            <Typography variant="h4" fontWeight="900" color="#090979">
              Revisión de manuales
            </Typography>

            <Typography color="text.secondary" mt={1} maxWidth={720}>
              Aprueba, rechaza o ajusta la prioridad de los manuales enviados antes de publicarlos.
            </Typography>

            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '16px !important' }} />}
              label={`${manuals.length} pendiente${manuals.length === 1 ? '' : 's'}`}
              sx={{
                mt: 3,
                background: '#EEF3FF',
                color: '#090979',
                fontWeight: 800,
                border: '1px solid #DCE5F3',
              }}
            />
          </Box>
        </Paper>
      </motion.div>

      {loading ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 5,
            border: '1px solid #DCE5F3',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={26} sx={{ color: '#090979' }} />
          <Typography color="text.secondary" fontWeight={700}>
            Cargando manuales pendientes...
          </Typography>
        </Paper>
      ) : manuals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              height: 300,
              borderRadius: 5,
              border: '1px dashed #CBD5E1',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 18px 45px rgba(9, 9, 121, 0.06)',
            }}
          >
            <DescriptionIcon sx={{ fontSize: 76, color: '#94A3B8' }} />

            <Typography mt={2} fontWeight="900" color="#090979">
              Sin manuales pendientes
            </Typography>

            <Typography color="text.secondary" textAlign="center">
              Cuando se suba un manual aparecerá aquí.
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        <Box
          component={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
        >
          {manuals.map((manual, index) => {
            const priorityStyle = getPriorityStyles(manual.priority)

            return (
              <motion.div
                key={manual.id}
                variants={cardVariants}
                whileHover={{
                  y: -6,
                  scale: [1, 1.012, 1.005, 1.012],
                  transition: {
                    scale: {
                      duration: 0.75,
                      repeat: Infinity,
                      repeatType: 'mirror',
                      ease: 'easeInOut',
                    },
                    y: {
                      duration: 0.25,
                    },
                  },
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 5,
                    border: '1px solid #DCE5F3',
                    background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                    flexWrap: 'wrap',
                    boxShadow: '0 18px 45px rgba(9, 9, 121, 0.08)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      borderColor: '#090979',
                      boxShadow: '0 28px 70px rgba(9, 9, 121, 0.15)',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      width: 130,
                      height: 130,
                      borderRadius: '50%',
                      right: -45,
                      bottom: -55,
                      background: '#EEF3FF',
                      opacity: 0.85,
                    },
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

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
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
                        width: 62,
                        height: 62,
                        borderRadius: 4,
                        background: '#EEF3FF',
                        color: '#090979',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <DescriptionIcon sx={{ fontSize: 32 }} />
                    </Box>

                    <Box>
                      <Typography fontWeight="900" color="#090979">
                        Manual {index + 1}: {manual.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Subido por: {manual.uploadedByName}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.3 }}>
                        <Chip
                          label="Pendiente de revisión"
                          size="small"
                          sx={{
                            background: '#FFF4DE',
                            color: '#8A5A00',
                            fontWeight: 800,
                          }}
                        />

                        <Chip
                          label={priorityStyle.label}
                          size="small"
                          sx={{
                            background: priorityStyle.background,
                            color: priorityStyle.color,
                            fontWeight: 900,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1.5,
                      flexWrap: 'wrap',
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={() => setSelectedManual(manual)}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        borderColor: '#090979',
                        color: '#090979',
                        fontWeight: 900,
                        '&:hover': {
                          borderColor: '#090979',
                          background: '#EEF3FF',
                        },
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
                        fontWeight: 900,
                        '&:hover': {
                          borderColor: '#090979',
                          background: '#EEF3FF',
                        },
                      }}
                    >
                      Descargar
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            )
          })}
        </Box>
      )}

      <Dialog open={!!selectedManual} onClose={() => setSelectedManual(null)} fullScreen>
        {selectedManual && (
          <>
            <DialogTitle
              sx={{
                px: 3,
                py: 2,
                borderBottom: '1px solid #DCE5F3',
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="900" color="#090979">
                  {selectedManual.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Subido por: {selectedManual.uploadedByName}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, flexWrap: 'wrap' }}>
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
                  <MenuItem value="ALTA">🔴 Alta</MenuItem>
                  <MenuItem value="MEDIA">🟡 Media</MenuItem>
                  <MenuItem value="BAJA">🔵 Baja</MenuItem>
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
                    fontWeight: 900,
                    background: 'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
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

            <DialogContent sx={{ p: 0, background: '#EEF3FF', height: '100%' }}>
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
            borderRadius: 5,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 900,
            color: '#B42318',
            borderBottom: '1px solid #F3C7C7',
            background: 'linear-gradient(135deg, #FFF8F8 0%, #FFFFFF 100%)',
          }}
        >
          Motivo del rechazo
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Typography color="text.secondary" mb={2}>
            Escribe por qué este manual no fue aprobado. Este comentario aparecerá en el apartado de rechazados.
          </Typography>

          <TextField
            label="Comentario del rechazo"
            fullWidth
            multiline
            minRows={4}
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
              },
            }}
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
              color: '#090979',
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