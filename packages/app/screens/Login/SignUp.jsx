import React, { useState } from 'react'
import {
  Button,
  Checkbox,
  Image,
  HStack,
  VStack,
  Text,
  Divider,
  Icon,
  Center,
  FormControl,
  Box,
  LinkText,
  Input,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  InputIcon,
  FormControlHelper,
  Toast,
  ToastTitle,
  useToast,
  ButtonIcon,
  CheckboxIndicator,
  CheckboxIcon,
  CheckboxLabel,
  CheckIcon,
  ButtonText,
  Heading,
  ArrowLeftIcon,
  InputField,
  InputSlot,
} from '@gluestack-ui/themed'
import { Link } from 'solito/link'
import { useRouter } from 'solito/router'

import { Controller, useForm } from 'react-hook-form'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  AlertTriangle,
  AppleIcon,
  EyeIcon,
  EyeOffIcon,
  GithubIcon,
  FacebookIcon,
  GoogleIcon,
} from 'lucide-react-native'

import { Keyboard } from 'react-native'

import GuestLayout from '../../layouts/GuestLayout'

import { registerUser } from '../../provider/firebaseAuthServices'
import { TwitterIcon } from 'lucide-react-native'

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email(),
  password: z
    .string()
    .min(6, 'Must be at least 8 characters in length')
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    ),
  confirmpassword: z
    .string()
    .min(6, 'Must be at least 8 characters in length')
    .regex(new RegExp('.*[A-Z].*'), 'One uppercase character')
    .regex(new RegExp('.*[a-z].*'), 'One lowercase character')
    .regex(new RegExp('.*\\d.*'), 'One number')
    .regex(
      new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'),
      'One special character'
    ),
  rememberme: z.boolean().optional(),
})

function SideContainerWeb() {
  return (
    <Center
      bg="$primary500"
      flex={1}
      sx={{
        _dark: {
          bg: '$primary500',
        },
      }}
    >
      <Link href="/">
        {/* TODO: Add Logo */}
        <Image
          h="$10"
          w="$80"
          alt="gluestack-ui Pro"
          resizeMode="contain"
          source={require('./assets/images/logo.png')}
        />
      </Link>
    </Center>
  )
}
function MobileHeader() {
  return (
    <VStack px="$3" mt="$4.5" mb="$5" space="md">
      <HStack space="md" alignItems="center">
        <Link href="/">
          <Icon
            as={ArrowLeftIcon}
            color="$textLight50"
            sx={{ _dark: { color: '$textDark50' } }}
          />
        </Link>
        <Text
          color="$textLight50"
          sx={{ _dark: { color: '$textDark50' } }}
          fontSize="$lg"
        >
          Sign Up
        </Text>
      </HStack>
      <VStack space="xs" ml="$1" my="$4">
        <Heading color="$textLight50" sx={{ _dark: { color: '$textDark50' } }}>
          Welcome
        </Heading>
        <Text
          color="$primary300"
          fontSize="$md"
          sx={{
            _dark: {
              color: '$textDark400',
            },
          }}
        >
          Sign up to continue
        </Text>
      </VStack>
    </VStack>
  )
}
const SignUpForm = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })
  const [isEmailFocused, setIsEmailFocused] = useState(false)
  const [pwMatched, setPwMatched] = useState(false)
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const router = useRouter()

  const toast = useToast()
  const onSubmit = async (_data) => {
    console.log(_data)
    if (_data.password === _data.confirmpassword) {
      setPwMatched(true)
      try {
        const user = await registerUser(_data.email, _data.password)
        console.log('successfully registered:' + user)
        toast.show({
          placement: 'bottom right',
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="accent" action="success">
                <ToastTitle>Signed up successfully</ToastTitle>
              </Toast>
            )
          },
        })
        reset()
        router.push('/dashboard')
      } catch (error) {
        console.error(error)
        toast.show({
          placement: 'bottom right',
          render: ({ id }) => {
            return (
              <Toast nativeID={id} variant="accent" action="error">
                <ToastTitle>Signed up failed, please try again.</ToastTitle>
              </Toast>
            )
          },
        })
        reset()
      }
    } else {
      toast.show({
        placement: 'bottom right',
        render: ({ id }) => {
          return (
            <Toast nativeID={id} action="error">
              <ToastTitle>Passwords do not match</ToastTitle>
            </Toast>
          )
        },
      })
    }
  }
  const handleKeyPress = () => {
    Keyboard.dismiss()
    handleSubmit(onSubmit)()
  }
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }
  const handleConfirmPwState = () => {
    setShowConfirmPassword((showState) => {
      return !showState
    })
  }
  return (
    <>
      <VStack justifyContent="space-between">
        <FormControl
          isInvalid={(!!errors.email || isEmailFocused) && !!errors.email}
          isRequired={true}
        >
          <Controller
            name="email"
            defaultValue=""
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await signUpSchema.parseAsync({ email: value })
                  return true
                } catch (error) {
                  return error.message
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Email"
                  fontSize="$sm"
                  type="text"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                />
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="md" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.email?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl isInvalid={!!errors.password} isRequired={true} my="$6">
          <Controller
            defaultValue=""
            name="password"
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await signUpSchema.parseAsync({
                    password: value,
                  })
                  return true
                } catch (error) {
                  return error.message
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  fontSize="$sm"
                  placeholder="Password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showPassword ? 'text' : 'password'}
                />
                <InputSlot onPress={handleState} pr="$3">
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.password?.message}
            </FormControlErrorText>
          </FormControlError>
          <FormControlHelper></FormControlHelper>
        </FormControl>
        <FormControl isInvalid={!!errors.confirmpassword} isRequired={true}>
          <Controller
            defaultValue=""
            name="confirmpassword"
            control={control}
            rules={{
              validate: async (value) => {
                try {
                  await signUpSchema.parseAsync({
                    password: value,
                  })
                  return true
                } catch (error) {
                  return error.message
                }
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <Input>
                <InputField
                  placeholder="Confirm Password"
                  fontSize="$sm"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onSubmitEditing={handleKeyPress}
                  returnKeyType="done"
                  type={showConfirmPassword ? 'text' : 'password'}
                />

                <InputSlot onPress={handleConfirmPwState} pr="$3">
                  <InputIcon as={showConfirmPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            )}
          />
          <FormControlError>
            <FormControlErrorIcon size="sm" as={AlertTriangle} />
            <FormControlErrorText>
              {errors?.confirmpassword?.message}
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </VStack>
      <Controller
        name="rememberme"
        defaultValue={false}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Checkbox
            size="sm"
            value="Remember me"
            isChecked={agreeToTerms}
            onChange={(e) => {
              console.log(e)
              setAgreeToTerms(e)
            }}
            alignSelf="flex-start"
            mt="$5"
          >
            <CheckboxIndicator mr="$2">
              <CheckboxIcon as={CheckIcon} />
            </CheckboxIndicator>
            <CheckboxLabel
              sx={{
                _text: {
                  fontSize: '$sm',
                },
              }}
            >
              I accept the{' '}
              <Link href="/terms-of-service">
                <LinkText
                  sx={{
                    _ios: {
                      marginTop: '$0.5',
                    },
                    _android: {
                      marginTop: '$0.5',
                    },
                  }}
                >
                  Terms of Use
                </LinkText>
              </Link>{' '}
              &{' '}
              <Link href="/privacy-policy">
                <LinkText
                  sx={{
                    _ios: {
                      marginTop: '$0.5',
                    },
                    _android: {
                      marginTop: '$0.5',
                    },
                  }}
                >
                  Privacy Policy
                </LinkText>
              </Link>
            </CheckboxLabel>
          </Checkbox>
        )}
      />
      <Button
        variant="solid"
        size="lg"
        mt="$5"
        onPress={handleSubmit(onSubmit)}
        disabled={
          !!errors.email ||
          !!errors.password ||
          !!errors.confirmpassword ||
          agreeToTerms === false
        }
      >
        <ButtonText fontSize="$sm"> SIGN UP</ButtonText>
      </Button>
    </>
  )
}
function SignUpFormComponent() {
  return (
    <>
      <Box sx={{ '@md': { display: 'none' } }}>
        <MobileHeader />
      </Box>
      <Box
        flex={1}
        bg="$backgroundLight0"
        sx={{
          '@md': {
            px: '$8',
            borderTopLeftRadius: '$none',
            borderTopRightRadius: '$none',
            borderBottomRightRadius: '$none',
          },
          _dark: {
            bg: '$backgroundDark800',
          },
        }}
        px="$4"
        py="$8"
        justifyContent="space-between"
        borderTopLeftRadius="$2xl"
        borderTopRightRadius="$2xl"
        borderBottomRightRadius="$none"
      >
        <Heading
          display="none"
          mb="$8"
          sx={{
            '@md': { display: 'flex', fontSize: '$2xl' },
          }}
        >
          Sign up to continue
        </Heading>
        <SignUpForm />
        <HStack my="$4" space="md" alignItems="center" justifyContent="center">
          <Divider
            w="$2/6"
            bg="$backgroundLight200"
            sx={{ _dark: { bg: '$backgroundDark700' } }}
          />
          <Text
            fontWeight="$medium"
            color="$textLight400"
            sx={{ _dark: { color: '$textDark300' } }}
          >
            or
          </Text>
          <Divider
            w="$2/6"
            bg="$backgroundLight200"
            sx={{ _dark: { bg: '$backgroundDark700' } }}
          />
        </HStack>
        <HStack
          sx={{
            '@md': {
              mt: '$4',
            },
          }}
          mt="$6"
          mb="$9"
          alignItems="center"
          justifyContent="center"
          space="lg"
        >
          <Link href="#">
            <Button
              action="secondary"
              variant="link"
              onPress={() => {
                socialSignIn('facebook')
              }}
            >
              <ButtonIcon as={FacebookIcon} size="md" />
            </Button>
          </Link>
          <Link href="#">
            <Button
              action="secondary"
              variant="link"
              onPress={() => {
                socialSignIn('google')
              }}
            >
              <ButtonIcon as={GoogleIcon} size="md" />
            </Button>
          </Link>
          <Link href="#">
            <Button
              action="secondary"
              variant="link"
              onPress={() => {
                socialSignIn('github')
              }}
            >
              <ButtonIcon as={GithubIcon} size="md" />
            </Button>
          </Link>
          <Link href="#">
            <Button
              action="secondary"
              variant="link"
              onPress={() => {
                socialSignIn('twitter')
              }}
            >
              <ButtonIcon as={TwitterIcon} size="md" />
            </Button>
          </Link>
          {/* <Link href="#">
            <Button action="secondary" variant="link" onPress={() => {socialSignIn("microsoft")}}>
              <ButtonIcon as={MicrosoftIcon} size="md" />
            </Button>
          </Link>
          <Link href="#">
            <Button action="secondary" variant="link" onPress={() => {socialSignIn("yahoo")}}>
              <ButtonIcon as={YahooIcon} size="md" />
            </Button>
          </Link> */}
          <Link href="#">
            <Button
              action="secondary"
              variant="link"
              onPress={() => {
                socialSignIn('apple')
              }}
            >
              <ButtonIcon as={AppleIcon} size="md" />
            </Button>
          </Link>
        </HStack>
        <HStack
          space="xs"
          alignItems="center"
          justifyContent="center"
          mt="auto"
        >
          <Text
            color="$textLight500"
            sx={{
              _dark: {
                color: '$textDark400',
              },
            }}
            fontSize="$sm"
          >
            Already have an account?
          </Text>
          <Link href="/login">
            <LinkText fontSize="$sm">Sign In</LinkText>
          </Link>
        </HStack>
      </Box>
    </>
  )
}

export default function SignUp() {
  return (
    <>
      <GuestLayout>
        <Box
          sx={{
            '@md': {
              display: 'flex',
            },
          }}
          flex={1}
          display="none"
        >
          <SideContainerWeb />
        </Box>
        <Box flex={1}>
          <SignUpFormComponent />
        </Box>
      </GuestLayout>
    </>
  )
}
