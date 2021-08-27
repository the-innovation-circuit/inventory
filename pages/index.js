import Link from 'next/link'
import dynamic from 'next/dynamic'
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false })
import { useState } from 'react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import toast, { Toaster } from 'react-hot-toast'
import useSound from 'use-sound'
import {useRouter} from 'next/router'
import { signIn } from "next-auth/client"

export default function App() {
  const router = useRouter()
  const [result, setResult] = useState('')
  const [playYes] = useSound(
    'https://cloud-3jnoqho1w-hack-club-bot.vercel.app/0barcode_scanner_sound_effect_-_realsoundfx-_audiotrimmer.com_.mp3'
  )
  const [playNo] = useSound(
    'https://cloud-2yqr66dgq-hack-club-bot.vercel.app/0microsoft_windows_xp_error_-_sound_effect__hd_.mp3'
  )
  const [playLoading] = useSound(
    'https://cloud-e9c0vxdos-hack-club-bot.vercel.app/0sci_fi_beep_sound_effect-_audiotrimmer.com_.mp3'
  )
  
  const handleScan = data => {
    if (data && result != data) {
      setResult(data)
      if (!data.includes('rec')) {
        toast.error('Invalid Access Pass')
        playNo()
      } else {
        playLoading()
        toast.promise(
          fetch(`/api/access?item=${data}`)
            .then(r => r.json())
            .then(function (result) {
              if (result.success === true) {
                playYes()
                navigator.vibrate(400)
                setResult('')
                router.push(`/${data}`)
                return true
              } else {
                playNo()
                setResult('')
                navigator.vibrate(400)
                throw new PermissionDenied()
              }
            }),
          {
            loading: 'Checking Pass...',
            success: `Access Authorised`,
            error: `Invalid Access Pass`
          }
        )
      }
    }
  }
  const handleError = err => {
    console.error(err)
  }
  return (
    <>
      <Toaster />
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bg: 'primary'
        }}
      >
        <Box sx={{ textAlign: 'center', width: '500px', maxWidth: '90vw' }}>
          <Heading mb={3} as="h1" sx={{color: 'white'}}>Scan Access Code</Heading>
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            showViewFinder={false}
            style={{
              height: '500px',
              width: '500px',
              maxWidth: '90vw',
              maxHeight: '90vw',
              background: 'black',
              border: '6px solid white'
            }}
          />
            <Heading
              onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000/hq' })}
              sx={{
                bg: 'white',
                px: 3,
                color: 'primary',
                py: 1,
                mt: 2,
                fontSize: 3
              }}
              as="h2"
            >
              HQ Management Zone
            </Heading>
        </Box>
      </Flex>
    </>
  )
}
