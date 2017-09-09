import * as React from 'react'
import * as Cleave from 'cleave.js/dist/cleave-react'
import 'cleave.js/dist/addons/cleave-phone.ru';
import './phone.sass'

interface Props {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default (props:Props) => {
  return (
    <div className="input-container">
      <Cleave
        options={{phone: true, phoneRegionCode: 'RU'}}
        type={"phone"}
        value={"+"}
      />
    </div>
  )
}