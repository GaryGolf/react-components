import * as React from 'react'
import * as Cleave from 'cleave.js/dist/cleave-react'
import 'cleave.js/dist/addons/cleave-phone.ru';
import './input.sass'

interface Props {
  iconLeft?: JSX.Element
  iconRight?: JSX.Element
  hint?: string
  error?: string
  restInputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default (props:Props) => {
  const {iconLeft, iconRight, hint, error, ...restInputProps} = props
  return (
    <div className="input-container">
      <Cleave
        className="input-element"
        options={{phone: true, phoneRegionCode: 'RU'}}
        type={"phone"}
        {...restInputProps}
      />
      {iconLeft &&
        <span className="input-icon input-icon--left">
          {iconLeft}
        </span>
      }
      {iconRight &&
        <span className="input-icon input-icon--right">
          {iconRight}
        </span>
      }
      {hint &&
        <p className="input-hint">
          {hint}
        </p>
      }
      {error &&
        <p className="input-error">
          {error}
        </p>
      }
    </div>
  )
}