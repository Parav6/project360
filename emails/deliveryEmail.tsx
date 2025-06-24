import * as React from 'react';

interface DeliveryEmailTemplateProps {
  name: string;
  otp:string
}

export const DeliveryEmailTemplate: React.FC<Readonly<DeliveryEmailTemplateProps>> = ({
  name,otp
}) => (
  <div>
    <h1>Hii, {name}!</h1>
    <h2>Your delivery has been done.Please verify with the below otp.</h2>
    <h1>Your otp is {otp}</h1>
  </div>
);