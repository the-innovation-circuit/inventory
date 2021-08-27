import { Box, Flex, Heading, Text } from 'theme-ui'
import Link from 'next/link'
import { getSession } from 'next-auth/client'
import checkUser from '../../lib/check'

export default function HQIndex({ events }) {
  return (
    <Flex
      sx={{
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bg: 'primary',
        color: 'white!important'
      }}
    >
      <Box sx={{ textAlign: 'center', width: '600px', maxWidth: '90vw' }}>
        <Heading as="h1" mb={2}>
          HQ Inventory Manager
        </Heading>
        {events.map(event => (
          <Link href={`/hq/${event.id}/`} key={event.id}>
            <Heading
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
              {event.fields.Name}
            </Heading>
          </Link>
        ))}
        <Heading as="h1" mt={3}>
          <Link href={`/`}>
            <Text sx={{ bg: 'white', px: 3, color: 'primary', py: 1 }}>
              {'Go Back'}
            </Text>
          </Link>
        </Heading>
      </Box>
    </Flex>
  )
}

export async function getServerSideProps(ctx) {
  const { eventsAirtable } = require('../../lib/airtable')
  const session = await getSession(ctx)
  if (await checkUser(session?.user.name)) {
    const events = await eventsAirtable.read()
    return { props: { events } }
  } else {
    ctx.res.setHeader('location', '/')
    ctx.res.statusCode = 302
    ctx.res.end()
  }
}
