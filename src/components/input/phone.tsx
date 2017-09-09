import * as React from 'react'
import * as Cleave from 'cleave.js/dist/cleave-react'
import 'cleave.js/dist/addons/cleave-phone.ru';

interface Props {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
}

export default (props:Props) => {
  return (
    <div>
      <Cleave
        options={{phone: true, phoneRegionCode: 'RU'}}
        type={"phone"}
        value={"+7"}
      />
    </div>
  )
}