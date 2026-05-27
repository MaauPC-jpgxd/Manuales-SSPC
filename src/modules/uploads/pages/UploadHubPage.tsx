import { type ReactNode } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import InventoryIcon from '@mui/icons-material/Inventory'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import ArticleIcon from '@mui/icons-material/Article'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

import { useAuthStore } from '@/modules/auth/store/auth.store'
import { UserRole } from '@/types/roles'

interface UploadCard {
  title: string
  description: string
  icon: ReactNode
  path: string
  tag: string
  rootOnly?: boolean
}

const uploadCards: UploadCard[] = [
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
      'Carga inventarios diarios en PDF indicando la fecha correspondiente.',
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
      'Agrega un tutorial mediante un enlace no listado de YouTube.',
    icon: <PlayCircleFilledIcon sx={{ fontSize: 42 }} />,
    path: '/subir/videos',
    tag: 'YouTube no listado',
  },
  {
    title: 'Subir formato',
    description:
      'Actualiza el formato autorizado que todos los usuarios pueden consultar.',
    icon: <ArticleIcon sx={{ fontSize: 42 }} />,
    path: '/subir/formato',
    tag: 'Solo ROOT',
    rootOnly: true,
  },
]

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

export default function UploadHubPage() {
  const navigate = useNavigate()

  const user = useAuthStore((state) => state.user)
  const previewRole = useAuthStore((state) => state.previewRole)

  const effectiveRole = previewRole ?? user?.role

  const visibleCards = uploadCards.filter((card) =>
    card.rootOnly ? effectiveRole === UserRole.ROOT : true,
  )

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
            <Box
              sx={{
                display: 'flex',
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },
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
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                    flexShrink: 0,
                  }}
                >
                  <CloudUploadIcon sx={{ fontSize: 34 }} />
                </Box>

                <Box>
                  <Chip
                    label="Centro de carga"
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
                    Centro de carga documental
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={700}>
                    Selecciona el tipo de contenido que deseas subir al sistema.
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={effectiveRole === UserRole.ROOT ? 'ROOT' : 'ADMIN'}
                sx={{
                  background: '#EEF3FF',
                  color: '#090979',
                  fontWeight: 900,
                  border: '1px solid #DCE5F3',
                  height: 36,
                  px: 1,
                }}
              />
            </Box>
          </Box>
        </Paper>
      </motion.div>

      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
        {visibleCards.map((card) => {
          const mainColor = card.rootOnly ? '#157347' : '#090979'
          const softBg = card.rootOnly ? '#EAF7EF' : '#EEF3FF'
          const borderColor = card.rootOnly ? '#A7E0BC' : '#DCE5F3'
          const cardBg = card.rootOnly
            ? 'linear-gradient(135deg, #FFFFFF 0%, #F1FFF6 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)'

          return (
            <motion.div
              key={card.title}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: [1, 1.035, 1.015, 1.03],
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
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(card.path)}
              style={{ cursor: 'pointer' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  minHeight: 250,
                  height: '100%',
                  borderRadius: 5,
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                  boxShadow: '0 18px 45px rgba(9, 9, 121, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0))',
                    opacity: 0.8,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    right: -55,
                    bottom: -55,
                    background: softBg,
                    opacity: 0.8,
                    transition: 'all 0.25s ease',
                  },
                  '&:hover': {
                    borderColor: mainColor,
                    boxShadow: '0 28px 70px rgba(9, 9, 121, 0.17)',
                  },
                  '&:hover::after': {
                    transform: 'scale(1.2)',
                  },
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: [0, 0.55, 0],
                    scale: [0.92, 1.18, 1.35],
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
                    border: `2px solid ${mainColor}`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                <Box
                  component={motion.div}
                  whileHover={{
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  sx={{
                    position: 'absolute',
                    top: 18,
                    right: 18,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: mainColor,
                    boxShadow: `0 0 0 6px ${softBg}`,
                    opacity: 0.2,
                    zIndex: 2,
                  }}
                />

                <Box sx={{ position: 'relative', zIndex: 1 }}>
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
                      width: 76,
                      height: 76,
                      borderRadius: 4,
                      background: softBg,
                      color: mainColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow:
                        'inset 0 0 0 1px rgba(255,255,255,0.7)',
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography variant="h6" fontWeight="900" color={mainColor}>
                    {card.title}
                  </Typography>

                  <Typography color="text.secondary" mt={1} minHeight={48}>
                    {card.description}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Chip
                    label={card.tag}
                    size="small"
                    sx={{
                      background: softBg,
                      color: mainColor,
                      fontWeight: 800,
                    }}
                  />

                  <Box
                    component={motion.div}
                    whileHover={{
                      x: [0, 6, 0],
                    }}
                    transition={{
                      duration: 0.65,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: '50%',
                      background: softBg,
                      color: mainColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <ArrowForwardIcon />
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          )
        })}
      </Box>
    </Box>
  )
}