import * as React from 'react';

interface VerificationEmailTemplateProps {
  name: string;
  otp:string
}

export const VerificationEmailTemplate: React.FC<Readonly<VerificationEmailTemplateProps>> = ({
  name,otp
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <h1>Your otp is {otp}</h1>
  </div>
);