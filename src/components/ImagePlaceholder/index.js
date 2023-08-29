import React from 'react'
import ContentLoader from 'react-content-loader'

const ImagePlaceholder = (props) => (
  <ContentLoader
    speed={2}
    viewBox="0 0 100 100"
    style={{ width: '100%' }}
    backgroundColor="#3a3b3c"
    foregroundColor="#7a7a7a"
    {...props}
  >
     <rect x="0" y="0" rx="0" ry="0" width="400" height="400" />
  </ContentLoader>
)
export { ImagePlaceholder }
