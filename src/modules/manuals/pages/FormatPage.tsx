import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArticleIcon from '@mui/icons-material/Article'
import DownloadIcon from '@mui/icons-material/Download'
import CloudDoneIcon from '@mui/icons-material/CloudDone'
import SearchOffIcon from '@mui/icons-material/SearchOff'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import VerifiedIcon from '@mui/icons-material/Verified'

import type { Manual } from '@/modules/manuals/types/manual.types'

import { getApprovedManuals } from '@/modules/manuals/services/manuals.service'

const getCreatedAtMillis = (createdAt: unknown) => {
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

const formatCreatedAt = (createdAt: unknown) => {
  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'toDate' in createdAt &&
    typeof createdAt.toDate === 'function'
  ) {
    return createdAt.toDate().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return 'Sin fecha'
}

export default function FormatPage() {
  const navigate = useNavigate()

  const [format, setFormat] = useState<Manual | null>(null)
  const [loading, setLoading] = useState(true)

  const loadFormat = async () => {
    try {
      setLoading(true)

      const data = await getApprovedManuals()

      const formats = data.filter((item) => item.category === 'FORMATO')

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
            borderColor: '#157347',
            color: '#157347',
            fontWeight: 900,
            background: '#FFFFFF',
            boxShadow: '0 10px 24px rgba(21,115,71,0.06)',
            '&:hover': {
              borderColor: '#157347',
              background: '#EAF7EF',
              boxShadow: '0 14px 30px rgba(21,115,71,0.11)',
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
            border: '1px solid #A7E0BC',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)',
            boxShadow: '0 22px 55px rgba(21, 115, 71, 0.09)',
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
                'conic-gradient(from 180deg, rgba(21,115,71,0.16), rgba(34,197,94,0.05), rgba(21,115,71,0.16))',
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
                  background: '#EAF7EF',
                  color: '#157347',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                }}
              >
                <ArticleIcon sx={{ fontSize: 34 }} />
              </Box>

              <Box>
                <Chip
                  icon={<VerifiedIcon sx={{ fontSize: '16px !important' }} />}
                  label="Plantilla oficial"
                  size="small"
                  sx={{
                    mb: 1,
                    fontWeight: 900,
                    color: '#157347',
                    background: '#EAF7EF',
                    border: '1px solid #A7E0BC',
                  }}
                />

                <Typography variant="h4" fontWeight="900" color="#157347">
                  Formato autorizado
                </Typography>

                <Typography color="text.secondary" mt={1} maxWidth={720}>
                  Consulta y descarga la plantilla corporativa oficial.
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<CloudDoneIcon sx={{ fontSize: '16px !important' }} />}
              label={format ? 'Formato disponible' : 'Sin formato'}
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
          <CircularProgress size={26} sx={{ color: '#157347' }} />

          <Typography color="text.secondary" fontWeight={700}>
            Cargando formato...
          </Typography>
        </Paper>
      ) : !format ? (
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

            <Typography mt={2} fontWeight="900" color="#157347">
              Sin formato autorizado
            </Typography>

            <Typography color="text.secondary" textAlign="center">
              Aún no se ha publicado ningún formato.
            </Typography>
          </Paper>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 34, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.48, ease: 'easeOut' }}
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
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: '1px solid #A7E0BC',
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)',
              boxShadow: '0 18px 45px rgba(21, 115, 71, 0.08)',
              position: 'relative',
              overflow: 'hidden',
              transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              '&:hover': {
                borderColor: '#157347',
                boxShadow: '0 28px 70px rgba(21, 115, 71, 0.15)',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                width: 150,
                height: 150,
                borderRadius: '50%',
                right: -55,
                bottom: -55,
                background: '#EAF7EF',
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
                border: '2px solid #157347',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            />

            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
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
                    width: 72,
                    height: 72,
                    borderRadius: 4,
                    background: '#EAF7EF',
                    color: '#157347',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                  }}
                >
                  <ArticleIcon sx={{ fontSize: 38 }} />
                </Box>

                <Box>
                  <Typography variant="h6" fontWeight="900" color="#157347">
                    {format.title}
                  </Typography>

                  <Chip
                    icon={<CalendarMonthIcon sx={{ fontSize: '16px !important' }} />}
                    label={`Publicado el ${formatCreatedAt(format.createdAt)}`}
                    size="small"
                    sx={{
                      mt: 1,
                      background: '#EAF7EF',
                      color: '#157347',
                      fontWeight: 900,
                      border: '1px solid #A7E0BC',
                    }}
                  />
                </Box>
              </Box>

              <Button
                component={motion.a}
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                variant="contained"
                startIcon={<DownloadIcon />}
                href={format.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 900,
                  height: 48,
                  px: 3,
                  background:
                    'linear-gradient(135deg, #157347 0%, #22C55E 100%)',
                  boxShadow: '0 10px 25px rgba(21,115,71,0.18)',
                  '&:hover': {
                    background:
                      'linear-gradient(135deg, #0F5D39 0%, #16A34A 100%)',
                    boxShadow: '0 16px 34px rgba(21,115,71,0.25)',
                  },
                }}
              >
                Descargar DOCX
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}
    </Box>
  )
}