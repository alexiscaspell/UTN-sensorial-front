import React, { useState, useEffect, useRef } from "react";


function useInterval(callback, delay) {

    const savedCallback = useRef(callback);
  
    useEffect(() => {
      savedCallback.current = callback
    }, [])

    useEffect(() => {
      if (delay === null) {
        return
      }
            
      const tick = () => savedCallback.current()
      const id = setInterval(tick, delay)

      return () => {
        clearInterval(id)
      }
    }, [delay]);
}

export {
    useInterval
}