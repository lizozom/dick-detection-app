import { useEffect } from "react";
import ReactGA from 'react-ga4';
import { useLocation } from "react-router-dom";

export function useAnalytics() {
    const location = useLocation()
  
    useEffect(() => {
        ReactGA.initialize('G-723W1G43PY');
    }, [])
  
    useEffect(() => {
      const currentPath = location.pathname + location.search
      ReactGA.send({
        hitType: "pageview",
        page: currentPath,
      })
    }, [location])
  }