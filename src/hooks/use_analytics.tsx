import { useEffect } from "react";
import * as ReactGA from 'react-ga';
import { useLocation } from "react-router-dom";

export function useAnalytics() {
    const location = useLocation()
  
    useEffect(() => {
        ReactGA.initialize('G-723W1G43PY');
    }, [])
  
    useEffect(() => {
      const currentPath = location.pathname + location.search
      ReactGA.pageview(currentPath)
    }, [location])
  }