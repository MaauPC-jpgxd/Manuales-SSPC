import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type {
  Manual,
} from '@/modules/manuals/types/manual.types'

import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material'

import InventoryIcon from '@mui/icons-material/Inventory'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CloudDoneIcon from '@mui/icons-material/CloudDone'

import {
  getApprovedManuals,
} from '@/modules/manuals/services/manuals.service'

const formatDate = (date?: string | null) => {
  if (!date) return 'Sin fecha'

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    'es-MX',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    },
  )
}

const formatCreatedAt = (createdAt: unknown) => {
  if (
    createdAt &&
    typeof createdAt === 'object' &&
    'toDate' in createdAt &&
    typeof createdAt.toDate === 'function'
  ) {
    return createdAt.toDate().toLocaleDateString(
      'es-MX',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    )
  }

  return 'Sin fecha de subida'
}

export default function InventoryPage() {
  const navigate = useNavigate()

  const [inventories, setInventories] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)
  const [filterDate, setFilterDate] = useState('')

  const [selectedInventory, setSelectedInventory] =
    useState<Manual | null>(null)

  const loadInventories = async () => {
    try {
      setLoading(true)

      const data = await getApprovedManuals()

      const onlyInventories = data.filter(
        (item) => item.category === 'INVENTARIO',
      )

      setInventories(onlyInventories)
    } catch (error) {
      console.error(error)
      alert('No se pudieron cargar los inventarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventories()
  }, [])

  const filteredInventories = useMemo(() => {
    if (!filterDate) return inventories

    return inventories.filter((item) => item.startDate === filterDate)
  }, [
    inventories,
    filterDate,
  ])

  return (
    <Box>
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
          borderRadius: 3,
          textTransform: 'none',
          borderColor: '#090979',
          color: '#090979',
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
              <InventoryIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Inventario PDF
              </Typography>

              <Typography color="text.secondary">
                Consulta inventarios diarios publicados por fecha.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={
              <CloudDoneIcon
                sx={{
                  fontSize: '16px !important',
                }}
              />
            }
            label={`${filteredInventories.length} inventario${
              filteredInventories.length === 1 ? '' : 's'
            }`}
            sx={{
              background: '#EAF7EF',
              color: '#157347',
              fontWeight: 800,
              border: '1px solid #A7E0BC',
            }}
          />
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          border: '1px solid #DCE5F3',
          background: '#FFFFFF',
          boxShadow: '0 12px 35px rgba(9, 9, 121, 0.06)',
        }}
      >
        <Typography
          fontWeight="900"
          color="#090979"
          mb={2}
        >
          Filtrar por fecha del inventario
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 180px',
            },
            gap: 2,
          }}
        >
          <TextField
            label="Fecha del inventario"
            type="date"
            value={filterDate}
            onChange={(event) =>
              setFilterDate(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <Button
            variant="outlined"
            onClick={() => setFilterDate('')}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              borderColor: '#090979',
              color: '#090979',
              fontWeight: 800,
            }}
          >
            Limpiar
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={2}
        >
          El filtro busca únicamente por la fecha del inventario, no por la fecha de subida.
        </Typography>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando inventarios...
        </Typography>
      ) : filteredInventories.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            height: 280,
            borderRadius: 4,
            border: '1px dashed #CBD5E1',
            background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <InventoryIcon
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
            Sin inventarios encontrados
          </Typography>

          <Typography color="text.secondary">
            No hay inventarios publicados para esa fecha.
          </Typography>
        </Paper>
      ) : (
        <Box className="flex flex-col gap-4">
          {filteredInventories.map((inventory, index) => (
            <Paper
              key={inventory.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: '1px solid #DCE5F3',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                flexWrap: 'wrap',
                boxShadow:
                  '0 12px 35px rgba(9, 9, 121, 0.06)',
              }}
            >
              <Box className="flex items-center gap-4">
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
                  <InventoryIcon />
                </Box>

                <Box>
                  <Typography fontWeight="900" color="#090979">
                    Inventario {index + 1}: {inventory.title}
                  </Typography>

                  <Box className="flex gap-2 flex-wrap mt-2">
                    <Chip
                      icon={
                        <CalendarMonthIcon
                          sx={{
                            fontSize: '16px !important',
                          }}
                        />
                      }
                      label={`Fecha: ${formatDate(inventory.startDate)}`}
                      size="small"
                      sx={{
                        background: '#EEF3FF',
                        color: '#090979',
                        fontWeight: 800,
                      }}
                    />

                    <Chip
                      label={`Subido: ${formatCreatedAt(
                        inventory.createdAt,
                      )}`}
                      size="small"
                      sx={{
                        background: '#EAF7EF',
                        color: '#157347',
                        fontWeight: 800,
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              <Box className="flex gap-2 flex-wrap">
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    setSelectedInventory(inventory)
                  }
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#090979',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                >
                  Ver
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={inventory.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#090979',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                >
                  Descargar
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <Dialog
        open={!!selectedInventory}
        onClose={() => setSelectedInventory(null)}
        fullScreen
      >
        {selectedInventory && (
          <>
            <DialogTitle
              sx={{
                flexShrink: 0,
                px: 3,
                py: 2,
                borderBottom: '1px solid #DCE5F3',
                background: '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="900"
                  color="#090979"
                >
                  {selectedInventory.title}
                </Typography>

                <Box className="flex gap-2 flex-wrap mt-1">
                  <Chip
                    label={`Fecha: ${formatDate(
                      selectedInventory.startDate,
                    )}`}
                    size="small"
                    sx={{
                      background: '#EEF3FF',
                      color: '#090979',
                      fontWeight: 800,
                    }}
                  />

                  <Chip
                    label={`Subido: ${formatCreatedAt(
                      selectedInventory.createdAt,
                    )}`}
                    size="small"
                    sx={{
                      background: '#EAF7EF',
                      color: '#157347',
                      fontWeight: 800,
                    }}
                  />
                </Box>
              </Box>

              <Box className="flex items-center gap-2">
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  href={selectedInventory.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    borderColor: '#090979',
                    color: '#090979',
                    fontWeight: 800,
                  }}
                >
                  Descargar
                </Button>

                <IconButton onClick={() => setSelectedInventory(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background: '#EEF3FF',
                height: 'calc(100vh - 88px)',
                overflow: 'hidden',
              }}
            >
              <iframe
                src={selectedInventory.fileUrl}
                title={selectedInventory.title}
                width="100%"
                height="100%"
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