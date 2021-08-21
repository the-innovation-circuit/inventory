import { Box, Flex, Heading, Text } from 'theme-ui'
import Link from 'next/link'

export default function App() {
  return (
    <>
      <Flex
        sx={{
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bg: 'primary'
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
        <Link
            href={`/hq`}
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
              HQ Management
            </Heading>
          </Link>
        </Box>
      </Flex>
    </>
  )
}

