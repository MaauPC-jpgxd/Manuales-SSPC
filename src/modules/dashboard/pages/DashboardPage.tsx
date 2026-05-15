import { useEffect, useState } from 'react'

import type {
  Manual,
  ManualPriority,
} from '@/modules/manuals/types/manual.types'

import {
  Box,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
} from '@mui/material'

import DescriptionIcon from '@mui/icons-material/Description'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DownloadIcon from '@mui/icons-material/Download'
import CloseIcon from '@mui/icons-material/Close'
import VerifiedIcon from '@mui/icons-material/Verified'
import SchoolIcon from '@mui/icons-material/School'

import {
  getApprovedManuals,
} from '@/modules/manuals/services/manuals.service'

const getPriorityStyles = (
  priority?: ManualPriority,
) => {
  if (priority === 'ALTA') {
    return {
      label: '🔴 ALTA',
      background: '#FDECEC',
      color: '#B42318',
    }
  }

  if (priority === 'BAJA') {
    return {
      label: '🔵 BAJA',
      background: '#EEF3FF',
      color: '#090979',
    }
  }

  return {
    label: '🟡 MEDIA',
    background: '#FFF7E0',
    color: '#9A6700',
  }
}

export default function DashboardPage() {
  const [manuals, setManuals] =
    useState<Manual[]>([])

  const [loading, setLoading] =
    useState(true)

  const [selectedManual, setSelectedManual] =
    useState<Manual | null>(null)

  const loadManuals = async () => {
    try {
      setLoading(true)

      const data =
        await getApprovedManuals()

      setManuals(data)
    } catch (error) {
      console.error(error)

      alert(
        'No se pudieron cargar los manuales',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadManuals()
  }, [])

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
                background: '#EEF3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SchoolIcon
                sx={{
                  color: '#090979',
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="h5"
                fontWeight="900"
                color="#090979"
              >
                Manuales PDF
              </Typography>

              <Typography color="text.secondary">
                Consulta, visualiza y descarga documentación aprobada.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={
              <VerifiedIcon
                sx={{
                  fontSize:
                    '16px !important',
                }}
              />
            }
            label={`${manuals.length} publicado${
              manuals.length === 1
                ? ''
                : 's'
            }`}
            sx={{
              background: '#EAF7EF',
              color: '#157347',
              fontWeight: 800,
              border:
                '1px solid #A7E0BC',
            }}
          />
        </Box>
      </Paper>

      {loading ? (
        <Typography color="text.secondary">
          Cargando manuales...
        </Typography>
      ) : manuals.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            height: 280,
            borderRadius: 4,
            border:
              '1px dashed #CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFFFFF',
          }}
        >
          <DescriptionIcon
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
            Sin elementos
          </Typography>

          <Typography color="text.secondary">
            No existen manuales aprobados disponibles.
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
          {manuals.map(
            (
              manual,
              index,
            ) => {

              const priorityStyle =
                getPriorityStyles(
                  manual.priority,
                )

              return (
                <Paper
                  key={manual.id}
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
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                      }}
                    >
                      <DescriptionIcon
                        sx={{
                          color:
                            '#090979',
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        fontWeight="900"
                        color="#090979"
                      >
                        Manual {index + 1}:{' '}
                        {manual.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Documento aprobado para consulta
                      </Typography>

                      <Box
                        className="
                          flex
                          gap-2
                          flex-wrap
                          mt-2
                        "
                      >
                        <Chip
                          icon={
                            <VerifiedIcon
                              sx={{
                                fontSize:
                                  '16px !important',
                              }}
                            />
                          }
                          label="APROBADO"
                          size="small"
                          sx={{
                            background:
                              '#EAF7EF',
                            color:
                              '#157347',
                            fontWeight:
                              800,
                          }}
                        />

                        <Chip
                          label={
                            priorityStyle.label
                          }
                          size="small"
                          sx={{
                            background:
                              priorityStyle.background,
                            color:
                              priorityStyle.color,
                            fontWeight:
                              800,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    className="
                      flex
                      gap-2
                      flex-wrap
                    "
                  >
                    <Button
                      variant="outlined"
                      startIcon={
                        <VisibilityIcon />
                      }
                      onClick={() =>
                        setSelectedManual(
                          manual,
                        )
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
                      Ver
                    </Button>

                    <Button
                      variant="outlined"
                      startIcon={
                        <DownloadIcon />
                      }
                      href={
                        manual.fileUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
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
                      Descargar
                    </Button>
                  </Box>
                </Paper>
              )
            },
          )}
        </Box>
      )}

      <Dialog
        open={!!selectedManual}
        onClose={() =>
          setSelectedManual(null)
        }
        fullScreen
      >
        {selectedManual && (
          <>
            <DialogTitle
              sx={{
                px: 3,
                py: 2,
                borderBottom:
                  '1px solid #DCE5F3',
                background:
                  '#FFFFFF',
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
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
                  {
                    selectedManual.title
                  }
                </Typography>

                <Box
                  className="
                    flex
                    gap-2
                    flex-wrap
                    mt-1
                  "
                >
                  <Chip
                    label="APROBADO"
                    size="small"
                    sx={{
                      background:
                        '#EAF7EF',
                      color:
                        '#157347',
                      fontWeight:
                        800,
                    }}
                  />

                  <Chip
                    label={
                      getPriorityStyles(
                        selectedManual.priority,
                      ).label
                    }
                    size="small"
                    sx={{
                      background:
                        getPriorityStyles(
                          selectedManual.priority,
                        ).background,
                      color:
                        getPriorityStyles(
                          selectedManual.priority,
                        ).color,
                      fontWeight:
                        800,
                    }}
                  />
                </Box>
              </Box>

              <Box
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Button
                  variant="outlined"
                  startIcon={
                    <DownloadIcon />
                  }
                  href={
                    selectedManual.fileUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
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
                  Descargar
                </Button>

                <IconButton
                  onClick={() =>
                    setSelectedManual(
                      null,
                    )
                  }
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>

            <DialogContent
              sx={{
                p: 0,
                background:
                  '#EEF3FF',
                height: '100%',
              }}
            >
              <iframe
                src={
                  selectedManual.fileUrl
                }
                title={
                  selectedManual.title
                }
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