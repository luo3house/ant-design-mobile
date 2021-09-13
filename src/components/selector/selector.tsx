import classNames from 'classnames'
import React, { ReactNode } from 'react'
import { NativeProps, withNativeProps } from '../../utils/native-props'
import { mergeProps } from '../../utils/with-default-props'
import Space from '../space'
import Grid from '../grid'
import { convertPx } from '../../utils/convert-px'
import selectorCheckMarkImg from '../../assets/selector-check-mark.svg'
import { useNewControllableValue } from '../../utils/use-controllable-value'

const classPrefix = `adm-selector`

type SelectorValue = string | number

export interface SelectorOption<V> {
  label: ReactNode
  value: V
  disabled?: boolean
}

export type SelectorProps<V> = {
  options: SelectorOption<V>[]
  columns?: number
  multiple?: boolean
  disabled?: boolean
  defaultValue?: V[]
  value?: V[]
  onChange?: (v: V[]) => void
} & NativeProps

const defaultProps = {
  multiple: false,
  defaultValue: [],
}

export const Selector = <V extends SelectorValue>(p: SelectorProps<V>) => {
  const props = mergeProps(defaultProps, p)
  const [value, setValue] = useNewControllableValue(props)

  const items = props.options.map(option => {
    const active = (value || []).includes(option.value)
    const disabled = option.disabled || props.disabled
    const itemCls = classNames(`${classPrefix}-item`, {
      [`${classPrefix}-item-active`]: active && !props.multiple,
      [`${classPrefix}-item-multiple-active`]: active && props.multiple,
      [`${classPrefix}-item-disabled`]: disabled,
    })

    return (
      <div
        key={option.value}
        className={itemCls}
        onClick={() => {
          if (disabled) {
            return
          }
          if (props.multiple) {
            setValue(
              active
                ? value.filter(v => v !== option.value)
                : [...value, option.value]
            )
          } else {
            setValue(active ? [] : [option.value])
          }
        }}
      >
        {option.label}
        {active && props.multiple && (
          <div className={`${classPrefix}-check-mark-wrapper`}>
            <img src={selectorCheckMarkImg} />
          </div>
        )}
      </div>
    )
  })

  return withNativeProps(
    props,
    <div className={classPrefix}>
      {!props.columns && <Space wrap>{items}</Space>}
      {props.columns && (
        <Grid columns={props.columns} gap={convertPx(8)}>
          {items}
        </Grid>
      )}
    </div>
  )
}