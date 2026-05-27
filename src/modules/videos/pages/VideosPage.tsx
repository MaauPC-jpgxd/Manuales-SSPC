import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

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

import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo'
import VisibilityIcon from '@mui/icons-material/Visibility'
import PersonIcon from '@mui/icons-material/Person'
import SearchOffIcon from '@mui/icons-material/SearchOff'

import type { VideoTutorial } from '../types/video.types'

import { getVideoTutorials } from '../services/videos.service'

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

export default function VideosPage() {
  const navigate = useNavigate()

  const [videos, setVideos] = useState<VideoTutorial[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null)

  const loadVideos = async () => {
    try {
      setLoading(true)

      const data = await getVideoTutorials()

      setVideos(data)
    } catch (error) {
      console.error(error)

      alert('No se pudieron cargar los video tutoriales')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
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
                <PlayCircleFilledIcon sx={{ fontSize: 36 }} />
              </Box>

              <Box>
                <Chip
                  icon={<OndemandVideoIcon sx={{ fontSize: '16px !important' }} />}
                  label="Biblioteca audiovisual"
                  size="small"
                  sx={{
                    mb: 1,
                    fontWeight: 800,
                    color: '#090979',
                    background: '#EEF3FF',
                    border: '1px solid #DCE5F3',
                  }}
                />

                <Typography variant="h4" fontWeight="900" color="#090979">
                  Video tutoriales
                </Typography>

                <Typography color="text.secondary" mt={1} maxWidth={720}>
                  Consulta videos de capacitación y soporte corporativo.
                </Typography>
              </Box>
            </Box>

            <Chip
              icon={<VisibilityIcon sx={{ fontSize: '16px !important' }} />}
              label={`${videos.length} video${videos.length === 1 ? '' : 's'}`}
              sx={{
                background: '#EEF3FF',
                color: '#090979',
                fontWeight: 900,
                border: '1px solid #DCE5F3',
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
            Cargando video tutoriales...
          </Typography>
        </Paper>
      ) : videos.length === 0 ? (
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
              Sin video tutoriales
            </Typography>

            <Typography color="text.secondary" textAlign="center">
              Cuando se agreguen videos aparecerán aquí.
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
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
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
                    <PlayCircleFilledIcon sx={{ fontSize: 34 }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight="900" color="#090979">
                      Tutorial {index + 1}: {video.title}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      {video.description}
                    </Typography>

                    <Chip
                      icon={<PersonIcon sx={{ fontSize: '16px !important' }} />}
                      label={`Subido por: ${video.createdByName}`}
                      size="small"
                      sx={{
                        mt: 1.2,
                        background: '#EEF3FF',
                        color: '#090979',
                        fontWeight: 800,
                      }}
                    />
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
                    startIcon={<PlayCircleFilledIcon />}
                    onClick={() => setSelectedVideo(video)}
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
                    Ver tutorial
                  </Button>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Box>
      )}

      <Dialog
        open={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
        fullScreen
      >
        {selectedVideo && (
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
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="900" color="#090979">
                  {selectedVideo.title}
                </Typography>

                <Typography color="text.secondary">
                  {selectedVideo.description}
                </Typography>
              </Box>

              <IconButton
                onClick={() => setSelectedVideo(null)}
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
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background: '#000',
                height: 'calc(100vh - 88px)',
              }}
            >
              <iframe
                src={selectedVideo.youtubeEmbedUrl}
                title={selectedVideo.title}
                width="100%"
                height="100%"
                allow="
                  accelerometer;
                  autoplay;
                  clipboard-write;
                  encrypted-media;
                  gyroscope;
                  picture-in-picture
                "
                allowFullScreen
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