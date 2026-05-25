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

import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
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

export default function TicketsPage() {
  const navigate = useNavigate()

  const [tickets, setTickets] = useState<Manual[]>([])
  const [loading, setLoading] = useState(true)

  const [weekStart, setWeekStart] = useState('')
  const [weekEnd, setWeekEnd] = useState('')

  const [selectedTicket, setSelectedTicket] =
    useState<Manual | null>(null)

  const loadTickets = async () => {
    try {
      setLoading(true)

      const data = await getApprovedManuals()

      const onlyTickets = data.filter(
        (item) => item.category === 'TICKETS',
      )

      setTickets(onlyTickets)
    } catch (error) {
      console.error(error)
      alert('No se pudieron cargar los tickets resueltos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  const filteredTickets = useMemo(() => {
    return tickets.filter((item) => {
      const itemStart = item.startDate ?? ''
      const itemEnd = item.endDate ?? ''

      if (weekStart && itemEnd < weekStart) {
        return false
      }

      if (weekEnd && itemStart > weekEnd) {
        return false
      }

      return true
    })
  }, [
    tickets,
    weekStart,
    weekEnd,
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
              <ConfirmationNumberIcon />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Tickets resueltos
              </Typography>

              <Typography color="text.secondary">
                Consulta reportes semanales de tickets cerrados y documentados.
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
            label={`${filteredTickets.length} reporte${
              filteredTickets.length === 1 ? '' : 's'
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
          Filtrar por semana de tickets
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
            },
            gap: 2,
          }}
        >
          <TextField
            label="Inicio de semana"
            type="date"
            value={weekStart}
            onChange={(event) =>
              setWeekStart(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <TextField
            label="Fin de semana"
            type="date"
            value={weekEnd}
            onChange={(event) =>
              setWeekEnd(event.target.value)
            }
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />

          <Button
            variant="outlined"
            onClick={() => {
              setWeekStart('')
              setWeekEnd('')
            }}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              borderColor: '#090979',
              color: '#090979',
              fontWeight: 800,
            }}
          >
            Limpiar filtro
          </Button>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          mt={2}
        >
          El filtro busca por la semana a la que pertenece el reporte, no por la fecha de subida.
        </Typography>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando tickets resueltos...
        </Typography>
      ) : filteredTickets.length === 0 ? (
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
          <ConfirmationNumberIcon
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
            Sin reportes encontrados
          </Typography>

          <Typography color="text.secondary">
            No hay documentación de tickets para esa semana.
          </Typography>
        </Paper>
      ) : (
        <Box className="flex flex-col gap-4">
          {filteredTickets.map((ticket, index) => (
            <Paper
              key={ticket.id}
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
                  <ConfirmationNumberIcon />
                </Box>

                <Box>
                  <Typography fontWeight="900" color="#090979">
                    Reporte {index + 1}: {ticket.title}
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
                      label={`Semana: ${formatDate(
                        ticket.startDate,
                      )} - ${formatDate(ticket.endDate)}`}
                      size="small"
                      sx={{
                        background: '#EEF3FF',
                        color: '#090979',
                        fontWeight: 800,
                      }}
                    />

                    <Chip
                      label={`Subido: ${formatCreatedAt(
                        ticket.createdAt,
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
                    setSelectedTicket(ticket)
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
                  href={ticket.fileUrl}
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
        open={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        fullScreen
      >
        {selectedTicket && (
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
                  {selectedTicket.title}
                </Typography>

                <Box className="flex gap-2 flex-wrap mt-1">
                  <Chip
                    label={`Semana: ${formatDate(
                      selectedTicket.startDate,
                    )} - ${formatDate(selectedTicket.endDate)}`}
                    size="small"
                    sx={{
                      background: '#EEF3FF',
                      color: '#090979',
                      fontWeight: 800,
                    }}
                  />

                  <Chip
                    label={`Subido: ${formatCreatedAt(
                      selectedTicket.createdAt,
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
                  href={selectedTicket.fileUrl}
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

                <IconButton onClick={() => setSelectedTicket(null)}>
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
                src={selectedTicket.fileUrl}
                title={selectedTicket.title}
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