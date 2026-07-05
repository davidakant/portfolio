import ph1 from './ph-1.svg'
import ph2 from './ph-2.svg'
import ph3 from './ph-3.svg'
import ph4 from './ph-4.svg'
import ph5 from './ph-5.svg'
import ph6 from './ph-6.svg'

export const placeholders = [ph1, ph2, ph3, ph4, ph5, ph6]

export function placeholderAt(index) {
  return placeholders[index % placeholders.length]
}
