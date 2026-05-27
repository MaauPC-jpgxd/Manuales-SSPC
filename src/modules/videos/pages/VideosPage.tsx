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
    <Box>
      <motion.div
        initial={{ opacity: 0, x: -18 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45 }}
      >
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
            },
          }}
        >
          Regresar
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
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
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 3,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
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
        <Paper
          elevation={0}
          sx={{
            height: 300,
            borderRadius: 5,
            border: '1px dashed #CBD5E1',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 3,
          }}
        >
          <SearchOffIcon sx={{ fontSize: 76, color: '#94A3B8' }} />

          <Typography mt={2} fontWeight="900" color="#090979">
            Sin video tutoriales
          </Typography>

          <Typography color="text.secondary">
            Cuando se agreguen videos aparecerán aquí.
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
              xl: 'repeat(3, 1fr)',
            },
            gap: 3,
          }}
        >
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 34, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.48, delay: index * 0.11 }}
              whileHover={{
                y: -8,
                scale: [1, 1.02, 1.01, 1.02],
                transition: {
                  scale: {
                    duration: 0.75,
                    repeat: Infinity,
                    repeatType: 'mirror',
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
                  height: '100%',
                  borderRadius: 5,
                  border: '1px solid #DCE5F3',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                  boxShadow: '0 16px 40px rgba(9, 9, 121, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    height: 220,
                    borderRadius: 4,
                    overflow: 'hidden',
                    background: '#000',
                    mb: 3,
                    border: '1px solid #DCE5F3',
                  }}
                >
                  <iframe
                    src={video.youtubeEmbedUrl}
                    title={video.title}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: 'none',
                      display: 'block',
                    }}
                  />
                </Box>

                <Typography fontWeight="900" color="#090979">
                  Tutorial {index + 1}: {video.title}
                </Typography>

                <Typography color="text.secondary" mt={1}>
                  {video.description}
                </Typography>

                <Chip
                  icon={<PersonIcon sx={{ fontSize: '16px !important' }} />}
                  label={`Subido por: ${video.createdByName}`}
                  size="small"
                  sx={{
                    mt: 2,
                    background: '#EEF3FF',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PlayCircleFilledIcon />}
                  onClick={() => setSelectedVideo(video)}
                  sx={{
                    mt: 3,
                    height: 48,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 900,
                    background:
                      'linear-gradient(135deg, #090979 0%, #1D4ED8 100%)',
                    '&:hover': {
                      background:
                        'linear-gradient(135deg, #070760 0%, #1E40AF 100%)',
                    },
                  }}
                >
                  Ver tutorial
                </Button>
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

              <IconButton onClick={() => setSelectedVideo(null)}>
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
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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