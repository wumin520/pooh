import Chartist from 'chartist'
import _ from 'lodash'

Chartist.createLabel = function (position, length, index, labels, axis, axisOffset, labelOffset, group, classes, useForeignObject, eventEmitter) {
  let labelElement
  let positionalData = {}

  positionalData[axis.units.pos] = position + labelOffset[axis.units.pos]
  positionalData[axis.counterUnits.pos] = labelOffset[axis.counterUnits.pos]
  positionalData[axis.units.len] = length
  positionalData[axis.counterUnits.len] = Math.max(0, axisOffset - 10)

  if (useForeignObject) {
    // We need to set width and height explicitly to px as span will not expand with width and height being
    // 100% in all browsers
    let content = document.createElement('span')
    content.className = classes.join(' ')
    content.setAttribute('xmlns', Chartist.namespaces.xhtml)
    content.innerText = labels[index]
    content.style[axis.units.len] = Math.round(positionalData[axis.units.len]) + 'px'
    content.style[axis.counterUnits.len] = Math.round(positionalData[axis.counterUnits.len]) + 'px'

    if (_.indexOf(classes, 'ct-horizontal') > -1) {
      content.style.display = 'inline-block'
      content.style.minWidth = '60px'
      content.style.marginLeft = '-20px'
    }

    labelElement = group.foreignObject(content, Chartist.extend({
      style: 'overflow: visible;'
    }, positionalData))
  } else {
    labelElement = group.elem('text', positionalData, classes.join(' ')).text(labels[index])
  }

  eventEmitter.emit('draw', Chartist.extend({
    type: 'label',
    axis: axis,
    index: index,
    group: group,
    element: labelElement,
    text: labels[index]
  }, positionalData))
}
