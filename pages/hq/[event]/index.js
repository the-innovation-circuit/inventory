import { Box, Flex, Heading, Text } from 'theme-ui'
import Link from 'next/link'

export default function HQEventIndex({ event }) {
  let items = [
    'Card Check In',
    'Card Check Out',
    'Hardware Check In',
    'Hardware Check Out'
  ]
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
        <Heading as="h1" mb={3}>
          {event.fields.Name} | HQ
        </Heading>
        {items.map((item, itemIndex) => (
          <Link
            key={'item-nav-' + itemIndex}
            href={`/hq/${event.id}/${item.toLowerCase().split(' ').join('-')}`}
          >
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
              {item}
            </Heading>
          </Link>
        ))}
        <Heading as="h1" mt={3}>
            <Link href={`/hq`}>
            <Text sx={{ bg: 'white', px: 3, color: 'primary', py: 1 }}>
              {'Go Back'}
            </Text></Link>
          </Heading>
      </Box>
    </Flex>
  )
}

export async function getServerSideProps({ params }) {
  const { eventsAirtable } = require('../../../lib/airtable')
  const event = await eventsAirtable.find(params.event)
  return { props: { event } }
}
