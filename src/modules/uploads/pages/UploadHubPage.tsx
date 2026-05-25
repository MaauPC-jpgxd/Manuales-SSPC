import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
  Chip,
} from '@mui/material'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import InventoryIcon from '@mui/icons-material/Inventory'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'

const uploadCards = [
  {
    title: 'Subir manual',
    description:
      'Carga manuales corporativos en PDF para enviarlos a revisión.',
    icon: <DescriptionIcon sx={{ fontSize: 42 }} />,
    path: '/subir-manual',
    tag: 'Requiere revisión',
  },
  {
    title: 'Subir inventario',
    description:
      'Carga inventarios en PDF indicando el periodo al que pertenecen.',
    icon: <InventoryIcon sx={{ fontSize: 42 }} />,
    path: '/subir/inventario',
    tag: 'Publicación directa',
  },
  {
    title: 'Subir tickets resueltos',
    description:
      'Carga reportes semanales de tickets resueltos en PDF.',
    icon: <ConfirmationNumberIcon sx={{ fontSize: 42 }} />,
    path: '/subir/tickets',
    tag: 'Semanal',
  },
  {
    title: 'Subir video tutorial',
    description:
      'Agrega un tutorial mediante un enlace privado o no listado de YouTube.',
    icon: <PlayCircleFilledIcon sx={{ fontSize: 42 }} />,
    path: '/subir/videos',
    tag: 'YouTube',
  },
]

export default function UploadHubPage() {
  const navigate = useNavigate()

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
          <Box className="flex items-center gap-3">
            <Box
              sx={{
                width: 54,
                height: 54,
                borderRadius: 3,
                background: '#EEF3FF',
                color: '#090979',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUploadIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Centro de carga documental
              </Typography>

              <Typography color="text.secondary">
                Selecciona el tipo de contenido que deseas subir al sistema.
              </Typography>
            </Box>
          </Box>

          <Chip
            label="ROOT / ADMIN"
            sx={{
              background: '#EEF3FF',
              color: '#090979',
              fontWeight: 800,
              border: '1px solid #DCE5F3',
            }}
          />
        </Box>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            xl: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {uploadCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.35,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            <Paper
              onClick={() => navigate(card.path)}
              elevation={0}
              sx={{
                p: 4,
                minHeight: 250,
                borderRadius: 5,
                cursor: 'pointer',
                border: '1px solid #DCE5F3',
                background:
                  'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                boxShadow:
                  '0 18px 45px rgba(9, 9, 121, 0.08)',
                transition: 'all 0.25s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                '&:hover': {
                  borderColor: '#090979',
                  boxShadow:
                    '0 24px 60px rgba(9, 9, 121, 0.16)',
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: 4,
                    background: '#EEF3FF',
                    color: '#090979',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  {card.icon}
                </Box>

                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#090979"
                >
                  {card.title}
                </Typography>

                <Typography
                  color="text.secondary"
                  mt={1}
                >
                  {card.description}
                </Typography>
              </Box>

              <Chip
                label={card.tag}
                size="small"
                sx={{
                  mt: 3,
                  width: 'fit-content',
                  background: '#EEF3FF',
                  color: '#090979',
                  fontWeight: 800,
                }}
              />
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  )
}