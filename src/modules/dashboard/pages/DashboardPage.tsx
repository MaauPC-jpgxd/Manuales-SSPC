import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Box, Paper, Typography, Chip } from '@mui/material'

import DescriptionIcon from '@mui/icons-material/Description'
import InventoryIcon from '@mui/icons-material/Inventory'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import BlockIcon from '@mui/icons-material/Block'
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled'
import ArticleIcon from '@mui/icons-material/Article'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize'

import { useAuthStore } from '@/modules/auth/store/auth.store'
import { UserRole } from '@/types/roles'

const baseCards = [
  {
    title: 'Manuales',
    description: 'Consulta manuales corporativos aprobados.',
    icon: <DescriptionIcon sx={{ fontSize: 42 }} />,
    path: '/manuales',
    roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.LECTOR],
  },
  {
    title: 'Inventario PDF',
    description: 'Consulta inventarios diarios por fecha.',
    icon: <InventoryIcon sx={{ fontSize: 42 }} />,
    path: '/inventario',
    roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.LECTOR],
  },
  {
    title: 'Tickets resueltos',
    description: 'Consulta documentación semanal de tickets cerrados.',
    icon: <ConfirmationNumberIcon sx={{ fontSize: 42 }} />,
    path: '/tickets',
    roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.LECTOR],
  },
  {
    title: 'Video tutoriales',
    description: 'Consulta videos de capacitación y soporte corporativo.',
    icon: <PlayCircleFilledIcon sx={{ fontSize: 42 }} />,
    path: '/videos',
    roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.LECTOR],
  },
  {
    title: 'Formato autorizado',
    description: 'Consulta la plantilla corporativa oficial actualizada.',
    icon: <ArticleIcon sx={{ fontSize: 42 }} />,
    path: '/formato',
    roles: [UserRole.ROOT, UserRole.ADMIN, UserRole.LECTOR],
  },
  {
    title: 'Rechazados',
    description: 'Consulta documentos rechazados.',
    icon: <BlockIcon sx={{ fontSize: 42 }} />,
    path: '/rechazados',
    roles: [UserRole.ROOT, UserRole.ADMIN],
  },
]

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

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)

  const cards = baseCards.filter((card) =>
    user ? card.roles.includes(user.role) : false,
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
            <Chip
              icon={<DashboardCustomizeIcon />}
              label="Centro documental"
              sx={{
                mb: 2,
                fontWeight: 800,
                color: '#090979',
                background: '#EEF3FF',
                border: '1px solid #DCE5F3',
              }}
            />

            <Typography variant="h4" fontWeight="900" color="#090979">
              Panel documental
            </Typography>

            <Typography color="text.secondary" mt={1} maxWidth={650}>
              Selecciona el módulo que deseas consultar dentro de la base de conocimiento corporativa.
            </Typography>
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
            xl: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {cards.map((card) => {
          const isRejected = card.title === 'Rechazados'
          const isFormat = card.title === 'Formato autorizado'

          const mainColor = isRejected
            ? '#B42318'
            : isFormat
              ? '#157347'
              : '#090979'

          const softBg = isRejected
            ? '#FDECEC'
            : isFormat
              ? '#EAF7EF'
              : '#EEF3FF'

          const borderColor = isRejected
            ? '#F3C7C7'
            : isFormat
              ? '#A7E0BC'
              : '#DCE5F3'

          const cardBg = isRejected
            ? 'linear-gradient(135deg, #FFF8F8 0%, #FFFFFF 100%)'
            : isFormat
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
                  borderRadius: 5,
                  border: `1px solid ${borderColor}`,
                  background: cardBg,
                  boxShadow: '0 18px 45px rgba(9, 9, 121, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition:
                    'border-color 0.25s ease, box-shadow 0.25s ease',
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

                  <Box
                    sx={{
                      mt: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Chip
                      label="Abrir módulo"
                      size="small"
                      sx={{
                        color: mainColor,
                        background: softBg,
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
                      }}
                    >
                      <ArrowForwardIcon />
                    </Box>
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