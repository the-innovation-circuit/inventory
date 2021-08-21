import dynamic from 'next/dynamic'
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false })
import { useState } from 'react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import toast, { Toaster } from 'react-hot-toast'
import useSound from 'use-sound'
import Link from 'next/link'
const title = require('title')

export default function App({ event, action }) {
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
  const actions = {
    'card-check-in': {
      success: `Card checked in from ${event.fields.Name}!`,
      error: `Failed to check in card from ${event.fields.Name}.`
    },
    'card-check-out': {
      success: `Card checked out for ${event.fields.Name}!`,
      error: `Failed to check out card for ${event.fields.Name}.`
    },
    'hardware-check-in': {
      success: `Hardware checked in from ${event.fields.Name}!`,
      error: `Failed to check in hardware from ${event.fields.Name}.`
    },
    'hardware-check-out': {
      success: `Hardware checked out for ${event.fields.Name}!`,
      error: `Failed to check out hardware for ${event.fields.Name}.`
    }
  }
  const handleScan = data => {
    if (data && result != data) {
      setResult(data)
      if (!data.includes('rec')) {
        toast.error('Invalid QR Code!')
        playNo()
      } else {
        playLoading()
        toast.promise(
          fetch(`/api/hq/${event.id}/${action}?item=${data}`)
            .then(r => r.json())
            .then(function (result) {
              if (result.success === true) {
                playYes()
                navigator.vibrate(400)
                setResult('')
                return true
              } else {
                playNo()
                setResult('')
                navigator.vibrate(400)
                throw new PermissionDenied()
              }
            }),
          {
            loading: 'Loading...',
            ...actions[action]
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
        <Box sx={{ textAlign: 'center' }}>
          <Heading>{event.fields.Name}</Heading>
          <Heading as="h1" mb={3}>
            {title(action.split('-').join(' '))}
          </Heading>
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
          <Heading as="h1" mt={3}>
            <Link href={`/hq/${event.id}`}>
            <Text sx={{ bg: 'white', px: 3, color: 'primary', py: 1 }}>
              {'Go Back'}
            </Text></Link>
          </Heading>
        </Box>
      </Flex>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { eventsAirtable } = require('../../../lib/airtable')
  const event = await eventsAirtable.find(params.event)
  return { props: { event, action: params.action } }
}
