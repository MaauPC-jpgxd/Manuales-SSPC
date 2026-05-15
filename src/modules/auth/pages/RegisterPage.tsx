import { motion } from 'framer-motion'

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
} from '@mui/material'

import {
  useForm,
} from 'react-hook-form'

import {
  zodResolver,
} from '@hookform/resolvers/zod'

import {
  registerSchema,
} from '../schemas/register.schema'

import type {
  RegisterSchema,
} from '../schemas/register.schema'
import { UserRole }
  from '@/types/roles'

import {
  registerUser,
} from '../services/register.service'

export default function RegisterPage() {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchema>({
    resolver:
      zodResolver(registerSchema),
  })

  const onSubmit =
    async (data: RegisterSchema) => {

      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      })

      alert('Usuario registrado')
    }

  return (
    <Box
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gradient-to-br
        from-[#090979]
        via-[#1B3FAF]
        to-[#4D7CFE]
        p-6
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        transition={{
          duration: 0.5,
        }}
      >
        <Paper
          elevation={0}
          className="
            w-[450px]
            rounded-3xl
            p-10
            shadow-2xl
            backdrop-blur-xl
          "
        >
          <Typography
            variant="h4"
            fontWeight="700"
            mb={1}
          >
            Crear Cuenta
          </Typography>

          <Typography
            color="text.secondary"
            mb={4}
          >
            Plataforma Empresarial
          </Typography>

          <form
            onSubmit={
              handleSubmit(onSubmit)
            }
            className="space-y-4"
          >
            <TextField
              fullWidth
              label="Nombre"

              {...register('name')}

              error={!!errors.name}

              helperText={
                errors.name?.message
              }
            />

            <TextField
              fullWidth
              label="Correo"

              {...register('email')}

              error={!!errors.email}

              helperText={
                errors.email?.message
              }
            />

            <TextField
              fullWidth
              type="password"
              label="Contraseña"

              {...register('password')}

              error={!!errors.password}

              helperText={
                errors.password?.message
              }
            />

            <TextField
              fullWidth
              type="password"
              label="Confirmar contraseña"

              {...register(
                'confirmPassword'
              )}

              error={
                !!errors.confirmPassword
              }

              helperText={
                errors.confirmPassword
                  ?.message
              }
            />

            <TextField
              fullWidth
              select
              label="Rol"

              defaultValue={
                UserRole.LECTOR
              }

              {...register('role')}
            >
              <MenuItem
                value={UserRole.ROOT}
              >
                ROOT
              </MenuItem>

              <MenuItem
                value={UserRole.ADMIN}
              >
                ADMIN
              </MenuItem>

              <MenuItem
                value={UserRole.LECTOR}
              >
                LECTOR
              </MenuItem>
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"

              disabled={isSubmitting}

              sx={{
                height: 55,
                borderRadius: 4,
              }}
            >
              Crear Cuenta
            </Button>
          </form>
        </Paper>
      </motion.div>
    </Box>
  )
}