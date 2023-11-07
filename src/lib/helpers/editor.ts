// export function forEachSlot(slots = [], cb, parent = null) {
//     console.log(slots)
//     for (let slot of slots) {
//         const component = getComponent(slot.type)
//         cb(slot, parent, slots)

//         for (let field of component.fields) {
//             if (field.type === 'slot') {
//                 forEachSlot(slot.props[field.name] ?? [], cb, slot)
//             }
//         }
//     }
// }

