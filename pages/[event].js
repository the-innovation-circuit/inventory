import dynamic from 'next/dynamic'
const QrReader = dynamic(() => import('react-qr-reader'), { ssr: false })
import { useState } from 'react'
import { Box, Flex, Heading, Text } from 'theme-ui'
import toast, { Toaster } from 'react-hot-toast'
import useSound from 'use-sound'
import Link from 'next/link'
const title = require('title')
import { useRouter } from 'next/router'

export default function App({ event, action }) {
  const router = useRouter()
  const [result, setResult] = useState('')
  const [user, setUser] = useState(null)
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
    'hardware-check-in': {
      success: `Hardware checked in from ${event.fields.Name}!`,
      error: `Failed to check in hardware from ${event.fields.Name}.`
    },
    'hardware-check-out': {
      success: `Hardware checked out for ${event.fields.Name}!`,
      error: `Failed to check out hardware for ${event.fields.Name}.`
    }
  }
  const handleScan = async data => {
    if (data && result != data) {
      setResult(data)
      if (!data.includes('rec')) {
        toast.error('Invalid QR Code!')
        playNo()
      } else {
        if (!user) {
          const toastId = toast.loading('Loading...!')
          fetch(`/api/${event.id}/login?item=${data}`)
            .then(r => r.json())
            .then(async function (result) {
              if (result.success === true) {
                playYes()
                navigator.vibrate(400)
                setResult('')
                if (!result['Assigned To @ Event']) {
                  let name = prompt("What's this attendee's name?")
                  await fetch(
                    `/api/${event.id}/set-user-name?item=${data}&name=${name}`
                  ).then(r => r.json())
                  toast.success('Authenticated attendee!', {
                    id: toastId
                  })
                  setUser({
                    id: result.ID,
                    name
                  })
                } else {
                  setUser({
                    id: result.ID,
                    name: result['Assigned To @ Event']
                  })
                  toast.success('Authenticated attendee!', {
                    id: toastId
                  })
                }
                return true
              } else {
                playNo()
                setResult('')
                navigator.vibrate(400)
                toast.error('Failed to authenticate!', {
                  id: toastId
                })
              }
            })
        } else {
          const toastId = toast.loading('Loading...!')
          let callResponse = await fetch(
            `/api/${event.id}/hardware?item=${data}&attendee=${user.id}`
          ).then(r => r.json())
          if (callResponse.success) {
            playYes()
            navigator.vibrate(400)
            setResult('')
            toast.success(`${callResponse.name} checked ${callResponse.checkedType}!`, {
              id: toastId
            })
          } else {
            playNo()
            setResult('')
            navigator.vibrate(400)
            toast.error('Failed hardware check-in/check-out!', {
              id: toastId
            })
          }
        }
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
          <Heading>{user ? event.fields.Name : ''}</Heading>
          <Heading as="h1" mb={3}>
            {user ? user.name : event.fields.Name}
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
          <Heading
            as="h1"
            mt={3}
            onClick={() => (user ? setUser(null) : router.push('/'))}
          >
            <Text sx={{ bg: 'white', px: 3, color: 'primary', py: 1 }}>
              {user ? 'Clear User' : 'Go Back'}
            </Text>
          </Heading>
        </Box>
      </Flex>
    </>
  )
}

export async function getServerSideProps({ params }) {
  const { eventsAirtable } = require('../lib/airtable')
  const event = await eventsAirtable.find(params.event)
  return { props: { event } }
}
