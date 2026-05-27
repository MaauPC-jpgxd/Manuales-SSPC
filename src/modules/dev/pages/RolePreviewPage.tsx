import { motion } from 'framer-motion'

import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material'

import VisibilityIcon from '@mui/icons-material/Visibility'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import RestartAltIcon from '@mui/icons-material/RestartAlt'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ShieldIcon from '@mui/icons-material/Shield'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'

import { useAuthStore } from '@/modules/auth/store/auth.store'

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

const roleCards = [
  {
    role: 'ROOT',
    title: 'Ver como ROOT',
    description: 'Vista completa del sistema con todos los permisos.',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 42 }} />,
    color: '#157347',
    softBg: '#EAF7EF',
    border: '#A7E0BC',
  },
  {
    role: 'ADMIN',
    title: 'Ver como ADMIN',
    description: 'Vista administrativa para carga y consulta documental.',
    icon: <VisibilityIcon sx={{ fontSize: 42 }} />,
    color: '#090979',
    softBg: '#EEF3FF',
    border: '#DCE5F3',
  },
  {
    role: 'LECTOR',
    title: 'Ver como LECTOR',
    description: 'Vista de consulta para usuarios con acceso de lectura.',
    icon: <MenuBookIcon sx={{ fontSize: 42 }} />,
    color: '#7A4F01',
    softBg: '#FFF7E0',
    border: '#F6D98B',
  },
] as const

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

export default function RolePreviewPage() {
  const user = useAuthStore((state) => state.user)
  const previewRole = useAuthStore((state) => state.previewRole)
  const setPreviewRole = useAuthStore((state) => state.setPreviewRole)

  if (!isLocalhost) {
    return (
      <Box sx={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 5,
              border: '1px solid #F3C7C7',
              background: 'linear-gradient(135deg, #FFF8F8 0%, #FFFFFF 100%)',
              boxShadow: '0 22px 55px rgba(180, 35, 24, 0.08)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              component={motion.div}
              animate={{
                scale: [1, 1.12, 1],
                opacity: [0.35, 0.65, 0.35],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              sx={{
                position: 'absolute',
                width: 220,
                height: 220,
                borderRadius: '50%',
                right: -80,
                top: -90,
                background:
                  'radial-gradient(circle, rgba(180,35,24,0.18) 0%, rgba(180,35,24,0) 70%)',
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                icon={<WarningAmberIcon sx={{ fontSize: '16px !important' }} />}
                label="Entorno restringido"
                sx={{
                  mb: 2,
                  fontWeight: 900,
                  color: '#B42318',
                  background: '#FDECEC',
                  border: '1px solid #F3C7C7',
                }}
              />

              <Typography variant="h4" fontWeight="900" color="#B42318">
                Función disponible solo en localhost
              </Typography>

              <Typography color="text.secondary" mt={1} maxWidth={720}>
                Esta herramienta solo funciona en entorno local para pruebas de desarrollo.
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    )
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
                  <PersonSearchIcon sx={{ fontSize: 34 }} />
                </Box>

                <Box>
                  <Chip
                    icon={<ShieldIcon sx={{ fontSize: '16px !important' }} />}
                    label="Modo de prueba"
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
                    Ver como
                  </Typography>

                  <Typography color="text.secondary" mt={1} maxWidth={720}>
                    Simula visualmente cómo ve el sistema un ROOT, ADMIN o LECTOR.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  gap: 1.2,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Chip
                  label={`Usuario real: ${user?.role}`}
                  sx={{
                    background: '#FFFFFF',
                    color: '#090979',
                    fontWeight: 900,
                    border: '1px solid #DCE5F3',
                  }}
                />

                <Chip
                  label={`Vista actual: ${previewRole ?? user?.role}`}
                  sx={{
                    background: '#EEF3FF',
                    color: '#090979',
                    fontWeight: 900,
                    border: '1px solid #DCE5F3',
                  }}
                />
              </Box>
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
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {roleCards.map((card) => {
          const activeRole = previewRole ?? user?.role
          const isActive = activeRole === card.role

          return (
            <motion.div
              key={card.role}
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
              onClick={() => setPreviewRole(card.role)}
              style={{ cursor: 'pointer' }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  minHeight: 260,
                  height: '100%',
                  borderRadius: 5,
                  border: `1px solid ${isActive ? card.color : card.border}`,
                  background: isActive
                    ? `linear-gradient(135deg, ${card.softBg} 0%, #FFFFFF 100%)`
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                  boxShadow: isActive
                    ? `0 24px 65px rgba(9, 9, 121, 0.16)`
                    : '0 18px 45px rgba(9, 9, 121, 0.08)',
                  position: 'relative',
                  overflow: 'hidden',
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
                    background: card.softBg,
                    opacity: 0.85,
                    transition: 'all 0.25s ease',
                  },
                  '&:hover': {
                    borderColor: card.color,
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
                    border: `2px solid ${card.color}`,
                    pointerEvents: 'none',
                    zIndex: 0,
                  }}
                />

                {isActive && (
                  <Box
                    component={motion.div}
                    animate={{
                      scale: [1, 1.45, 1],
                      opacity: [0.45, 0, 0.45],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                      ease: 'easeOut',
                    }}
                    sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: card.color,
                      boxShadow: `0 0 0 6px ${card.softBg}`,
                      zIndex: 2,
                    }}
                  />
                )}

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
                      background: card.softBg,
                      color: card.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.7)',
                    }}
                  >
                    {card.icon}
                  </Box>

                  <Typography variant="h6" fontWeight="900" color={card.color}>
                    {card.title}
                  </Typography>

                  <Typography color="text.secondary" mt={1} minHeight={48}>
                    {card.description}
                  </Typography>

                  <Chip
                    label={isActive ? 'Vista activa' : 'Cambiar vista'}
                    size="small"
                    sx={{
                      mt: 3,
                      background: card.softBg,
                      color: card.color,
                      fontWeight: 900,
                      border: `1px solid ${card.border}`,
                    }}
                  />
                </Box>
              </Paper>
            </motion.div>
          )
        })}
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35, ease: 'easeOut' }}
      >
        <Button
          component={motion.button}
          whileHover={{ y: -2, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          startIcon={<RestartAltIcon />}
          onClick={() => setPreviewRole(null)}
          sx={{
            mt: 4,
            height: 52,
            px: 3,
            borderRadius: 3,
            textTransform: 'none',
            color: '#090979',
            background: '#EEF3FF',
            border: '1px solid #DCE5F3',
            fontWeight: 900,
            boxShadow: '0 10px 25px rgba(9,9,121,0.08)',
            '&:hover': {
              background: '#E1EAFE',
              boxShadow: '0 16px 34px rgba(9,9,121,0.14)',
            },
          }}
        >
          Volver a mi rol real
        </Button>
      </motion.div>
    </Box>
  )
}