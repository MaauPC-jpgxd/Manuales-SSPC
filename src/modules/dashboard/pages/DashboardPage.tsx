import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Paper,
  Typography,
} from '@mui/material'

import DescriptionIcon from '@mui/icons-material/Description'
import InventoryIcon from '@mui/icons-material/Inventory'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import BlockIcon from '@mui/icons-material/Block'

import { useAuthStore } from '@/modules/auth/store/auth.store'
import { UserRole } from '@/types/roles'
import PlayCircleFilledIcon
from '@mui/icons-material/PlayCircleFilled'
const baseCards = [
  {
    title: 'Manuales',
    description: 'Consulta manuales corporativos aprobados.',
    icon: <DescriptionIcon sx={{ fontSize: 42 }} />,
    path: '/manuales',
    roles: [
      UserRole.ROOT,
      UserRole.ADMIN,
      UserRole.LECTOR,
    ],
  },
  {
    title: 'Inventario PDF',
    description: 'Consulta reportes de inventario por periodo.',
    icon: <InventoryIcon sx={{ fontSize: 42 }} />,
    path: '/inventario',
    roles: [
      UserRole.ROOT,
      UserRole.ADMIN,
      UserRole.LECTOR,
    ],
  },
  {
    title: 'Tickets resueltos',
    description: 'Consulta documentación de tickets cerrados.',
    icon: <ConfirmationNumberIcon sx={{ fontSize: 42 }} />,
    path: '/tickets',
    roles: [
      UserRole.ROOT,
      UserRole.ADMIN,
      UserRole.LECTOR,
    ],
  },
  {
  title: 'Video tutoriales',

  description:
    'Consulta videos de capacitación y soporte corporativo.',

  icon: (
    <PlayCircleFilledIcon
      sx={{
        fontSize: 42,
      }}
    />
  ),

  path: '/videos',

  roles: [
    UserRole.ROOT,
    UserRole.ADMIN,
    UserRole.LECTOR,
  ],
},
  {
    title: 'Rechazados',
    description: 'Consulta documentos rechazados.',
    icon: <BlockIcon sx={{ fontSize: 42 }} />,
    path: '/rechazados',
    roles: [
      UserRole.ROOT,
      UserRole.ADMIN,
    ],
  },
]

export default function DashboardPage() {
  const navigate = useNavigate()

  const user = useAuthStore(
    (state) => state.user,
  )

  const cards = baseCards.filter((card) =>
    user ? card.roles.includes(user.role) : false,
  )

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
        <Typography
          variant="h5"
          fontWeight="900"
          color="#090979"
        >
          Panel documental
        </Typography>

        <Typography color="text.secondary">
          Selecciona el módulo que deseas consultar.
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(3, 1fr)',
          },
          gap: 3,
        }}
      >
        {cards.map((card, index) => (
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
                minHeight: 220,
                borderRadius: 5,
                cursor: 'pointer',
                border: '1px solid #DCE5F3',
                background:
                  card.title === 'Rechazados'
                    ? 'linear-gradient(135deg, #FFF8F8 0%, #FFFFFF 100%)'
                    : 'linear-gradient(135deg, #FFFFFF 0%, #F8FAFF 100%)',
                boxShadow:
                  '0 18px 45px rgba(9, 9, 121, 0.08)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  borderColor:
                    card.title === 'Rechazados'
                      ? '#B42318'
                      : '#090979',
                  boxShadow:
                    '0 24px 60px rgba(9, 9, 121, 0.16)',
                },
              }}
            >
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 4,
                  background:
                    card.title === 'Rechazados'
                      ? '#FDECEC'
                      : '#EEF3FF',
                  color:
                    card.title === 'Rechazados'
                      ? '#B42318'
                      : '#090979',
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
                color={
                  card.title === 'Rechazados'
                    ? '#B42318'
                    : '#090979'
                }
              >
                {card.title}
              </Typography>

              <Typography
                color="text.secondary"
                mt={1}
              >
                {card.description}
              </Typography>
            </Paper>
          </motion.div>
        ))}
      </Box>
    </Box>
  )
}