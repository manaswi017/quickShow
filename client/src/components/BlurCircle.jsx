import React from 'react'

// destructing 
const BlurCircle = ({top='auto', left='auto', right='auto', bottom='auto'}) => {
  return (
    // -ve z index to set the z axis position that keeps the circle behind everything as its -ve
    // aspect-square to maintain the aspect ratio of height and width ensuing perfect circle 
    // rounded-full to make it circular
    <div className='absolute -z-50 h-58 w-58 aspect-square rounded-full bg-primary/30 blur-3xl' 
    style={{top: top, left: left, right: right, bottom: bottom}}>
      
    </div>
  )
}

export default BlurCircle
