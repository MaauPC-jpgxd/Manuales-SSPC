import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
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

import type {
  VideoTutorial,
} from '../types/video.types'

import {
  getVideoTutorials,
} from '../services/videos.service'

export default function VideosPage() {

  const navigate = useNavigate()

  const [videos, setVideos] =
    useState<VideoTutorial[]>([])

  const [loading, setLoading] =
    useState(true)

  const [selectedVideo, setSelectedVideo] =
    useState<VideoTutorial | null>(null)

  const loadVideos = async () => {

    try {

      setLoading(true)

      const data =
        await getVideoTutorials()

      setVideos(data)

    } catch (error) {

      console.error(error)

      alert(
        'No se pudieron cargar los video tutoriales',
      )

    } finally {

      setLoading(false)
    }
  }

  useEffect(() => {
    loadVideos()
  }, [])

  return (

    <Box>

      <Button
        variant="outlined"

        startIcon={
          <ArrowBackIcon />
        }

        onClick={() =>
          navigate(
            '/dashboard',
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
            '1px solid #DCE5F3',

          background:
            'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
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
                  '#EEF3FF',

                color:
                  '#090979',

                display:
                  'flex',

                alignItems:
                  'center',

                justifyContent:
                  'center',
              }}
            >

              <PlayCircleFilledIcon />

            </Box>

            <Box>

              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Video tutoriales
              </Typography>

              <Typography color="text.secondary">
                Consulta videos de capacitación y soporte corporativo.
              </Typography>

            </Box>

          </Box>

        </Box>

      </Paper>

      {loading ? (

        <Typography color="text.secondary">
          Cargando video tutoriales...
        </Typography>

      ) : videos.length === 0 ? (

        <Paper
          elevation={0}

          sx={{
            height: 280,
            borderRadius: 4,

            border:
              '1px dashed #CBD5E1',

            background:
              '#FFFFFF',

            display: 'flex',
            flexDirection: 'column',

            alignItems: 'center',
            justifyContent: 'center',
          }}
        >

          <PlayCircleFilledIcon
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
            Sin video tutoriales
          </Typography>

          <Typography color="text.secondary">
            Cuando se agreguen videos aparecerán aquí.
          </Typography>

        </Paper>

      ) : (

        <Box
          className="
            flex
            flex-col
            gap-4
          "
        >

          {videos.map(
            (
              video,
              index,
            ) => (

              <Paper
                key={video.id}
                elevation={0}

                sx={{
                  p: 3,
                  borderRadius: 4,

                  border:
                    '1px solid #DCE5F3',

                  background:
                    '#FFFFFF',

                  display: 'flex',

                  alignItems:
                    'center',

                  justifyContent:
                    'space-between',

                  gap: 2,

                  flexWrap:
                    'wrap',

                  boxShadow:
                    '0 12px 35px rgba(9, 9, 121, 0.06)',
                }}
              >

                <Box
                  className="
                    flex
                    items-center
                    gap-4
                  "
                >

                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: 3,

                      background:
                        '#EEF3FF',

                      color:
                        '#090979',

                      display:
                        'flex',

                      alignItems:
                        'center',

                      justifyContent:
                        'center',
                    }}
                  >

                    <PlayCircleFilledIcon />

                  </Box>

                  <Box>

                    <Typography
                      fontWeight="900"
                      color="#090979"
                    >
                      Tutorial {index + 1}:{' '}
                      {video.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {video.description}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Subido por:{' '}
                      {video.createdByName}
                    </Typography>

                  </Box>

                </Box>

                <Button
                  variant="outlined"

                  startIcon={
                    <PlayCircleFilledIcon />
                  }

                  onClick={() =>
                    setSelectedVideo(video)
                  }

                  sx={{
                    borderRadius: 3,

                    textTransform:
                      'none',

                    borderColor:
                      '#090979',

                    color:
                      '#090979',

                    fontWeight:
                      800,
                  }}
                >
                  Ver tutorial
                </Button>

              </Paper>
            ),
          )}

        </Box>
      )}

      <Dialog
        open={
          !!selectedVideo
        }

        onClose={() =>
          setSelectedVideo(null)
        }

        fullScreen
      >

        {selectedVideo && (

          <>

            <DialogTitle
              sx={{
                flexShrink: 0,

                px: 3,
                py: 2,

                borderBottom:
                  '1px solid #DCE5F3',

                display: 'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'center',

                gap: 2,
              }}
            >

              <Box>

                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#090979"
                >
                  {selectedVideo.title}
                </Typography>

                <Typography color="text.secondary">
                  {selectedVideo.description}
                </Typography>

              </Box>

              <IconButton
                onClick={() =>
                  setSelectedVideo(null)
                }
              >
                <CloseIcon />
              </IconButton>

            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background: '#000',
                height:
                  'calc(100vh - 88px)',
              }}
            >

              <iframe
                src={
                  selectedVideo.youtubeEmbedUrl
                }

                title={
                  selectedVideo.title
                }

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