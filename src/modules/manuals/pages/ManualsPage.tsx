import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import type {
  Manual,
  ManualPriority,
} from '@/modules/manuals/types/manual.types'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'

import DescriptionIcon from '@mui/icons-material/Description'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import VerifiedIcon from '@mui/icons-material/Verified'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import MenuBookIcon from '@mui/icons-material/MenuBook'

import { getApprovedManuals } from '@/modules/manuals/services/manuals.service'

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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.15,
    },
  },
}

const cardVariants = {
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

export default function ManualsPage() {
  const navigate = useNavigate()

  const [manuals, setManuals] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedManual, setSelectedManual] = useState<Manual | null>(null)

  const loadManuals = async () => {
    try {
      setLoading(true)

      const data = await getApprovedManuals()

      const onlyManuals = data.filter(
        (manual) => !manual.category || manual.category === 'MANUAL',
      )

      setManuals(onlyManuals)
    } catch (error) {
      console.error(error)
      alert('No se pudieron cargar los manuales')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManuals()
  }, [])

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
            navigate('/dashboard', {
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

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
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
                <MenuBookIcon sx={{ fontSize: 34 }} />
              </Box>

              <Box>
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '16px !important' }} />}
                  label="Documentos aprobados"
                  size="small"
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                    color: '#157347',
                    background: '#EAF7EF',
                    border: '1px solid #A7E0BC',
                  }}
                />

                <Typography variant="h4" fontWeight="900" color="#090979">
                  Manuales corporativos
                </Typography>

                <Typography color="text.secondary" mt={1} maxWidth={720}>
                  Consulta manuales aprobados con prioridad de aprendizaje.
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<VerifiedIcon sx={{ fontSize: '16px !important' }} />}
              label={`${manuals.length} manual${manuals.length === 1 ? '' : 'es'}`}
              sx={{
                background: '#EAF7EF',
                color: '#157347',
                fontWeight: 900,
                border: '1px solid #A7E0BC',
                height: 36,
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
            Cargando manuales...
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
            <SearchOffIcon
              sx={{
                fontSize: 76,
                color: '#94A3B8',
              }}
            />

            <Typography mt={2} fontWeight="900" color="#090979">
              Sin manuales publicados
            </Typography>

            <Typography color="text.secondary" textAlign="center">
              Cuando se aprueben manuales aparecerán aquí.
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
                        Documento aprobado para consulta corporativa
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.3 }}>
                        <Chip
                          label="APROBADO"
                          size="small"
                          sx={{
                            background: '#EAF7EF',
                            color: '#157347',
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

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  <Chip
                    label="APROBADO"
                    size="small"
                    sx={{
                      background: '#EAF7EF',
                      color: '#157347',
                      fontWeight: 800,
                    }}
                  />

                  <Chip
                    label={getPriorityStyles(selectedManual.priority).label}
                    size="small"
                    sx={{
                      background: getPriorityStyles(selectedManual.priority).background,
                      color: getPriorityStyles(selectedManual.priority).color,
                      fontWeight: 900,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
                    fontWeight: 900,
                  }}
                >
                  Descargar
                </Button>

                <IconButton
                  onClick={() => setSelectedManual(null)}
                  sx={{
                    background: '#EEF3FF',
                    color: '#090979',
                    border: '1px solid #DCE5F3',
                    '&:hover': {
                      background: '#E1EAFE',
                    },
                  }}
                >
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