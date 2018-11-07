import React from 'react'
import {TextField} from '@material-ui/core'

export default (inputProps) => {
    const 
        {classes, inputRef = () => {}, ref, ...other} = inputProps
  
    return (
        <TextField
            fullWidth
            InputProps={{
                inputRef: node => {
                    ref(node)
                    inputRef(node)
                },
                classes: {
                    input: classes.input,
                },
            }}
            {...other}
        />
    )
}