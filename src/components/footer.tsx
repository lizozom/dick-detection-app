import { Button } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import './footer.scss';


export interface FooterProps {
}

export function Footer(props: FooterProps) {
  const navigate = useNavigate(); 
  const navigatePrivacyFn = () => navigate('/privacy_policy'); 
  const navigateTermsFn = () => navigate('/terms'); 


  return (
    <div className="footer">
      <div className="footer-actions">
        <Button onClick={navigatePrivacyFn} size='small'>Privacy Policy</Button>
        <span className="separator">|</span>
        <Button onClick={navigateTermsFn} size='small'>Terms of Use</Button>
      </div>
    </div>
  );
}

