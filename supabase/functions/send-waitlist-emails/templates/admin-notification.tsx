
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface AdminNotificationEmailProps {
  name: string
  email: string
  socialHandle?: string
  followerCount?: string
  niche?: string
}

export const AdminNotificationEmail = ({ 
  name, 
  email, 
  socialHandle, 
  followerCount, 
  niche 
}: AdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>New Waitlist Submission</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Waitlist Submission</Heading>
        <Text style={text}>Details of the new signup:</Text>
        <div style={codeBlock}>
          <Text style={codeText}>Name: {name}</Text>
          <Text style={codeText}>Email: {email}</Text>
          {socialHandle && <Text style={codeText}>Social Handle: {socialHandle}</Text>}
          {followerCount && <Text style={codeText}>Follower Count: {followerCount}</Text>}
          {niche && <Text style={codeText}>Niche: {niche}</Text>}
        </div>
      </Container>
    </Body>
  </Html>
)

export default AdminNotificationEmail

const main = {
  backgroundColor: '#f4f4f4',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '20px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  marginBottom: '16px',
}

const codeBlock = {
  backgroundColor: '#f0f0f0',
  padding: '10px',
  borderRadius: '4px',
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
}

const codeText = {
  fontFamily: 'monospace',
  margin: '4px 0',
}
