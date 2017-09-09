import * as React from 'react'

interface Props {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default (props:Props) => {
  return <input {...props.inputProps}
  />
}