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

import { useAuthStore } from '@/modules/auth/store/auth.store'

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'

export default function RolePreviewPage() {
  const user = useAuthStore((state) => state.user)
  const previewRole = useAuthStore((state) => state.previewRole)
  const setPreviewRole = useAuthStore((state) => state.setPreviewRole)

  if (!isLocalhost) {
    return (
      <Box>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: '1px solid #F3C7C7',
            background: '#FFF8F8',
          }}
        >
          <Typography variant="h5" fontWeight="900" color="#B42318">
            Función disponible solo en localhost
          </Typography>

          <Typography color="text.secondary" mt={1}>
            Esta herramienta solo funciona en entorno local para pruebas de
            desarrollo.
          </Typography>
        </Paper>
      </Box>
    )
  }

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
        <Typography variant="h5" fontWeight="900" color="#090979">
          Ver como
        </Typography>

        <Typography color="text.secondary">
          Simula visualmente cómo ve el sistema un ROOT, ADMIN o LECTOR.
        </Typography>

        <Box className="flex gap-2 flex-wrap mt-3">
          <Chip label={`Usuario real: ${user?.role}`} />
          <Chip
            label={`Vista actual: ${previewRole ?? user?.role}`}
            sx={{
              background: '#EEF3FF',
              color: '#090979',
              fontWeight: 800,
            }}
          />
        </Box>
      </Paper>

      <Box className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          variant="outlined"
          startIcon={<AdminPanelSettingsIcon />}
          onClick={() => setPreviewRole('ROOT')}
          sx={{
            height: 90,
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 900,
          }}
        >
          Ver como ROOT
        </Button>

        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={() => setPreviewRole('ADMIN')}
          sx={{
            height: 90,
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 900,
          }}
        >
          Ver como ADMIN
        </Button>

        <Button
          variant="outlined"
          startIcon={<MenuBookIcon />}
          onClick={() => setPreviewRole('LECTOR')}
          sx={{
            height: 90,
            borderRadius: 4,
            textTransform: 'none',
            fontWeight: 900,
          }}
        >
          Ver como LECTOR
        </Button>
      </Box>

      <Button
        startIcon={<RestartAltIcon />}
        onClick={() => setPreviewRole(null)}
        sx={{
          mt: 4,
          textTransform: 'none',
          color: '#090979',
          fontWeight: 900,
        }}
      >
        Volver a mi rol real
      </Button>
    </Box>
  )
}