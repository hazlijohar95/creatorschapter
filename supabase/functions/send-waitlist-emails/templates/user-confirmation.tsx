
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface UserConfirmationEmailProps {
  name: string
}

export const UserConfirmationEmail = ({ name }: UserConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Thanks for joining the waitlist!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img 
          src="https://lovable.dev/opengraph-image-chaptercreator.png" 
          width="200" 
          height="200" 
          alt="ChapterCreator Logo" 
          style={logo} 
        />
        <Heading style={h1}>Welcome to ChapterCreator, {name}!</Heading>
        <Text style={text}>
          Thank you for joining our waitlist. We're excited to have you on board and 
          can't wait to help you elevate your creator journey.
        </Text>
        <Text style={text}>
          We'll be in touch soon with more details about your early access.
        </Text>
        <Text style={text}>
          Best regards,<br />
          The ChapterCreator Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default UserConfirmationEmail

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

const logo = {
  margin: '0 auto 20px',
  display: 'block',
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
