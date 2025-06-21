import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  otp:string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,otp
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <h1>Your otp is {otp}</h1>
  </div>
);